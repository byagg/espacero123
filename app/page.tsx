"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, Users, Clock, Star, Wifi, Car, Coffee, Monitor } from "lucide-react"
import { AuthModal } from "@/components/shared/auth-modal"

// Mock data for featured venues
const featuredVenues = [
  {
    id: 1,
    name: "Moderná konferenčná miestnosť",
    location: "Bratislava - Centrum",
    price: 25,
    rating: 4.8,
    reviews: 124,
    capacity: 12,
    image: "/placeholder.svg?height=200&width=300&text=Conference+Room",
    amenities: ["Wifi", "Projektor", "Káva"],
    type: "Konferenčná miestnosť",
  },
  {
    id: 2,
    name: "Kreatívny coworking priestor",
    location: "Košice - Staré Mesto",
    price: 15,
    rating: 4.6,
    reviews: 89,
    capacity: 20,
    image: "/placeholder.svg?height=200&width=300&text=Coworking+Space",
    amenities: ["Wifi", "Parkovanie", "Kuchynka"],
    type: "Coworking",
  },
  {
    id: 3,
    name: "Elegantná event hala",
    location: "Žilina - Centrum",
    price: 80,
    rating: 4.9,
    reviews: 67,
    capacity: 100,
    image: "/placeholder.svg?height=200&width=300&text=Event+Hall",
    amenities: ["Wifi", "Parkovanie", "Catering"],
    type: "Event priestor",
  },
]

const amenityIcons = {
  Wifi: Wifi,
  Projektor: Monitor,
  Káva: Coffee,
  Parkovanie: Car,
  Kuchynka: Coffee,
  Catering: Coffee,
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log("Searching for:", searchQuery)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Nájdite perfektný priestor pre vaše podujatie</h1>
            <p className="text-xl text-gray-600 mb-8">
              Rezervujte si konferenčné miestnosti, coworking priestory a event haly v celom Slovensku jednoducho a
              rýchlo.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-4 bg-white p-2 rounded-lg shadow-lg">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Kde hľadáte priestor? (napr. Bratislava)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-0 focus:ring-0 h-12"
                  />
                </div>
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600 h-12 px-8">
                  <Search className="h-5 w-5 mr-2" />
                  Hľadať
                </Button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">500+</div>
                <div className="text-gray-600">Dostupných priestorov</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">50+</div>
                <div className="text-gray-600">Miest na Slovensku</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">10k+</div>
                <div className="text-gray-600">Spokojných zákazníkov</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Odporúčané priestory</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Objavte najlepšie hodnotené priestory v rôznych mestách Slovenska
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVenues.map((venue) => (
              <Card key={venue.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img src={venue.image || "/placeholder.svg"} alt={venue.name} className="w-full h-48 object-cover" />
                  <Badge className="absolute top-3 left-3 bg-amber-500">{venue.type}</Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{venue.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {venue.location}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-amber-600">€{venue.price}</div>
                      <div className="text-sm text-gray-500">za hodinu</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">{venue.rating}</span>
                      <span className="ml-1 text-gray-500">({venue.reviews})</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{venue.capacity} osôb</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {venue.amenities.map((amenity) => {
                      const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons]
                      return (
                        <div key={amenity} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                          {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
                          {amenity}
                        </div>
                      )
                    })}
                  </div>

                  <Button className="w-full bg-amber-500 hover:bg-amber-600" onClick={() => setShowAuthModal(true)}>
                    Rezervovať
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ako to funguje</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Rezervácia priestoru je jednoduchá a rýchla</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Vyhľadajte</h3>
              <p className="text-gray-600">Nájdite priestor podľa lokality, kapacity a vybavenia</p>
            </div>

            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Rezervujte</h3>
              <p className="text-gray-600">Vyberte si termín a čas, ktorý vám vyhovuje</p>
            </div>

            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Využívajte</h3>
              <p className="text-gray-600">Príďte a využívajte priestor pre vaše podujatie</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Pripravení začať?</h2>
          <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
            Zaregistrujte sa ešte dnes a získajte prístup k stovkám priestorov po celom Slovensku
          </p>
          <Button
            size="lg"
            className="bg-white text-amber-600 hover:bg-gray-100"
            onClick={() => setShowAuthModal(true)}
          >
            Zaregistrovať sa zadarmo
          </Button>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
