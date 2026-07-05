import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { api, setTokenGetter } from '@/lib/api'

export interface NeuroMindUser {
  id: string
  wallet_pubkey: string
  privy_did?: string
  free_tries_left: number
  credits: number
}

export interface AuthState {
  ready: boolean
  authenticated: boolean
  login: () => void
  logout: () => void
  user: NeuroMindUser | null
  isRegistering: boolean
  walletAddress: string | null
  isLoading: boolean
  isPrivyConfigured: boolean
}

const fallbackAuth: AuthState = {
  ready: true,
  authenticated: false,
  login: () => {
    console.warn('Privy is not configured yet. Set VITE_PRIVY_APP_ID to enable wallet auth.')
  },
  logout: () => {},
  user: null,
  isRegistering: false,
  walletAddress: null,
  isLoading: false,
  isPrivyConfigured: false,
}

const AuthContext = createContext<AuthState>(fallbackAuth)

export function FallbackAuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    setTokenGetter(async () => null)
  }, [])

  return <AuthContext.Provider value={fallbackAuth}>{children}</AuthContext.Provider>
}

export function PrivyAuthBridge({ children }: { children: ReactNode }) {
  const privy = usePrivy()
  const { ready, authenticated, user, login, logout, getAccessToken } = privy
  const [neuroMindUser, setNeuroMindUser] = useState<NeuroMindUser | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const registeredRef = useRef(false)

  useEffect(() => {
    setTokenGetter(getAccessToken)
  }, [getAccessToken])

  const registerWithBackend = useCallback(async () => {
    if (!authenticated || !user?.wallet?.address || registeredRef.current) return

    const token = await getAccessToken()
    if (!token) return

    registeredRef.current = true
    setIsRegistering(true)

    try {
      const result = await api.post<NeuroMindUser>('/auth/verify', {
        token,
        wallet_address: user.wallet.address,
      })
      setNeuroMindUser(result)
    } catch (err) {
      console.error('[NeuroMind] Backend registration failed:', err)
      registeredRef.current = false
    } finally {
      setIsRegistering(false)
    }
  }, [authenticated, user?.wallet?.address, getAccessToken])

  useEffect(() => {
    if (authenticated && user?.wallet?.address && !registeredRef.current) {
      registerWithBackend()
    }
    if (!authenticated) {
      registeredRef.current = false
      setNeuroMindUser(null)
    }
  }, [authenticated, user?.wallet?.address, registerWithBackend])

  const value: AuthState = {
    ready,
    authenticated,
    login,
    logout,
    user: neuroMindUser,
    isRegistering,
    walletAddress: user?.wallet?.address || null,
    isLoading: !ready || (authenticated && isRegistering && !neuroMindUser),
    isPrivyConfigured: true,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
