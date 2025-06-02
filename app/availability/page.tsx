"use client"

import type React from "react"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"
import { getAvailableApartments, type ApartmentAvailability } from "@/api/apartment"
import { getTotalPrice, createBooking, type Booking } from "@/api/booking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import {
  Calendar,
  Users,
  Bed,
  Building,
  Euro,
  MapPin,
  Filter,
  SortAsc,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Search,
  Edit3,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

type SortOption = "price-asc" | "price-desc" | "capacity-asc" | "capacity-desc" | "floor-asc" | "floor-desc"

interface ExtendedApartmentAvailability extends ApartmentAvailability {
  price?: number
  pricePerNight?: number
  loading?: boolean
  error?: string
}

interface SearchFormData {
  startDate: string
  endDate: string
  type: string
  adults: string
  children: string
}

export default function AvailabilityPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [apartments, setApartments] = useState<ExtendedApartmentAvailability[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("price-asc")
  const [filterByAvailability, setFilterByAvailability] = useState<"all" | "available" | "unavailable">("all")
  const [showSearchForm, setShowSearchForm] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)

  // Initialize search form with current parameters
  const [searchForm, setSearchForm] = useState<SearchFormData>({
    startDate: searchParams.get("start") || "",
    endDate: searchParams.get("end") || "",
    type: searchParams.get("type") || "",
    adults: searchParams.get("adults") || "1",
    children: searchParams.get("children") || "0",
  })

  // Extract current search parameters
  const startDate = searchParams.get("start")
  const endDate = searchParams.get("end")
  const type = searchParams.get("type")
  const adults = searchParams.get("adults")
  const children = searchParams.get("children")

  // Calculate number of nights
  const numberOfNights = useMemo(() => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }, [startDate, endDate])

  // Format dates for display
  const formattedDates = useMemo(() => {
    if (!startDate || !endDate) return null
    return {
      start: format(new Date(startDate), "dd MMM yyyy", { locale: es }),
      end: format(new Date(endDate), "dd MMM yyyy", { locale: es }),
    }
  }, [startDate, endDate])

  const handleSearchFormChange = (field: keyof SearchFormData, value: string) => {
    setSearchForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchForm.startDate || !searchForm.endDate || !searchForm.type) {
      alert("Por favor, completa todos los campos obligatorios")
      return
    }

    // Validate dates
    const start = new Date(searchForm.startDate)
    const end = new Date(searchForm.endDate)
    if (start >= end) {
      alert("La fecha de salida debe ser posterior a la fecha de entrada")
      return
    }

    setSearchLoading(true)

    // Update URL with new search parameters
    const params = new URLSearchParams()
    params.set("start", searchForm.startDate)
    params.set("end", searchForm.endDate)
    params.set("type", searchForm.type)
    params.set("adults", searchForm.adults)
    if (searchForm.children && searchForm.children !== "0") {
      params.set("children", searchForm.children)
    }

    router.push(`/availability?${params.toString()}`)
    setShowSearchForm(false)
    setSearchLoading(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate || !type) {
        setError("Parámetros de búsqueda incompletos")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const data = await getAvailableApartments({ type, startDate, endDate })

        // Initialize apartments with loading state for prices
        const apartmentsWithPricing: ExtendedApartmentAvailability[] = data.map((item) => ({
          ...item,
          loading: true,
        }))

        setApartments(apartmentsWithPricing)

        // Fetch prices for each apartment
        const updatedApartments = await Promise.all(
          apartmentsWithPricing.map(async (item) => {
            try {
              const totalPrice = await getTotalPrice(item.apartment.id, startDate, endDate)
              const pricePerNight = numberOfNights > 0 ? totalPrice / numberOfNights : 0

              return {
                ...item,
                price: totalPrice,
                pricePerNight,
                loading: false,
                error: undefined,
              }
            } catch (error) {
              console.error(`Error fetching price for apartment ${item.apartment.id}:`, error)
              return {
                ...item,
                loading: false,
                error: "Error al cargar el precio",
              }
            }
          }),
        )

        setApartments(updatedApartments)
      } catch (error) {
        console.error("Error fetching apartments:", error)
        setError("Error al cargar los apartamentos disponibles")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchParams, numberOfNights])

  // Filter and sort apartments
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

  const handleReserve = async (apartmentId: number) => {
    if (!startDate || !endDate || !adults) {
      alert("Por favor, selecciona fechas y número de huéspedes válidos.")
      return
    }

    const apartment = apartments.find((apt) => apt.apartment.id === apartmentId)
    const totalPrice = apartment?.price

    if (totalPrice === undefined) {
      alert("El precio total aún no está disponible.")
      return
    }

    const booking: Booking = {
      guests: Number.parseInt(adults, 10) + (children ? Number.parseInt(children, 10) : 0),
      apartmentId: apartmentId,
      startDate: startDate,
      endDate: endDate,
      totalPrice: totalPrice,
      status: "PENDING",
    }

    try {
      const created = await createBooking(booking)
      localStorage.setItem("pendingBookingId", JSON.stringify(created.id))
      router.push("/booking")
    } catch (error) {
      console.error("Error al crear la reserva:", error)
      alert("Hubo un problema al crear la reserva. Intenta de nuevo.")
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div>
        <SiteHeader />
        <div className="container py-12">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <SiteHeader />
        <div className="container py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={handleGoBack} variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <SiteHeader />
      <div className="container py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Apartamentos Disponibles</h1>
            <Button
              variant="outline"
              onClick={() => setShowSearchForm(!showSearchForm)}
              className="flex items-center gap-2"
            >
              <Edit3 className="h-4 w-4" />
              Modificar búsqueda
            </Button>
          </div>

          {/* Search Form */}
          {showSearchForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Modificar criterios de búsqueda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearchSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Fecha de entrada</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={searchForm.startDate}
                        onChange={(e) => handleSearchFormChange("startDate", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">Fecha de salida</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={searchForm.endDate}
                        onChange={(e) => handleSearchFormChange("endDate", e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo de apartamento</Label>
                      <Select value={searchForm.type} onValueChange={(value) => handleSearchFormChange("type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="studio">Estudio</SelectItem>
                          <SelectItem value="apartment">Apartamento</SelectItem>
                          <SelectItem value="suite">Suite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adults">Adultos</Label>
                      <Select
                        value={searchForm.adults}
                        onValueChange={(value) => handleSearchFormChange("adults", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "adulto" : "adultos"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="children">Niños</Label>
                      <Select
                        value={searchForm.children}
                        onValueChange={(value) => handleSearchFormChange("children", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "niño" : "niños"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={searchLoading}>
                      {searchLoading ? "Buscando..." : "Buscar apartamentos"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowSearchForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Search Summary */}
          {formattedDates && (
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Check-in:</span>
                  <span>{formattedDates.start}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Check-out:</span>
                  <span>{formattedDates.end}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Huéspedes:</span>
                  <span>
                    {adults} adultos{children && `, ${children} niños`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Tipo:</span>
                  <span className="capitalize">{type}</span>
                </div>
              </div>
              {numberOfNights > 0 && (
                <div className="mt-2 text-sm text-muted-foreground">
                  {numberOfNights} {numberOfNights === 1 ? "noche" : "noches"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterByAvailability} onValueChange={(value: any) => setFilterByAvailability(value)}>
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
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
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
            {filteredAndSortedApartments.length} apartamento{filteredAndSortedApartments.length !== 1 ? "s" : ""}{" "}
            encontrado{filteredAndSortedApartments.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Results */}
        {filteredAndSortedApartments.length === 0 ? (
          <div className="text-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron apartamentos</h3>
            <p className="text-muted-foreground mb-4">
              No hay apartamentos disponibles para los criterios seleccionados.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => setShowSearchForm(true)} variant="default">
                <Edit3 className="h-4 w-4 mr-2" />
                Modificar búsqueda
              </Button>
              <Button onClick={handleGoBack} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedApartments.map(
              ({ apartment, available, price, pricePerNight, loading: priceLoading, error: priceError }) => (
                <Card
                  key={apartment.id}
                  className={`overflow-hidden transition-all hover:shadow-lg ${!available ? "opacity-75" : ""}`}
                >
                  <div className="relative h-48">
                    <Image
                      src={`/apartments/${apartment.id}/index.jpg`}
                      alt={`Apartamento ${apartment.id}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant={available ? "default" : "destructive"} className="shadow-sm">
                        {available ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" /> Disponible
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" /> No disponible
                          </>
                        )}
                      </Badge>
                    </div>
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="shadow-sm">
                        Apartamento {apartment.id}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize">{apartment.apartmentType}</span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        Piso {apartment.floor}
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Apartment Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{apartment.capacity} huéspedes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bed className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {apartment.bedrooms} habitación{apartment.bedrooms !== 1 ? "es" : ""}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {apartment.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{apartment.description}</p>
                    )}

                    <Separator />

                    {/* Pricing */}
                    <div className="space-y-2">
                      {priceLoading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-6 w-32" />
                        </div>
                      ) : priceError ? (
                        <div className="text-sm text-destructive">{priceError}</div>
                      ) : (
                        <>
                          {pricePerNight && (
                            <div className="text-sm text-muted-foreground">{pricePerNight.toFixed(2)} € por noche</div>
                          )}
                          <div className="flex items-center gap-2">
                            <Euro className="h-4 w-4 text-muted-foreground" />
                            <span className="text-lg font-bold">{price?.toFixed(2)} € total</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Reserve Button */}
                    <Button
                      className="w-full"
                      onClick={() => handleReserve(apartment.id)}
                      disabled={!available || priceLoading || !!priceError}
                      variant={available ? "default" : "secondary"}
                    >
                      {!available
                        ? "No disponible"
                        : priceLoading
                          ? "Calculando precio..."
                          : priceError
                            ? "Error en precio"
                            : "Reservar ahora"}
                    </Button>
                  </CardContent>
                </Card>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  )
}
