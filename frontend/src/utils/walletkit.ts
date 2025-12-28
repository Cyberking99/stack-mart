/**
 * WalletKit Utility Functions
 * Helper functions for working with WalletKit SDK
 */

/**
 * Format WalletKit address for display
 */
export const formatWalletKitAddress = (address: string): string => {
  if (!address) return '';
  if (address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Check if transaction can be gasless on current chain
 */
export const isGaslessSupported = (chainId?: number): boolean => {
  // WalletKit supports gasless transactions on:
  // Ethereum, Base, Polygon, Arbitrum, Optimism, and more
  const supportedChains = [
    1,    // Ethereum Mainnet
    8453, // Base Mainnet
    137,  // Polygon
    42161, // Arbitrum
    10,   // Optimism
  ];
  return chainId ? supportedChains.includes(chainId) : false;
};

/**
 * Get chain name from WalletKit chain object
 */
export const getWalletKitChainName = (chain: any): string => {
  if (!chain) return 'Unknown';
  return chain.name || chain.chainId?.toString() || 'Unknown';
};

