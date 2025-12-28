# Complete Wallet Integration Guide

This project supports **three wallet integration options** for maximum flexibility:

## 🎯 Wallet Options Overview

### 1. Stacks Connect (Native)
- **Best for**: Stacks blockchain transactions
- **Features**: Native Stacks wallet support, direct blockchain interaction
- **Component**: `WalletButton`
- **Hook**: `useStacks`

### 2. Reown AppKit (Multi-Wallet)
- **Best for**: Connecting to 100+ wallets via WalletConnect
- **Features**: Email/social login, multi-chain support, modern UI
- **Component**: `AppKitConnectButton`
- **Hook**: `useAppKitIntegration`

### 3. WalletKit SDK (Gasless)
- **Best for**: Gasless transactions and smart wallets
- **Features**: Zero gas fees, email/social login, recoverable wallets
- **Component**: `WalletKitButton`
- **Hook**: `useWalletKitHook`

## 🚀 Quick Start

### Environment Variables

Add to your `.env` file:

```bash
# Reown AppKit Project ID
VITE_REOWN_PROJECT_ID=your_reown_project_id

# WalletKit Project ID
VITE_WALLETKIT_PROJECT_ID=your_walletkit_project_id

# Stacks Network
VITE_STACKS_NETWORK=mainnet  # or testnet
```

### Using the Unified Selector

```tsx
import { UnifiedWalletSelector } from './components/UnifiedWalletSelector';

function App() {
  return (
    <div>
      <UnifiedWalletSelector />
    </div>
  );
}
```

### Using Individual Components

```tsx
// Stacks Connect
import { WalletButton } from './components/WalletButton';

// Reown AppKit
import { AppKitConnectButton } from './components/AppKitConnectButton';

// WalletKit
import { WalletKitButton } from './components/WalletKitButton';
```

## 📚 Detailed Documentation

- [AppKit Integration Guide](./APPKIT_INTEGRATION.md)
- [WalletKit Integration Guide](./WALLETKIT_INTEGRATION.md)

## 🔄 When to Use Which?

| Use Case | Recommended Option |
|----------|-------------------|
| Stacks blockchain transactions | Stacks Connect |
| Connect to MetaMask, Coinbase, etc. | Reown AppKit |
| Gasless transactions | WalletKit SDK |
| Maximum wallet compatibility | Reown AppKit |
| Smart wallet features | WalletKit SDK |
| Email/social login | Both AppKit & WalletKit |

## 🎨 Customization

All wallet components can be customized with your own styling. Check the component files for inline styles that can be modified.

## 🔧 Advanced Usage

### Programmatic Wallet Access

```tsx
// Stacks
const { userSession, isConnected } = useStacks();

// AppKit
const { open, address, isConnected } = useAppKitIntegration();

// WalletKit
const { walletKit, isConnected, address } = useWalletKitHook();
```

### Transaction Examples

```tsx
// Stacks transaction
import { makeContractCall } from '@stacks/transactions';
// ... use with userSession

// EVM transaction (via AppKit/WalletKit)
import { useAccount, useWriteContract } from 'wagmi';
// ... use wagmi hooks
```

## 🐛 Troubleshooting

### WalletKit React Version Conflict
If you see peer dependency warnings, the project uses `--legacy-peer-deps` for WalletKit compatibility.

### Project IDs Not Working
Make sure you've:
1. Created projects on respective dashboards
2. Added Project IDs to `.env` file
3. Restarted the dev server after adding env vars

## 📝 Notes

- All three wallet options can be used simultaneously
- Stacks Connect is required for Stacks blockchain transactions
- AppKit and WalletKit are for EVM-compatible chains
- The unified selector provides the best user experience

