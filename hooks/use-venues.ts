"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Venue = Database["public"]["Tables"]["venues"]["Row"] & {
  averageRating?: number
  reviewCount?: number
}
type VenueInsert = Database["public"]["Tables"]["venues"]["Insert"]
type VenueUpdate = Database["public"]["Tables"]["venues"]["Update"]

interface VenueFilters {
  city?: string
  category?: string
  minCapacity?: number
  maxPrice?: number
  amenities?: string[]
}

export const useVenues = () => {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVenues = async (filters?: VenueFilters) => {
    setLoading(true)
    setError(null)

    if (!supabase) {
      setError("Supabase client not initialized. Check your environment variables.")
      setLoading(false)
      return
    }

    try {
      let query = supabase
        .from("venues")
        .select(`
        *,
        host:profiles(full_name, avatar_url, phone),
        reviews(rating)
      `)
        .eq("is_active", true)

      if (filters?.city) {
        query = query.ilike("city", `%${filters.city}%`)
      }
      if (filters?.category) {
        query = query.eq("category", filters.category)
      }
      if (filters?.minCapacity) {
        query = query.gte("capacity", filters.minCapacity)
      }
      if (filters?.maxPrice) {
        query = query.lte("price_per_hour", filters.maxPrice)
      }

      const { data, error } = await query.order("created_at", { ascending: false })

      if (error) throw error

      // Calculate average ratings
      const venuesWithRatings = (data || []).map((venue) => ({
        ...venue,
        averageRating:
          venue.reviews?.length > 0
            ? venue.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / venue.reviews.length
            : 0,
        reviewCount: venue.reviews?.length || 0,
      }))

      setVenues(venuesWithRatings)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getVenueById = async (id: string) => {
    if (!supabase) {
      return { data: null, error: new Error("Supabase client not initialized") }
    }

    try {
      const { data, error } = await supabase
        .from("venues")
        .select(`
          *,
          host:profiles(full_name, avatar_url, phone)
        `)
        .eq("id", id)
        .single()

      return { data, error }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error("Unknown error fetching venue"),
      }
    }
  }

  const addVenue = async (venueData: VenueInsert) => {
    if (!supabase) {
      return { data: null, error: new Error("Supabase client not initialized") }
    }

    try {
      const { data, error } = await supabase.from("venues").insert(venueData).select().single()
      return { data, error }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error("Unknown error adding venue"),
      }
    }
  }

  const updateVenue = async (id: string, updates: VenueUpdate) => {
    if (!supabase) {
      return { data: null, error: new Error("Supabase client not initialized") }
    }

    try {
      const { data, error } = await supabase.from("venues").update(updates).eq("id", id).select().single()
      return { data, error }
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error("Unknown error updating venue"),
      }
    }
  }

  const deleteVenue = async (id: string) => {
    if (!supabase) {
      return { error: new Error("Supabase client not initialized") }
    }

    try {
      const { error } = await supabase.from("venues").delete().eq("id", id)
      return { error }
    } catch (err) {
      return {
        error: err instanceof Error ? err : new Error("Unknown error deleting venue"),
      }
    }
  }

  // Fetch venues on mount with error handling
  useEffect(() => {
    fetchVenues().catch((err) => {
      setError("Failed to fetch venues")
      setLoading(false)
    })
  }, [])

  return {
    venues,
    loading,
    error,
    fetchVenues,
    getVenueById,
    addVenue,
    updateVenue,
    deleteVenue,
  }
}
