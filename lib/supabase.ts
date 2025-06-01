import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

// Check if environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create Supabase client only if environment variables are available
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
        },
      })
    : null

// Mock authentication functions for fallback
const mockSignUp = async (email: string, password: string, userData: any) => {
  // Simulation of registration
  const mockUser = {
    id: `mock-${Date.now()}`,
    email,
    user_metadata: userData,
    created_at: new Date().toISOString(),
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("espacero_user", JSON.stringify(mockUser))
  }

  return {
    data: { user: mockUser },
    error: null,
  }
}

const mockSignIn = async (email: string, password: string) => {
  // Simulation of sign in
  const mockUser = {
    id: `mock-${Date.now()}`,
    email,
    user_metadata: {
      full_name: email.split("@")[0],
      user_role: "client",
    },
    created_at: new Date().toISOString(),
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("espacero_user", JSON.stringify(mockUser))
  }

  return {
    data: { user: mockUser },
    error: null,
  }
}

const mockSignOut = async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("espacero_user")
  }
  return { error: null }
}

// Main authentication functions
export const signUp = async (email: string, password: string, userData: any) => {
  if (!supabase) {
    return mockSignUp(email, password, userData)
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })
    return { data, error }
  } catch (error) {
    console.error("Error during registration:", error)
    return { data: null, error }
  }
}

export const signIn = async (email: string, password: string) => {
  if (!supabase) {
    return mockSignIn(email, password)
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  } catch (error) {
    console.error("Error during sign in:", error)
    return { data: null, error }
  }
}

export const signOut = async () => {
  if (!supabase) {
    return mockSignOut()
  }

  try {
    const { error } = await supabase.auth.signOut()
    return { error }
  } catch (error) {
    console.error("Error during sign out:", error)
    return { error }
  }
}

export const getCurrentUser = async () => {
  if (!supabase) {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("espacero_user")
      return savedUser ? JSON.parse(savedUser) : null
    }
    return null
  }

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

export const getSession = async () => {
  if (!supabase) {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("espacero_user")
      if (savedUser) {
        return {
          user: JSON.parse(savedUser),
          access_token: "mock-token",
        }
      }
    }
    return null
  }

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}
