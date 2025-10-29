'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isWithinInterval,
  format,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  parseISO,
  addDays,
  startOfDay,
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  getAllApartmentIds,
  getDiscountsByApartmentId,
  type Discount,
} from '@/api/discount';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Building,
  ArrowLeft,
  Grid3X3,
  List,
  RefreshCw,
  AlertCircle,
  Info,
  Percent,
  DollarSign,
  Tag,
} from 'lucide-react';

type CalendarView = 'month' | 'week';
type ViewMode = 'calendar' | 'list';

interface DayInfo {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasDiscount: boolean;
  discounts: Discount[];
  maxDiscount: number;
}

export default function AdminDiscountsPage() {
  const router = useRouter();
  const [apartmentIds, setApartmentIds] = useState<number[]>([]);
  const [selectedApartmentId, setSelectedApartmentId] = useState<number | null>(
    null
  );
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<CalendarView>('month');
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchApartmentIds = async () => {
      try {
        setLoading(true);
        const ids = await getAllApartmentIds();
        setApartmentIds(ids);
        if (ids.length > 0) {
          setSelectedApartmentId(ids[0]);
        }
      } catch (err) {
        setError('Error al cargar los apartamentos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApartmentIds();
  }, []);

  useEffect(() => {
    const fetchDiscounts = async () => {
      if (selectedApartmentId !== null) {
        try {
          setRefreshing(true);
          setError(null);
          const data = await getDiscountsByApartmentId(selectedApartmentId);
          setDiscounts(data);
        } catch (err) {
          setError('Error al cargar los descuentos');
          console.error(err);
        } finally {
          setRefreshing(false);
        }
      } else {
        setDiscounts([]);
      }
    };

    fetchDiscounts();
  }, [selectedApartmentId]);

  // Calculate calendar days based on view
  const calendarDays = useMemo(() => {
    const start =
      calendarView === 'month'
        ? startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
        : startOfWeek(currentDate, { weekStartsOn: 1 });

    const end =
      calendarView === 'month'
        ? endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
        : endOfWeek(currentDate, { weekStartsOn: 1 });

    return eachDayOfInterval({ start, end });
  }, [currentDate, calendarView]);

  // Process day information
  const daysInfo: DayInfo[] = useMemo(() => {
    return calendarDays.map((date) => {
      const isCurrentMonth =
        calendarView === 'month' ? isSameMonth(date, currentDate) : true;
      const isToday = isSameDay(date, new Date());

      // Check if day has discounts
      const dayDiscounts = discounts.filter((discount) => {
        const start = discount.startDate ? parseISO(discount.startDate) : null;
        const end = discount.endDate ? parseISO(discount.endDate) : start;
        if (!start || !end) return false;
        return isWithinInterval(startOfDay(date), {
          start: startOfDay(start),
          end: startOfDay(end),
        });
      });

      const hasDiscount = dayDiscounts.length > 0;
      const maxDiscount = hasDiscount
        ? Math.max(
            ...dayDiscounts.map((d) => (d.isPercentage ? d.discount : 0))
          )
        : 0;

      return {
        date,
        isCurrentMonth,
        isToday,
        hasDiscount,
        discounts: dayDiscounts,
        maxDiscount,
      };
    });
  }, [calendarDays, currentDate, calendarView, discounts]);

  // Statistics
  const stats = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const daysWithDiscount = monthDays.filter((day) =>
      discounts.some((discount) => {
        const start = discount.startDate ? parseISO(discount.startDate) : null;
        const end = discount.endDate ? parseISO(discount.endDate) : start;
        if (!start || !end) return false;
        return isWithinInterval(startOfDay(day), {
          start: startOfDay(start),
          end: startOfDay(end),
        });
      })
    ).length;

    const activeDiscounts = discounts.filter((discount) => {
      const start = discount.startDate ? parseISO(discount.startDate) : null;
      const end = discount.endDate ? parseISO(discount.endDate) : start;
      if (!start || !end) return false;
      const today = startOfDay(new Date());
      return isWithinInterval(today, {
        start: startOfDay(start),
        end: startOfDay(end),
      });
    }).length;

    const avgDiscount =
      discounts.length > 0
        ? discounts
            .filter((d) => d.isPercentage)
            .reduce((sum, d) => sum + d.discount, 0) /
          Math.max(discounts.filter((d) => d.isPercentage).length, 1)
        : 0;

    return {
      totalDays: monthDays.length,
      daysWithDiscount,
      activeDiscounts,
      totalDiscounts: discounts.length,
      avgDiscount,
    };
  }, [currentDate, discounts]);

  const handleRefresh = async () => {
    if (selectedApartmentId !== null) {
      setRefreshing(true);
      try {
        const data = await getDiscountsByApartmentId(selectedApartmentId);
        setDiscounts(data);
      } catch (err) {
        setError('Error al actualizar los descuentos');
      } finally {
        setRefreshing(false);
      }
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(
      direction === 'prev'
        ? subMonths(currentDate, 1)
        : addMonths(currentDate, 1)
    );
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(
      direction === 'prev' ? addDays(currentDate, -7) : addDays(currentDate, 7)
    );
  };

  const getDayClassName = (dayInfo: DayInfo) => {
    const baseClasses =
      'relative p-2 min-h-[80px] border border-border/50 transition-colors hover:bg-muted/50';

    let statusClasses = '';
    if (dayInfo.hasDiscount) {
      if (dayInfo.maxDiscount >= 30) {
        statusClasses =
          'bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      } else if (dayInfo.maxDiscount >= 15) {
        statusClasses =
          'bg-yellow-100 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      } else {
        statusClasses =
          'bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      }
    } else {
      statusClasses = 'bg-background';
    }

    const monthClasses = !dayInfo.isCurrentMonth ? 'opacity-40' : '';
    const todayClasses = dayInfo.isToday ? 'ring-2 ring-primary' : '';

    return `${baseClasses} ${statusClasses} ${monthClasses} ${todayClasses}`;
  };

  const getDiscountBadge = (discount: Discount) => {
    return (
      <Badge
        variant={discount.isPercentage ? 'default' : 'secondary'}
        className="text-xs"
      >
        {discount.isPercentage ? (
          <>
            <Percent className="h-3 w-3 mr-1" />
            {discount.discount}%
          </>
        ) : (
          <>
            <DollarSign className="h-3 w-3 mr-1" />
            {discount.discount}€
          </>
        )}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Calendario de Descuentos</h1>
            <p className="text-muted-foreground">
              Gestiona los descuentos de los apartamentos
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
          </div>
        </div>

        {/* Apartment Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Selección de Apartamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="space-y-2">
                <label className="text-sm font-medium">Apartamento:</label>
                <Select
                  value={selectedApartmentId?.toString() || ''}
                  onValueChange={(value) =>
                    setSelectedApartmentId(value ? Number(value) : null)
                  }
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Selecciona un apartamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {apartmentIds.map((id) => (
                      <SelectItem key={id} value={id.toString()}>
                        Apartamento #{id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedApartmentId && (
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'calendar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('calendar')}
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Calendario
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4 mr-2" />
                    Lista
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {selectedApartmentId ? (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Descuentos
                  </CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalDiscounts}
                  </div>
                  <p className="text-xs text-muted-foreground">Configurados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Descuentos Activos
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.activeDiscounts}
                  </div>
                  <p className="text-xs text-muted-foreground">Vigentes hoy</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Días con Descuento
                  </CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.daysWithDiscount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    En {format(currentDate, 'MMMM', { locale: es })}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Descuento Promedio
                  </CardTitle>
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.avgDiscount.toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Descuentos porcentuales
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leyenda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-200 dark:bg-green-900/20 dark:border-green-800 rounded" />
                    <span className="text-sm">Descuento alto (≥30%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 rounded" />
                    <span className="text-sm">Descuento medio (15-29%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 rounded" />
                    <span className="text-sm">Descuento bajo (&lt;15%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-background border border-border rounded" />
                    <span className="text-sm">Sin descuento</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar/List View */}
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as ViewMode)}
            >
              <TabsContent value="calendar">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          {calendarView === 'month'
                            ? format(currentDate, 'MMMM yyyy', { locale: es })
                            : `Semana del ${format(startOfWeek(currentDate, { weekStartsOn: 1 }), 'dd MMM', { locale: es })}`}
                        </CardTitle>
                        <CardDescription>
                          Apartamento #{selectedApartmentId}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={calendarView}
                          onValueChange={(value: CalendarView) =>
                            setCalendarView(value)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="month">Mes</SelectItem>
                            <SelectItem value="week">Semana</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            calendarView === 'month'
                              ? navigateMonth('prev')
                              : navigateWeek('prev')
                          }
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentDate(new Date())}
                        >
                          Hoy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            calendarView === 'month'
                              ? navigateMonth('next')
                              : navigateWeek('next')
                          }
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Calendar Header */}
                    <div className="grid grid-cols-7 mb-2">
                      {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(
                        (day) => (
                          <div
                            key={day}
                            className="p-2 text-center font-semibold text-sm text-muted-foreground"
                          >
                            {day}
                          </div>
                        )
                      )}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                      {daysInfo.map((dayInfo, index) => (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <div className={getDayClassName(dayInfo)}>
                              <div className="flex justify-between items-start">
                                <span
                                  className={`text-sm font-medium ${dayInfo.isToday ? 'text-primary' : ''}`}
                                >
                                  {format(dayInfo.date, 'd')}
                                </span>
                                {dayInfo.hasDiscount && (
                                  <Tag className="h-3 w-3 text-green-600" />
                                )}
                              </div>
                              {dayInfo.isToday && (
                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                                  <div className="w-1 h-1 rounded-full bg-primary" />
                                </div>
                              )}
                              {dayInfo.discounts.length > 0 && (
                                <div className="mt-1 space-y-1">
                                  {dayInfo.discounts
                                    .slice(0, 2)
                                    .map((discount, i) => (
                                      <div
                                        key={i}
                                        className="text-xs p-1 bg-background/80 rounded truncate"
                                      >
                                        {discount.isPercentage
                                          ? `${discount.discount}%`
                                          : `${discount.discount}€`}
                                      </div>
                                    ))}
                                  {dayInfo.discounts.length > 2 && (
                                    <div className="text-xs text-muted-foreground">
                                      +{dayInfo.discounts.length - 2} más
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-2">
                              <div className="font-semibold">
                                {format(dayInfo.date, "dd 'de' MMMM, yyyy", {
                                  locale: es,
                                })}
                              </div>
                              {dayInfo.discounts.length > 0 ? (
                                <div className="space-y-1">
                                  <div className="text-sm font-medium">
                                    Descuentos activos:
                                  </div>
                                  {dayInfo.discounts.map((discount, i) => (
                                    <div
                                      key={i}
                                      className="text-sm flex items-center gap-2"
                                    >
                                      • {getDiscountBadge(discount)}
                                      <span className="text-xs text-muted-foreground">
                                        (
                                        {format(
                                          parseISO(discount.startDate),
                                          'dd/MM'
                                        )}{' '}
                                        -{' '}
                                        {format(
                                          parseISO(discount.endDate),
                                          'dd/MM'
                                        )}
                                        )
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground">
                                  Sin descuentos
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="list">
                <Card>
                  <CardHeader>
                    <CardTitle>Lista de Descuentos</CardTitle>
                    <CardDescription>
                      Descuentos para el apartamento #{selectedApartmentId}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {discounts.length === 0 ? (
                      <div className="text-center py-12">
                        <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No hay descuentos
                        </h3>
                        <p className="text-muted-foreground">
                          Este apartamento no tiene descuentos configurados.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {discounts.map((discount) => (
                          <div
                            key={discount.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="space-y-1">
                              <div className="font-medium flex items-center gap-2">
                                Descuento #{discount.id}
                                {getDiscountBadge(discount)}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {format(
                                  parseISO(discount.startDate),
                                  'dd MMM yyyy',
                                  { locale: es }
                                )}{' '}
                                -{' '}
                                {format(
                                  parseISO(discount.endDate),
                                  'dd MMM yyyy',
                                  { locale: es }
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                {discount.isPercentage
                                  ? `${discount.discount}%`
                                  : `${discount.discount}€`}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {discount.isPercentage
                                  ? 'Porcentaje'
                                  : 'Cantidad fija'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Selecciona un apartamento
              </h3>
              <p className="text-muted-foreground text-center">
                Elige un apartamento del selector de arriba para ver su
                calendario de descuentos.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
