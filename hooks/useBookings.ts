"use client"

import { useState, useEffect } from "react"
import type { Booking } from "@/types"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./useAuth"

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          venue:venues(*)
        `)
        .eq("guest_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setBookings(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chyba pri načítavaní rezervácií")
    } finally {
      setLoading(false)
    }
  }

  const createBooking = async (bookingData: Omit<Booking, "id" | "created_at" | "venue">) => {
    if (!user) throw new Error("Používateľ nie je prihlásený")

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          ...bookingData,
          guest_id: user.id,
        })
        .select()
        .single()

      if (error) throw error

      await fetchBookings() // Refresh bookings
      return data
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Chyba pri vytváraní rezervácie")
    }
  }

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId)
        .eq("guest_id", user?.id)

      if (error) throw error

      await fetchBookings() // Refresh bookings
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "Chyba pri zrušení rezervácie")
    }
  }

  return {
    bookings,
    loading,
    error,
    createBooking,
    cancelBooking,
    refetch: fetchBookings,
  }
}
