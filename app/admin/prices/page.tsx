'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAllPrices,
  createPrices,
  updatePrice,
  deletePrice,
} from '@/api/prices';
import type { Price, CreatePriceRequest } from '@/types/prices';
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  addMonths,
} from 'date-fns';
import { es } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  X,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

type SortField = 'date' | 'price' | 'apartment.id';
type SortDirection = 'asc' | 'desc';

interface PriceStats {
  total: number;
  averagePrice: number;
  highestPrice: number;
  lowestPrice: number;
  totalRevenuePotential: number;
  uniqueApartments: number;
  pricesThisMonth: number;
}

export default function AdminPricesPage() {
  const router = useRouter();
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [apartmentFilter, setApartmentFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [refreshing, setRefreshing] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [priceToDelete, setPriceToDelete] = useState<Price | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [priceToEdit, setPriceToEdit] = useState<Price | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [editApartmentId, setEditApartmentId] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // Bulk add dialog state
  const [showDaySelector, setShowDaySelector] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [priceForDays, setPriceForDays] = useState<string>('');
  const [apartmentIdForDays, setApartmentIdForDays] = useState<string>('');
  const [bulkSaving, setBulkSaving] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageInput, setPageInput] = useState('1');
  const [hasMorePages, setHasMorePages] = useState(true);

  useEffect(() => {
    fetchPrices();
  }, [currentPage, pageSize, sortField, sortDirection]);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      setError(null);

      const sortParam = `${sortField === 'apartment.id' ? 'apartmentId' : sortField},${sortDirection}`;
      const data = await getAllPrices({
        page: currentPage,
        size: pageSize,
        sort: sortParam,
      });

      setPrices(data);
      setHasMorePages(data.length === pageSize);
    } catch (err) {
      setError('Error al obtener los precios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const sortParam = `${sortField === 'apartment.id' ? 'apartmentId' : sortField},${sortDirection}`;
      const data = await getAllPrices({
        page: currentPage,
        size: pageSize,
        sort: sortParam,
      });
      setPrices(data);
      setHasMorePages(data.length === pageSize);
    } catch (err) {
      setError('Error al cargar los precios');
    } finally {
      setRefreshing(false);
    }
  };

  // Get unique apartments for filter
  const uniqueApartments = useMemo(() => {
    const apartments = new Map<number, string>();
    prices.forEach((price) => {
      if (price.apartment?.id && !apartments.has(price.apartment.id)) {
        apartments.set(price.apartment.id, `Apartamento ${price.apartment.id}`);
      }
    });
    return Array.from(apartments.entries()).map(([id, name]) => ({ id, name }));
  }, [prices]);

  // Calculate statistics
  const stats: PriceStats = useMemo(() => {
    const total = prices.length;
    const priceValues = prices.map((p) => p.price);
    const averagePrice =
      total > 0 ? priceValues.reduce((sum, p) => sum + p, 0) / total : 0;
    const highestPrice = total > 0 ? Math.max(...priceValues) : 0;
    const lowestPrice = total > 0 ? Math.min(...priceValues) : 0;
    const totalRevenuePotential = priceValues.reduce((sum, p) => sum + p, 0);
    const uniqueApartments = new Set(prices.map((p) => p.apartment?.id)).size;

    const currentMonth = new Date();
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const pricesThisMonth = prices.filter((p) => {
      const priceDate = parseISO(p.date);
      return priceDate >= monthStart && priceDate <= monthEnd;
    }).length;

    return {
      total,
      averagePrice,
      highestPrice,
      lowestPrice,
      totalRevenuePotential,
      uniqueApartments,
      pricesThisMonth,
    };
  }, [prices]);

  // Filter and sort prices
  const filteredAndSortedPrices = useMemo(() => {
    let filtered = prices;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (price) =>
          price.apartment?.id?.toString().includes(searchTerm) ||
          price.date.includes(searchTerm) ||
          price.price.toString().includes(searchTerm)
      );
    }

    // Apartment filter
    if (apartmentFilter !== 'all') {
      filtered = filtered.filter(
        (price) => price.apartment?.id?.toString() === apartmentFilter
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      filtered = filtered.filter((price) => {
        const priceDate = parseISO(price.date);

        switch (dateFilter) {
          case 'today':
            return (
              format(priceDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
            );
          case 'this-week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            return priceDate >= weekStart && priceDate <= weekEnd;
          case 'this-month':
            return (
              priceDate >= startOfMonth(today) && priceDate <= endOfMonth(today)
            );
          case 'next-month':
            const nextMonth = addMonths(today, 1);
            return (
              priceDate >= startOfMonth(nextMonth) &&
              priceDate <= endOfMonth(nextMonth)
            );
          case 'past':
            return priceDate < today;
          case 'future':
            return priceDate > today;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [prices, searchTerm, apartmentFilter, dateFilter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(0);
    setPageInput('1');
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setPageInput((newPage + 1).toString());
    }
  };

  const handleNextPage = () => {
    if (hasMorePages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setPageInput((newPage + 1).toString());
    }
  };

  const handlePageInputChange = (value: string) => {
    setPageInput(value);
  };

  const handlePageInputSubmit = () => {
    const pageNumber = Number.parseInt(pageInput);
    if (!Number.isNaN(pageNumber) && pageNumber > 0) {
      setCurrentPage(pageNumber - 1);
    } else {
      setPageInput((currentPage + 1).toString());
    }
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number.parseInt(value));
    setCurrentPage(0);
    setPageInput('1');
  };

  // Edit handlers
  const handleEditClick = (price: Price) => {
    setPriceToEdit(price);
    setEditPrice(price.price.toString());
    setEditApartmentId(price.apartment?.id?.toString() || '');
    setEditDate(price.date);
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!priceToEdit || !editPrice || !editApartmentId || !editDate) return;

    try {
      setSaving(true);
      const originalApartmentId = priceToEdit.apartment?.id;
      const originalDate = priceToEdit.date;

      if (!originalApartmentId) {
        throw new Error('Invalid original price data');
      }

      await updatePrice(originalApartmentId, originalDate, {
        price: Number.parseFloat(editPrice),
      });

      // Refresh prices
      await fetchPrices();
      setEditDialogOpen(false);
      setPriceToEdit(null);
    } catch (err) {
      console.error('Error al actualizar precio:', err);
      alert('Error al actualizar el precio');
    } finally {
      setSaving(false);
    }
  };

  // Delete handlers
  const handleDeleteClick = (price: Price) => {
    setPriceToDelete(price);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!priceToDelete?.apartment?.id || !priceToDelete.date) return;

    try {
      setDeleting(true);
      await deletePrice(priceToDelete.apartment.id, priceToDelete.date);
      await fetchPrices();
      setDeleteDialogOpen(false);
      setPriceToDelete(null);
    } catch (err) {
      console.error('Error al eliminar precio:', err);
      alert('Error al eliminar el precio');
    } finally {
      setDeleting(false);
    }
  };

  // Bulk add handlers
  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort((a, b) => a - b)
    );
  };

  const selectAllDays = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    setSelectedDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  };

  const clearAllDays = () => {
    setSelectedDays([]);
  };

  const handleSavePrices = async () => {
    if (selectedDays.length === 0 || !priceForDays || !apartmentIdForDays) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      setBulkSaving(true);
      const requests: CreatePriceRequest[] = selectedDays.map((day) => ({
        apartmentId: Number.parseInt(apartmentIdForDays),
        date: `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        price: Number.parseFloat(priceForDays),
      }));

      await createPrices(requests);
      await fetchPrices();

      // Reset form
      setShowDaySelector(false);
      setSelectedDays([]);
      setPriceForDays('');
      setApartmentIdForDays('');
    } catch (err) {
      console.error('Error al guardar precios:', err);
      alert('Error al guardar los precios');
    } finally {
      setBulkSaving(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Apartamento ID', 'Fecha', 'Precio'];
    const csvData = prices.map((price) => [
      price.apartment?.id || '',
      price.date,
      price.price,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `precios-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
    );
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
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Precios</h1>
            <p className="text-muted-foreground">
              Administra los precios diarios de los apartamentos
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Button
              onClick={handleRefresh}
              variant="outline"
              disabled={refreshing}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
              />
              Actualizar
            </Button>
            <Button onClick={() => setShowDaySelector(!showDaySelector)}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Precios
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pricesThisMonth} este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Precio Promedio
              </CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{stats.averagePrice.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.uniqueApartments} apartamentos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Precio Más Alto
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{stats.highestPrice.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Más bajo: €{stats.lowestPrice.toFixed(2)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos Potenciales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{stats.totalRevenuePotential.toFixed(2)}
              </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Select
                  value={apartmentFilter}
                  onValueChange={setApartmentFilter}
                >
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
                <label className="text-sm font-medium">Acciones</label>
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Add Dialog */}
        {showDaySelector && (
          <Card className="border-primary">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" />
                    Añadir Precios para Múltiples Días
                  </CardTitle>
                  <CardDescription>
                    Selecciona los días y asigna un precio
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDaySelector(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Year, Month, Apartment, and Price Selection */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bulk-apartment">Apartamento ID</Label>
                  <Input
                    id="bulk-apartment"
                    type="number"
                    placeholder="1"
                    value={apartmentIdForDays}
                    onChange={(e) => setApartmentIdForDays(e.target.value)}
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bulk-year">Año</Label>
                  <Input
                    id="bulk-year"
                    type="number"
                    value={selectedYear}
                    onChange={(e) =>
                      setSelectedYear(
                        Number.parseInt(e.target.value) ||
                          new Date().getFullYear()
                      )
                    }
                    min={2024}
                    max={2030}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bulk-month">Mes</Label>
                  <Select
                    value={selectedMonth.toString()}
                    onValueChange={(v) => setSelectedMonth(Number.parseInt(v))}
                  >
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
                    onChange={(e) => setPriceForDays(e.target.value)}
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAllDays}>
                  <Check className="h-4 w-4 mr-2" />
                  Seleccionar todos
                </Button>
                <Button variant="outline" size="sm" onClick={clearAllDays}>
                  <X className="h-4 w-4 mr-2" />
                  Limpiar
                </Button>
                <div className="ml-auto text-sm text-muted-foreground flex items-center">
                  {selectedDays.length} día
                  {selectedDays.length !== 1 ? 's' : ''} seleccionado
                  {selectedDays.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-2">
                {Array.from(
                  {
                    length: new Date(selectedYear, selectedMonth, 0).getDate(),
                  },
                  (_, i) => i + 1
                ).map((day) => (
                  <Button
                    key={day}
                    variant={selectedDays.includes(day) ? 'default' : 'outline'}
                    className="h-12 w-full"
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </Button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowDaySelector(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSavePrices}
                  disabled={
                    selectedDays.length === 0 ||
                    !priceForDays ||
                    !apartmentIdForDays ||
                    bulkSaving
                  }
                >
                  {bulkSaving ? (
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
        )}

        {/* Results Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Precios</CardTitle>
                <CardDescription>
                  {filteredAndSortedPrices.length} precios en la página{' '}
                  {currentPage + 1}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAndSortedPrices.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No se encontraron precios
                </h3>
                <p className="text-muted-foreground">
                  No hay precios que coincidan con los filtros seleccionados.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('apartment.id')}
                        >
                          Apartamento{' '}
                          {sortField === 'apartment.id' &&
                            (sortDirection === 'asc' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('date')}
                        >
                          Fecha{' '}
                          {sortField === 'date' &&
                            (sortDirection === 'asc' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSort('price')}
                        >
                          Precio{' '}
                          {sortField === 'price' &&
                            (sortDirection === 'asc' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prices.map((price) => {
                        const id = `${price.apartment?.id}-${price.date}`;
                        return (
                          <TableRow key={id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <div className="font-medium">{`Apartamento ${price.apartment?.id}`}</div>
                                  <div className="text-sm text-muted-foreground">
                                    ID: {price.apartment?.id}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                {format(parseISO(price.date), 'dd MMM yyyy', {
                                  locale: es,
                                })}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 font-bold text-lg">
                                <Euro className="h-4 w-4 text-muted-foreground" />
                                {price.price.toFixed(2)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>
                                    Acciones
                                  </DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => handleEditClick(price)}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        id?.toString() || ''
                                      );
                                    }}
                                  >
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Copiar ID
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteClick(price)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="page-size"
                      className="text-sm whitespace-nowrap"
                    >
                      Resultados por página:
                    </Label>
                    <Select
                      value={pageSize.toString()}
                      onValueChange={handlePageSizeChange}
                    >
                      <SelectTrigger id="page-size" className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 0 || loading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Página
                      </span>
                      <Input
                        type="number"
                        min="1"
                        value={pageInput}
                        onChange={(e) => handlePageInputChange(e.target.value)}
                        onBlur={handlePageInputSubmit}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handlePageInputSubmit();
                          }
                        }}
                        className="w-16 text-center"
                        disabled={loading}
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleNextPage}
                      disabled={!hasMorePages || loading}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Mostrando {filteredAndSortedPrices.length} resultado
                    {filteredAndSortedPrices.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Precio</DialogTitle>
              <DialogDescription>
                Modifica los detalles del precio seleccionado
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-apartment">Apartamento ID</Label>
                <Input
                  id="edit-apartment"
                  type="number"
                  value={editApartmentId}
                  onChange={(e) => setEditApartmentId(e.target.value)}
                  min={1}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Fecha</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Precio (€)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleEditSave}
                disabled={saving || !editPrice || !editApartmentId || !editDate}
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Guardar
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar eliminación</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que quieres eliminar este precio?
                {priceToDelete && (
                  <span className="block mt-2 font-medium">
                    {`Apartamento ${priceToDelete.apartment?.id}`} -{' '}
                    {format(parseISO(priceToDelete.date), 'dd MMM yyyy', {
                      locale: es,
                    })}{' '}
                    - €{priceToDelete.price.toFixed(2)}
                  </span>
                )}
                Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
