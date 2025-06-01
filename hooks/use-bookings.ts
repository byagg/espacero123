"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/database"

type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"]
type Booking = Database["public"]["Tables"]["bookings"]["Row"]

export const useBookings = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBooking = async (bookingData: BookingInsert) => {
    setLoading(true)
    setError(null)

    if (!supabase) {
      const error = new Error("Supabase client not initialized")
      setError(error.message)
      setLoading(false)
      return { data: null, error }
    }

    try {
      const { data, error } = await supabase.from("bookings").insert(bookingData).select().single()

      if (error) throw error

      setLoading(false)
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error creating booking"
      setError(errorMessage)
      setLoading(false)
      return { data: null, error: new Error(errorMessage) }
    }
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    setLoading(true)
    setError(null)

    if (!supabase) {
      const error = new Error("Supabase client not initialized")
      setError(error.message)
      setLoading(false)
      return { error }
    }

    try {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId)

      if (error) throw error

      setLoading(false)
      return { error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error updating booking"
      setError(errorMessage)
      setLoading(false)
      return { error: new Error(errorMessage) }
    }
  }

  const getBookingsByUser = async (userId: string) => {
    setLoading(true)
    setError(null)

    if (!supabase) {
      const error = new Error("Supabase client not initialized")
      setError(error.message)
      setLoading(false)
      return { data: null, error }
    }

    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          venue:venues(id, name, address, city, images)
        `)
        .eq("guest_id", userId)
        .order("start_datetime", { ascending: false })

      if (error) throw error

      setLoading(false)
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error fetching bookings"
      setError(errorMessage)
      setLoading(false)
      return { data: null, error: new Error(errorMessage) }
    }
  }

  const getBookingsByHost = async (hostId: string) => {
    setLoading(true)
    setError(null)

    if (!supabase) {
      const error = new Error("Supabase client not initialized")
      setError(error.message)
      setLoading(false)
      return { data: null, error }
    }

    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          venue:venues!inner(name, address, city, host_id),
          guest:profiles(full_name, email, phone)
        `)
        .eq("venue.host_id", hostId)
        .order("created_at", { ascending: false })

      if (error) throw error

      setLoading(false)
      return { data, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error fetching host bookings"
      setError(errorMessage)
      setLoading(false)
      return { data: null, error: new Error(errorMessage) }
    }
  }

  return {
    loading,
    error,
    createBooking,
    updateBookingStatus,
    getBookingsByUser,
    getBookingsByHost,
  }
}
