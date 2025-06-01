import type { Venue } from "@/types"

export interface VenueCardProps {
  venue: Venue
  onFavorite?: (venueId: string) => void
  isFavorite?: boolean
}
