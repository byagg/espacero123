"use client"

import { VenueCard } from "@/components/VenueCard"
import type { VenueListProps } from "./types"
import { Search } from "lucide-react"

export function VenueList({ venues, loading, onFavorite, favorites = [] }: VenueListProps) {
  if (loading) {
    return (
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
    )
  }

  if (venues.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Žiadne priestory nenájdené</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Skúste zmeniť parametre vyhľadávania alebo filtre pre lepšie výsledky.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {venues.map((venue) => (
        <VenueCard key={venue.id} venue={venue} onFavorite={onFavorite} isFavorite={favorites.includes(venue.id)} />
      ))}
    </div>
  )
}
