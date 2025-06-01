"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type Amenity = Database["public"]["Tables"]["amenities"]["Row"]
type VenueCategory = Database["public"]["Tables"]["venue_categories"]["Row"]

export const useAmenities = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [categories, setCategories] = useState<VenueCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    if (!supabase) return

    setLoading(true)
    try {
      // Fetch amenities
      const { data: amenitiesData, error: amenitiesError } = await supabase.from("amenities").select("*").order("name")

      if (amenitiesError) throw amenitiesError

      // Fetch venue categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("venue_categories")
        .select("*")
        .order("name")

      if (categoriesError) throw categoriesError

      setAmenities(amenitiesData || [])
      setCategories(categoriesData || [])
    } catch (error) {
      console.error("Error fetching amenities and categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAmenitiesByCategory = (category: string) => {
    return amenities.filter((amenity) => amenity.category === category)
  }

  const getAmenityById = (id: string) => {
    return amenities.find((amenity) => amenity.id === id)
  }

  const getCategoryById = (id: string) => {
    return categories.find((category) => category.id === id)
  }

  return {
    amenities,
    categories,
    loading,
    getAmenitiesByCategory,
    getAmenityById,
    getCategoryById,
    refetch: fetchData,
  }
}
