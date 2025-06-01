"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Edit,
  Calendar,
  Euro,
  Users,
  MapPin,
  Star,
  Eye,
  Settings,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// Mock data - v reálnej aplikácii by sa načítavalo z databázy
const mockUserVenues = [
  {
    id: "1",
    name: "Reštaurácia Zlatý Kľúč",
    category: "Reštaurácia",
    city: "Bratislava",
    capacity: 80,
    price_per_hour: 150,
    status: "active",
    rating: 4.8,
    reviews_count: 24,
    image: "/placeholder.svg?height=200&width=300&text=Reštaurácia",
    bookings_this_month: 12,
    revenue_this_month: 3600,
  },
  {
    id: "2",
    name: "Kaviareň Central",
    category: "Kaviareň",
    city: "Bratislava",
    capacity: 40,
    price_per_hour: 80,
    status: "pending",
    rating: 4.5,
    reviews_count: 8,
    image: "/placeholder.svg?height=200&width=300&text=Kaviareň",
    bookings_this_month: 5,
    revenue_this_month: 1200,
  },
]

const mockTimeSlots = [
  { id: "1", date: "2024-01-15", time: "14:00-18:00", status: "available", price: 600 },
  { id: "2", date: "2024-01-15", time: "19:00-23:00", status: "booked", price: 600, guest: "Ján Novák" },
  { id: "3", date: "2024-01-16", time: "10:00-14:00", status: "available", price: 600 },
  { id: "4", date: "2024-01-16", time: "15:00-19:00", status: "blocked", price: 600 },
  { id: "5", date: "2024-01-17", time: "12:00-16:00", status: "available", price: 600 },
]

export function VenueManagement() {
  const [selectedVenue, setSelectedVenue] = useState(mockUserVenues[0])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Aktívny</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Čaká na schválenie</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Neaktívny</Badge>
      default:
        return null
    }
  }

  const getSlotStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Voľný
          </Badge>
        )
      case "booked":
        return (
          <Badge className="bg-amber-100 text-amber-800">
            <Calendar className="h-3 w-3 mr-1" />
            Rezervovaný
          </Badge>
        )
      case "blocked":
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" />
            Blokovaný
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("sk-SK", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Moje priestory</h2>
          <p className="text-gray-600">Spravujte svoje priestory a rezervácie</p>
        </div>
        <Link href="/venues/add">
          <Button className="bg-amber-500 hover:bg-amber-600">
            <Plus className="h-4 w-4 mr-2" />
            Pridať priestor
          </Button>
        </Link>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockUserVenues.map((venue) => (
          <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <Image
                src={venue.image || "/placeholder.svg"}
                alt={venue.name}
                width={300}
                height={200}
                className="h-48 w-full object-cover"
              />
              <div className="absolute top-3 right-3">{getStatusBadge(venue.status)}</div>
            </div>

            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800 line-clamp-1">{venue.name}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                  {venue.rating}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {venue.city} • {venue.category}
              </p>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                <span className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  {venue.capacity} osôb
                </span>
                <span className="flex items-center">
                  <Euro className="h-3 w-3 mr-1" />
                  {venue.price_per_hour}€/h
                </span>
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {venue.bookings_this_month} rezervácií
                </span>
                <span className="flex items-center">
                  <Euro className="h-3 w-3 mr-1" />
                  {venue.revenue_this_month}€ príjem
                </span>
              </div>

              <div className="flex gap-2">
                <Link href={`/venues/${venue.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-4 w-4 mr-1" />
                    Zobraziť
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={() => setSelectedVenue(venue)} className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Upraviť
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Venue Management Tabs */}
      {selectedVenue && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Správa priestoru: {selectedVenue.name}</span>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Nastavenia
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="slots" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="slots">Časové sloty</TabsTrigger>
                <TabsTrigger value="bookings">Rezervácie</TabsTrigger>
                <TabsTrigger value="settings">Nastavenia</TabsTrigger>
              </TabsList>

              <TabsContent value="slots" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Správa časových slotov</h3>
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Pridať slot
                  </Button>
                </div>

                <div className="grid gap-3">
                  {mockTimeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{formatDate(slot.date)}</p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {slot.time}
                          </p>
                        </div>
                        {getSlotStatusBadge(slot.status)}
                        {slot.guest && (
                          <div className="text-sm">
                            <p className="text-gray-600">Rezervoval:</p>
                            <p className="font-medium">{slot.guest}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-amber-600">{slot.price}€</span>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-4">
                <h3 className="text-lg font-semibold">Nadchádzajúce rezervácie</h3>
                <p className="text-gray-600">Zoznam všetkých rezervácií pre tento priestor.</p>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <h3 className="text-lg font-semibold">Nastavenia priestoru</h3>
                <p className="text-gray-600">Upravte základné informácie, ceny a pravidlá.</p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
