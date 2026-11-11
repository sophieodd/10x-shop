import { useState, type ReactNode } from 'react'
import { AuthContext, type AuthUser } from './auth'

type AuthProviderProps = {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)

  function login(username: string) {
    const trimmedUsername = username.trim()
    if (!trimmedUsername) return

    setUser({ username: trimmedUsername })
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}