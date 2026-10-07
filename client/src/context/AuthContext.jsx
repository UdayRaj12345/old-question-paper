import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch the current user on mount
  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/profile')
      if (res.data && res.data.success) {
        setUser(res.data.data)
      } else {
        setUser(null)
      }
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    setUser(res.data.data)
    return res
  }
  
  const register = async (formData) => {
    const res = await api.post('/auth/register', formData)
    setUser(res.data.data)
    return res
  }

  const updateProfile = async (formData) => {
    const res = await api.put('/auth/profile', formData)
    setUser(res.data.data)
    return res
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, updateProfile, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}
