"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isWithinInterval,
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  parseISO,
  addDays,
  startOfDay,
} from "date-fns"
import { es } from "date-fns/locale"
import { getAllIds } from "@/api/apartment"
import { getDatesByApartmentId} from "@/api/booking"
import type { DefaultDateRange } from "@/types/defaultDateRange"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Building,
  ArrowLeft,
  Grid3X3,
  List,
  RefreshCw,
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import { SiteHeaderAdmin } from "@/components/site-header-admin"

type CalendarView = "month" | "week"
type ViewMode = "calendar" | "list"

interface BookingInfo {
  id: number
  clientName: string
  status: string
  checkIn: string
  checkOut: string
  guests: number
}

interface DayInfo {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  isBooked: boolean
  bookings: BookingInfo[]
  status: "available" | "booked" | "checkout" | "checkin"
}

export default function AdminCalendarPage() {
  const router = useRouter()
  const [apartmentIds, setApartmentIds] = useState<number[]>([])
  const [selectedApartmentId, setSelectedApartmentId] = useState<number | null>(null)
  const [dateRanges, setDateRanges] = useState<DefaultDateRange[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarView, setCalendarView] = useState<CalendarView>("month")
  const [viewMode, setViewMode] = useState<ViewMode>("calendar")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const fetchApartmentIds = async () => {
      try {
        setLoading(true)
        const ids = await getAllIds()
        setApartmentIds(ids)
        if (ids.length > 0) {
          setSelectedApartmentId(ids[0])
        }
      } catch (err) {
        setError("Error al cargar los apartamentos")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchApartmentIds()
  }, [])

  useEffect(() => {
    const fetchDateRanges = async () => {
      if (selectedApartmentId !== null) {
        try {
          setRefreshing(true)
          setError(null)
          const ranges = await getDatesByApartmentId(selectedApartmentId)
          setDateRanges(ranges)
        } catch (err) {
          setError("Error al cargar las reservas")
          console.error(err)
        } finally {
          setRefreshing(false)
        }
      } else {
        setDateRanges([])
      }
    }

    fetchDateRanges()
  }, [selectedApartmentId])

  // Calculate calendar days based on view
  const calendarDays = useMemo(() => {
    const start =
      calendarView === "month"
        ? startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
        : startOfWeek(currentDate, { weekStartsOn: 1 })

    const end =
      calendarView === "month"
        ? endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
        : endOfWeek(currentDate, { weekStartsOn: 1 })

    return eachDayOfInterval({ start, end })
  }, [currentDate, calendarView])

  // Process day information
  const daysInfo: DayInfo[] = useMemo(() => {
    return calendarDays.map((date) => {
      const isCurrentMonth = calendarView === "month" ? isSameMonth(date, currentDate) : true
      const isToday = isSameDay(date, new Date())

      // Check if day is booked
      const dayBookings = dateRanges.filter((range) => {
        const start = range.from ? parseISO(range.from) : null
        const end = range.to ? parseISO(range.to) : start
        if (!start || !end) return false
        return isWithinInterval(startOfDay(date), { start: startOfDay(start), end: startOfDay(end) })
      })

      const isBooked = dayBookings.length > 0

      // Determine status
      let status: DayInfo["status"] = "available"
      if (isBooked) {
        const hasCheckIn = dayBookings.some((range) => range.from && isSameDay(parseISO(range.from), date))
        const hasCheckOut = dayBookings.some((range) => range.to && isSameDay(parseISO(range.to), date))

        if (hasCheckIn && hasCheckOut) {
          status = "booked" // Same day check-in and check-out
        } else if (hasCheckIn) {
          status = "checkin"
        } else if (hasCheckOut) {
          status = "checkout"
        } else {
          status = "booked"
        }
      }

      // Mock booking info (in real app, this would come from API)
      const bookings: BookingInfo[] = dayBookings.map((range, index) => ({
        id: index + 1,
        clientName: `Cliente ${index + 1}`,
        status: "CONFIRMED",
        checkIn: range.from || "",
        checkOut: range.to || "",
        guests: 2,
      }))

      return {
        date,
        isCurrentMonth,
        isToday,
        isBooked,
        bookings,
        status,
      }
    })
  }, [calendarDays, currentDate, calendarView, dateRanges])

  // Statistics
  const stats = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

    const bookedDays = monthDays.filter((day) =>
      dateRanges.some((range) => {
        const start = range.from ? parseISO(range.from) : null
        const end = range.to ? parseISO(range.to) : start
        if (!start || !end) return false
        return isWithinInterval(startOfDay(day), { start: startOfDay(start), end: startOfDay(end) })
      }),
    ).length

    const occupancyRate = monthDays.length > 0 ? (bookedDays / monthDays.length) * 100 : 0

    return {
      totalDays: monthDays.length,
      bookedDays,
      availableDays: monthDays.length - bookedDays,
      occupancyRate,
    }
  }, [currentDate, dateRanges])

  const handleRefresh = async () => {
    if (selectedApartmentId !== null) {
      setRefreshing(true)
      try {
        const ranges = await getDatesByApartmentId(selectedApartmentId)
        setDateRanges(ranges)
      } catch (err) {
        setError("Error al actualizar las reservas")
      } finally {
        setRefreshing(false)
      }
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
  }

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate(direction === "prev" ? addDays(currentDate, -7) : addDays(currentDate, 7))
  }

  const getDayClassName = (dayInfo: DayInfo) => {
    const baseClasses = "relative p-2 min-h-[80px] border border-border/50 transition-colors hover:bg-muted/50"

    let statusClasses = ""
    switch (dayInfo.status) {
      case "booked":
        statusClasses = "bg-red-100 border-red-200 dark:bg-red-900/20 dark:border-red-800"
        break
      case "checkin":
        statusClasses = "bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800"
        break
      case "checkout":
        statusClasses = "bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
        break
      default:
        statusClasses = "bg-background"
    }

    const monthClasses = !dayInfo.isCurrentMonth ? "opacity-40" : ""
    const todayClasses = dayInfo.isToday ? "ring-2 ring-primary" : ""

    return `${baseClasses} ${statusClasses} ${monthClasses} ${todayClasses}`
  }

  const getStatusBadge = (status: DayInfo["status"]) => {
    const config = {
      available: { variant: "outline" as const, label: "Disponible", icon: CheckCircle },
      booked: { variant: "destructive" as const, label: "Ocupado", icon: XCircle },
      checkin: { variant: "default" as const, label: "Check-in", icon: Clock },
      checkout: { variant: "secondary" as const, label: "Check-out", icon: Clock },
    }

    const { variant, label, icon: Icon } = config[status]
    return (
      <Badge variant={variant} className="text-xs">
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    )
  }

  if (loading) {
    return (
      
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
    <SiteHeaderAdmin />
    <TooltipProvider>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Calendario de Reservas</h1>
            <p className="text-muted-foreground">Gestiona la disponibilidad de los apartamentos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/admin/bookings")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ver reservas
            </Button>
            <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Apartment Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Selección de Apartamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="space-y-2">
                <label className="text-sm font-medium">Apartamento:</label>
                <Select
                  value={selectedApartmentId?.toString() || ""}
                  onValueChange={(value) => setSelectedApartmentId(value ? Number(value) : null)}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Selecciona un apartamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {apartmentIds.map((id) => (
                      <SelectItem key={id} value={id.toString()}>
                        Apartamento #{id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedApartmentId && (
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "calendar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("calendar")}
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Calendario
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4 mr-2" />
                    Lista
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {selectedApartmentId ? (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Días del Mes</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalDays}</div>
                  <p className="text-xs text-muted-foreground">{format(currentDate, "MMMM yyyy", { locale: es })}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Días Ocupados</CardTitle>
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{stats.bookedDays}</div>
                  <p className="text-xs text-muted-foreground">Reservas confirmadas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Días Disponibles</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.availableDays}</div>
                  <p className="text-xs text-muted-foreground">Sin reservas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.occupancyRate.toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground">Tasa de ocupación</p>
                </CardContent>
              </Card>
            </div>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leyenda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {getStatusBadge("available")}
                  {getStatusBadge("booked")}
                  {getStatusBadge("checkin")}
                  {getStatusBadge("checkout")}
                </div>
              </CardContent>
            </Card>

            {/* Calendar/List View */}
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
              <TabsContent value="calendar">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          {calendarView === "month"
                            ? format(currentDate, "MMMM yyyy", { locale: es })
                            : `Semana del ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "dd MMM", { locale: es })}`}
                        </CardTitle>
                        <CardDescription>Apartamento #{selectedApartmentId}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={calendarView} onValueChange={(value: CalendarView) => setCalendarView(value)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="month">Mes</SelectItem>
                            <SelectItem value="week">Semana</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => (calendarView === "month" ? navigateMonth("prev") : navigateWeek("prev"))}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                          Hoy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => (calendarView === "month" ? navigateMonth("next") : navigateWeek("next"))}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Calendar Header */}
                    <div className="grid grid-cols-7 mb-2">
                      {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                        <div key={day} className="p-2 text-center font-semibold text-sm text-muted-foreground">
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {daysInfo.map((dayInfo, index) => (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <div className={getDayClassName(dayInfo)}>
                              <div className="flex justify-between items-start">
                                <span className={`text-sm font-medium ${dayInfo.isToday ? "text-primary" : ""}`}>
                                  {format(dayInfo.date, "d")}
                                </span>
                                {dayInfo.isBooked && <div className="w-2 h-2 rounded-full bg-red-500" />}
                              </div>
                              {dayInfo.isToday && (
                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                                  <div className="w-1 h-1 rounded-full bg-primary" />
                                </div>
                              )}
                              {dayInfo.bookings.length > 0 && (
                                <div className="mt-1 space-y-1">
                                  {dayInfo.bookings.slice(0, 2).map((booking, i) => (
                                    <div key={i} className="text-xs p-1 bg-background/80 rounded truncate">
                                      {booking.clientName}
                                    </div>
                                  ))}
                                  {dayInfo.bookings.length > 2 && (
                                    <div className="text-xs text-muted-foreground">
                                      +{dayInfo.bookings.length - 2} más
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-2">
                              <div className="font-semibold">
                                {format(dayInfo.date, "dd 'de' MMMM, yyyy", { locale: es })}
                              </div>
                              {getStatusBadge(dayInfo.status)}
                              {dayInfo.bookings.length > 0 && (
                                <div className="space-y-1">
                                  <div className="text-sm font-medium">Reservas:</div>
                                  {dayInfo.bookings.map((booking, i) => (
                                    <div key={i} className="text-sm">
                                      • {booking.clientName} ({booking.guests} huéspedes)
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="list">
                <Card>
                  <CardHeader>
                    <CardTitle>Lista de Reservas</CardTitle>
                    <CardDescription>Reservas para el apartamento #{selectedApartmentId}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dateRanges.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No hay reservas</h3>
                        <p className="text-muted-foreground">
                          Este apartamento no tiene reservas en el período seleccionado.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {dateRanges.map((range, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                              <div className="font-medium">Reserva #{index + 1}</div>
                              <div className="text-sm text-muted-foreground">
                                {range.from && format(parseISO(range.from), "dd MMM yyyy", { locale: es })} -{" "}
                                {range.to && format(parseISO(range.to), "dd MMM yyyy", { locale: es })}
                              </div>
                            </div>
                            <Badge variant="default">Confirmada</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Selecciona un apartamento</h3>
              <p className="text-muted-foreground text-center">
                Elige un apartamento del selector de arriba para ver su calendario de reservas.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
    </div>
  )
}
