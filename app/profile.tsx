"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { RoleGuard } from "@/components/auth/role-guard"
import {
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Euro,
  Star,
  TrendingUp,
  Plus,
  Edit,
  BarChart3,
  Users,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import VenueManagement from "@/components/venue/venue-management"

interface HostStats {
  totalVenues: number
  totalBookings: number
  monthlyRevenue: number
  averageRating: number
  pendingBookings: number
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

interface Venue {
  id: string
  name: string
  address: string
  // Add other venue properties as needed
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"profile" | "dashboard" | "venues">("profile")
  const [hostStats, setHostStats] = useState<HostStats>({
    totalVenues: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
    averageRating: 4.8,
    pendingBookings: 0,
  })
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([])
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  })
  const { user, isHost, isAdmin, getUserRole } = useAuth()
  const [myVenues, setMyVenues] = useState<Venue[]>([])

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.user_metadata?.full_name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
      })

      // Set default tab based on user role
      if (isHost()) {
        setActiveTab("dashboard")
        fetchHostData()
      }

      fetchMyVenues()
    }
  }, [user, isHost])

  const fetchHostData = async () => {
    if (!user || !supabase) return

    try {
      setLoading(true)

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

      // Calculate monthly revenue
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

      setHostStats({
        totalVenues,
        totalBookings,
        monthlyRevenue,
        averageRating: 4.8,
        pendingBookings,
      })

      // Set recent bookings
      const recent = bookings
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 3)
        .map((booking) => ({
          id: booking.id,
          venue_name: booking.venue?.name || "Unknown Venue",
          guest_name: "Hosť",
          start_datetime: booking.start_datetime,
          end_datetime: booking.end_datetime,
          total_price: booking.total_price,
          status: booking.status,
          guest_count: booking.guest_count,
        }))

      setRecentBookings(recent || [])
    } catch (error) {
      console.error("Error fetching host data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !supabase) return

    try {
      setSaving(true)

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
        },
      })

      if (error) throw error

      alert("Profil bol úspešne aktualizovaný")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Nastala chyba pri aktualizácii profilu")
    } finally {
      setSaving(false)
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
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
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

  const fetchMyVenues = async () => {
    if (!user || !supabase) return

    try {
      setLoading(true)
      const { data, error } = await supabase.from("venues").select("*").eq("host_id", user.id)

      if (error) {
        console.error("Error fetching venues:", error)
      }

      setMyVenues(data || [])
    } catch (error) {
      console.error("Error fetching venues:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RoleGuard allowedRoles={["client", "host", "admin"]}>
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{isHost() ? "Dashboard hostiteľa" : "Môj profil"}</h1>
            <p className="text-gray-600">Vitajte späť, {user?.user_metadata?.full_name || "Používateľ"}!</p>
            <div className="mt-2">
              <Badge className="bg-amber-100 text-amber-800 capitalize">{getUserRole() || "client"}</Badge>
            </div>
          </div>

          {/* Tabs for hosts */}
          {isHost() && (
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "dashboard"
                        ? "border-amber-500 text-amber-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "profile"
                        ? "border-amber-500 text-amber-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Profil
                  </button>
                  {myVenues.length > 0 && (
                    <button
                      onClick={() => setActiveTab("venues")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "venues"
                          ? "border-amber-500 text-amber-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Moje priestory
                    </button>
                  )}
                </nav>
              </div>
            </div>
          )}

          {/* Dashboard Tab */}
          {isHost() && activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white border-gray-200 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Mesačný príjem</p>
                        <p className="text-2xl font-bold text-gray-800">€{hostStats.monthlyRevenue}</p>
                        <p className="text-green-600 text-sm flex items-center mt-1">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +12% oproti minulému
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
                        <p className="text-gray-600 text-sm font-medium">Rezervácie</p>
                        <p className="text-2xl font-bold text-gray-800">{hostStats.totalBookings}</p>
                        <p className="text-amber-600 text-sm flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {hostStats.pendingBookings} čaká
                        </p>
                      </div>
                      <div className="bg-amber-100 p-3 rounded-full">
                        <Calendar className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">Moje priestory</p>
                        <p className="text-2xl font-bold text-gray-800">{hostStats.totalVenues}</p>
                        <p className="text-gray-600 text-sm flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          Aktívne
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
                        <p className="text-gray-600 text-sm font-medium">Hodnotenie</p>
                        <p className="text-2xl font-bold text-gray-800">{hostStats.averageRating}</p>
                        <p className="text-yellow-600 text-sm flex items-center mt-1">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Výborné
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
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-amber-500 text-amber-600 hover:bg-amber-50"
                          >
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
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div>
                  <Card className="bg-white border-gray-200 shadow-lg">
                    <CardHeader className="border-b border-gray-200">
                      <CardTitle className="text-lg font-semibold text-gray-800">Rýchle akcie</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-3">
                      <Link href="/venues/add">
                        <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white justify-start">
                          <Plus className="h-4 w-4 mr-2" />
                          Pridať priestor
                        </Button>
                      </Link>
                      <Link href="/host/venues">
                        <Button variant="outline" className="w-full justify-start border-gray-300">
                          <Edit className="h-4 w-4 mr-2" />
                          Spravovať priestory
                        </Button>
                      </Link>
                      <Link href="/host">
                        <Button variant="outline" className="w-full justify-start border-gray-300">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Podrobný dashboard
                        </Button>
                      </Link>
                      <Link href="/host/bookings">
                        <Button variant="outline" className="w-full justify-start border-gray-300">
                          <Calendar className="h-4 w-4 mr-2" />
                          Správa rezervácií
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {(!isHost() || activeTab === "profile") && (
            <div className="max-w-md mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Môj profil</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Celé meno</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="Vaše celé meno"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            name="email"
                            value={formData.email}
                            disabled
                            className="pl-10 bg-gray-50"
                            placeholder="Váš email"
                          />
                        </div>
                        <p className="text-xs text-gray-500">Email nie je možné zmeniť.</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefónne číslo</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="pl-10"
                            placeholder="Vaše telefónne číslo"
                          />
                        </div>
                      </div>

                      <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600" disabled={saving}>
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Ukladám...
                          </>
                        ) : (
                          "Uložiť zmeny"
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Venue Management Tab */}
          {isHost() && activeTab === "venues" && <VenueManagement venues={myVenues} fetchVenues={fetchMyVenues} />}
        </div>
      </div>
    </RoleGuard>
  )
}
