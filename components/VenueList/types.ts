import type { Venue } from "@/types"

export interface VenueListProps {
  venues: Venue[]
  loading?: boolean
  onFavorite?: (venueId: string) => void
  favorites?: string[]
}
