/**
 * Wallet Type Definitions
 * TypeScript types for wallet integrations
 */

export type WalletType = 'stacks' | 'appkit' | 'walletkit';

export interface WalletConnection {
  type: WalletType;
  address: string | null;
  isConnected: boolean;
  chainId?: number;
  network?: string;
}

export interface StacksWalletData {
  profile?: {
    stxAddress?: {
      mainnet?: string;
      testnet?: string;
    };
  };
}

export interface EVMWalletData {
  address: string;
  chainId: number;
  isConnected: boolean;
}

export interface WalletKitData {
  address: string | null;
  isConnected: boolean;
  chain?: any;
}

export interface UnifiedWalletState {
  stacks: {
    isConnected: boolean;
    userData?: StacksWalletData;
    address?: string | null;
  };
  appKit: {
    isConnected: boolean;
    address: string | null;
    chain?: any;
  };
  walletKit: {
    isConnected: boolean;
    address: string | null;
    chain?: any;
  };
  isAnyConnected: boolean;
  connectedWallets: Array<{
    type: WalletType;
    address: string;
  }>;
  connectedCount: number;
}

