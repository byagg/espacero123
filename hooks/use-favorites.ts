"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"
import type { Database } from "@/types/database"

type Favorite = Database["public"]["Tables"]["favorites"]["Row"]

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    if (!user || !supabase) return

    setLoading(true)
    try {
      const { data, error } = await supabase.from("favorites").select("venue_id").eq("user_id", user.id)

      if (error) throw error

      setFavorites(data?.map((f) => f.venue_id) || [])
    } catch (error) {
      console.error("Error fetching favorites:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = async (venueId: string) => {
    if (!user || !supabase) return { error: new Error("User not authenticated") }

    try {
      const { error } = await supabase.from("favorites").insert({ user_id: user.id, venue_id: venueId })

      if (error) throw error

      setFavorites((prev) => [...prev, venueId])
      return { error: null }
    } catch (error) {
      console.error("Error adding to favorites:", error)
      return { error: error instanceof Error ? error : new Error("Unknown error") }
    }
  }

  const removeFromFavorites = async (venueId: string) => {
    if (!user || !supabase) return { error: new Error("User not authenticated") }

    try {
      const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("venue_id", venueId)

      if (error) throw error

      setFavorites((prev) => prev.filter((id) => id !== venueId))
      return { error: null }
    } catch (error) {
      console.error("Error removing from favorites:", error)
      return { error: error instanceof Error ? error : new Error("Unknown error") }
    }
  }

  const isFavorite = (venueId: string) => favorites.includes(venueId)

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refetch: fetchFavorites,
  }
}
