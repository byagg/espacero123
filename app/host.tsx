"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import {
  Euro,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Star,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AuthModal } from "@/components/auth/auth-modal"

interface DashboardStats {
  totalVenues: number
  totalBookings: number
  monthlyRevenue: number
  averageRating: number
  pendingBookings: number
  confirmedBookings: number
  completedBookings: number
}

interface RecentBooking {
  id: string
  venue_name: string
  guest_name: string
  start_datetime: string
  end_datetime: string
  total_price: number
  status: string
  guest_count: number
}

export default function HostDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVenues: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
    averageRating: 4.8,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    if (!user || !supabase) return

    try {
      // Fetch venues count
      const { data: venues, error: venuesError } = await supabase.from("venues").select("id").eq("host_id", user.id)

      if (venuesError) throw venuesError

      // Fetch bookings data
      const { data: bookings, error: bookingsError } = await supabase
        .from("bookings")
        .select(`
          *,
          venue:venues!inner(name, host_id)
        `)
        .eq("venue.host_id", user.id)

      if (bookingsError) throw bookingsError

      // Calculate stats
      const totalVenues = venues?.length || 0
      const totalBookings = bookings?.length || 0
      const pendingBookings = bookings?.filter((b) => b.status === "pending").length || 0
      const confirmedBookings = bookings?.filter((b) => b.status === "confirmed").length || 0
      const completedBookings = bookings?.filter((b) => b.status === "completed").length || 0

      // Calculate monthly revenue (current month)
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const monthlyRevenue =
        bookings
          ?.filter((b) => {
            const bookingDate = new Date(b.created_at)
            return (
              bookingDate.getMonth() === currentMonth &&
              bookingDate.getFullYear() === currentYear &&
              (b.status === "confirmed" || b.status === "completed")
            )
          })
          .reduce((sum, b) => sum + b.total_price, 0) || 0

      setStats({
        totalVenues,
        totalBookings,
        monthlyRevenue,
        averageRating: 4.8, // This would come from reviews
        pendingBookings,
        confirmedBookings,
        completedBookings,
      })

      // Set recent bookings (last 5)
      const recent = bookings
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map((booking) => ({
          id: booking.id,
          venue_name: booking.venue?.name || "Unknown Venue",
          guest_name: "Hosť", // This would come from profiles
          start_datetime: booking.start_datetime,
          end_datetime: booking.end_datetime,
          total_price: booking.total_price,
          status: booking.status,
          guest_count: booking.guest_count,
        }))

      setRecentBookings(recent || [])
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Potvrdené
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Čaká
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="h-3 w-3 mr-1" />
            Zrušené
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ukončené
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("sk-SK", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Dashboard pre hostiteľov</h1>
            <p className="text-gray-600 mb-6">Pre prístup k dashboardu sa musíte prihlásiť.</p>
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
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard hostiteľa</h1>
              <p className="text-gray-600">
                Vitajte späť, {user?.user_metadata?.full_name || "Hostiteľ"}! Tu je prehľad vašich priestorov.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Link href="/venues/add">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Pridať priestor
                </Button>
              </Link>
              <Link href="/host/venues">
                <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
                  <MapPin className="h-4 w-4 mr-2" />
                  Spravovať priestory
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Celkový príjem (mesiac)</p>
                  <p className="text-2xl font-bold text-gray-800">€{stats.monthlyRevenue}</p>
                  <p className="text-green-600 text-sm flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% oproti minulému mesiacu
                  </p>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <Euro className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Celkové rezervácie</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalBookings}</p>
                  <p className="text-blue-600 text-sm flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {stats.pendingBookings} čaká na potvrdenie
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Moje priestory</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalVenues}</p>
                  <p className="text-gray-600 text-sm flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    Aktívne priestory
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Priemerné hodnotenie</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.averageRating}</p>
                  <p className="text-yellow-600 text-sm flex items-center mt-1">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Výborné hodnotenie
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-800">Najnovšie rezervácie</CardTitle>
                  <Link href="/host/bookings">
                    <Button variant="outline" size="sm" className="border-amber-500 text-amber-600 hover:bg-amber-50">
                      Zobraziť všetky
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {recentBookings.length === 0 ? (
                  <div className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Žiadne rezervácie</h3>
                    <p className="text-gray-600">Keď dostanete prvé rezervácie, zobrazia sa tu.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-800">{booking.venue_name}</h4>
                              {getStatusBadge(booking.status)}
                            </div>
                            <p className="text-gray-600 text-sm mb-1">
                              {formatDate(booking.start_datetime)} - {formatDate(booking.end_datetime)}
                            </p>
                            <div className="flex items-center text-gray-600 text-sm">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{booking.guest_count} hostí</span>
                              <span className="mx-2">•</span>
                              <span className="font-medium text-amber-600">€{booking.total_price}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button variant="outline" size="sm" className="border-gray-300">
                              <Eye className="h-4 w-4" />
                            </Button>
                            {booking.status === "pending" && (
                              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                                Potvrdiť
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-lg font-semibold text-gray-800">Rýchle akcie</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Link href="/venues/add">
                  <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Pridať nový priestor
                  </Button>
                </Link>
                <Link href="/host/venues">
                  <Button variant="outline" className="w-full justify-start border-gray-300">
                    <Edit className="h-4 w-4 mr-2" />
                    Upraviť priestory
                  </Button>
                </Link>
                <Link href="/host/analytics">
                  <Button variant="outline" className="w-full justify-start border-gray-300">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Zobraziť štatistiky
                  </Button>
                </Link>
                <Link href="/host/calendar">
                  <Button variant="outline" className="w-full justify-start border-gray-300">
                    <Calendar className="h-4 w-4 mr-2" />
                    Kalendár rezervácií
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Booking Status Overview */}
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-lg font-semibold text-gray-800">Stav rezervácií</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Čakajú na potvrdenie</span>
                  </div>
                  <span className="font-medium text-gray-800">{stats.pendingBookings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Potvrdené</span>
                  </div>
                  <span className="font-medium text-gray-800">{stats.confirmedBookings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">Ukončené</span>
                  </div>
                  <span className="font-medium text-gray-800">{stats.completedBookings}</span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Alert */}
            {stats.pendingBookings > 0 && (
              <Card className="bg-amber-50 border-amber-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 mb-1">Pozor!</h4>
                      <p className="text-amber-700 text-sm">
                        Máte {stats.pendingBookings} rezervácií čakajúcich na potvrdenie. Rýchle odpovede zlepšujú vaše
                        hodnotenie.
                      </p>
                      <Link href="/host/bookings?status=pending">
                        <Button size="sm" className="mt-3 bg-amber-500 hover:bg-amber-600 text-white">
                          Potvrdiť rezervácie
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
