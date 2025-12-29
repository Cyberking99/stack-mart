/**
 * Wallet Helper Utilities
 * Common functions for working with multiple wallet types
 */

/**
 * Detect wallet type from address format
 */
export const detectWalletType = (address: string): 'stacks' | 'evm' | 'unknown' => {
  if (!address) return 'unknown';
  
  // Stacks addresses start with SP (mainnet) or ST (testnet)
  if (address.startsWith('SP') || address.startsWith('ST')) {
    return 'stacks';
  }
  
  // EVM addresses start with 0x and are 42 characters
  if (address.startsWith('0x') && address.length === 42) {
    return 'evm';
  }
  
  return 'unknown';
};

/**
 * Format any wallet address for display
 */
export const formatAnyAddress = (address: string | null | undefined): string => {
  if (!address) return '';
  
  const type = detectWalletType(address);
  
  if (type === 'stacks') {
    // Stacks addresses: show first 5 and last 4
    return `${address.slice(0, 5)}...${address.slice(-4)}`;
  }
  
  if (type === 'evm') {
    // EVM addresses: show first 6 and last 4
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  
  // Fallback for unknown formats
  if (address.length > 10) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
  
  return address;
};

/**
 * Validate any wallet address
 */
export const isValidWalletAddress = (address: string | null | undefined): boolean => {
  if (!address) return false;
  
  const type = detectWalletType(address);
  
  if (type === 'stacks') {
    // Stacks addresses: SP/ST + 39 characters
    return (address.startsWith('SP') || address.startsWith('ST')) && address.length === 41;
  }
  
  if (type === 'evm') {
    // EVM addresses: 0x + 40 hex characters
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  
  return false;
};

/**
 * Get network name for wallet type
 */
export const getWalletNetworkName = (type: string, chainId?: number): string => {
  if (type === 'stacks') {
    return 'Stacks';
  }
  
  if (type === 'evm') {
    const networks: Record<number, string> = {
      1: 'Ethereum',
      11155111: 'Sepolia',
      8453: 'Base',
      137: 'Polygon',
    };
    return chainId ? networks[chainId] || `Chain ${chainId}` : 'EVM';
  }
  
  return 'Unknown';
};

