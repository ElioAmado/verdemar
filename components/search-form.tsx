"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import type { SearchFormData } from "@/types/availability"

interface SearchFormProps {
  initialData: SearchFormData
  onClose: () => void
}

export function SearchForm({ initialData, onClose }: SearchFormProps) {
  const router = useRouter()
  const [searchForm, setSearchForm] = useState<SearchFormData>(initialData)
  const [searchLoading, setSearchLoading] = useState(false)

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
    onClose()
    setSearchLoading(false)
  }

  return (
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
              <Select value={searchForm.adults} onValueChange={(value) => handleSearchFormChange("adults", value)}>
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
              <Select value={searchForm.children} onValueChange={(value) => handleSearchFormChange("children", value)}>
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
