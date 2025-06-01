"use client"

import { useState } from "react"
import { FilterBar } from "@/components/FilterBar"
import { VenueList } from "@/components/VenueList"
import { useVenues } from "@/hooks/useVenues"
import { useFavorites } from "@/hooks/useFavorites"
import type { FilterOptions } from "@/types"

export default function VenuesPage() {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    type: "",
    date: "",
    maxPrice: 200,
    city: "",
  })

  const { venues, loading } = useVenues(filters)
  const { toggleFavorite, favorites } = useFavorites()

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Priestory na prenájom</h1>
          <p className="text-gray-600">Nájdených {venues.length} priestorov podľa vašich kritérií</p>
        </div>

        {/* Filters */}
        <FilterBar filters={filters} onFiltersChange={setFilters} className="mb-8" />

        {/* Results */}
        <VenueList venues={venues} loading={loading} onFavorite={toggleFavorite} favorites={favorites} />
      </div>
    </div>
  )
}
