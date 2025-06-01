"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, MapPin, Calendar, Filter } from "lucide-react"
import type { FilterBarProps } from "./types"

export function FilterBar({ filters, onFiltersChange, className = "" }: FilterBarProps) {
  const handleFilterChange = (key: string, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  return (
    <Card className={`bg-white border-gray-200 shadow-lg ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-amber-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filtre</h3>
        </div>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              placeholder="Hľadať priestor podľa názvu..."
              className="pl-10 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
              aria-label="Vyhľadávanie priestorov"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* City */}
            <div>
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                Mesto
              </Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="city"
                  type="text"
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  placeholder="Bratislava, Košice..."
                  className="pl-9 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  aria-label="Mesto"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                Dátum
              </Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="date"
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange("date", e.target.value)}
                  className="pl-9 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                  aria-label="Dátum rezervácie"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                Typ priestoru
              </Label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
                <SelectTrigger id="type" className="mt-1 border-gray-300 focus:border-amber-500 focus:ring-amber-500">
                  <SelectValue placeholder="Všetky typy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Všetky typy</SelectItem>
                  <SelectItem value="restaurant">Reštaurácia</SelectItem>
                  <SelectItem value="cafe">Kaviareň</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="event_hall">Event sála</SelectItem>
                  <SelectItem value="conference">Konferenčná miestnosť</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                  Max. cena za hodinu
                </Label>
                <span className="text-amber-600 font-semibold text-sm">{filters.maxPrice}€</span>
              </div>
              <Slider
                id="price"
                min={0}
                max={500}
                step={10}
                value={[filters.maxPrice]}
                onValueChange={(values) => handleFilterChange("maxPrice", values[0])}
                className="mt-2"
                aria-label="Maximálna cena za hodinu"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0€</span>
                <span>500€</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
