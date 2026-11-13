import { createContext, useContext } from 'react'

export type AuthUser = {
  username: string
}

type AuthContextValue = {
  user: AuthUser | null
  login: (username: string) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return auth
}