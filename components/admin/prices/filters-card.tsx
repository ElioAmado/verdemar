"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download } from "lucide-react"

interface FiltersCardProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  apartmentFilter: string
  onApartmentFilterChange: (value: string) => void
  dateFilter: string
  onDateFilterChange: (value: string) => void
  uniqueApartments: { id: number; name: string }[]
  onExport: () => void
}

export function FiltersCard({
  searchTerm,
  onSearchChange,
  apartmentFilter,
  onApartmentFilterChange,
  dateFilter,
  onDateFilterChange,
  uniqueApartments,
  onExport,
}: FiltersCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros y Búsqueda
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ID, apartamento, fecha..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Apartamento</label>
            <Select value={apartmentFilter} onValueChange={onApartmentFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todos los apartamentos" />
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

          <div className="space-y-2">
            <label className="text-sm font-medium">Fechas</label>
            <Select value={dateFilter} onValueChange={onDateFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Todas las fechas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las fechas</SelectItem>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="this-week">Esta semana</SelectItem>
                <SelectItem value="this-month">Este mes</SelectItem>
                <SelectItem value="next-month">Próximo mes</SelectItem>
                <SelectItem value="future">Futuras</SelectItem>
                <SelectItem value="past">Pasadas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Acciones</label>
            <Button onClick={onExport} variant="outline" className="w-full bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
