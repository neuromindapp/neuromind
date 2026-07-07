import type { ReactNode } from 'react'
import { PrivyProvider } from '@privy-io/react-auth'
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana'
import { FallbackAuthProvider, PrivyAuthBridge } from '@/hooks/useAuth'

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: false,
})

export function Providers({ children }: { children: ReactNode }) {
  const appId = import.meta.env.VITE_PRIVY_APP_ID
  const hasPrivyAppId = typeof appId === 'string' && appId.trim().length > 0

  if (!hasPrivyAppId) {
    console.warn('VITE_PRIVY_APP_ID is missing. Privy login will not work.')
    return <FallbackAuthProvider>{children}</FallbackAuthProvider>
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#2FB8FF',
          logo: '/logo.png',
          walletChainType: 'solana-only',
          walletList: [
            'phantom',
            'backpack',
            'solflare',
            'detected_solana_wallets',
          ],
        },
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        embeddedWallets: {
          solana: { createOnLogin: 'off' },
        },
      }}
    >
      <PrivyAuthBridge>{children}</PrivyAuthBridge>
    </PrivyProvider>
  )
}
