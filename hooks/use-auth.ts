"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@supabase/supabase-js"
import type { User, AuthError } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: any; error: AuthError | null }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data: any; error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error getting initial session:", error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return result
    } catch (error) {
      console.error("Sign in error:", error)
      return { data: null, error: error as AuthError }
    }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const result = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })
      return result
    } catch (error) {
      console.error("Sign up error:", error)
      return { data: null, error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      const result = await supabase.auth.signOut()
      return result
    } catch (error) {
      console.error("Sign out error:", error)
      return { error: error as AuthError }
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

// Pridaj funkciu pre zabezpečenie chránených stránok
export function useRequireAuth(redirectTo = "/") {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, router, redirectTo])

  return { user, loading }
}
