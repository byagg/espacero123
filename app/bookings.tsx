"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import type { Booking } from "@/types/booking"
import { Loader2, MapPin, Calendar, Clock, Users, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthModal } from "@/components/auth/auth-modal"
import { format } from "date-fns"
import { sk } from "date-fns/locale"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchBookings = async () => {
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
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            *,
            venue:venues(id, name, address, city, images)
          `)
          .eq("guest_id", user.id)
          .order("start_datetime", { ascending: false })

        if (error) throw error

        setBookings(data || [])
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Potvrdené
          </span>
        )
      case "pending":
        return (
          <span className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Čaká na potvrdenie
          </span>
        )
      case "cancelled":
        return (
          <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs">
            <XCircle className="h-3 w-3 mr-1" />
            Zrušené
          </span>
        )
      case "completed":
        return (
          <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ukončené
          </span>
        )
      default:
        return null
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "d. MMMM yyyy 'o' HH:mm", { locale: sk })
  }

  const calculateDuration = (start: string, end: string) => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const diffHours = Math.abs(endDate.getTime() - startDate.getTime()) / 36e5
    return diffHours.toFixed(1)
  }

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Moje rezervácie</h1>
            <p className="text-gray-600 mb-6">Pre zobrazenie rezervácií sa musíte prihlásiť.</p>
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
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Moje rezervácie</h1>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Nemáte žiadne rezervácie</h2>
            <p className="text-gray-600 mb-6">
              Začnite prehliadať priestory a rezervujte si ich pre vašu najbližšiu udalosť.
            </p>
            <Button className="bg-amber-500 hover:bg-amber-600" onClick={() => router.push("/search")}>
              Hľadať priestory
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <Image
                      src={booking.venue?.images?.[0] || "/placeholder.svg"}
                      alt={booking.venue?.name || "Venue"}
                      width={300}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6 md:w-2/3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-1">{booking.venue?.name}</h2>
                        <p className="text-gray-600 flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {booking.venue?.city}, {booking.venue?.address}
                        </p>
                      </div>
                      <div>{getStatusBadge(booking.status)}</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <div>
                          <div className="font-medium">Dátum a čas</div>
                          <div>{formatDateTime(booking.start_datetime)}</div>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <div>
                          <div className="font-medium">Trvanie</div>
                          <div>{calculateDuration(booking.start_datetime, booking.end_datetime)} hodín</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <div>
                          <div className="font-medium">Počet hostí</div>
                          <div>{booking.guest_count} osôb</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-600">Celková cena</div>
                        <div className="text-xl font-bold text-amber-500">€{booking.total_price}</div>
                      </div>
                    </div>

                    {booking.special_requests && (
                      <div className="mb-4">
                        <div className="font-medium text-gray-600">Špeciálne požiadavky</div>
                        <p className="text-gray-600 text-sm">{booking.special_requests}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-4">
                      {booking.status === "pending" && (
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                          Zrušiť rezerváciu
                        </Button>
                      )}
                      {booking.status === "confirmed" && (
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                          Zrušiť rezerváciu
                        </Button>
                      )}
                      {booking.status === "completed" && (
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                          Pridať recenziu
                        </Button>
                      )}
                      <Link href={`/venues/${booking.venue?.id}`}>
                        <Button className="bg-amber-500 hover:bg-amber-600">Zobraziť priestor</Button>
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
