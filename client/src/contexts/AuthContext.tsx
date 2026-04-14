import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import api from '../services/api'

interface User {
  id: number
  username: string
  email: string
  artist_name?: string
  role: string
  plan: string
  avatar?: string
  subscription_expires_at?: string
  subscription_status?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { username: string; email: string; password: string; artist_name?: string; plan?: string }) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  isCreator: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
  isCreator: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('layers_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      api.me()
        .then((u: unknown) => setUser(u as User))
        .catch(() => {
          localStorage.removeItem('layers_token')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email: string, password: string) => {
    const data = await api.login({ email, password })
    localStorage.setItem('layers_token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const register = async (regData: { username: string; email: string; password: string; artist_name?: string; plan?: string }) => {
    const data = await api.register(regData)
    localStorage.setItem('layers_token', data.token)
    setToken(data.token)
    setUser(data.user)
  }

  const logout = () => {
    localStorage.removeItem('layers_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isCreator: user?.role === 'creator' || user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
