import type { FilterOptions } from "@/types"

export interface FilterBarProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  className?: string
}
