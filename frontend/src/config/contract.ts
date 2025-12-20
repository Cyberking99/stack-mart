// StackMart Contract Configuration
export const CONTRACT_ADDRESS = 'SPATASA6SYGCVB67NJ1XQ72BB0Q3EHGNGE9JQBQT';
export const CONTRACT_NAME = 'stack-mart';
export const CONTRACT_ID = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`;

// Network configuration
export const NETWORK = import.meta.env.VITE_STACKS_NETWORK || 'mainnet';
export const API_URL = import.meta.env.VITE_STACKS_API_URL || 
  (NETWORK === 'mainnet' ? 'https://api.hiro.so' : 'https://api.testnet.hiro.so');

