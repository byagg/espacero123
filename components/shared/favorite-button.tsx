"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/hooks/use-auth"
import { Heart } from "lucide-react"
import { useState } from "react"

interface FavoriteButtonProps {
  venueId: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
  showText?: boolean
}

export function FavoriteButton({
  venueId,
  size = "default",
  variant = "outline",
  showText = false,
}: FavoriteButtonProps) {
  const { user } = useAuth()
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites()
  const [loading, setLoading] = useState(false)

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      // Could trigger auth modal here
      return
    }

    setLoading(true)
    try {
      if (isFavorite(venueId)) {
        await removeFromFavorites(venueId)
      } else {
        await addToFavorites(venueId)
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    } finally {
      setLoading(false)
    }
  }

  const isLiked = isFavorite(venueId)

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      disabled={loading || !user}
      className={`${isLiked ? "text-red-500 border-red-500" : ""} transition-colors`}
    >
      <Heart className={`h-4 w-4 ${showText ? "mr-2" : ""} ${isLiked ? "fill-current" : ""}`} />
      {showText && (isLiked ? "Odstrániť z obľúbených" : "Pridať do obľúbených")}
    </Button>
  )
}
