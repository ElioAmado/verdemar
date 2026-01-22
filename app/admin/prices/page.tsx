"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getPricesByMonth, createPrices, updatePrice, deletePrice, bulkUpdatePrices } from "@/api/prices"
import type { Price, CreatePriceRequest, PriceStats, UpdatePriceRequest } from "@/types/prices"
import { parseISO, startOfMonth, endOfMonth } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react"

import { StatsCards } from "@/components/admin/prices/stats-cards"
import { PricesCalendar } from "@/components/admin/prices/prices-calendar"
import { SiteHeaderAdmin } from "@/components/site-header-admin"

export default function AdminPricesPage() {
  const router = useRouter()
  const [prices, setPrices] = useState<Price[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Ahora almacenamos un array de IDs de apartamentos del tipo seleccionado
  const [selectedApartments, setSelectedApartments] = useState<number[]>([])
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())

  // Tomamos el primer apartamento del tipo para hacer las consultas de precios
  const primaryApartmentId = selectedApartments.length > 0 ? selectedApartments[0] : 0

  useEffect(() => {
    if (primaryApartmentId > 0) {
      fetchPrices()
    } else {
      setPrices([])
      setLoading(false)
    }
  }, [primaryApartmentId, currentMonth, currentYear])

  const fetchPrices = async () => {
    if (primaryApartmentId === 0) return
    try {
      setLoading(true)
      setError(null)
      // Usamos el primer apartamento del tipo para obtener los precios
      const data = await getPricesByMonth(primaryApartmentId, currentMonth, currentYear)
      setPrices(Array.isArray(data) ? data : [])
    } catch (err) {
      setError("Error al obtener los precios")
      setPrices([])
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    if (primaryApartmentId === 0) return
    setRefreshing(true)
    try {
      const data = await getPricesByMonth(primaryApartmentId, currentMonth, currentYear)
      setPrices(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      setError("Error al cargar los precios")
    } finally {
      setRefreshing(false)
    }
  }

  // Ahora recibe un array de IDs del tipo de apartamento
  const handleApartmentTypeChange = (apartmentIds: number[]) => {
    setSelectedApartments(apartmentIds)
  }

  const handleMonthChange = (month: number, year: number) => {
    setCurrentMonth(month)
    setCurrentYear(year)
  }

  const handleUpdatePrice = async (date: string, price: number) => {
    // Actualiza el precio para el primer apartamento (los precios son iguales por tipo)
    await updatePrice(primaryApartmentId, date, { price })
    await fetchPrices()
  }

  const handleCreatePrice = async (date: string, price: number) => {
    // Crear precios para TODOS los apartamentos del tipo seleccionado
    const requests: CreatePriceRequest[] = selectedApartments.map((apartmentId) => ({
      apartmentId,
      date,
      price,
    }))
    await createPrices(requests)
    await fetchPrices()
  }

  const handleDeletePrice = async (date: string) => {
    // Elimina el precio del primer apartamento
    await deletePrice(primaryApartmentId, date)
    await fetchPrices()
  }

  // Recibe updates para múltiples apartamentos y fechas
  const handleBulkUpdatePrices = async (priceUpdates: UpdatePriceRequest[]) => {
    await bulkUpdatePrices(priceUpdates)
    await fetchPrices()
  }

  const stats: PriceStats = useMemo(() => {
    const total = prices.length
    const priceValues = prices.map((p) => p.price)
    const averagePrice = total > 0 ? priceValues.reduce((sum, p) => sum + p, 0) / total : 0
    const highestPrice = total > 0 ? Math.max(...priceValues) : 0
    const lowestPrice = total > 0 ? Math.min(...priceValues) : 0
    const totalRevenuePotential = priceValues.reduce((sum, p) => sum + p, 0)
    const currentDate = new Date()
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const pricesThisMonth = prices.filter((p) => {
      const priceDate = parseISO(p.date)
      return priceDate >= monthStart && priceDate <= monthEnd
    }).length

    return {
      total,
      averagePrice,
      highestPrice,
      lowestPrice,
      totalRevenuePotential,
      uniqueApartments: selectedApartments.length,
      pricesThisMonth,
    }
  }, [prices, selectedApartments])

  if (loading && primaryApartmentId > 0 && prices.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && prices.length === 0 && primaryApartmentId > 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchPrices} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeaderAdmin />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestion de Precios</h1>
            <p className="text-muted-foreground">Administra los precios diarios de los apartamentos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/admin")} className="bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={refreshing || primaryApartmentId === 0}
              className="bg-transparent"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {selectedApartments.length > 0 && <StatsCards stats={stats} />}

        <PricesCalendar
          prices={prices}
          loading={loading}
          selectedApartments={selectedApartments}
          onApartmentTypeChange={handleApartmentTypeChange}
          onMonthChange={handleMonthChange}
          currentMonth={currentMonth}
          currentYear={currentYear}
          onUpdatePrice={handleUpdatePrice}
          onCreatePrice={handleCreatePrice}
          onDeletePrice={handleDeletePrice}
          onBulkUpdatePrices={handleBulkUpdatePrices}
        />
      </div>
    </div>
  )
}
