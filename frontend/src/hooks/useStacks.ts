import { useState, useEffect } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import { NETWORK } from '../config/contract';
import { useAppKit } from '@reown/appkit/react';
import { useAccount } from 'wagmi';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const network = NETWORK === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;

export const useStacks = () => {
  // AppKit hooks for modern wallet UI
  const { open } = useAppKit();
  const { address: appKitAddress, isConnected: isAppKitConnected } = useAccount();
  
  const [userData, setUserData] = useState(() => {
    try {
      return userSession.isUserSignedIn() ? userSession.loadUserData() : undefined;
    } catch (error) {
      console.warn('Error loading user data:', error);
      return undefined;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      if (userSession.isUserSignedIn()) {
        const data = userSession.loadUserData();
        setUserData(data || undefined);
      } else {
        setUserData(undefined);
      }
    } catch (error) {
      console.warn('Error in useStacks useEffect:', error);
      setUserData(undefined);
    }
  }, []);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      // Use AppKit for modern wallet connection UI
      // This opens the AppKit modal for EVM wallets
      // For Stacks, we still use showConnect below
      if (open) {
        open();
      }
      
      // Also show Stacks Connect for Stacks-specific wallets
      showConnect({
        appDetails: {
          name: 'StackMart',
          icon: window.location.origin + '/vite.svg',
        },
        redirectTo: '/',
        onFinish: () => {
          try {
            const data = userSession.loadUserData();
            setUserData(data || undefined);
          } catch (error) {
            console.error('Error loading user data after connect:', error);
            setUserData(undefined);
          }
          setIsLoading(false);
        },
        onCancel: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    try {
      userSession.signUserOut();
    } catch (error) {
      console.warn('Error signing out:', error);
    }
    setUserData(undefined);
  };

  // Check if either Stacks or AppKit wallet is connected
  const isConnected = userSession.isUserSignedIn() || isAppKitConnected;

  return {
    userData,
    isConnected,
    isLoading,
    connectWallet,
    disconnectWallet,
    network,
    userSession,
    // AppKit specific exports
    appKitAddress,
    isAppKitConnected,
  };
};
