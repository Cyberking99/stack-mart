# StackMart Contract Implementation Status & Milestones

## Current Implementation Status

### ✅ Completed Features
- **Basic Listing System**
  - Create listings with price, royalty-bips, and royalty-recipient
  - Read-only functions: `get-listing`, `get-next-id`
  - Royalty validation (max 10% / 1000 bips)
  - Automatic royalty splits on purchase

- **Basic Purchase Flow**
  - Immediate payment to seller and royalty recipient
  - Listing deletion after purchase
  - STX transfer handling

---

## Remaining Contract Implementations

### 🎯 Milestone 1: NFT Integration & License Terms
**Priority: High**

#### Contract Changes Needed:
- [ ] Add NFT contract reference to listings (SIP-009 NFT standard)
- [ ] Add NFT token ID to listing data structure
- [ ] Verify seller owns NFT before creating listing
- [ ] Transfer NFT to buyer on purchase
- [ ] Add license terms field to listings (string or structured data)
- [ ] Add license type enum (e.g., commercial, non-commercial, exclusive, non-exclusive)

#### Functions to Implement:
- `create-listing-with-nft(nft-contract principal, token-id uint, price uint, royalty-bips uint, royalty-recipient principal, license-terms (string-ascii 500))`
- `verify-nft-ownership(nft-contract principal, token-id uint, owner principal) -> bool`
- `get-listing-with-nft(id uint)` - returns listing with NFT details

---

### 🎯 Milestone 2: Escrow System
**Priority: High**

#### Contract Changes Needed:
- [ ] Change payment flow from immediate to escrowed
- [ ] Add escrow state tracking (pending, delivered, disputed, released)
- [ ] Add escrow timeout mechanism
- [ ] Store buyer address in listing/escrow data
- [ ] Add escrow release conditions

#### Functions to Implement:
- `buy-listing-escrow(id uint)` - creates escrow, doesn't pay immediately
- `confirm-delivery(id uint)` - seller signals delivery
- `confirm-receipt(id uint)` - buyer confirms receipt, releases escrow
- `release-escrow(id uint)` - auto-release after timeout or manual release
- `get-escrow-status(id uint)` - returns escrow state
- `cancel-escrow(id uint)` - allows cancellation with conditions

#### Data Structures:
- Escrow map: `{ id: uint } -> { buyer: principal, amount: uint, created-at: uint, state: (escrow-state), timeout: uint }`
- Escrow state enum: `pending, delivered, confirmed, disputed, released, cancelled`

---

### 🎯 Milestone 3: Delivery Attestation & Reputation
**Priority: Medium**

#### Contract Changes Needed:
- [ ] Add delivery attestation tracking
- [ ] Add seller/buyer reputation scores
- [ ] Track successful transactions
- [ ] Track delivery confirmations/rejections
- [ ] Add rating system (optional)

#### Functions to Implement:
- `attest-delivery(id uint, delivery-hash (buff 32))` - seller attests delivery
- `confirm-delivery-received(id uint)` - buyer confirms
- `reject-delivery(id uint, reason (string-ascii 200))` - buyer rejects
- `get-seller-reputation(seller principal)` - returns reputation score
- `get-buyer-reputation(buyer principal)` - returns reputation score
- `get-transaction-history(principal principal)` - returns transaction list

#### Data Structures:
- Reputation map: `{ principal } -> { successful-txs: uint, failed-txs: uint, rating-sum: uint, rating-count: uint }`
- Delivery attestations: `{ id: uint } -> { delivery-hash: (buff 32), attested-at: uint, confirmed: bool }`

---

### 🎯 Milestone 4: Dispute Resolution System
**Priority: Medium**

#### Contract Changes Needed:
- [ ] Add dispute creation mechanism
- [ ] Add community staking for dispute resolution
- [ ] Add weighted voting system
- [ ] Add dispute outcome execution
- [ ] Add staking rewards/penalties

