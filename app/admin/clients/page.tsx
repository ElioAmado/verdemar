"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getAllPrices, createPrices, updatePrice, deletePrice } from "@/api/prices"
import type { Price, CreatePriceRequest, PriceStats, SortField, SortDirection } from "@/types/prices"
import { format, parseISO, startOfMonth, endOfMonth, addMonths } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Plus, RefreshCw, AlertCircle } from "lucide-react"

import { StatsCards } from "@/components/admin/prices/stats-cards"
import { FiltersCard } from "@/components/admin/prices/filters-card"
import { BulkAddCard } from "@/components/admin/prices/bulk-add-card"
import { PricesTable } from "@/components/admin/prices/prices-table"
import { EditDialog } from "@/components/admin/prices/edit-dialog"
import { DeleteDialog } from "@/components/admin/prices/delete-dialog"

export default function AdminPricesPage() {
  const router = useRouter()
  const [prices, setPrices] = useState<Price[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [apartmentFilter, setApartmentFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [refreshing, setRefreshing] = useState(false)

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [priceToDelete, setPriceToDelete] = useState<Price | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [priceToEdit, setPriceToEdit] = useState<Price | null>(null)
  const [editPrice, setEditPrice] = useState<string>("")
  const [editApartmentId, setEditApartmentId] = useState<string>("")
  const [editDate, setEditDate] = useState<string>("")
  const [saving, setSaving] = useState(false)

  // Bulk add state
  const [showDaySelector, setShowDaySelector] = useState(false)
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
  const [priceForDays, setPriceForDays] = useState<string>("")
  const [apartmentIdForDays, setApartmentIdForDays] = useState<string>("")
  const [bulkSaving, setBulkSaving] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [pageInput, setPageInput] = useState("1")
  const [hasMorePages, setHasMorePages] = useState(true)

  useEffect(() => {
    fetchPrices()
  }, [currentPage, pageSize, sortField, sortDirection])

  const fetchPrices = async () => {
    try {
      setLoading(true)
      setError(null)
      const sortParam = `${sortField === "apartment.id" ? "apartmentId" : sortField},${sortDirection}`
      const data = await getAllPrices({ page: currentPage, size: pageSize, sort: sortParam })
      setPrices(data)
      setHasMorePages(data.length === pageSize)
    } catch (err) {
      setError("Error al obtener los precios")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const sortParam = `${sortField === "apartment.id" ? "apartmentId" : sortField},${sortDirection}`
      const data = await getAllPrices({ page: currentPage, size: pageSize, sort: sortParam })
      setPrices(data)
      setHasMorePages(data.length === pageSize)
    } catch (err) {
      setError("Error al cargar los precios")
    } finally {
      setRefreshing(false)
    }
  }

  const uniqueApartments = useMemo(() => {
    const apartments = new Map<number, string>()
    prices.forEach((price) => {
      if (price.apartment?.id && !apartments.has(price.apartment.id)) {
        apartments.set(price.apartment.id, `Apartamento ${price.apartment.id}`)
      }
    })
    return Array.from(apartments.entries()).map(([id, name]) => ({ id, name }))
  }, [prices])

  const stats: PriceStats = useMemo(() => {
    const total = prices.length
    const priceValues = prices.map((p) => p.price)
    const averagePrice = total > 0 ? priceValues.reduce((sum, p) => sum + p, 0) / total : 0
    const highestPrice = total > 0 ? Math.max(...priceValues) : 0
    const lowestPrice = total > 0 ? Math.min(...priceValues) : 0
    const totalRevenuePotential = priceValues.reduce((sum, p) => sum + p, 0)
    const uniqueApartmentsCount = new Set(prices.map((p) => p.apartment?.id)).size
    const currentMonth = new Date()
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
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
      uniqueApartments: uniqueApartmentsCount,
      pricesThisMonth,
    }
  }, [prices])

  const filteredAndSortedPrices = useMemo(() => {
    let filtered = prices

    if (searchTerm) {
      filtered = filtered.filter(
        (price) =>
          price.apartment?.id?.toString().includes(searchTerm) ||
          price.date.includes(searchTerm) ||
          price.price.toString().includes(searchTerm),
      )
    }

    if (apartmentFilter !== "all") {
      filtered = filtered.filter((price) => price.apartment?.id?.toString() === apartmentFilter)
    }

    if (dateFilter !== "all") {
      const today = new Date()
      filtered = filtered.filter((price) => {
        const priceDate = parseISO(price.date)
        switch (dateFilter) {
          case "today":
            return format(priceDate, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")
          case "this-week":
            const weekStart = new Date(today)
            weekStart.setDate(today.getDate() - today.getDay())
            const weekEnd = new Date(weekStart)
            weekEnd.setDate(weekStart.getDate() + 6)
            return priceDate >= weekStart && priceDate <= weekEnd
          case "this-month":
            return priceDate >= startOfMonth(today) && priceDate <= endOfMonth(today)
          case "next-month":
            const nextMonth = addMonths(today, 1)
            return priceDate >= startOfMonth(nextMonth) && priceDate <= endOfMonth(nextMonth)
          case "past":
            return priceDate < today
          case "future":
            return priceDate > today
          default:
            return true
        }
      })
    }

    return filtered
  }, [prices, searchTerm, apartmentFilter, dateFilter])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
    setCurrentPage(0)
    setPageInput("1")
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setPageInput((page + 1).toString())
  }

  const handlePageInputChange = (value: string) => {
    setPageInput(value)
  }

  const handlePageInputSubmit = () => {
    const pageNumber = Number.parseInt(pageInput)
    if (!Number.isNaN(pageNumber) && pageNumber > 0) {
      setCurrentPage(pageNumber - 1)
    } else {
      setPageInput((currentPage + 1).toString())
    }
  }

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number.parseInt(value))
    setCurrentPage(0)
    setPageInput("1")
  }

  const handleEditClick = (price: Price) => {
    setPriceToEdit(price)
    setEditPrice(price.price.toString())
    setEditApartmentId(price.apartment?.id?.toString() || "")
    setEditDate(price.date)
    setEditDialogOpen(true)
  }

  const handleEditSave = async () => {
    if (!priceToEdit || !editPrice || !editApartmentId || !editDate) return
    try {
      setSaving(true)
      const originalApartmentId = priceToEdit.apartment?.id
      const originalDate = priceToEdit.date
      if (!originalApartmentId) throw new Error("Invalid original price data")
      await updatePrice(originalApartmentId, originalDate, { price: Number.parseFloat(editPrice) })
      await fetchPrices()
      setEditDialogOpen(false)
      setPriceToEdit(null)
    } catch (err) {
      console.error("Error al actualizar precio:", err)
      alert("Error al actualizar el precio")
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteClick = (price: Price) => {
    setPriceToDelete(price)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!priceToDelete?.apartment?.id || !priceToDelete.date) return
    try {
      setDeleting(true)
      await deletePrice(priceToDelete.apartment.id, priceToDelete.date)
      await fetchPrices()
      setDeleteDialogOpen(false)
      setPriceToDelete(null)
    } catch (err) {
      console.error("Error al eliminar precio:", err)
      alert("Error al eliminar el precio")
    } finally {
      setDeleting(false)
    }
  }

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b),
    )
  }

  const selectAllDays = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate()
    setSelectedDays(Array.from({ length: daysInMonth }, (_, i) => i + 1))
  }

  const clearAllDays = () => {
    setSelectedDays([])
  }

  const handleSavePrices = async () => {
    if (selectedDays.length === 0 || !priceForDays || !apartmentIdForDays) {
      alert("Por favor completa todos los campos")
      return
    }
    try {
      setBulkSaving(true)
      const requests: CreatePriceRequest[] = selectedDays.map((day) => ({
        apartmentId: Number.parseInt(apartmentIdForDays),
        date: `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        price: Number.parseFloat(priceForDays),
      }))
      await createPrices(requests)
      await fetchPrices()
      setShowDaySelector(false)
      setSelectedDays([])
      setPriceForDays("")
      setApartmentIdForDays("")
    } catch (err) {
      console.error("Error al guardar precios:", err)
      alert("Error al guardar los precios")
    } finally {
      setBulkSaving(false)
    }
  }

  const exportToCSV = () => {
    const headers = ["Apartamento ID", "Fecha", "Precio"]
    const csvData = prices.map((price) => [price.apartment?.id || "", price.date, price.price])
    const csvContent = [headers, ...csvData].map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `precios-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
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

  if (error) {
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
            <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Actualizar
            </Button>
            <Button onClick={() => setShowDaySelector(!showDaySelector)}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir
            </Button>
          </div>
        </div>

        <StatsCards stats={stats} />

        <FiltersCard
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          apartmentFilter={apartmentFilter}
          onApartmentFilterChange={setApartmentFilter}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          uniqueApartments={uniqueApartments}
          onExport={exportToCSV}
        />

        {showDaySelector && (
          <BulkAddCard
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            selectedDays={selectedDays}
            onToggleDay={toggleDay}
            onSelectAllDays={selectAllDays}
            onClearAllDays={clearAllDays}
            priceForDays={priceForDays}
            onPriceChange={setPriceForDays}
            apartmentIdForDays={apartmentIdForDays}
            onApartmentIdChange={setApartmentIdForDays}
            onSave={handleSavePrices}
            onClose={() => setShowDaySelector(false)}
            saving={bulkSaving}
          />
        )}

        <PricesTable
          prices={filteredAndSortedPrices}
          filteredCount={filteredAndSortedPrices.length}
          currentPage={currentPage}
          pageSize={pageSize}
          pageInput={pageInput}
          hasMorePages={hasMorePages}
          loading={loading}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
          onPageChange={handlePageChange}
          onPageInputChange={handlePageInputChange}
          onPageInputSubmit={handlePageInputSubmit}
          onPageSizeChange={handlePageSizeChange}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        <EditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          editPrice={editPrice}
          onPriceChange={setEditPrice}
          editApartmentId={editApartmentId}
          onApartmentIdChange={setEditApartmentId}
          editDate={editDate}
          onDateChange={setEditDate}
          onSave={handleEditSave}
          saving={saving}
        />

        <DeleteDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          priceToDelete={priceToDelete}
          onConfirm={handleDeleteConfirm}
          deleting={deleting}
        />
      </div>
    </div>
  )
}
