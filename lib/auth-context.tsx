'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User } from './types'
import { initDemoData } from './init-demo'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, businessName: string, gstin: string) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    // Initialize demo data if needed
    initDemoData()
    
    const savedUser = localStorage.getItem('msme_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('msme_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Check against stored users
    const users: User[] = JSON.parse(localStorage.getItem('msme_users') || '[]')
    const found = users.find((u) => u.email === email && u.password === password)
    
    if (!found) {
      throw new Error('Invalid email or password')
    }

    setUser(found)
    localStorage.setItem('msme_user', JSON.stringify(found))
  }

  const register = async (
    email: string,
    password: string,
    businessName: string,
    gstin: string
  ) => {
    const users: User[] = JSON.parse(localStorage.getItem('msme_users') || '[]')
    
    if (users.some((u) => u.email === email)) {
      throw new Error('Email already registered')
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password,
      businessName,
      gstin,
      createdAt: new Date(),
    }

    users.push(newUser)
    localStorage.setItem('msme_users', JSON.stringify(users))
    setUser(newUser)
    localStorage.setItem('msme_user', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('msme_user')
  }

  const updateUser = (updates: Partial<User>) => {
    if (!user) return
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('msme_user', JSON.stringify(updated))
    
    // Also update in users list
    const users: User[] = JSON.parse(localStorage.getItem('msme_users') || '[]')
    const index = users.findIndex((u) => u.id === user.id)
    if (index !== -1) {
      users[index] = updated
      localStorage.setItem('msme_users', JSON.stringify(users))
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
