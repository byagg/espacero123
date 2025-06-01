import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

// Vytvorenie Supabase klienta pre použitie na strane klienta (browser)
const createClientSide = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables nie sú nastavené, používa sa mock autentifikácia")
    return null
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}

// Singleton pattern pre klientskú stranu
let clientSideInstance: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseBrowser = () => {
  if (typeof window === "undefined") {
    return null
  }

  if (clientSideInstance !== null) return clientSideInstance

  try {
    clientSideInstance = createClientSide()
    return clientSideInstance
  } catch (error) {
    console.warn("Nepodarilo sa vytvoriť Supabase klient, používa sa mock autentifikácia:", error)
    clientSideInstance = null
    return null
  }
}

// Export pre jednoduchšie použitie v komponentoch
export const supabase = typeof window !== "undefined" ? getSupabaseBrowser() : null

// Mock autentifikačné funkcie pre fallback
const mockSignUp = async (email: string, password: string, userData: any) => {
  // Simulácia registrácie
  const mockUser = {
    id: `mock-${Date.now()}`,
    email,
    user_metadata: userData,
    created_at: new Date().toISOString(),
  }

  localStorage.setItem("espacero_user", JSON.stringify(mockUser))

  return {
    data: { user: mockUser },
    error: null,
  }
}

const mockSignIn = async (email: string, password: string) => {
  // Simulácia prihlásenia
  const mockUser = {
    id: `mock-${Date.now()}`,
    email,
    user_metadata: {
      full_name: email.split("@")[0],
      user_role: "guest",
    },
    created_at: new Date().toISOString(),
  }

  localStorage.setItem("espacero_user", JSON.stringify(mockUser))

  return {
    data: { user: mockUser },
    error: null,
  }
}

const mockSignOut = async () => {
  localStorage.removeItem("espacero_user")
  return { error: null }
}

// Hlavné autentifikačné funkcie
export const signUp = async (email: string, password: string, userData: any) => {
  const client = getSupabaseBrowser()

  if (!client) {
    return mockSignUp(email, password, userData)
  }

  try {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })
    return { data, error }
  } catch (error) {
    console.error("Chyba pri registrácii:", error)
    return { data: null, error }
  }
}

export const signIn = async (email: string, password: string) => {
  const client = getSupabaseBrowser()

  if (!client) {
    return mockSignIn(email, password)
  }

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  } catch (error) {
    console.error("Chyba pri prihlásení:", error)
    return { data: null, error }
  }
}

export const signOut = async () => {
  const client = getSupabaseBrowser()

  if (!client) {
    return mockSignOut()
  }

  try {
    const { error } = await client.auth.signOut()
    return { error }
  } catch (error) {
    console.error("Chyba pri odhlásení:", error)
    return { error }
  }
}

export const getCurrentUser = async () => {
  const client = getSupabaseBrowser()

  if (!client) {
    const savedUser = localStorage.getItem("espacero_user")
    return savedUser ? JSON.parse(savedUser) : null
  }

  try {
    const {
      data: { user },
    } = await client.auth.getUser()
    return user
  } catch (error) {
    console.error("Chyba pri získavaní používateľa:", error)
    return null
  }
}

export const getSession = async () => {
  const client = getSupabaseBrowser()

  if (!client) {
    const savedUser = localStorage.getItem("espacero_user")
    if (savedUser) {
      return {
        user: JSON.parse(savedUser),
        access_token: "mock-token",
      }
    }
    return null
  }

  try {
    const {
      data: { session },
    } = await client.auth.getSession()
    return session
  } catch (error) {
    console.error("Chyba pri získavaní session:", error)
    return null
  }
}
