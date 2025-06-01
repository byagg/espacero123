"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Euro, Users, MapPin, Star, Eye, Settings, Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Venue {
  id: string
  name: string
  address: string
  city: string
  capacity: number
  price_per_hour: number
  images: string[]
  is_active: boolean
  created_at: string
}

interface VenueManagementProps {
  venues: Venue[]
  fetchVenues: () => void
}

export default function VenueManagement({ venues, fetchVenues }: VenueManagementProps) {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(venues[0] || null)

  const getStatusBadge = (status: boolean) => {
    return status ? (
      <Badge className="bg-green-100 text-green-800">Aktívny</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Neaktívny</Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("sk-SK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  if (venues.length === 0) {
    return (
      <Card className="bg-white border-gray-200 shadow-lg">
        <CardContent className="p-12 text-center">
          <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Žiadne priestory</h3>
          <p className="text-gray-600 mb-6">
            Zatiaľ nemáte žiadne priestory. Pridajte svoj prvý priestor a začnite zarábať.
          </p>
          <Link href="/venues/add">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Pridať prvý priestor
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
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
        {venues.map((venue) => (
          <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <Image
                src={venue.images?.[0] || "/placeholder.svg?height=200&width=400"}
                alt={venue.name}
                width={400}
                height={200}
                className="h-48 w-full object-cover"
              />
              <div className="absolute top-3 right-3">{getStatusBadge(venue.is_active)}</div>
            </div>

            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800 line-clamp-1">{venue.name}</h3>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                  4.5
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {venue.city}, {venue.address}
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
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informácie</TabsTrigger>
                <TabsTrigger value="bookings">Rezervácie</TabsTrigger>
                <TabsTrigger value="settings">Nastavenia</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Vytvorené</p>
                    <p className="font-medium">{formatDate(selectedVenue.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Stav</p>
                    <p className="font-medium">{selectedVenue.is_active ? "Aktívny" : "Neaktívny"}</p>
                  </div>
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
