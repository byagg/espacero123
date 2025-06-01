"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import type { Venue } from "@/types/venue"
import { Loader2, MapPin, Star, Users, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthModal } from "@/components/auth/auth-modal"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      if (!supabase) {
        console.error("Supabase client not initialized")
        setLoading(false)
        return
      }

      try {
        // Get favorite IDs
        const { data: favoriteData, error: favoriteError } = await supabase
          .from("favorites")
          .select("venue_id")
          .eq("user_id", user.id)

        if (favoriteError) throw favoriteError

        if (!favoriteData || favoriteData.length === 0) {
          setFavorites([])
          setLoading(false)
          return
        }

        const venueIds = favoriteData.map((fav) => fav.venue_id)

        // Get venue details
        const { data: venueData, error: venueError } = await supabase.from("venues").select("*").in("id", venueIds)

        if (venueError) throw venueError

        setFavorites(venueData || [])
      } catch (error) {
        console.error("Error fetching favorites:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [user])

  const removeFavorite = async (venueId: string) => {
    if (!user || !supabase) return

    try {
      const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("venue_id", venueId)

      if (error) throw error

      setFavorites((prev) => prev.filter((venue) => venue.id !== venueId))
    } catch (error) {
      console.error("Error removing favorite:", error)
    }
  }

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Obľúbené priestory</h1>
            <p className="text-gray-600 mb-6">Pre zobrazenie obľúbených priestorov sa musíte prihlásiť.</p>
            <Button className="bg-amber-500 hover:bg-amber-600" onClick={() => setShowAuthModal(true)}>
              Prihlásiť sa
            </Button>
            <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Obľúbené priestory</h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Nemáte žiadne obľúbené priestory</h2>
            <p className="text-gray-600 mb-6">
              Začnite prehliadať priestory a pridajte si ich do obľúbených kliknutím na ikonu srdca.
            </p>
            <Button className="bg-amber-500 hover:bg-amber-600" onClick={() => router.push("/search")}>
              Hľadať priestory
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {favorites.map((venue) => (
              <Card key={venue.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <Image
                      src={venue.images?.[0] || "/placeholder.svg"}
                      alt={venue.name}
                      width={300}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">{venue.name}</h2>
                        <p className="text-gray-600 flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {venue.city}, {venue.address}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        <span className="font-medium">4.8</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4">{venue.description}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {venue.amenities?.slice(0, 3).map((amenity, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {amenity}
                        </span>
                      ))}
                      {venue.amenities && venue.amenities.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          +{venue.amenities.length - 3} ďalších
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        <span>až {venue.capacity} osôb</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-amber-500">€{venue.price_per_hour}</span>
                        <span className="text-gray-500">/hodina</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={() => removeFavorite(venue.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Odstrániť
                      </Button>
                      <Link href={`/venues/${venue.id}`}>
                        <Button className="bg-amber-500 hover:bg-amber-600">Zobraziť detail</Button>
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