#### Functions to Implement:
- `create-dispute(id uint, reason (string-ascii 500))` - buyer/seller creates dispute
- `stake-on-dispute(dispute-id uint, amount uint, side bool)` - stake on buyer/seller side
- `vote-on-dispute(dispute-id uint, vote bool)` - weighted vote
- `resolve-dispute(dispute-id uint)` - execute resolution based on votes
- `get-dispute(dispute-id uint)` - returns dispute details
- `get-dispute-stakes(dispute-id uint)` - returns staking info

#### Data Structures:
- Disputes map: `{ id: uint } -> { escrow-id: uint, created-by: principal, reason: (string-ascii 500), created-at: uint, resolved: bool, buyer-stakes: uint, seller-stakes: uint }`
- Dispute stakes: `{ dispute-id: uint, staker: principal } -> { amount: uint, side: bool }`
- Dispute votes: `{ dispute-id: uint, voter: principal } -> { vote: bool, weight: uint }`

---

### 🎯 Milestone 5: Bundles & Curated Packs
**Priority: Low**

#### Contract Changes Needed:
- [ ] Add bundle data structure (multiple listings grouped)
- [ ] Add discount calculation for bundles
- [ ] Add curated pack creation
- [ ] Add pack pricing logic

#### Functions to Implement:
- `create-bundle(listing-ids (list 10 uint), discount-bips uint)` - create bundle
- `buy-bundle(bundle-id uint)` - purchase entire bundle
- `create-curated-pack(listing-ids (list 20 uint), pack-price uint, curator principal)` - create pack
- `buy-curated-pack(pack-id uint)` - purchase pack
- `get-bundle(bundle-id uint)` - returns bundle details
- `get-pack(pack-id uint)` - returns pack details

#### Data Structures:
- Bundles map: `{ id: uint } -> { listing-ids: (list 10 uint), discount-bips: uint, creator: principal }`
- Packs map: `{ id: uint } -> { listing-ids: (list 20 uint), price: uint, curator: principal, created-at: uint }`

---

## Additional Enhancements

### 🔧 Contract Improvements Needed:
- [ ] Add listing cancellation (`cancel-listing(id uint)`)
- [ ] Add listing update (`update-listing-price(id uint, new-price uint)`)
- [ ] Add bulk operations for efficiency
- [ ] Add pagination for listing queries
- [ ] Add listing filters (by seller, price range, etc.)
- [ ] Add marketplace fee (optional platform fee)
- [ ] Add multiple royalty recipients support
- [ ] Add listing expiration dates
- [ ] Add reserve price / auction support (optional)

### 🧪 Testing Requirements:
- [ ] Test NFT integration with SIP-009 contracts
- [ ] Test escrow timeout scenarios
- [ ] Test dispute resolution edge cases
- [ ] Test bundle discount calculations
- [ ] Test reputation score calculations
- [ ] Test concurrent purchase attempts
- [ ] Test gas optimization

### 📚 Documentation Needed:
- [ ] API documentation for all public functions
- [ ] Integration guide for NFT contracts
- [ ] Dispute resolution process documentation
- [ ] Escrow flow diagrams
- [ ] Security considerations document

---

## Implementation Priority Order

1. **Milestone 1** (NFT Integration) - Foundation for digital goods
2. **Milestone 2** (Escrow System) - Core trust mechanism
3. **Milestone 3** (Reputation) - Builds on escrow system
4. **Milestone 4** (Disputes) - Requires reputation system
5. **Milestone 5** (Bundles) - Nice-to-have feature

---

## Estimated Complexity

- **Milestone 1**: Medium (requires NFT contract integration)
- **Milestone 2**: High (complex state management, timeout handling)
- **Milestone 3**: Medium (straightforward data tracking)
- **Milestone 4**: Very High (complex voting, staking, resolution logic)
- **Milestone 5**: Low (mostly data structures and calculations)

