import { useAppKit } from '@reown/appkit/react';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';

/**
 * Custom hook to integrate AppKit with the application
 * Provides unified interface for wallet connection state
 */
export const useAppKitIntegration = () => {
  const { open, close } = useAppKit();
  const { address, isConnected, chain } = useAccount();

  // Log connection state changes for debugging
  useEffect(() => {
    if (isConnected && address) {
      console.log('AppKit wallet connected:', { address, chain });
    }
  }, [isConnected, address, chain]);

  return {
    open,
    close,
    address,
    isConnected,
    chain,
  };
};

