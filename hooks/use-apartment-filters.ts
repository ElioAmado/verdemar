import { useState, useMemo } from "react"
import type { ExtendedApartmentAvailability, SortOption } from "@/types/availability"

export function useApartmentFilters(apartments: ExtendedApartmentAvailability[]) {
  const [sortBy, setSortBy] = useState<SortOption>("price-asc")
  const [filterByAvailability, setFilterByAvailability] = useState<"all" | "available" | "unavailable">("all")

  const filteredAndSortedApartments = useMemo(() => {
    let filtered = apartments

    // Apply availability filter
    if (filterByAvailability !== "all") {
      filtered = filtered.filter((item) => (filterByAvailability === "available" ? item.available : !item.available))
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return (a.price || 0) - (b.price || 0)
        case "price-desc":
          return (b.price || 0) - (a.price || 0)
        case "capacity-asc":
          return a.apartment.capacity - b.apartment.capacity
        case "capacity-desc":
          return b.apartment.capacity - a.apartment.capacity
        case "floor-asc":
          return a.apartment.floor - b.apartment.floor
        case "floor-desc":
          return b.apartment.floor - a.apartment.floor
        default:
          return 0
      }
    })
  }, [apartments, sortBy, filterByAvailability])

  return {
    sortBy,
    setSortBy,
    filterByAvailability,
    setFilterByAvailability,
    filteredAndSortedApartments,
  }
}
