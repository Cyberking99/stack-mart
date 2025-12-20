import { useChainhooks } from '../hooks/useChainhooks';

export const ChainhookEvents = () => {
  const { 
    events, 
    isLoading, 
    error, 
    getLatestListings, 
    getLatestPurchases,
    getEscrowUpdates 
  } = useChainhooks();

  const latestListings = getLatestListings();
  const latestPurchases = getLatestPurchases();
  const escrowUpdates = getEscrowUpdates();

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <p>Error loading chainhook events: {error}</p>
        <p>Make sure the chainhook server is running at {import.meta.env.VITE_CHAINHOOK_API_URL || 'http://localhost:3001'}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px' }}>
      <h2>📡 Real-time Marketplace Events (Chainhooks)</h2>
      
      {isLoading && <p>Loading events...</p>}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        <div>
          <h3>New Listings ({latestListings.length})</h3>
          {latestListings.slice(0, 5).map((event, idx) => (
            <div key={idx} style={{ padding: '10px', margin: '5px 0', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <p><strong>TX:</strong> {event.txid.slice(0, 16)}...</p>
              <p><strong>Function:</strong> {event.function}</p>
              <p><strong>Time:</strong> {new Date(event.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
        
        <div>
          <h3>Recent Purchases ({latestPurchases.length})</h3>
          {latestPurchases.slice(0, 5).map((event, idx) => (
            <div key={idx} style={{ padding: '10px', margin: '5px 0', backgroundColor: '#e8f5e9', borderRadius: '4px' }}>
              <p><strong>TX:</strong> {event.txid.slice(0, 16)}...</p>
              <p><strong>Function:</strong> {event.function}</p>
              <p><strong>Time:</strong> {new Date(event.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
        
        <div>
          <h3>Escrow Updates ({escrowUpdates.length})</h3>
          {escrowUpdates.slice(0, 5).map((event, idx) => (
            <div key={idx} style={{ padding: '10px', margin: '5px 0', backgroundColor: '#fff3e0', borderRadius: '4px' }}>
              <p><strong>TX:</strong> {event.txid.slice(0, 16)}...</p>
              <p><strong>Function:</strong> {event.function}</p>
              <p><strong>Time:</strong> {new Date(event.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '0.9em', color: '#666' }}>
        <p>Total events received: {events.length}</p>
        <p>Events update every 10 seconds</p>
      </div>
    </div>
  );
};

