import type { Venue } from "./venue"

export interface Booking {
  id: string
  venue_id: string
  guest_id: string
  start_datetime: string
  end_datetime: string
  guest_count: number
  total_price: number
  status: "pending" | "confirmed" | "cancelled" | "completed"
  special_requests: string | null
  created_at: string
  updated_at: string
  venue?: Venue
}

export interface Venue {
  id: string
  host_id: string
  name: string
  description: string | null
  category: string | null
  address: string
  city: string
  postal_code: string | null
  latitude: number | null
  longitude: number | null
  capacity: number
  price_per_hour: number
  images: string[]
  amenities: string[]
  rules: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          user_role: "host" | "guest" | "admin"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          user_role?: "host" | "guest" | "admin"
        }
        Update: {
          email?: string | null
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          user_role?: "host" | "guest" | "admin"
        }
      }
      venues: {
        Row: {
          id: string
          host_id: string
          name: string
          description: string | null
          category: string | null
          address: string
          city: string
          postal_code: string | null
          latitude: number | null
          longitude: number | null
          capacity: number
          price_per_hour: number
          images: string[]
          amenities: string[]
          rules: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          host_id: string
          name: string
          description?: string | null
          category?: string | null
          address: string
          city: string
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          capacity: number
          price_per_hour: number
          images?: string[]
          amenities?: string[]
          rules?: string | null
          is_active?: boolean
        }
        Update: {
          name?: string
          description?: string | null
          category?: string | null
          address?: string
          city?: string
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          capacity?: number
          price_per_hour?: number
          images?: string[]
          amenities?: string[]
          rules?: string | null
          is_active?: boolean
        }
      }
      bookings: {
        Row: {
          id: string
          venue_id: string
          guest_id: string
          start_datetime: string
          end_datetime: string
          guest_count: number
          total_price: number
          status: "pending" | "confirmed" | "cancelled" | "completed"
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          venue_id: string
          guest_id: string
          start_datetime: string
          end_datetime: string
          guest_count: number
          total_price: number
          status?: "pending" | "confirmed" | "cancelled" | "completed"
          special_requests?: string | null
        }
        Update: {
          start_datetime?: string
          end_datetime?: string
          guest_count?: number
          total_price?: number
          status?: "pending" | "confirmed" | "cancelled" | "completed"
          special_requests?: string | null
        }
      }
    }
  }
}
