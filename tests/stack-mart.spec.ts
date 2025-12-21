import { describe, it, expect } from "vitest";
import { Cl } from "@stacks/transactions";

const contractName = "stack-mart";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const seller = accounts.get("wallet_1")!;
const buyer = accounts.get("wallet_2")!;
const royaltyRecipient = accounts.get("wallet_3")!;

const getStxBalance = (addr: string): bigint => {
  const assets = simnet.getAssetsMap();
  const stx = assets.get("STX");
  return stx?.get(addr) ?? 0n;
};

describe("stack-mart listings", () => {
  it("creates a listing with royalty cap", () => {
    const res = simnet.callPublicFn(
      contractName,
      "create-listing",
      [Cl.uint(1_000), Cl.uint(500), Cl.principal(royaltyRecipient)],
      seller
    );

    expect(res.result).toBeOk(Cl.uint(1));

    const listing = simnet.callReadOnlyFn(
      contractName,
      "get-listing",
      [Cl.uint(1)],
      deployer
    );

    expect(listing.result).toBeOk(
      Cl.tuple({
        price: Cl.uint(1_000),
        "royalty-bips": Cl.uint(500),
        "royalty-recipient": Cl.principal(royaltyRecipient),
        seller: Cl.principal(seller),
        "nft-contract": Cl.none(),
        "token-id": Cl.none(),
        "license-terms": Cl.none(),
      })
    );
  });

  it("buys a listing and deletes it", () => {
    simnet.callPublicFn(
      contractName,
      "create-listing",
      [Cl.uint(2_000), Cl.uint(1000), Cl.principal(royaltyRecipient)],
      seller
    );

    const purchase = simnet.callPublicFn(
      contractName,
      "buy-listing",
      [Cl.uint(1)],
      buyer
    );

    expect(purchase.result).toBeOk(Cl.bool(true));

    const missing = simnet.callReadOnlyFn(
      contractName,
      "get-listing",
      [Cl.uint(1)],
      deployer
    );

    expect(missing.result).toBeErr(Cl.uint(404));
  });

  it("pays seller and royalty recipient on purchase", () => {
    simnet.callPublicFn(
      contractName,
      "create-listing",
      [Cl.uint(2_000), Cl.uint(1_000), Cl.principal(royaltyRecipient)],
      seller
    );

    const sellerBefore = getStxBalance(seller);
    const buyerBefore = getStxBalance(buyer);
    const royaltyBefore = getStxBalance(royaltyRecipient);

    const purchase = simnet.callPublicFn(
      contractName,
      "buy-listing",
      [Cl.uint(1)],
      buyer
    );

    expect(purchase.result).toBeOk(Cl.bool(true));

    expect(getStxBalance(buyer)).toBe(buyerBefore - 2_000n);
    expect(getStxBalance(seller)).toBe(sellerBefore + 1_800n);
    expect(getStxBalance(royaltyRecipient)).toBe(royaltyBefore + 200n);
  });
});

