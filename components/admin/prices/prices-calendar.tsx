"use client"

import { useState, useMemo } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
  getDay,
  isToday,
  parseISO,
} from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, Calendar, Euro, Edit, Trash2, MoreHorizontal } from "lucide-react"
import type { Price } from "@/types/prices"
import { cn } from "@/lib/utils"

interface PricesCalendarProps {
  prices: Price[]
  loading: boolean
  uniqueApartments: { id: number; name: string }[]
  onEdit: (price: Price) => void
  onDelete: (price: Price) => void
}

export function PricesCalendar({ prices, loading, uniqueApartments, onEdit, onDelete }: PricesCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedApartment, setSelectedApartment] = useState<string>("all")

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  const startDayOfWeek = getDay(monthStart)
  // Adjust for Monday start (0 = Monday, 6 = Sunday)
  const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1

  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

  // Filter prices by selected apartment and current month
  const filteredPrices = useMemo(() => {
    return prices.filter((price) => {
      const priceDate = parseISO(price.date)
      const matchesMonth = isSameMonth(priceDate, currentDate)
      const matchesApartment = selectedApartment === "all" || price.apartment?.id?.toString() === selectedApartment
      return matchesMonth && matchesApartment
    })
  }, [prices, currentDate, selectedApartment])

  // Group prices by date
  const pricesByDate = useMemo(() => {
    const grouped = new Map<string, Price[]>()
    filteredPrices.forEach((price) => {
      const dateKey = price.date
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, [])
      }
      grouped.get(dateKey)!.push(price)
    })
    return grouped
  }, [filteredPrices])

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const getPricesForDay = (day: Date): Price[] => {
    const dateKey = format(day, "yyyy-MM-dd")
    return pricesByDate.get(dateKey) || []
  }

  const getDayStats = (dayPrices: Price[]) => {
    if (dayPrices.length === 0) return null
    const total = dayPrices.reduce((sum, p) => sum + p.price, 0)
    const avg = total / dayPrices.length
    const min = Math.min(...dayPrices.map((p) => p.price))
    const max = Math.max(...dayPrices.map((p) => p.price))
    return { total, avg, min, max, count: dayPrices.length }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendario de Precios
            </CardTitle>
            <CardDescription>
              {filteredPrices.length} precio{filteredPrices.length !== 1 ? "s" : ""} en{" "}
              {format(currentDate, "MMMM yyyy", { locale: es })}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedApartment} onValueChange={setSelectedApartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar apartamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los apartamentos</SelectItem>
                {uniqueApartments.map((apt) => (
                  <SelectItem key={apt.id} value={apt.id.toString()}>
                    {apt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold capitalize">{format(currentDate, "MMMM yyyy", { locale: es })}</h2>
            <Button variant="ghost" size="sm" onClick={handleToday}>
              Hoy
            </Button>
          </div>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="border rounded-lg overflow-hidden">
          {/* Week day headers */}
          <div className="grid grid-cols-7 bg-muted">
            {weekDays.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground border-b">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {/* Empty cells for days before the first day of the month */}
            {Array.from({ length: adjustedStartDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[120px] p-2 border-b border-r bg-muted/30" />
            ))}

            {/* Days of the month */}
            {daysInMonth.map((day, index) => {
              const dayPrices = getPricesForDay(day)
              const stats = getDayStats(dayPrices)
              const isCurrentDay = isToday(day)
              const isLastRow =
                index + adjustedStartDay >= Math.floor((daysInMonth.length + adjustedStartDay - 1) / 7) * 7

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-h-[120px] p-2 border-r transition-colors",
                    !isLastRow && "border-b",
                    isCurrentDay && "bg-primary/5",
                    dayPrices.length > 0 && "hover:bg-muted/50",
                  )}
                >
                  {/* Day number */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                        isCurrentDay && "bg-primary text-primary-foreground",
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {dayPrices.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {dayPrices.length} precio{dayPrices.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>

                  {/* Prices for the day */}
                  {dayPrices.length > 0 && (
                    <div className="space-y-1">
                      {dayPrices.slice(0, 2).map((price) => (
                        <div
                          key={`${price.apartment?.id}-${price.date}`}
                          className="group flex items-center justify-between text-xs bg-background rounded px-1.5 py-1 border"
                        >
                          <div className="flex items-center gap-1 min-w-0">
                            <span className="text-muted-foreground truncate">Apt {price.apartment?.id}</span>
                            <span className="font-semibold flex items-center">
                              <Euro className="h-3 w-3" />
                              {price.price.toFixed(0)}
                            </span>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => onEdit(price)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => onDelete(price)} className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                      {dayPrices.length > 2 && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full h-auto py-0.5 text-xs text-muted-foreground hover:text-foreground"
                            >
                              +{dayPrices.length - 2} más
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuLabel>
                              Todos los precios - {format(day, "d MMM", { locale: es })}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {dayPrices.map((price) => (
                              <DropdownMenuItem
                                key={`${price.apartment?.id}-${price.date}`}
                                className="flex items-center justify-between"
                              >
                                <span>Apt {price.apartment?.id}</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">€{price.price.toFixed(2)}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onEdit(price)
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  )}

                  {/* Stats summary for days with multiple prices */}
                  {stats && stats.count > 1 && selectedApartment === "all" && (
                    <div className="mt-1 pt-1 border-t text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span>Promedio:</span>
                        <span className="font-medium">€{stats.avg.toFixed(0)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Empty cells to fill the last row */}
            {Array.from({
              length: (7 - ((daysInMonth.length + adjustedStartDay) % 7)) % 7,
            }).map((_, i) => (
              <div key={`empty-end-${i}`} className="min-h-[120px] p-2 border-r bg-muted/30" />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span>Hoy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded border bg-background" />
            <span>Con precio</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
