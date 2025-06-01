"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"
import { Search, Plus, Edit, Eye, Trash2, MapPin, Users, Euro, Star, MoreVertical, Grid, List } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import Link from "next/link"

interface Venue {
  id: string
  name: string
  description: string
  category: string
  address: string
  city: string
  capacity: number
  price_per_hour: number
  images: string[]
  amenities: string[]
  is_active: boolean
  created_at: string
  bookings_count?: number
  total_revenue?: number
  average_rating?: number
}

export default function HostVenues() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchVenues()
    }
  }, [user])

  useEffect(() => {
    filterVenues()
  }, [venues, searchTerm, categoryFilter, statusFilter])

  const fetchVenues = async () => {
    if (!user || !supabase) return

    try {
      const { data, error } = await supabase
        .from("venues")
        .select("*")
        .eq("host_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      // For each venue, fetch booking stats
      const venuesWithStats = await Promise.all(
        (data || []).map(async (venue) => {
          const { data: bookings } = await supabase
            .from("bookings")
            .select("total_price, status")
            .eq("venue_id", venue.id)

          const bookings_count = bookings?.length || 0
          const total_revenue =
            bookings
              ?.filter((b) => b.status === "confirmed" || b.status === "completed")
              .reduce((sum, b) => sum + b.total_price, 0) || 0

          return {
            ...venue,
            bookings_count,
            total_revenue,
            average_rating: 4.5, // This would come from reviews
          }
        }),
      )

      setVenues(venuesWithStats)
    } catch (error) {
      console.error("Error fetching venues:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterVenues = () => {
    let filtered = venues

    if (searchTerm) {
      filtered = filtered.filter(
        (venue) =>
          venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          venue.city.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((venue) => venue.category === categoryFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((venue) => (statusFilter === "active" ? venue.is_active : !venue.is_active))
    }

    setFilteredVenues(filtered)
  }

  const toggleVenueStatus = async (venueId: string, currentStatus: boolean) => {
    if (!supabase) return

    try {
      const { error } = await supabase.from("venues").update({ is_active: !currentStatus }).eq("id", venueId)

      if (error) throw error

      setVenues((prev) => prev.map((venue) => (venue.id === venueId ? { ...venue, is_active: !currentStatus } : venue)))
    } catch (error) {
      console.error("Error updating venue status:", error)
    }
  }

  const deleteVenue = async (venueId: string) => {
    if (!supabase || !confirm("Ste si istí, že chcete odstrániť tento priestor?")) return

    try {
      const { error } = await supabase.from("venues").delete().eq("id", venueId)

      if (error) throw error

      setVenues((prev) => prev.filter((venue) => venue.id !== venueId))
    } catch (error) {
      console.error("Error deleting venue:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sk-SK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Moje priestory</h1>
              <p className="text-gray-600">Spravujte svoje priestory a sledujte ich výkonnosť</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/venues/add">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Pridať priestor
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card className="bg-white border-gray-200 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Hľadať priestory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-gray-300 focus:border-amber-500 focus:ring-amber-500">
                  <SelectValue placeholder="Kategória" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všetky kategórie</SelectItem>
                  <SelectItem value="restaurant">Reštaurácia</SelectItem>
                  <SelectItem value="cafe">Kaviareň</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="event_hall">Event sála</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-gray-300 focus:border-amber-500 focus:ring-amber-500">
                  <SelectValue placeholder="Stav" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všetky stavy</SelectItem>
                  <SelectItem value="active">Aktívne</SelectItem>
                  <SelectItem value="inactive">Neaktívne</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-amber-500 text-white" : "border-gray-300"}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-amber-500 text-white" : "border-gray-300"}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Venues Grid/List */}
        {filteredVenues.length === 0 ? (
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-12 text-center">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Žiadne priestory</h3>
              <p className="text-gray-600 mb-6">
                {venues.length === 0
                  ? "Zatiaľ nemáte žiadne priestory. Pridajte svoj prvý priestor a začnite zarábať."
                  : "Žiadne priestory nevyhovujú vašim filtrom."}
              </p>
              {venues.length === 0 && (
                <Link href="/venues/add">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Pridať prvý priestor
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => (
              <Card key={venue.id} className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative">
                  <Image
                    src={venue.images?.[0] || "/placeholder.svg?height=200&width=400"}
                    alt={venue.name}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={venue.is_active ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                      {venue.is_active ? "Aktívny" : "Neaktívny"}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/venues/${venue.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Zobraziť
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/host/venues/${venue.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Upraviť
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleVenueStatus(venue.id, venue.is_active)}>
                          {venue.is_active ? "Deaktivovať" : "Aktivovať"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteVenue(venue.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Odstrániť
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{venue.name}</h3>
                    <div className="flex items-center ml-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700 ml-1">{venue.average_rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {venue.city}, {venue.address}
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-500 text-xs">Kapacita</p>
                      <p className="font-medium text-gray-800 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {venue.capacity} osôb
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Cena/hodina</p>
                      <p className="font-medium text-amber-600 flex items-center">
                        <Euro className="h-4 w-4 mr-1" />€{venue.price_per_hour}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-gray-500 text-xs">Rezervácie</p>
                      <p className="font-medium text-gray-800">{venue.bookings_count}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Celkový príjem</p>
                      <p className="font-medium text-green-600">€{venue.total_revenue}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/venues/${venue.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full border-gray-300">
                        <Eye className="h-4 w-4 mr-1" />
                        Zobraziť
                      </Button>
                    </Link>
                    <Link href={`/host/venues/${venue.id}/edit`} className="flex-1">
                      <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                        <Edit className="h-4 w-4 mr-1" />
                        Upraviť
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVenues.map((venue) => (
              <Card key={venue.id} className="bg-white border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    <Image
                      src={venue.images?.[0] || "/placeholder.svg?height=120&width=200"}
                      alt={venue.name}
                      width={200}
                      height={120}
                      className="w-48 h-28 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{venue.name}</h3>
                          <p className="text-gray-600 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {venue.city}, {venue.address}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={venue.is_active ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                            {venue.is_active ? "Aktívny" : "Neaktívny"}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/venues/${venue.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Zobraziť
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/host/venues/${venue.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Upraviť
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleVenueStatus(venue.id, venue.is_active)}>
                                {venue.is_active ? "Deaktivovať" : "Aktivovať"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteVenue(venue.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Odstrániť
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-gray-500 text-xs">Kapacita</p>
                          <p className="font-medium text-gray-800 flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {venue.capacity} osôb
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Cena/hodina</p>
                          <p className="font-medium text-amber-600 flex items-center">
                            <Euro className="h-4 w-4 mr-1" />€{venue.price_per_hour}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Rezervácie</p>
                          <p className="font-medium text-gray-800">{venue.bookings_count}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Príjem</p>
                          <p className="font-medium text-green-600">€{venue.total_revenue}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                          <span className="text-sm font-medium text-gray-700">{venue.average_rating}</span>
                          <span className="text-gray-500 text-sm ml-1">• Vytvorené {formatDate(venue.created_at)}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/venues/${venue.id}`}>
                            <Button variant="outline" size="sm" className="border-gray-300">
                              <Eye className="h-4 w-4 mr-1" />
                              Zobraziť
                            </Button>
                          </Link>
                          <Link href={`/host/venues/${venue.id}/edit`}>
                            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                              <Edit className="h-4 w-4 mr-1" />
                              Upraviť
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