describe("stack-mart escrow flow", () => {
  it("creates escrow when buying with escrow option", () => {
    // Create listing
    simnet.callPublicFn(
      contractName,
      "create-listing",
      [Cl.uint(5_000), Cl.uint(500), Cl.principal(royaltyRecipient)],
      seller
    );

    const buyerBefore = getStxBalance(buyer);

    // Buy with escrow
    const escrowPurchase = simnet.callPublicFn(
      contractName,
      "buy-listing-escrow",
      [Cl.uint(1)],
      buyer
    );

    expect(escrowPurchase.result).toBeOk(Cl.bool(true));

    // Check escrow was created
    const escrowStatus = simnet.callReadOnlyFn(
      contractName,
      "get-escrow-status",
      [Cl.uint(1)],
      deployer
    );

    expect(escrowStatus.result).toBeOk(
      Cl.tuple({
        buyer: Cl.principal(buyer),
        amount: Cl.uint(5_000),
        "created-at-block": Cl.uint(0),
        state: Cl.stringAscii("pending"),
        "timeout-block": Cl.uint(144),
      })
    );

    // Buyer's balance should be reduced
    expect(getStxBalance(buyer)).toBe(buyerBefore - 5_000n);
  });

  it("seller attests delivery and transfers NFT", () => {
    // Create listing
    simnet.callPublicFn(
      contractName,
      "create-listing",
      [Cl.uint(3_000), Cl.uint(300), Cl.principal(royaltyRecipient)],
      seller
    );

    // Buy with escrow
    simnet.callPublicFn(
      contractName,
      "buy-listing-escrow",
      [Cl.uint(1)],
      buyer
    );

    // Seller attests delivery
    const deliveryHash = Cl.bufferFromHex("0000000000000000000000000000000000000000000000000000000000000001");
    const attestResult = simnet.callPublicFn(
      contractName,
      "attest-delivery",
      [Cl.uint(1), deliveryHash],
      seller
    );

    expect(attestResult.result).toBeOk(Cl.bool(true));

    // Check escrow state changed to "delivered"
    const escrowStatus = simnet.callReadOnlyFn(
      contractName,
      "get-escrow-status",
      [Cl.uint(1)],
      deployer
    );

    expect(escrowStatus.result).toBeOk(
      Cl.tuple({
        state: Cl.stringAscii("delivered"),
      })
    );
  });

  it("buyer confirms receipt and releases escrow", () => {
    // Create listing
    simnet.callPublicFn(
      contractName,
      "create-listing",
      [Cl.uint(4_000), Cl.uint(400), Cl.principal(royaltyRecipient)],
      seller
    );

    // Buy with escrow
    simnet.callPublicFn(
      contractName,
      "buy-listing-escrow",
      [Cl.uint(1)],
      buyer
    );

    // Seller attests delivery
    const deliveryHash = Cl.bufferFromHex("0000000000000000000000000000000000000000000000000000000000000002");
    simnet.callPublicFn(
      contractName,
      "attest-delivery",
      [Cl.uint(1), deliveryHash],
      seller
    );

    const sellerBefore = getStxBalance(seller);
    const buyerBefore = getStxBalance(buyer);
    const royaltyBefore = getStxBalance(royaltyRecipient);

    // Buyer confirms receipt
    const confirmResult = simnet.callPublicFn(
      contractName,
      "confirm-receipt",
      [Cl.uint(1)],
      buyer
    );

    expect(confirmResult.result).toBeOk(Cl.bool(true));

    // Check payments were made
    expect(getStxBalance(seller)).toBe(sellerBefore + 3_840n); // 4000 - 160 (royalty)
    expect(getStxBalance(royaltyRecipient)).toBe(royaltyBefore + 160n); // 4000 * 0.04
    expect(getStxBalance(buyer)).toBe(buyerBefore); // Already paid in escrow

    // Listing should be deleted
    const listing = simnet.callReadOnlyFn(
      contractName,
      "get-listing",
      [Cl.uint(1)],
      deployer
    );

    expect(listing.result).toBeErr(Cl.uint(404));
  });

  it("buyer can reject delivery", () => {
    // Create listing
    simnet.callPublicFn(
      contractName,
      "create-listing",
      [Cl.uint(3_000), Cl.uint(300), Cl.principal(royaltyRecipient)],
      seller
    );

    // Buy with escrow
    simnet.callPublicFn(
      contractName,
      "buy-listing-escrow",
      [Cl.uint(1)],
      buyer
    );

    // Seller attests delivery
    const deliveryHash = Cl.bufferFromHex("0000000000000000000000000000000000000000000000000000000000000003");
    simnet.callPublicFn(
      contractName,
      "attest-delivery",
      [Cl.uint(1), deliveryHash],
      seller
    );

    // Buyer rejects delivery
    const rejectResult = simnet.callPublicFn(
      contractName,
      "reject-delivery",
      [Cl.uint(1), Cl.stringAscii("Item not as described")],
      buyer
    );

    expect(rejectResult.result).toBeOk(Cl.bool(true));

    // Check delivery attestation was marked as rejected
    // Note: This would require a read-only function to check delivery status
    // For now, we just verify the function succeeded
  });

  it("updates reputation after successful transaction", () => {
    // Create listing
    simnet.callPublicFn(
      contractName,
      "create-listing",
      [Cl.uint(2_000), Cl.uint(200), Cl.principal(royaltyRecipient)],
      seller
    );

    // Buy with escrow
    simnet.callPublicFn(
      contractName,
      "buy-listing-escrow",
      [Cl.uint(1)],
      buyer
    );

    // Seller attests delivery
    const deliveryHash = Cl.bufferFromHex("0000000000000000000000000000000000000000000000000000000000000004");
    simnet.callPublicFn(
      contractName,
      "attest-delivery",
      [Cl.uint(1), deliveryHash],
      seller
    );

    // Buyer confirms receipt
    simnet.callPublicFn(
      contractName,
      "confirm-receipt",
      [Cl.uint(1)],
      buyer
    );

    // Check seller reputation
    const sellerRep = simnet.callReadOnlyFn(
      contractName,
      "get-seller-reputation",
      [Cl.principal(seller)],
      deployer
    );

    expect(sellerRep.result).toBeOk(
      Cl.tuple({
        "successful-txs": Cl.uint(1),
        "failed-txs": Cl.uint(0),
        "rating-sum": Cl.uint(0),
        "rating-count": Cl.uint(0),
      })
    );

    // Check buyer reputation
    const buyerRep = simnet.callReadOnlyFn(
      contractName,
      "get-buyer-reputation",
      [Cl.principal(buyer)],
      deployer
    );

    expect(buyerRep.result).toBeOk(
      Cl.tuple({
        "successful-txs": Cl.uint(1),
        "failed-txs": Cl.uint(0),
        "rating-sum": Cl.uint(0),
        "rating-count": Cl.uint(0),
      })
    );
  });
});

describe("stack-mart bundles and packs", () => {
  it("creates a bundle with multiple listings", () => {
    // Create multiple listings
    simnet.callPublicFn(
      contractName,
      "create-listing",
      [Cl.uint(1_000), Cl.uint(100), Cl.principal(royaltyRecipient)],
      seller
    );

    simnet.callPublicFn(
      contractName,
      "create-listing",
      [Cl.uint(2_000), Cl.uint(200), Cl.principal(royaltyRecipient)],
      seller
    );

    simnet.callPublicFn(
      contractName,
      "create-listing",
      [Cl.uint(3_000), Cl.uint(300), Cl.principal(royaltyRecipient)],
      seller
    );

    // Create bundle with discount
    const bundleResult = simnet.callPublicFn(
      contractName,
      "create-bundle",
      [
        Cl.list([Cl.uint(1), Cl.uint(2), Cl.uint(3)]),
        Cl.uint(1_000), // 10% discount
      ],
      seller
    );

    expect(bundleResult.result).toBeOk(Cl.uint(1));

    // Get bundle details
    const bundle = simnet.callReadOnlyFn(
      contractName,
      "get-bundle",
      [Cl.uint(1)],
      deployer
    );

    expect(bundle.result).toBeOk(
      Cl.tuple({
        "listing-ids": Cl.list([Cl.uint(1), Cl.uint(2), Cl.uint(3)]),
        "discount-bips": Cl.uint(1_000),
        creator: Cl.principal(seller),
        "created-at-block": Cl.uint(0),
      })
    );
  });
});
