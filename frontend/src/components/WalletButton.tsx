import { useStacks } from '../hooks/useStacks';
import { formatAddress } from '../utils/validation';
import { useAppKit } from '@reown/appkit/react';
import { useAccount } from 'wagmi';

export const WalletButton = () => {
  const { isConnected, connectWallet, disconnectWallet, userData, isLoading, appKitAddress, isAppKitConnected } = useStacks();
  const { open } = useAppKit();
  const { address, isConnected: isAppKitAccountConnected } = useAccount();

  // Determine which wallet is connected
  const connectedAddress = appKitAddress || address || (userData?.profile?.stxAddress?.mainnet || userData?.profile?.stxAddress?.testnet);
  const walletConnected = isConnected || isAppKitConnected || isAppKitAccountConnected;

  if (walletConnected && connectedAddress) {
    const shortAddress = formatAddress(connectedAddress);

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'monospace',
          fontSize: '0.875rem'
        }}>
          <span style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--success)',
            display: 'inline-block'
          }}></span>
          {shortAddress}
        </div>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={disconnectWallet} 
          disabled={isLoading}
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)' }}
        >
          {isLoading ? (
            <>
              <span className="loading"></span>
              Disconnecting...
            </>
          ) : (
            'Disconnect'
          )}
        </button>
      </div>
    );
  }

  return (
    <button 
      className="btn btn-primary"
      onClick={() => {
        // Use AppKit's open function for modern wallet UI
        if (open) {
          open();
        } else {
          connectWallet();
        }
      }} 
      disabled={isLoading}
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)' }}
    >
      {isLoading ? (
        <>
          <span className="loading"></span>
          Connecting...
        </>
      ) : (
        '🔗 Connect Wallet'
      )}
    </button>
  );
};
