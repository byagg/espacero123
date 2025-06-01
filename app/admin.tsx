"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import {
  Users,
  MapPin,
  Calendar,
  Euro,
  TrendingUp,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  UserCheck,
  Building,
  CreditCard,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { AuthModal } from "@/components/auth/auth-modal"

interface AdminStats {
  totalUsers: number
  totalHosts: number
  totalVenues: number
  totalBookings: number
  totalRevenue: number
  monthlyRevenue: number
  pendingVenues: number
  pendingBookings: number
  activeUsers: number
}

interface RecentActivity {
  id: string
  type: "user_registered" | "venue_added" | "booking_created" | "booking_completed"
  description: string
  timestamp: string
  status: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalHosts: 0,
    totalVenues: 0,
    totalBookings: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingVenues: 0,
    pendingBookings: 0,
    activeUsers: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  // Check if user is admin
  const isAdmin = user?.email === "info@simplimator.com" || user?.user_metadata?.user_role === "admin"

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    if (!isAdmin) {
      router.push("/")
      return
    }

    fetchAdminData()
  }, [user, isAdmin, router])

  const fetchAdminData = async () => {
    if (!supabase) return

    try {
      // Fetch users count (this would need to be done via admin API in real app)
      const totalUsers = 1250 // Mock data
      const totalHosts = 85 // Mock data
      const activeUsers = 320 // Mock data

      // Fetch venues
      const { data: venues, error: venuesError } = await supabase.from("venues").select("*")

      if (venuesError) throw venuesError

      // Fetch bookings
      const { data: bookings, error: bookingsError } = await supabase.from("bookings").select("*")

      if (bookingsError) throw bookingsError

      // Calculate stats
      const totalVenues = venues?.length || 0
      const totalBookings = bookings?.length || 0
      const pendingVenues = venues?.filter((v) => v.status === "pending").length || 0
      const pendingBookings = bookings?.filter((b) => b.status === "pending").length || 0

      // Calculate revenue
      const totalRevenue =
        bookings
          ?.filter((b) => b.status === "confirmed" || b.status === "completed")
          .reduce((sum, b) => sum + b.total_price, 0) || 0

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
        totalUsers,
        totalHosts,
        totalVenues,
        totalBookings,
        totalRevenue,
        monthlyRevenue,
        pendingVenues,
        pendingBookings,
        activeUsers,
      })

      // Mock recent activity
      setRecentActivity([
        {
          id: "1",
          type: "user_registered",
          description: "Nový používateľ sa zaregistroval",
          timestamp: new Date().toISOString(),
          status: "completed",
        },
        {
          id: "2",
          type: "venue_added",
          description: "Nový priestor bol pridaný - Reštaurácia Zlatý Kľúč",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: "pending",
        },
        {
          id: "3",
          type: "booking_created",
          description: "Nová rezervácia bola vytvorená",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          status: "confirmed",
        },
      ])
    } catch (error) {
      console.error("Error fetching admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registered":
        return <UserCheck className="h-4 w-4 text-green-600" />
      case "venue_added":
        return <Building className="h-4 w-4 text-amber-600" />
      case "booking_created":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "booking_completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Dokončené</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Čaká</Badge>
      case "confirmed":
        return <Badge className="bg-amber-100 text-amber-800">Potvrdené</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
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
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mb-6">Pre prístup k admin dashboardu sa musíte prihlásiť.</p>
            <Button className="bg-amber-500 hover:bg-amber-600" onClick={() => setShowAuthModal(true)}>
              Prihlásiť sa
            </Button>
            <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Prístup zamietnutý</h1>
            <p className="text-gray-600 mb-6">Nemáte oprávnenie na prístup k admin dashboardu.</p>
            <Button onClick={() => router.push("/")} className="bg-amber-500 hover:bg-amber-600">
              Späť na hlavnú stránku
            </Button>
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">
                Vitajte v administrátorskom rozhraní, {user?.user_metadata?.full_name || "Admin"}!
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                <BarChart3 className="h-4 w-4 mr-2" />
                Exportovať dáta
              </Button>
              <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
                <Shield className="h-4 w-4 mr-2" />
                Nastavenia
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Celkový príjem</p>
                  <p className="text-2xl font-bold text-gray-800">€{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-green-600 text-sm flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15% oproti minulému mesiacu
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Euro className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Používatelia</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-amber-600 text-sm flex items-center mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    {stats.activeUsers} aktívnych
                  </p>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Priestory</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalVenues}</p>
                  <p className="text-yellow-600 text-sm flex items-center mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {stats.pendingVenues} čaká na schválenie
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Rezervácie</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalBookings}</p>
                  <p className="text-purple-600 text-sm flex items-center mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    {stats.pendingBookings} čaká na potvrdenie
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Mesačný príjem</p>
                  <p className="text-xl font-bold text-gray-800">€{stats.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-green-600 text-sm">Aktuálny mesiac</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Hostitelia</p>
                  <p className="text-xl font-bold text-gray-800">{stats.totalHosts}</p>
                  <p className="text-amber-600 text-sm">Registrovaní hostitelia</p>
                </div>
                <div className="bg-amber-100 p-3 rounded-full">
                  <UserCheck className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Konverzný pomer</p>
                  <p className="text-xl font-bold text-gray-800">12.5%</p>
                  <p className="text-green-600 text-sm">+2.3% oproti minulému</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-xl font-semibold text-gray-800">Najnovšia aktivita</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getActivityIcon(activity.type)}
                          <div>
                            <p className="font-medium text-gray-800">{activity.description}</p>
                            <p className="text-gray-600 text-sm">{formatDate(activity.timestamp)}</p>
                          </div>
                        </div>
                        {getStatusBadge(activity.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-lg font-semibold text-gray-800">Rýchle akcie</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Spravovať používateľov
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-300">
                  <MapPin className="h-4 w-4 mr-2" />
                  Schváliť priestory
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-300">
                  <Calendar className="h-4 w-4 mr-2" />
                  Správa rezervácií
                </Button>
                <Button variant="outline" className="w-full justify-start border-gray-300">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Finančné reporty
                </Button>
              </CardContent>
            </Card>

            {/* System Alerts */}
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-lg font-semibold text-gray-800">Systémové upozornenia</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Čakajúce schválenia</p>
                    <p className="text-gray-600 text-sm">{stats.pendingVenues} priestorov čaká na schválenie</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-800">Systém funguje</p>
                    <p className="text-gray-600 text-sm">Všetky služby sú dostupné</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
