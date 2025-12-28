import { useAppKit } from '@reown/appkit/react';
import { useAccount } from 'wagmi';

/**
 * AppKit Connect Button Component
 * Uses AppKit's built-in UI for wallet connection
 */
export const AppKitConnectButton = () => {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();

  if (isConnected && address) {
    return (
      <w3m-button />
    );
  }

  return (
    <button 
      onClick={() => open()}
      className="btn btn-primary"
      style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)' }}
    >
      🔗 Connect Wallet (AppKit)
    </button>
  );
};

