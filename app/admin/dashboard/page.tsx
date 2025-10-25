"use client"

/**
 * "use client"
 *
 * COMENTARIO CLAVE: Esta directiva marca este módulo como un "Client Component"
 * en el framework Next.js (a partir de la versión 13, con App Router).
 *
 * Implicaciones:
 * 1. Ejecución en el Navegador (Client-Side): Este componente y cualquier
 * código que importe se ejecutará en el navegador del usuario, no en el
 * servidor.
 * 2. Uso de Hooks de React: Permite el uso de hooks de React que dependen del
 * estado y del ciclo de vida del navegador, como `useState`, `useEffect`,
 * y `useMemo` (los cuales se usan intensamente a continuación).
 * 3. Interactividad: Es esencial para componentes que manejan interactividad,
 * como clics de botones (`onClick`), navegación dinámica (`useRouter`),
 * manejo de formularios, y en este caso, un calendario interactivo con
 * cambio de fechas y selección de apartamentos.
 *
 * En resumen, Next.js por defecto usa "Server Components", pero este componente
 * requiere la interactividad del lado del cliente para funcionar como un calendario
 * de administración funcional.
 */

import { useEffect, useState, useMemo } from "react" // Hooks esenciales de React para manejar estado (`useState`), efectos secundarios y ciclo de vida (`useEffect`), y memorización de valores costosos (`useMemo`).
import { useRouter } from "next/navigation" // Hook de Next.js para la navegación programática (Client Component).
import {
  startOfMonth, // date-fns: Obtiene el primer día del mes.
  endOfMonth, // date-fns: Obtiene el último día del mes.
  eachDayOfInterval, // date-fns: Genera un array de fechas entre dos puntos.
  isWithinInterval, // date-fns: Comprueba si una fecha está dentro de un rango.
  format, // date-fns: Formatea fechas en un string legible.
  addMonths, // date-fns: Añade meses a una fecha.
  subMonths, // date-fns: Resta meses a una fecha.
  startOfWeek, // date-fns: Obtiene el primer día de la semana (Lunes o Domingo).
  endOfWeek, // date-fns: Obtiene el último día de la semana.
  isSameMonth, // date-fns: Comprueba si dos fechas están en el mismo mes.
  isSameDay, // date-fns: Comprueba si dos fechas son el mismo día.
  parseISO, // date-fns: Convierte un string ISO a objeto Date.
  addDays, // date-fns: Añade días a una fecha.
  startOfDay, // date-fns: Pone la hora de una fecha a las 00:00:00.
} from "date-fns"
import { es } from "date-fns/locale" // Configuración regional para español (es).
import { getAllIds } from "@/api/apartment" // Función API para obtener todos los IDs de apartamentos disponibles.
import { getDatesByApartmentId } from "@/api/booking" // Función API para obtener las fechas de reserva de un apartamento específico.
import type { DefaultDateRange } from "@/types/defaultDateRange" // Definición de tipo para el rango de fechas de reserva.

// Importaciones de Componentes de UI (utilizan Tailwind CSS y potencialmente Radix/shadcn-ui)
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton" // Componente para mostrar un estado de carga.
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Importaciones de iconos de Lucide
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
import { SiteHeaderAdmin } from "@/components/site-header-admin" // Componente para el encabezado de la página de administración.

// Definiciones de tipos para el estado y las props internas
type CalendarView = "month" | "week" // Tipo para la vista del calendario.
type ViewMode = "calendar" | "list" // Tipo para el modo de visualización.

interface BookingInfo {
  id: number // ID de la reserva.
  clientName: string // Nombre del cliente (simulado en el componente).
  status: string // Estado de la reserva.
  checkIn: string // Fecha de check-in (string ISO).
  checkOut: string // Fecha de check-out (string ISO).
  guests: number // Número de huéspedes.
}

interface DayInfo {
  date: Date // Objeto Date para el día.
  isCurrentMonth: boolean // Indica si el día pertenece al mes actual (útil para la vista mensual).
  isToday: boolean // Indica si el día es hoy.
  isBooked: boolean // Indica si el día tiene alguna reserva.
  bookings: BookingInfo[] // Array de reservas en ese día.
  status: "available" | "booked" | "checkout" | "checkin" // Estado de disponibilidad visual.
}

// -------------------------------------------
// Componente Principal
// -------------------------------------------

