"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getPricesByMonth, createPrices, updatePrice, deletePrice } from "@/api/prices"
import type { Price, CreatePriceRequest, PriceStats } from "@/types/prices"
import { parseISO, startOfMonth, endOfMonth } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react"

import { StatsCards } from "@/components/admin/prices/stats-cards"
import { PricesCalendar } from "@/components/admin/prices/prices-calendar"

export default function AdminPricesPage() {
  const router = useRouter()
  const [prices, setPrices] = useState<Price[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const [selectedApartment, setSelectedApartment] = useState<number>(0)
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())

  useEffect(() => {
    if (selectedApartment > 0) {
      fetchPrices()
    } else {
      setPrices([])
      setLoading(false)
    }
  }, [selectedApartment, currentMonth, currentYear])

  const fetchPrices = async () => {
    if (selectedApartment === 0) return
    try {
      setLoading(true)
      setError(null)
      const data = await getPricesByMonth(selectedApartment, currentMonth, currentYear)
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
    if (selectedApartment === 0) return
    setRefreshing(true)
    try {
      const data = await getPricesByMonth(selectedApartment, currentMonth, currentYear)
      setPrices(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      setError("Error al cargar los precios")
    } finally {
      setRefreshing(false)
    }
  }

  const handleApartmentChange = (apartmentId: number) => {
    setSelectedApartment(apartmentId)
  }

  const handleMonthChange = (month: number, year: number) => {
    setCurrentMonth(month)
    setCurrentYear(year)
  }

  const handleUpdatePrice = async (date: string, price: number) => {
    await updatePrice(selectedApartment, date, { price })
    await fetchPrices()
  }

  const handleCreatePrice = async (date: string, price: number) => {
    const request: CreatePriceRequest[] = [
      {
        apartmentId: selectedApartment,
        date,
        price,
      },
    ]
    await createPrices(request)
    await fetchPrices()
  }

  const handleDeletePrice = async (date: string) => {
    await deletePrice(selectedApartment, date)
    await fetchPrices()
  }

  const handleBulkUpdatePrices = async (dates: string[], price: number) => {
    const requests: CreatePriceRequest[] = dates.map((date) => ({
      apartmentId: selectedApartment,
      date,
      price,
    }))
    await createPrices(requests)
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
      uniqueApartments: selectedApartment > 0 ? 1 : 0,
      pricesThisMonth,
    }
  }, [prices, selectedApartment])

  if (loading && selectedApartment > 0 && prices.length === 0) {
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

  if (error && prices.length === 0 && selectedApartment > 0) {
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
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Precios</h1>
            <p className="text-muted-foreground">Administra los precios diarios de los apartamentos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Button onClick={handleRefresh} variant="outline" disabled={refreshing || selectedApartment === 0}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {selectedApartment > 0 && <StatsCards stats={stats} />}

        <PricesCalendar
          prices={prices}
          loading={loading}
          selectedApartment={selectedApartment}
          onApartmentChange={handleApartmentChange}
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
