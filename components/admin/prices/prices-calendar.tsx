"use client"

import type React from "react"

import { useState, useMemo } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths,
  getDay,
  isToday,
} from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Calendar, Euro, Check, Loader2 } from "lucide-react"
import type { Price, UpdatePriceRequest } from "@/types/prices"
import { cn } from "@/lib/utils"

// Lista de apartamentos disponibles por tipo (en producción vendría de la API)
const APARTMENT_TYPES = [
  { ids: [1, 2, 3, 4], name: "Apartamento de un dormitorio" },
  { ids: [5, 6], name: "Apartamento de dos dormitorios" },
]

interface PricesCalendarProps {
  prices: Price[]
  loading: boolean
  selectedApartments: number[]
  onApartmentTypeChange: (apartmentIds: number[]) => void
  onMonthChange: (month: number, year: number) => void
  currentMonth: number
  currentYear: number
  onUpdatePrice: (date: string, price: number) => Promise<void>
  onCreatePrice: (date: string, price: number) => Promise<void>
  onDeletePrice: (date: string) => Promise<void>
  onBulkUpdatePrices: (prices: UpdatePriceRequest[]) => Promise<void>
}

export function PricesCalendar({
  prices,
  loading,
  selectedApartments,
  onApartmentTypeChange,
  onMonthChange,
  currentMonth,
  currentYear,
  onUpdatePrice,
  onCreatePrice,
  onDeletePrice,
  onBulkUpdatePrices,
}: PricesCalendarProps) {
  const [editingDay, setEditingDay] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>("")
  const [saving, setSaving] = useState(false)
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())
  const [bulkPrice, setBulkPrice] = useState<string>("")
  const [bulkSaving, setBulkSaving] = useState(false)

  // Encontrar el índice del tipo de apartamento seleccionado
  const selectedTypeIndex = useMemo(() => {
    if (selectedApartments.length === 0) return -1
    return APARTMENT_TYPES.findIndex(
      (type) =>
        type.ids.length === selectedApartments.length &&
        type.ids.every((id) => selectedApartments.includes(id))
    )
  }, [selectedApartments])

  const hasSelection = selectedApartments.length > 0

  const currentDate = new Date(currentYear, currentMonth - 1, 1)
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const startDayOfWeek = getDay(monthStart)
  const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1

  const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

  // Mapa de precios por fecha
  const pricesByDate = useMemo(() => {
    const map = new Map<string, number>()
    prices.forEach((price) => {
      map.set(price.date, price.price)
    })
    return map
  }, [prices])

  const handlePreviousMonth = () => {
    const newDate = subMonths(currentDate, 1)
    onMonthChange(newDate.getMonth() + 1, newDate.getFullYear())
  }

  const handleNextMonth = () => {
    const newDate = addMonths(currentDate, 1)
    onMonthChange(newDate.getMonth() + 1, newDate.getFullYear())
  }

  const handleToday = () => {
    const today = new Date()
    onMonthChange(today.getMonth() + 1, today.getFullYear())
  }

  const handleTypeChange = (typeIndex: string) => {
    const index = Number.parseInt(typeIndex)
    if (index >= 0 && index < APARTMENT_TYPES.length) {
      onApartmentTypeChange(APARTMENT_TYPES[index].ids)
    }
  }

  const handleDayClick = (day: Date) => {
    if (!hasSelection) return
    const dateKey = format(day, "yyyy-MM-dd")

    setSelectedDates((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(dateKey)) {
        newSet.delete(dateKey)
      } else {
        newSet.add(dateKey)
      }
      return newSet
    })
  }

  const clearSelection = () => {
    setSelectedDates(new Set())
    setBulkPrice("")
  }

  const selectAllDays = () => {
    const allDates = daysInMonth.map((day) => format(day, "yyyy-MM-dd"))
    setSelectedDates(new Set(allDates))
  }

  const handleBulkSave = async () => {
    // Validaciones básicas
    if (selectedDates.size === 0 || !bulkPrice || !hasSelection) return

    const priceValue = Number.parseFloat(bulkPrice)
    if (Number.isNaN(priceValue) || priceValue < 0) return

    setBulkSaving(true)
    try {
      // Crear updates para cada apartamento del tipo seleccionado y cada fecha
      const updates: UpdatePriceRequest[] = []
      
      for (const date of selectedDates) {
        for (const apartmentId of selectedApartments) {
          updates.push({
            date,
            price: priceValue,
            apartmentId,
          })
        }
      }

      // Llamamos al handler que procesará todos los updates
      await onBulkUpdatePrices(updates)

      // Limpiamos la selección después de guardar
      clearSelection()
    } catch (error) {
      console.error("Error saving bulk prices:", error)
    } finally {
      setBulkSaving(false)
    }
  }

  const handleSave = async () => {
    if (!editingDay || !hasSelection) return

    const priceValue = Number.parseFloat(editValue)
    if (Number.isNaN(priceValue) || priceValue < 0) {
      setEditingDay(null)
      return
    }

    setSaving(true)
    try {
      const existingPrice = pricesByDate.get(editingDay)
      if (existingPrice !== undefined) {
        await onUpdatePrice(editingDay, priceValue)
      } else {
        await onCreatePrice(editingDay, priceValue)
      }
    } catch (error) {
      console.error("Error saving price:", error)
    } finally {
      setSaving(false)
      setEditingDay(null)
      setEditValue("")
    }
  }

  const handleDelete = async () => {
    if (!editingDay || !hasSelection) return

    setSaving(true)
    try {
      await onDeletePrice(editingDay)
    } catch (error) {
      console.error("Error deleting price:", error)
    } finally {
      setSaving(false)
      setEditingDay(null)
      setEditValue("")
    }
  }

  const handleCancel = () => {
    setEditingDay(null)
    setEditValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      handleCancel()
    }
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
              {!hasSelection
                ? "Selecciona un tipo de apartamento para ver y editar precios"
                : `${selectedApartments.length} apartamento${selectedApartments.length !== 1 ? "s" : ""} · ${prices.length} precio${prices.length !== 1 ? "s" : ""} configurado${prices.length !== 1 ? "s" : ""}`}
            </CardDescription>
          </div>
          <Select
            value={selectedTypeIndex >= 0 ? selectedTypeIndex.toString() : ""}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Seleccionar tipo de apartamento" />
            </SelectTrigger>
            <SelectContent>
              {APARTMENT_TYPES.map((type, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {type.name} ({type.ids.length} aptos)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {/* Navegación del mes */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold capitalize">
              {format(currentDate, "MMMM yyyy", { locale: es })}
            </h2>
            <Button variant="ghost" size="sm" onClick={handleToday}>
              Hoy
            </Button>
          </div>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Mensaje si no hay tipo seleccionado */}
        {!hasSelection && (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Selecciona un tipo de apartamento</p>
            <p className="text-sm">
              Elige un tipo de apartamento del selector de arriba para ver y editar sus precios
            </p>
          </div>
        )}

        {/* Calendario */}
        {hasSelection && (
          <>
            <div className="mb-4 p-4 border rounded-lg bg-muted/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">
                    {selectedDates.size > 0
                      ? `${selectedDates.size} día${selectedDates.size !== 1 ? "s" : ""} seleccionado${selectedDates.size !== 1 ? "s" : ""}`
                      : "Haz clic en los días para seleccionarlos"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Selecciona varios días y asigna un precio común para los {selectedApartments.length} apartamentos
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={selectAllDays}>
                    Seleccionar todos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSelection}
                    disabled={selectedDates.size === 0}
                  >
                    Limpiar
                  </Button>
                </div>
              </div>

              {selectedDates.size > 0 && (
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-end gap-3">
                  <div className="flex-1 w-full sm:max-w-xs">
                    <label className="text-sm font-medium mb-1 block">
                      Precio para días seleccionados
                    </label>
                    <div className="relative">
                      <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={bulkPrice}
                        onChange={(e) => setBulkPrice(e.target.value)}
                        placeholder="0.00"
                        className="pl-9"
                        disabled={bulkSaving}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleBulkSave}
                    disabled={bulkSaving || !bulkPrice || selectedDates.size === 0}
                    className="w-full sm:w-auto"
                  >
                    {bulkSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Aplicar precio
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <div className="border rounded-lg overflow-hidden">
              {/* Cabecera de días de la semana */}
              <div className="grid grid-cols-7 bg-muted">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="p-3 text-center text-sm font-medium text-muted-foreground border-b"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Días del calendario */}
              <div className="grid grid-cols-7">
                {/* Celdas vacías antes del primer día */}
                {Array.from({ length: adjustedStartDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[100px] p-2 border-b border-r bg-muted/30" />
                ))}

                {/* Días del mes */}
                {daysInMonth.map((day, index) => {
                  const dateKey = format(day, "yyyy-MM-dd")
                  const price = pricesByDate.get(dateKey)
                  const isCurrentDay = isToday(day)
                  const isEditing = editingDay === dateKey
                  const isSelected = selectedDates.has(dateKey)
                  const isLastRow =
                    index + adjustedStartDay >=
                    Math.floor((daysInMonth.length + adjustedStartDay - 1) / 7) * 7

                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => !isEditing && handleDayClick(day)}
                      className={cn(
                        "min-h-[100px] p-2 border-r transition-colors",
                        !isLastRow && "border-b",
                        isCurrentDay && "bg-primary/5",
                        isSelected && "bg-primary/20 ring-2 ring-primary ring-inset",
                        !isEditing && "cursor-pointer hover:bg-muted/50"
                      )}
                    >
                      {/* Número del día */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={cn(
                            "text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                            isCurrentDay && "bg-primary text-primary-foreground"
                          )}
                        >
                          {format(day, "d")}
                        </span>
                        {isSelected && (
                          <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>

                      {/* Precio */}
                      {price !== undefined ? (
                        <div className="flex items-center justify-center bg-primary/10 rounded-md py-2 px-3">
                          <Euro className="h-4 w-4 text-primary mr-1" />
                          <span className="font-semibold text-primary">{price.toFixed(0)}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center text-muted-foreground/50 py-2 px-3 border border-dashed rounded-md">
                          <span className="text-xs">Sin precio</span>
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Celdas vacías al final */}
                {Array.from({
                  length: (7 - ((daysInMonth.length + adjustedStartDay) % 7)) % 7,
                }).map((_, i) => (
                  <div key={`empty-end-${i}`} className="min-h-[100px] p-2 border-r bg-muted/30" />
                ))}
              </div>
            </div>

            {/* Loading overlay */}
            {loading && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Leyenda */}
            <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span>Hoy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-12 rounded bg-primary/10 flex items-center justify-center">
                  <Euro className="h-3 w-3 text-primary" />
                </div>
                <span>Con precio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-12 rounded border border-dashed flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground/50">—</span>
                </div>
                <span>Sin precio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-12 rounded bg-primary/20 ring-2 ring-primary flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span>Seleccionado</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
