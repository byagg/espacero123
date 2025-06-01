export type Database = {
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
      favorites: {
        Row: {
          id: string
          user_id: string
          venue_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          venue_id: string
        }
        Update: {
          user_id?: string
          venue_id?: string
        }
      }
      reviews: {
        Row: {
          id: string
          venue_id: string
          user_id: string
          booking_id: string | null
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          venue_id: string
          user_id: string
          booking_id?: string | null
          rating: number
          comment?: string | null
        }
        Update: {
          rating?: number
          comment?: string | null
        }
      }
      amenities: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          category: string | null
          created_at: string
        }
        Insert: {
          name: string
          description?: string | null
          icon?: string | null
          category?: string | null
        }
        Update: {
          name?: string
          description?: string | null
          icon?: string | null
          category?: string | null
        }
      }
      venue_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          created_at: string
        }
        Insert: {
          name: string
          description?: string | null
          icon?: string | null
        }
        Update: {
          name?: string
          description?: string | null
          icon?: string | null
        }
      }
      availability_slots: {
        Row: {
          id: string
          venue_id: string
          date: string
          start_time: string
          end_time: string
          is_available: boolean
          price_override: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          venue_id: string
          date: string
          start_time: string
          end_time: string
          is_available?: boolean
          price_override?: number | null
        }
        Update: {
          date?: string
          start_time?: string
          end_time?: string
          is_available?: boolean
          price_override?: number | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: "info" | "success" | "warning" | "error"
          is_read: boolean
          related_booking_id: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          title: string
          message: string
          type?: "info" | "success" | "warning" | "error"
          is_read?: boolean
          related_booking_id?: string | null
        }
        Update: {
          title?: string
          message?: string
          type?: "info" | "success" | "warning" | "error"
          is_read?: boolean
        }
      }
    }
  }
}
