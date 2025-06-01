"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Users, ChefHat, Coffee, Wine, Calendar, Phone, Heart, User } from "lucide-react"
import Link from "next/link"
import { VenueCard } from "@/components/VenueCard"
import { useVenues } from "@/hooks/useVenues"
import { useFavorites } from "@/hooks/useFavorites"

export default function HomePage() {
  const { venues, loading } = useVenues()
  const { toggleFavorite, isFavorite } = useFavorites()

  // Show only first 6 venues on homepage
  const featuredVenues = venues.slice(0, 6)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 bg-gradient-to-br from-amber-50 to-amber-100">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-6 text-amber-600">ESPACERO</h1>
          <p className="text-lg md:text-2xl text-gray-700 mb-6 md:mb-8 max-w-3xl mx-auto font-medium">
            Prenájom priestorov na Slovensku
          </p>
          <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto">
            Nájdite perfektný priestor pre vašu súkromnú udalosť, oslavu, firemné podujatie alebo akúkoľvek príležitosť
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-4 md:p-6 shadow-xl border border-gray-200">
            <div className="grid grid-cols-1 gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <Input
                  placeholder="Mesto (napr. Bratislava)"
                  className="pl-10 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <Input type="date" className="pl-10 bg-gray-50 border-gray-300 text-gray-800" />
              </div>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                <Input
                  placeholder="Počet hostí"
                  type="number"
                  className="pl-10 bg-gray-50 border-gray-300 text-gray-800 placeholder:text-gray-500"
                />
              </div>
              <Link href="/venues">
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg">
                  <Search className="mr-2 h-5 w-5" />
                  Hľadať priestory
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-amber-600">320+</div>
              <div className="text-gray-600">Priestorov</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-amber-600">15</div>
              <div className="text-gray-600">Miest</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-amber-600">2,500+</div>
              <div className="text-gray-600">Spokojných hostí</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-amber-600">4.8</div>
              <div className="text-gray-600">Priemerné hodnotenie</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 md:py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-800">Kategórie priestorov</h2>
          <p className="text-center text-gray-600 mb-8 md:mb-12 max-w-2xl mx-auto">
            Vyberte si z rôznych typov priestorov podľa charakteru vašej udalosti
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: ChefHat,
                title: "Reštaurácie",
                count: "120+ priestorov",
                description: "Elegantné reštaurácie pre rodinné oslavy a firemné podujatia",
                priceRange: "€35-85/hod",
                type: "restaurant",
              },
              {
                icon: Coffee,
                title: "Kaviarne",
                count: "85+ priestorov",
                description: "Útulné kaviarne ideálne pre menšie stretnutia a workshopy",
                priceRange: "€20-45/hod",
                type: "cafe",
              },
              {
                icon: Wine,
                title: "Bary",
                count: "65+ priestorov",
                description: "Štýlové bary pre večierky a neformálne podujatia",
                priceRange: "€30-70/hod",
                type: "bar",
              },
              {
                icon: Calendar,
                title: "Event sály",
                count: "45+ priestorov",
                description: "Veľké sály pre konferencie, svadby a veľké oslavy",
                priceRange: "€60-150/hod",
                type: "event_hall",
              },
            ].map((category, index) => (
              <Link key={index} href={`/venues?type=${category.type}`}>
                <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:border-amber-200 h-full">
                  <CardContent className="p-4 md:p-6 text-center">
                    <category.icon className="h-10 w-10 md:h-12 md:w-12 text-amber-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">{category.title}</h3>
                    <p className="text-amber-600 font-medium mb-2 md:mb-3">{category.count}</p>
                    <p className="text-gray-600 text-sm mb-2 md:mb-3">{category.description}</p>
                    <p className="text-gray-700 font-medium text-sm">{category.priceRange}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues */}
      <section className="py-10 md:py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Odporúčané priestory</h2>
              <p className="text-gray-600">Najlepšie hodnotené priestory v našej ponuke</p>
            </div>
            <Link href="/venues">
              <Button variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">
                Zobraziť všetky
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 animate-pulse rounded" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-4 bg-gray-200 animate-pulse rounded" />
                      <div className="h-4 bg-gray-200 animate-pulse rounded" />
                    </div>
                    <div className="h-10 bg-gray-200 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} onFavorite={toggleFavorite} isFavorite={isFavorite(venue.id)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-16 px-4 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-white">Máte priestor na prenájom?</h2>
          <p className="text-lg md:text-xl text-amber-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Pridajte svoj priestor na ESPACERO a začnite zarábať prenájmom reštaurácie, kaviarne, sály alebo iného
            priestoru.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8 max-w-4xl mx-auto">
            <div className="text-center text-amber-100">
              <div className="text-xl md:text-2xl font-bold text-white">€2,500</div>
              <div className="text-sm">Priemerný mesačný príjem</div>
            </div>
            <div className="text-center text-amber-100">
              <div className="text-xl md:text-2xl font-bold text-white">85%</div>
              <div className="text-sm">Priemerná obsadenosť</div>
            </div>
            <div className="text-center text-amber-100">
              <div className="text-xl md:text-2xl font-bold text-white">3 mesiace</div>
              <div className="text-sm">zdarma</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/host">
              <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100 font-semibold">
                Pridať priestor zadarmo
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600">
              <Phone className="mr-2 h-5 w-5" />
              Zavolajte nám: +421 900 123 456
            </Button>
          </div>
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex justify-around">
          <Link href="/" className="flex flex-col items-center text-amber-500">
            <Search className="h-6 w-6" />
            <span className="text-xs mt-1">Hľadať</span>
          </Link>
          <Link href="/favorites" className="flex flex-col items-center text-gray-500">
            <Heart className="h-6 w-6" />
            <span className="text-xs mt-1">Obľúbené</span>
          </Link>
          <Link href="/bookings" className="flex flex-col items-center text-gray-500">
            <Calendar className="h-6 w-6" />
            <span className="text-xs mt-1">Rezervácie</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-500">
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profil</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
