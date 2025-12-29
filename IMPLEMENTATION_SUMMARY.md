# WalletKit SDK & Reown AppKit - Code Implementation Summary

This document provides a complete overview of how WalletKit SDK and Reown AppKit are implemented in StackMart.

## 📁 File Structure

```
frontend/src/
├── config/
│   ├── appkit.ts          # Reown AppKit configuration
│   └── walletkit.ts        # WalletKit SDK configuration
├── main.tsx               # Provider setup (entry point)
├── hooks/
│   ├── useAppKitIntegration.ts  # AppKit hook
│   ├── useWalletKit.ts          # WalletKit hook
│   └── useAllWallets.ts         # Unified wallet state
├── components/
│   ├── AppKitConnectButton.tsx   # AppKit UI component
│   ├── WalletKitButton.tsx       # WalletKit UI component
│   └── UnifiedWalletSelector.tsx # Combined selector
└── examples/
    └── WalletIntegrationExamples.tsx # Usage examples
```

## 🔧 Core Implementation

### 1. Provider Setup (`main.tsx`)

```tsx
import { WalletKitLinkProvider } from '@walletkit/react-link'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from './config/appkit'
import { walletKitLink } from './config/walletkit'

createRoot(document.getElementById('root')!).render(
  <WalletKitLinkProvider link={walletKitLink}>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </WalletKitLinkProvider>
)
```

**Key Points:**
- `WalletKitLinkProvider` wraps the entire app for WalletKit SDK
- `WagmiProvider` provides AppKit's wagmi configuration
- `QueryClientProvider` enables React Query for AppKit

### 2. Reown AppKit Configuration (`config/appkit.ts`)

```tsx
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, sepolia } from 'viem/chains'

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID

const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, sepolia],
  projectId,
})

export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, sepolia],
  projectId,
  metadata: {
    name: 'StackMart Marketplace',
    description: 'Decentralized marketplace on Stacks blockchain',
    url: window.location.origin,
    icons: [`${window.location.origin}/vite.svg`],
  },
  features: {
    analytics: true,
    email: true,
    socials: ['github', 'google', 'x', 'discord'],
    emailShowWallets: true,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#6366f1',
    '--w3m-border-radius-master': '8px',
  },
})

export const wagmiConfig = wagmiAdapter.wagmiConfig
```

**Features Configured:**
- ✅ Multi-chain support (Ethereum Mainnet, Sepolia)
- ✅ Email and social login
- ✅ Analytics enabled
- ✅ Custom theme variables

### 3. WalletKit SDK Configuration (`config/walletkit.ts`)

```tsx
import { WalletKitLink } from '@walletkit/react-link'

const projectId = import.meta.env.VITE_WALLETKIT_PROJECT_ID

export const walletKitLink = new WalletKitLink({
  projectId,
})
```

**Features:**
- ✅ Gasless transactions
- ✅ Smart wallet infrastructure
- ✅ Email/social login
- ✅ Recoverable wallets

### 4. AppKit Hook (`hooks/useAppKitIntegration.ts`)

```tsx
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'

export const useAppKitIntegration = () => {
  const { open, close } = useAppKit()
  const { address, isConnected, chain } = useAccount()

  return {
    open,
    close,
    address,
    isConnected,
    chain,
  }
}
```

**Usage:**
```tsx
const { open, address, isConnected } = useAppKitIntegration()
```

### 5. WalletKit Hook (`hooks/useWalletKit.ts`)

```tsx
import { useWalletKit } from '@walletkit/react-link'

export const useWalletKitHook = () => {
  const walletKit = useWalletKit()

  return {
    walletKit,
    isConnected: walletKit?.isConnected || false,
    address: walletKit?.address || null,
    chain: walletKit?.chain || null,
  }
}
```

**Usage:**
```tsx
const { walletKit, isConnected, address } = useWalletKitHook()
```

### 6. Unified Wallet Hook (`hooks/useAllWallets.ts`)

```tsx
import { useStacks } from './useStacks'
import { useAppKitIntegration } from './useAppKitIntegration'
import { useWalletKitHook } from './useWalletKit'

export const useAllWallets = () => {
  const stacks = useStacks()
  const appKit = useAppKitIntegration()
  const walletKit = useWalletKitHook()

  const isAnyConnected = stacks.isConnected || appKit.isConnected || walletKit.isConnected

  const connectedWallets = [
    stacks.isConnected && { type: 'stacks', address: stacks.userData?.profile?.stxAddress?.mainnet },
    appKit.isConnected && { type: 'appkit', address: appKit.address },
    walletKit.isConnected && { type: 'walletkit', address: walletKit.address },
  ].filter(Boolean)

  return {
    stacks,
    appKit,
    walletKit,
    isAnyConnected,
    connectedWallets,
    getPrimaryAddress: () => {
      return stacks.userData?.profile?.stxAddress?.mainnet 
        || appKit.address 
        || walletKit.address
    },
  }
}
```

