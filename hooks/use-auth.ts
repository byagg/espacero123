"use client"

import type React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import type { User, AuthError } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: any; error: AuthError | null }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data: any; error: AuthError | null }>
  signOut: () => Promise<void>
  isAdmin: () => boolean
  isHost: () => boolean
  isClient: () => boolean
  getUserRole: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      if (!supabase) {
        setLoading(false)
        return
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error("Error getting session:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    if (!supabase) {
      setLoading(false)
      return
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === "SIGNED_IN" && session?.user) {
        // Redirect based on user role after sign in
        const role = session.user.user_metadata?.user_role || "client"
        redirectBasedOnRole(role)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case "admin":
        router.push("/admin")
        break
      case "host":
        router.push("/host")
        break
      case "client":
      default:
        router.push("/venues")
        break
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { data: null, error: new Error("Supabase not available") as AuthError }
    }

    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return result
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    if (!supabase) {
      return { data: null, error: new Error("Supabase not available") as AuthError }
    }

    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    return result
  }

  const signOut = async () => {
    if (!supabase) {
      router.push("/")
      return
    }

    await supabase.auth.signOut()
    router.push("/")
  }

  const getUserRole = (): string | null => {
    return user?.user_metadata?.user_role || "client"
  }

  const isAdmin = (): boolean => {
    return getUserRole() === "admin"
  }

  const isHost = (): boolean => {
    const role = getUserRole()
    return role === "host" || role === "admin"
  }

  const isClient = (): boolean => {
    return getUserRole() === "client"
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isHost,
    isClient,
    getUserRole,
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
