"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, X, Check, RefreshCw } from "lucide-react"

interface BulkAddCardProps {
  selectedYear: number
  onYearChange: (year: number) => void
  selectedMonth: number
  onMonthChange: (month: number) => void
  selectedDays: number[]
  onToggleDay: (day: number) => void
  onSelectAllDays: () => void
  onClearAllDays: () => void
  priceForDays: string
  onPriceChange: (price: string) => void
  apartmentIdForDays: string
  onApartmentIdChange: (id: string) => void
  onSave: () => void
  onClose: () => void
  saving: boolean
}

export function BulkAddCard({
  selectedYear,
  onYearChange,
  selectedMonth,
  onMonthChange,
  selectedDays,
  onToggleDay,
  onSelectAllDays,
  onClearAllDays,
  priceForDays,
  onPriceChange,
  apartmentIdForDays,
  onApartmentIdChange,
  onSave,
  onClose,
  saving,
}: BulkAddCardProps) {
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate()

  return (
    <Card className="border-primary">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Añadir Precios para Múltiples Días
            </CardTitle>
            <CardDescription>Selecciona los días y asigna un precio</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bulk-apartment">Apartamento ID</Label>
            <Input
              id="bulk-apartment"
              type="number"
              placeholder="1"
              value={apartmentIdForDays}
              onChange={(e) => onApartmentIdChange(e.target.value)}
              min={1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bulk-year">Año</Label>
            <Input
              id="bulk-year"
              type="number"
              value={selectedYear}
              onChange={(e) => onYearChange(Number.parseInt(e.target.value) || new Date().getFullYear())}
              min={2024}
              max={2030}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bulk-month">Mes</Label>
            <Select value={selectedMonth.toString()} onValueChange={(v) => onMonthChange(Number.parseInt(v))}>
              <SelectTrigger id="bulk-month">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Enero</SelectItem>
                <SelectItem value="2">Febrero</SelectItem>
                <SelectItem value="3">Marzo</SelectItem>
                <SelectItem value="4">Abril</SelectItem>
                <SelectItem value="5">Mayo</SelectItem>
                <SelectItem value="6">Junio</SelectItem>
                <SelectItem value="7">Julio</SelectItem>
                <SelectItem value="8">Agosto</SelectItem>
                <SelectItem value="9">Septiembre</SelectItem>
                <SelectItem value="10">Octubre</SelectItem>
                <SelectItem value="11">Noviembre</SelectItem>
                <SelectItem value="12">Diciembre</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bulk-price">Precio (€)</Label>
            <Input
              id="bulk-price"
              type="number"
              placeholder="0.00"
              value={priceForDays}
              onChange={(e) => onPriceChange(e.target.value)}
              min={0}
              step={0.01}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onSelectAllDays}>
            <Check className="h-4 w-4 mr-2" />
            Seleccionar todos
          </Button>
          <Button variant="outline" size="sm" onClick={onClearAllDays}>
            <X className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
          <div className="ml-auto text-sm text-muted-foreground flex items-center">
            {selectedDays.length} día{selectedDays.length !== 1 ? "s" : ""} seleccionado
            {selectedDays.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
            <Button
              key={day}
              variant={selectedDays.includes(day) ? "default" : "outline"}
              className="h-12 w-full"
              onClick={() => onToggleDay(day)}
            >
              {day}
            </Button>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            disabled={selectedDays.length === 0 || !priceForDays || !apartmentIdForDays || saving}
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Guardar Precios
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
