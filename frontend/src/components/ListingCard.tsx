interface Listing {
  id: number;
  seller: string;
  price: number;
  royaltyBips: number;
  royaltyRecipient: string;
  nftContract?: string;
  tokenId?: number;
  licenseTerms?: string;
}

interface ListingCardProps {
  listing: Listing;
  onBuy?: (id: number) => void;
}

export const ListingCard = ({ listing, onBuy }: ListingCardProps) => {
  const priceInSTX = listing.price / 1000000; // Convert microSTX to STX
  const royaltyPercent = listing.royaltyBips / 100;

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      margin: '10px',
      maxWidth: '400px',
    }}>
      <h3>Listing #{listing.id}</h3>
      <p><strong>Seller:</strong> {listing.seller}</p>
      <p><strong>Price:</strong> {priceInSTX} STX</p>
      <p><strong>Royalty:</strong> {royaltyPercent}%</p>
      {listing.licenseTerms && (
        <p><strong>License:</strong> {listing.licenseTerms}</p>
      )}
      {onBuy && (
        <button 
          onClick={() => onBuy(listing.id)}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Buy Now
        </button>
      )}
    </div>
  );
};