**Benefits:**
- Single hook to access all wallet states
- Automatic detection of primary address
- List of all connected wallets

## 🎨 UI Components

### AppKit Connect Button

```tsx
import { useAppKit } from '@reown/appkit/react'
import { useAccount } from 'wagmi'

export const AppKitConnectButton = () => {
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()

  if (isConnected && address) {
    return <w3m-button /> // Built-in AppKit component
  }

  return (
    <button onClick={() => open()}>
      🔗 Connect Wallet (AppKit)
    </button>
  )
}
```

### WalletKit Button

```tsx
import { useWalletKitLink } from '@walletkit/react-link'

export const WalletKitButton = () => {
  const walletKit = useWalletKitLink()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    await walletKit.connect()
    setIsConnecting(false)
  }

  const handleDisconnect = async () => {
    await walletKit.disconnect()
  }

  if (walletKit?.isConnected && walletKit?.address) {
    return (
      <div>
        <span>{formatAddress(walletKit.address)}</span>
        <button onClick={handleDisconnect}>Disconnect</button>
      </div>
    )
  }

  return (
    <button onClick={handleConnect} disabled={isConnecting}>
      🔗 Connect WalletKit (Gasless)
    </button>
  )
}
```

### Unified Wallet Selector

```tsx
export const UnifiedWalletSelector = () => {
  const [selectedOption, setSelectedOption] = useState<'stacks' | 'appkit' | 'walletkit'>('stacks')

  return (
    <div>
      {/* Wallet selection UI */}
      {selectedOption === 'stacks' && <WalletButton />}
      {selectedOption === 'appkit' && <AppKitConnectButton />}
      {selectedOption === 'walletkit' && <WalletKitButton />}
    </div>
  )
}
```

## 🔄 Integration Flow

```
1. App Starts
   ↓
2. Providers Initialize
   - WalletKitLinkProvider
   - WagmiProvider (AppKit)
   - QueryClientProvider
   ↓
3. User Clicks Connect
   ↓
4. Wallet Selection
   - Stacks Connect (native)
   - AppKit (100+ wallets)
   - WalletKit (gasless)
   ↓
5. Wallet Connected
   ↓
6. Hooks Provide State
   - useStacks()
   - useAppKitIntegration()
   - useWalletKitHook()
   - useAllWallets() (unified)
   ↓
7. Components Use State
   - Display address
   - Send transactions
   - Check connection status
```

## 📦 Dependencies

### Package.json Dependencies

```json
{
  "@reown/appkit": "^1.8.15",
  "@reown/appkit-adapter-wagmi": "^1.8.15",
  "@walletkit/react-link": "^0.0.30",
  "walletkit-js": "^0.0.30",
  "wagmi": "^3.1.3",
  "viem": "^2.43.3",
  "@tanstack/react-query": "^5.90.12"
}
```

## 🔐 Environment Variables

```bash
# .env file
VITE_REOWN_PROJECT_ID=your_reown_project_id
VITE_WALLETKIT_PROJECT_ID=your_walletkit_project_id
VITE_STACKS_NETWORK=mainnet
```

## 🚀 Usage in App Component

```tsx
// frontend/src/App.tsx
import { UnifiedWalletSelector } from './components/UnifiedWalletSelector'

function App() {
  return (
    <div className="App">
      <header>
        <h1>StackMart Marketplace</h1>
        <UnifiedWalletSelector />
      </header>
      {/* Rest of app */}
    </div>
  )
}
```

## ✅ Implementation Checklist

- [x] Reown AppKit provider setup
- [x] WalletKit SDK provider setup
- [x] AppKit configuration with networks
- [x] WalletKit configuration
- [x] Custom hooks for both SDKs
- [x] Unified wallet state hook
- [x] UI components for both
- [x] Unified wallet selector
- [x] Environment variable setup
- [x] Documentation and examples

## 🎯 Key Implementation Points

1. **Dual Provider Setup**: Both providers wrap the app in `main.tsx`
2. **Network Configuration**: AppKit supports Ethereum Mainnet and Sepolia
3. **Feature Flags**: Email, social login, analytics enabled
4. **Unified Interface**: `useAllWallets` provides single access point
5. **Component Reusability**: Separate components for each wallet type
6. **Type Safety**: TypeScript types defined for all wallet states

## 📝 Next Steps

1. Get Project IDs from respective dashboards
2. Add Project IDs to `.env` file
3. Test wallet connections
4. Implement transaction flows
5. Add error handling
6. Customize UI themes

