"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart, MapPin, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { VenueCardProps } from "./types"

export function VenueCard({ venue, onFavorite, isFavorite }: VenueCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onFavorite(venue.id)
  }

  return (
    <Card className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="relative">
        <Link href={`/venues/${venue.id}`}>
          <div className="relative h-48 overflow-hidden">
            <Image
              src={venue.image || "/placeholder.svg"}
              alt={venue.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>

        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
          aria-label={isFavorite ? "Odstrániť z obľúbených" : "Pridať do obľúbených"}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>

        <Badge className="absolute top-3 left-3 bg-amber-500 text-white">
          {venue.type === "restaurant" && "Reštaurácia"}
          {venue.type === "cafe" && "Kaviareň"}
          {venue.type === "bar" && "Bar"}
          {venue.type === "event_hall" && "Event sála"}
          {venue.type === "conference" && "Konferenčná miestnosť"}
        </Badge>
      </div>

      <CardContent className="p-4">
        <Link href={`/venues/${venue.id}`}>
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-amber-600 transition-colors line-clamp-1">
                {venue.name}
              </h3>
              <div className="flex items-center text-gray-600 text-sm mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="line-clamp-1">{venue.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                <span>Do {venue.capacity} osôb</span>
              </div>
              <div className="flex items-center text-amber-600">
                <Star className="h-4 w-4 mr-1 fill-current" />
                <span className="font-medium">{venue.rating}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-gray-800">€{venue.price}</span>
                <span className="text-gray-600 text-sm">/hodina</span>
              </div>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                Rezervovať
              </Button>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  )
}
