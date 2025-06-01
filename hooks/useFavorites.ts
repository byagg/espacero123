"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./useAuth"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadFavorites()
    } else {
      // Clear favorites when user is not logged in
      setFavorites([])
    }
  }, [user])

  const loadFavorites = () => {
    if (!user) return

    try {
      const stored = localStorage.getItem(`favorites_${user.id}`)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
      setFavorites([])
    }
  }

  const saveFavorites = (newFavorites: string[]) => {
    if (!user) return

    try {
      setFavorites(newFavorites)
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites))
    } catch (error) {
      console.error("Error saving favorites:", error)
    }
  }

  const toggleFavorite = (venueId: string) => {
    if (!user) {
      // Could show a login modal here
      console.log("User must be logged in to add favorites")
      return
    }

    const newFavorites = favorites.includes(venueId)
      ? favorites.filter((id) => id !== venueId)
      : [...favorites, venueId]

    saveFavorites(newFavorites)
  }

  const isFavorite = (venueId: string) => {
    if (!user) return false
    return favorites.includes(venueId)
  }

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoggedIn: !!user,
  }
}
