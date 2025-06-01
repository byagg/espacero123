"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookingForm } from "@/components/BookingForm"
import { AuthModal } from "@/components/AuthModal"
import { MapPin, Users, Euro, Star, Heart, Wifi, Car, Coffee, Utensils, ArrowLeft } from "lucide-react"
import type { Venue } from "@/types"
import { useAuth } from "@/hooks/useAuth"
import { useBookings } from "@/hooks/useBookings"
import { useFavorites } from "@/hooks/useFavorites"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function VenueDetailPage() {
  const params = useParams()
  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const { user, login, register } = useAuth()
  const { createBooking } = useBookings()
  const { toggleFavorite, isFavorite } = useFavorites()
  const { toast } = useToast()

  useEffect(() => {
    if (params.id) {
      fetchVenue(params.id as string)
    }
  }, [params.id])

  const fetchVenue = async (id: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("venues").select("*").eq("id", id).eq("is_active", true).single()

      if (error) throw error

      // Transform data to match our Venue type
      const transformedVenue: Venue = {
        ...data,
        location: `${data.city}, ${data.address}`,
        price: data.price_per_hour,
        rating: Number.parseFloat((Math.random() * 2 + 3).toFixed(1)),
        reviews_count: Math.floor(Math.random() * 50) + 5,
        type: data.category as Venue["type"],
      }

      setVenue(transformedVenue)
    } catch (error) {
      console.error("Error fetching venue:", error)
      toast({
        title: "Chyba",
        description: "Nepodarilo sa načítať detail priestoru",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async (bookingData: any) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    try {
      await createBooking({
        ...bookingData,
        user_id: user.id,
        status: "pending",
      })
    } catch (error) {
      throw error
    }
  }

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, any> = {
      wifi: Wifi,
      parking: Car,
      coffee: Coffee,
      catering: Utensils,
    }
    return icons[amenity.toLowerCase()] || Coffee
  }

  const getTypeLabel = (type: Venue["type"]) => {
    const labels = {
      restaurant: "Reštaurácia",
      cafe: "Kaviareň",
      bar: "Bar",
      event_hall: "Event sála",
      conference: "Konferenčná miestnosť",
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Priestor nenájdený</h1>
          <p className="text-gray-600 mb-8">Požadovaný priestor neexistuje alebo nie je dostupný.</p>
          <Link href="/venues">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Späť na priestory
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back Button */}
        <Link href="/venues" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Späť na priestory
        </Link>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="relative h-96 rounded-lg overflow-hidden mb-4">
            <Image
              src={venue.images?.[selectedImageIndex] || "/placeholder.svg?height=400&width=800&query=venue"}
              alt={venue.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-amber-500 text-white font-medium">{getTypeLabel(venue.type)}</Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/80 hover:bg-white"
                onClick={() => toggleFavorite(venue.id)}
                aria-label={isFavorite(venue.id) ? "Odstrániť z obľúbených" : "Pridať do obľúbených"}
              >
                <Heart className={`h-5 w-5 ${isFavorite(venue.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
              </Button>
            </div>
          </div>

          {venue.images && venue.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {venue.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative h-20 w-32 rounded-lg overflow-hidden flex-shrink-0 ${
                    selectedImageIndex === index ? "ring-2 ring-amber-500" : ""
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${venue.name} - obrázok ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{venue.name}</h1>
                  <p className="text-gray-600 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {venue.location}
                  </p>
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="text-lg font-semibold text-gray-800 ml-1">{venue.rating}</span>
                  <span className="text-gray-600 ml-1">({venue.reviews_count} recenzií)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">Kapacita: {venue.capacity} osôb</span>
                </div>
                <div className="flex items-center">
                  <Euro className="h-5 w-5 text-amber-600 mr-2" />
                  <span className="font-semibold text-amber-600">{venue.price}€ za hodinu</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Popis priestoru</h2>
                <p className="text-gray-600 leading-relaxed">
                  {venue.description ||
                    "Krásny a priestranný priestor ideálny pre rôzne typy podujatí. Moderné vybavenie a príjemná atmosféra zaručujú úspech vašej udalosti."}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            {venue.amenities && venue.amenities.length > 0 && (
              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Vybavenie</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {venue.amenities.map((amenity, index) => {
                      const IconComponent = getAmenityIcon(amenity)
                      return (
                        <div key={index} className="flex items-center">
                          <IconComponent className="h-5 w-5 text-amber-600 mr-2" />
                          <span className="text-gray-700 capitalize">{amenity}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingForm venue={venue} onSubmit={handleBooking} />
            </div>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={login}
          onRegister={register}
        />
      </div>
    </div>
  )
}
