"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  signIn as supabaseSignIn,
  signUp as supabaseSignUp,
  signOut as supabaseSignOut,
  getCurrentUser,
} from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error getting initial session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Check for session changes periodically
    const interval = setInterval(async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error("Error checking session:", error)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const result = await supabaseSignIn(email, password)
      if (result.data?.user) {
        setUser(result.data.user)
      }
      return result
    } catch (error) {
      console.error("Sign in error:", error)
      return { data: null, error }
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const result = await supabaseSignUp(email, password, metadata)
      if (result.data?.user) {
        setUser(result.data.user)
      }
      return result
    } catch (error) {
      console.error("Sign up error:", error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const result = await supabaseSignOut()
      setUser(null)
      return result
    } catch (error) {
      console.error("Sign out error:", error)
      return { error }
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
