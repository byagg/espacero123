"use client"

import { useState, useEffect, useMemo } from "react"
import type { Venue, FilterOptions } from "@/types"
import { supabase } from "@/lib/supabase"

export function useVenues(filters?: FilterOptions) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchVenues()
  }, [])

  const fetchVenues = async () => {
    try {
      setLoading(true)
      setError(null)

      const query = supabase.from("venues").select("*").eq("is_active", true)

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error

      // Add mock data for demo
      const venuesWithMockData = (data || []).map((venue) => ({
        ...venue,
        location: `${venue.city}, ${venue.address}`,
        price: venue.price_per_hour,
        rating: Number.parseFloat((Math.random() * 2 + 3).toFixed(1)),
        reviews_count: Math.floor(Math.random() * 50) + 5,
        type: venue.category as Venue["type"],
      }))

      setVenues(venuesWithMockData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chyba pri načítavaní priestorov")
    } finally {
      setLoading(false)
    }
  }

  const filteredVenues = useMemo(() => {
    if (!filters) return venues

    return venues.filter((venue) => {
      const matchesSearch =
        !filters.search ||
        venue.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        venue.location.toLowerCase().includes(filters.search.toLowerCase())

      const matchesType = !filters.type || venue.type === filters.type

      const matchesCity = !filters.city || venue.city.toLowerCase().includes(filters.city.toLowerCase())

      const matchesPrice = venue.price <= filters.maxPrice

      return matchesSearch && matchesType && matchesCity && matchesPrice
    })
  }, [venues, filters])

  return {
    venues: filteredVenues,
    allVenues: venues,
    loading,
    error,
    refetch: fetchVenues,
  }
}