export default function AdminCalendarPage() {
  const router = useRouter() // Inicialización del hook de enrutamiento.

  // --- Estado del Componente ---
  const [apartmentIds, setApartmentIds] = useState<number[]>([]) // Lista de IDs de apartamentos disponibles.
  const [selectedApartmentId, setSelectedApartmentId] = useState<number | null>(null) // ID del apartamento seleccionado.
  const [dateRanges, setDateRanges] = useState<DefaultDateRange[]>([]) // Rangos de fechas de reserva para el apartamento seleccionado.
  const [currentDate, setCurrentDate] = useState(new Date()) // Fecha que sirve como referencia para el calendario (mes o semana actual).
  const [calendarView, setCalendarView] = useState<CalendarView>("month") // Vista actual: 'month' (mes) o 'week' (semana).
  const [viewMode, setViewMode] = useState<ViewMode>("calendar") // Modo de vista: 'calendar' (calendario) o 'list' (lista).
  const [loading, setLoading] = useState(false) // Estado de carga inicial (para IDs de apartamentos).
  const [error, setError] = useState<string | null>(null) // Almacena mensajes de error.
  const [refreshing, setRefreshing] = useState(false) // Estado de refresco de reservas.

  // --- useEffect: Cargar IDs de Apartamentos ---
  useEffect(() => {
    const fetchApartmentIds = async () => {
      try {
        setLoading(true)
        const ids = await getAllIds() // Llama a la API para obtener todos los IDs.
        setApartmentIds(ids)
        if (ids.length > 0) {
          setSelectedApartmentId(ids[0]) // Selecciona el primer apartamento por defecto.
        }
      } catch (err) {
        setError("Error al cargar los apartamentos")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchApartmentIds() // Ejecuta la carga al montar el componente.
  }, []) // El array vacío asegura que se ejecuta solo una vez al inicio.

  // --- useEffect: Cargar Rangos de Fechas (Reservas) ---
  useEffect(() => {
    const fetchDateRanges = async () => {
      if (selectedApartmentId !== null) {
        try {
          setRefreshing(true)
          setError(null)
          // Llama a la API para obtener las reservas del apartamento seleccionado.
          const ranges = await getDatesByApartmentId(selectedApartmentId)
          setDateRanges(ranges)
        } catch (err) {
          setError("Error al cargar las reservas")
          console.error(err)
        } finally {
          setRefreshing(false)
        }
      } else {
        setDateRanges([]) // Vacía las reservas si no hay apartamento seleccionado.
      }
    }

    fetchDateRanges()
  }, [selectedApartmentId]) // Se re-ejecuta cada vez que cambia el apartamento seleccionado.

  // --- useMemo: Calcular Días del Calendario ---
  const calendarDays = useMemo(() => {
    const start =
      calendarView === "month"
        ? startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }) // Inicio de la semana del inicio del mes (vista mensual).
        : startOfWeek(currentDate, { weekStartsOn: 1 }) // Inicio de la semana actual (vista semanal).

    const end =
      calendarView === "month"
        ? endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }) // Fin de la semana del fin del mes (vista mensual).
        : endOfWeek(currentDate, { weekStartsOn: 1 }) // Fin de la semana actual (vista semanal).

    // Genera un array de fechas desde `start` hasta `end`.
    return eachDayOfInterval({ start, end })
  }, [currentDate, calendarView]) // Se re-calcula si cambia la fecha de referencia o la vista.

  // --- useMemo: Procesar Información de Cada Día ---
  const daysInfo: DayInfo[] = useMemo(() => {
    return calendarDays.map((date) => {
      const isCurrentMonth = calendarView === "month" ? isSameMonth(date, currentDate) : true
      const isToday = isSameDay(date, new Date())

      // Filtra las reservas que afectan al día actual.
      const dayBookings = dateRanges.filter((range) => {
        const start = range.from ? parseISO(range.from) : null
        const end = range.to ? parseISO(range.to) : start
        if (!start || !end) return false
        // Comprueba si el día está dentro del rango de la reserva (incluyendo el check-out).
        return isWithinInterval(startOfDay(date), { start: startOfDay(start), end: startOfDay(end) })
      })

      const isBooked = dayBookings.length > 0

      // Determina el estado del día (available, booked, checkin, checkout).
      let status: DayInfo["status"] = "available"
      if (isBooked) {
        const hasCheckIn = dayBookings.some((range) => range.from && isSameDay(parseISO(range.from), date))
        const hasCheckOut = dayBookings.some((range) => range.to && isSameDay(parseISO(range.to), date))

        if (hasCheckIn && hasCheckOut) {
          status = "booked" // Podría ser un cambio de un huésped a otro.
        } else if (hasCheckIn) {
          status = "checkin"
        } else if (hasCheckOut) {
          status = "checkout"
        } else {
          status = "booked"
        }
      }

      // Simulación de información detallada de la reserva.
      const bookings: BookingInfo[] = dayBookings.map((range, index) => ({
        id: index + 1,
        clientName: `Cliente ${index + 1}`, // MOCK: Los nombres de cliente son simulados.
        status: "CONFIRMED", // MOCK
        checkIn: range.from || "",
        checkOut: range.to || "",
        guests: 2, // MOCK
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
  }, [calendarDays, currentDate, calendarView, dateRanges]) // Se re-calcula si cambian las fechas, la vista o las reservas.

  // --- useMemo: Calcular Estadísticas del Mes ---
  const stats = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    // Obtiene todos los días del mes actual de referencia.
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Cuenta cuántos días del mes tienen al menos una reserva.
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
      occupancyRate, // Tasa de ocupación en porcentaje.
    }
  }, [currentDate, dateRanges]) // Se re-calcula si cambian la fecha o las reservas.

  // --- Handlers y Funciones de Utilidad ---

  // Refresca manualmente la lista de reservas.
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

  // Navegación entre meses.
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1))
  }

  // Navegación entre semanas.
  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate(direction === "prev" ? addDays(currentDate, -7) : addDays(currentDate, 7))
  }

  // Genera las clases CSS para la celda de un día en el calendario.
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

    const monthClasses = !dayInfo.isCurrentMonth ? "opacity-40" : "" // Opacidad para días que no son del mes actual.
    const todayClasses = dayInfo.isToday ? "ring-2 ring-primary" : "" // Anillo para resaltar el día de hoy.

    return `${baseClasses} ${statusClasses} ${monthClasses} ${todayClasses}`
  }

  // Genera el componente Badge para el estado.
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

  // --- Renderizado Condicional: Estado de Carga Inicial ---
  if (loading) {
    return (
      // Muestra un esqueleto (Skeleton) mientras se cargan los IDs de apartamentos.
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

  // --- Renderizado Principal ---
  return (
    <div>
      <SiteHeaderAdmin /> {/* Encabezado de la interfaz de administración */}
      <TooltipProvider> {/* Proveedor para mostrar Tooltips (información al pasar el ratón) */}
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
              {/* Botón de actualizar que usa el estado `refreshing` para animar el icono y deshabilitarlo */}
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
                  {/* Selector de apartamento, actualiza `selectedApartmentId` */}
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

                {/* Botones de vista (Calendario/Lista) */}
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

          {/* Alerta de Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Contenido principal: Solo se muestra si hay un apartamento seleccionado */}
          {selectedApartmentId ? (
            <>
              {/* Statistics (Usa el `stats` calculado con useMemo) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* ... Tarjetas de estadísticas ... */}
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

              {/* Leyenda de Colores */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Leyenda</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    {/* Renderiza los badges de estado usando la función de utilidad */}
                    {getStatusBadge("available")}
                    {getStatusBadge("booked")}
                    {getStatusBadge("checkin")}
                    {getStatusBadge("checkout")}
                  </div>
                </CardContent>
              </Card>

              {/* Vista de Calendario/Lista (Tabs) */}
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
                <TabsContent value="calendar">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        {/* Título que muestra el mes o la semana actual */}
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
                          {/* Selector de vista (Mes/Semana) */}
                          <Select value={calendarView} onValueChange={(value: CalendarView) => setCalendarView(value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="month">Mes</SelectItem>
                              <SelectItem value="week">Semana</SelectItem>
                            </SelectContent>
                          </Select>
                          {/* Botones de navegación (anterior, hoy, siguiente) */}
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
                      {/* Cabecera de los días de la semana */}
                      <div className="grid grid-cols-7 mb-2">
                        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                          <div key={day} className="p-2 text-center font-semibold text-sm text-muted-foreground">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Grid del Calendario */}
                      <div className="grid grid-cols-7 gap-1">
                        {/* Mapea sobre `daysInfo` (calculado con useMemo) para renderizar cada día */}
                        {daysInfo.map((dayInfo, index) => (
                          <Tooltip key={index}>
                            <TooltipTrigger asChild>
                              {/* Aplica las clases de estilo según el estado del día */}
                              <div className={getDayClassName(dayInfo)}>
                                <div className="flex justify-between items-start">
                                  {/* Número del día */}
                                  <span className={`text-sm font-medium ${dayInfo.isToday ? "text-primary" : ""}`}>
                                    {format(dayInfo.date, "d")}
                                  </span>
                                  {/* Indicador visual de reserva */}
                                  {dayInfo.isBooked && <div className="w-2 h-2 rounded-full bg-red-500" />}
                                </div>
                                {/* Mostrar una vista previa de las reservas en la celda */}
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
                            {/* Contenido del Tooltip (detalles del día y reservas) */}
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
                  {/* Vista de Lista de Reservas */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Lista de Reservas</CardTitle>
                      <CardDescription>Reservas para el apartamento #{selectedApartmentId}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Renderizado condicional si no hay reservas */}
                      {dateRanges.length === 0 ? (
                        <div className="text-center py-12">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No hay reservas</h3>
                          <p className="text-muted-foreground">
                            Este apartamento no tiene reservas en el período seleccionado.
                          </p>
                        </div>
                      ) : (
                        // Muestra la lista de rangos de fechas de reserva
                        <div className="space-y-4">
                          {dateRanges.map((range, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="space-y-1">
                                <div className="font-medium">Reserva #{index + 1}</div>
                                <div className="text-sm text-muted-foreground">
                                  {/* Muestra las fechas de check-in y check-out formateadas */}
                                  {range.from && format(parseISO(range.from), "dd MMM yyyy", { locale: es })} -{" "}
                                  {range.to && format(parseISO(range.to), "dd MMM yyyy", { locale: es })}
                                </div>
                              </div>
                              <Badge variant="default">Confirmada</Badge> {/* Estado simulado */}
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
            // Mensaje para cuando no hay apartamento seleccionado (después de la carga inicial)
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