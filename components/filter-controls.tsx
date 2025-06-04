"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, SortAsc } from "lucide-react"
import type { SortOption } from "@/types/availability"

interface FilterControlsProps {
  sortBy: SortOption
  setSortBy: (value: SortOption) => void
  filterByAvailability: "all" | "available" | "unavailable"
  setFilterByAvailability: (value: "all" | "available" | "unavailable") => void
  resultCount: number
}

export function FilterControls({
  sortBy,
  setSortBy,
  filterByAvailability,
  setFilterByAvailability,
  resultCount,
}: FilterControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filterByAvailability} onValueChange={setFilterByAvailability}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por disponibilidad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los apartamentos</SelectItem>
            <SelectItem value="available">Solo disponibles</SelectItem>
            <SelectItem value="unavailable">No disponibles</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <SortAsc className="h-4 w-4 text-muted-foreground" />
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
            <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
            <SelectItem value="capacity-asc">Capacidad: menor a mayor</SelectItem>
            <SelectItem value="capacity-desc">Capacidad: mayor a menor</SelectItem>
            <SelectItem value="floor-asc">Piso: menor a mayor</SelectItem>
            <SelectItem value="floor-desc">Piso: mayor a menor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="ml-auto text-sm text-muted-foreground">
        {resultCount} apartamento{resultCount !== 1 ? "s" : ""} encontrado{resultCount !== 1 ? "s" : ""}
      </div>
    </div>
  )
}
