import { useState, useEffect } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { NETWORK } from '../config/contract';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

const network = NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

export const useStacks = () => {
  const [userData, setUserData] = useState(userSession.loadUserData());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      showConnect({
        appDetails: {
          name: 'StackMart',
          icon: window.location.origin + '/vite.svg',
        },
        redirectTo: '/',
        onFinish: () => {
          setUserData(userSession.loadUserData());
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
    userSession.signUserOut();
    setUserData(null);
  };

  return {
    userData,
    isConnected: userSession.isUserSignedIn(),
    isLoading,
    connectWallet,
    disconnectWallet,
    network,
    userSession,
  };
};

