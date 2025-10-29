'use client';

/**
 * Página principal del calendario de administración
 * Ahora modularizada con componentes y utilidades separadas
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, addMonths, subMonths, addDays, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

// Hooks personalizados
import { useApartmentData } from '@/hooks/use-apartment-data';
import { useCalendarData } from '@/hooks/use-calendar-data';

// Tipos
import type { CalendarView, ViewMode } from '@/types/calendar';

// Componentes de UI
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
import { TooltipProvider } from '@/components/ui/tooltip';

// Iconos
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
} from 'lucide-react';

// Componentes personalizados
import { SiteHeaderAdmin } from '@/components/site-header-admin';
import { CalendarStatsCards } from '@/components/calendar/calendar-stats';
import { CalendarLegend } from '@/components/calendar/calendar-legend';
import { CalendarDayCell } from '@/components/calendar/calendar-day-cell';

// Constantes
import { WEEK_DAYS } from '@/constants/calendar';

// Utilidades
import { sendBookings } from '@/app/admin/dashboard/test_csv';

export default function AdminCalendarPage() {
  const router = useRouter();

  // Estado del calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<CalendarView>('month');
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');

  // Datos de apartamentos (hook personalizado)
  const {
    apartmentIds,
    selectedApartmentId,
    setSelectedApartmentId,
    dateRanges,
    loading,
    error,
    refreshing,
    handleRefresh,
  } = useApartmentData();

  // Datos del calendario procesados (hook personalizado)
  const { daysInfo, stats } = useCalendarData(
    currentDate,
    calendarView,
    dateRanges
  );

  // Funciones de navegación
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

  // Estado de carga inicial
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
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
    <div>
      <SiteHeaderAdmin />
      <TooltipProvider>
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Calendario de Reservas</h1>
              <p className="text-muted-foreground">
                Gestiona la disponibilidad de los apartamentos
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push('/admin/bookings')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ver reservas
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

          {/* Alerta de Error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Contenido principal */}
          {selectedApartmentId ? (
            <>
              <CalendarStatsCards stats={stats} currentDate={currentDate} />

              <CalendarLegend />

              {/* Vista de Calendario/Lista */}
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
                      {/* Cabecera de días */}
                      <div className="grid grid-cols-7 mb-2">
                        {WEEK_DAYS.map((day) => (
                          <div
                            key={day}
                            className="p-2 text-center font-semibold text-sm text-muted-foreground"
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {daysInfo.map((dayInfo, index) => (
                          <CalendarDayCell key={index} dayInfo={dayInfo} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="list">
                  <Card>
                    <CardHeader>
                      <CardTitle>Lista de Reservas</CardTitle>
                      <CardDescription>
                        Reservas para el apartamento #{selectedApartmentId}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {dateRanges.length === 0 ? (
                        <div className="text-center py-12">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                            No hay reservas
                          </h3>
                          <p className="text-muted-foreground">
                            Este apartamento no tiene reservas en el período
                            seleccionado.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {dateRanges.map((range, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div className="space-y-1">
                                <div className="font-medium">
                                  Reserva #{index + 1}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {range.from &&
                                    format(
                                      new Date(range.from),
                                      'dd MMM yyyy',
                                      { locale: es }
                                    )}{' '}
                                  -{' '}
                                  {range.to &&
                                    format(new Date(range.to), 'dd MMM yyyy', {
                                      locale: es,
                                    })}
                                </div>
                              </div>
                              <Badge variant="default">Confirmada</Badge>
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
                  calendario de reservas.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </TooltipProvider>
      <div>
        <button
          onClick={() => sendBookings()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Crear bookings
        </button>
      </div>
    </div>
  );
}
