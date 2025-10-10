"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { getAllPrices } from "@/api/prices"
import { Price } from "@/types/prices"
import { format, parseISO, startOfMonth, endOfMonth, addMonths } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Search,
    Filter,
    Plus,
    ArrowLeft,
    MoreHorizontal,
    Edit,
    Trash2,
    Calendar,
    Euro,
    Building,
    Download,
    RefreshCw,
    AlertCircle,
    TrendingUp,
    DollarSign,
    CalendarDays,
} from "lucide-react"

type SortField = "id" | "date" | "price" | "apartment.id"
type SortDirection = "asc" | "desc"

interface PriceStats {
    total: number
    averagePrice: number
    highestPrice: number
    lowestPrice: number
    totalRevenuePotential: number
    uniqueApartments: number
    pricesThisMonth: number
}

export default function AdminPricesPage() {
    const router = useRouter()
    const [prices, setPrices] = useState<Price[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [apartmentFilter, setApartmentFilter] = useState<string>("all")
    const [dateFilter, setDateFilter] = useState<string>("all")
    const [priceRangeFilter, setPriceRangeFilter] = useState<string>("all")
    const [sortField, setSortField] = useState<SortField>("date")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [priceToDelete, setPriceToDelete] = useState<Price | null>(null)
    const [refreshing, setRefreshing] = useState(false)

    useEffect(() => {
        fetchPrices()
    }, [])

    const fetchPrices = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getAllPrices()
            setPrices(data)
        } catch (err) {
            setError("Error al obtener los precios")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true)
        await fetchPrices()
        setRefreshing(false)
    }

    // Get unique apartments for filter
    const uniqueApartments = useMemo(() => {
        const apartments = new Map<number, string>()
        prices.forEach((price) => {
            if (price.apartment?.id && !apartments.has(price.apartment.id)) {
                apartments.set(price.apartment.id, price.apartment?.name || `Apartamento ${price.apartment.id}`)
            }
        })
        return Array.from(apartments.entries()).map(([id, name]) => ({ id, name }))
    }, [prices])

    // Calculate statistics
    const stats: PriceStats = useMemo(() => {
        const total = prices.length
        const priceValues = prices.map((p) => p.price)
        const averagePrice = total > 0 ? priceValues.reduce((sum, p) => sum + p, 0) / total : 0
        const highestPrice = total > 0 ? Math.max(...priceValues) : 0
        const lowestPrice = total > 0 ? Math.min(...priceValues) : 0
        const totalRevenuePotential = priceValues.reduce((sum, p) => sum + p, 0)
        const uniqueApartments = new Set(prices.map((p) => p.apartment?.id)).size

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
            uniqueApartments,
            pricesThisMonth,
        }
    }, [prices])

    // Filter and sort prices
    const filteredAndSortedPrices = useMemo(() => {
        let filtered = prices

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (price) =>
                    price.apartment?.id?.toString().includes(searchTerm) ||
                    price.apartment?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    price.date.includes(searchTerm) ||
                    price.price.toString().includes(searchTerm),
            )
        }

        // Apartment filter
        if (apartmentFilter !== "all") {
            filtered = filtered.filter((price) => price.apartment?.id?.toString() === apartmentFilter)
        }

        // Date filter
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

        // Price range filter
        if (priceRangeFilter !== "all") {
            filtered = filtered.filter((price) => {
                switch (priceRangeFilter) {
                    case "low":
                        return price.price < 100
                    case "medium":
                        return price.price >= 100 && price.price < 200
                    case "high":
                        return price.price >= 200 && price.price < 300
                    case "premium":
                        return price.price >= 300
                    default:
                        return true
                }
            })
        }

        // Sort
        return filtered.sort((a, b) => {
            let aValue: any
            let bValue: any

            switch (sortField) {
                case "date":
                    aValue = new Date(a.date)
                    bValue = new Date(b.date)
                    break
                case "price":
                    aValue = a.price
                    bValue = b.price
                    break
                case "apartment.id":
                    aValue = a.apartment?.id || 0
                    bValue = b.apartment?.id || 0
                    break
                default:
                    return 0
            }

            if (sortDirection === "asc") {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
            }
        })
    }, [prices, searchTerm, apartmentFilter, dateFilter, priceRangeFilter, sortField, sortDirection])

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const handleDeleteClick = (price: Price) => {
        setPriceToDelete(price)
        setDeleteDialogOpen(true)
    }

    // const handleDeleteConfirm = async () => {
    //     if (!priceToDelete?.id) return

    //     try {
    //         await deletePrice(priceToDelete.id)
    //         setPrices((prev) => prev.filter((p) => p.id !== priceToDelete.id))
    //         setDeleteDialogOpen(false)
    //         setPriceToDelete(null)
    //     } catch (err) {
    //         console.error("Error al eliminar precio:", err)
    //         alert("❌ Error al eliminar el precio.")
    //     }
    // }

    const getPriceBadge = (price: number) => {
        if (price < 100) {
            return <Badge variant="secondary">Económico</Badge>
        } else if (price < 200) {
            return <Badge variant="default">Estándar</Badge>
        } else if (price < 300) {
            return <Badge variant="outline">Alto</Badge>
        } else {
            return <Badge className="bg-amber-500 text-white">Premium</Badge>
        }
    }

    const exportToCSV = () => {
        const headers = ["ID", "Apartamento", "Fecha", "Precio", "Creado", "Actualizado"]
        const csvData = filteredAndSortedPrices.map((price) => [
            price.apartment?.name || `ID: ${price.apartment?.id}`,
            price.date,
            price.price,
        ])

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
                            Volver al panel
                        </Button>
                        <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                            Actualizar
                        </Button>
                        <Button onClick={() => router.push("/admin/prices/create")}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo precio
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Precios</CardTitle>
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">{stats.pricesThisMonth} este mes</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Precio Promedio</CardTitle>
                            <Euro className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">€{stats.averagePrice.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">{stats.uniqueApartments} apartamentos</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Precio Más Alto</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">€{stats.highestPrice.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">Más bajo: €{stats.lowestPrice.toFixed(2)}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ingresos Potenciales</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">€{stats.totalRevenuePotential.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">Total configurado</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filtros y Búsqueda
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Buscar</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="ID, apartamento, fecha..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Apartamento</label>
                                <Select value={apartmentFilter} onValueChange={setApartmentFilter}>
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
                                <Select value={dateFilter} onValueChange={setDateFilter}>
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
                                <label className="text-sm font-medium">Rango de Precio</label>
                                <Select value={priceRangeFilter} onValueChange={setPriceRangeFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos los precios" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos los precios</SelectItem>
                                        <SelectItem value="low">Económico (&lt;€100)</SelectItem>
                                        <SelectItem value="medium">Estándar (€100-€200)</SelectItem>
                                        <SelectItem value="high">Alto (€200-€300)</SelectItem>
                                        <SelectItem value="premium">Premium (€300+)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Acciones</label>
                                <Button onClick={exportToCSV} variant="outline" className="w-full bg-transparent">
                                    <Download className="h-4 w-4 mr-2" />
                                    Exportar CSV
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Precios</CardTitle>
                                <CardDescription>
                                    {filteredAndSortedPrices.length} de {prices.length} precios
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredAndSortedPrices.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No se encontraron precios</h3>
                                <p className="text-muted-foreground">No hay precios que coincidan con los filtros seleccionados.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("id")}>
                                                ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
                                            </TableHead>
                                            <TableHead
                                                className="cursor-pointer hover:bg-muted/50"
                                                onClick={() => handleSort("apartment.id")}
                                            >
                                                Apartamento {sortField === "apartment.id" && (sortDirection === "asc" ? "↑" : "↓")}
                                            </TableHead>
                                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("date")}>
                                                Fecha {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
                                            </TableHead>
                                            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("price")}>
                                                Precio {sortField === "price" && (sortDirection === "asc" ? "↑" : "↓")}
                                            </TableHead>
                                            <TableHead>Categoría</TableHead>
                                            <TableHead>Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAndSortedPrices.map((price) => {
                                            const id = `${price.apartment?.id}-${price.date}`
                                            return (
                                                <TableRow key={id} className="hover:bg-muted/50">
                                                    <TableCell className="font-medium">#{id}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Building className="h-4 w-4 text-muted-foreground" />
                                                            <div>
                                                                <div className="font-medium">
                                                                    {price.apartment?.name || `Apartamento ${price.apartment?.id}`}
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">ID: {price.apartment?.id}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                                            {format(parseISO(price.date), "dd MMM yyyy", { locale: es })}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 font-bold text-lg">
                                                            <Euro className="h-4 w-4 text-muted-foreground" />
                                                            {price.price.toFixed(2)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{getPriceBadge(price.price)}</TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => router.push(`/admin/prices/edit/${id}`)}>
                                                                    <Edit className="h-4 w-4 mr-2" />
                                                                    Editar
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(id?.toString() || "")
                                                                        alert("ID copiado al portapapeles")
                                                                    }}
                                                                >
                                                                    <Calendar className="h-4 w-4 mr-2" />
                                                                    Copiar ID
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => handleDeleteClick(price)} className="text-destructive">
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Eliminar
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar eliminación</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que quieres eliminar el precio # id?
                                {priceToDelete && (
                                    <span className="block mt-2 font-medium">
                                        {priceToDelete.apartment?.name || `Apartamento ${priceToDelete.apartment?.id}`} -{" "}
                                        {format(parseISO(priceToDelete.date), "dd MMM yyyy", { locale: es })} - €
                                        {priceToDelete.price.toFixed(2)}
                                    </span>
                                )}
                                Esta acción no se puede deshacer.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button variant="destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
