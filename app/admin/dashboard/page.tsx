'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, ComposedChart } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { DashboardHeader } from '@/components/dashboard/header';
import { KPICards } from '@/components/dashboard/kpi-cards';
import { SmartAlerts } from '@/components/dashboard/smart-alerts';
import { RecentBookings } from '@/components/dashboard/recent-bookings';
import { DashboardFiltersComponent } from '@/components/dashboard/filters';

import {
  DashboardFilters,
  DashboardKPIs,
  OccupancyChartData,
  PredictionResponse,
  SmartAlert,
  Booking,
} from '@/types/booking';

import {
  fetchPredictions,
  generateSmartAlerts,
  fetchDashboardKPIs,
  fetchOccupancyData,
  fetchRecentBookings
} from '@/api/booking';
import { SiteHeader } from '@/components/site-header';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<DashboardFilters>({
    date_range: {
      start: '2026-07-01',
      end: '2027-06-30',
    },
    apartment_type: 'ALL',
    year: 2027,
  });

  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [occupancyData, setOccupancyData] = useState<OccupancyChartData | null>(null);
  const [predictions, setPredictions] = useState<PredictionResponse | null>(null);
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Obtener predicciones de la API
      const predictionData = await fetchPredictions(filters.year);
      setPredictions(predictionData);

      // 2. Generar alertas basadas en las predicciones
      const generatedAlerts = generateSmartAlerts(predictionData);
      setAlerts(generatedAlerts);

      // 3. Obtener KPIs desde Spring Boot
      const kpiData = await fetchDashboardKPIs(filters);
      setKpis(kpiData);

      // 4. Obtener datos de ocupación real e histórica
      const occupancy = await fetchOccupancyData(filters);
      setOccupancyData(occupancy);

      // 5. Obtener últimas reservas transaccionales
      const recents = await fetchRecentBookings();
      setRecentBookings(recents);

    } catch (err) {
      console.error('[Dashboard] Error al conectar con las APIs de Spring Boot:', err);
      setError('Error al sincronizar las métricas con el servidor de Spring Boot.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFiltersChange = (newFilters: DashboardFilters) => {
    setFilters(newFilters);
  };


  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
          {/* Header */}
          <DashboardHeader
            title="Dashboard de Reservas"
            subtitle={`Motor de reservas con predicciones de IA para ${filters.year}`}
            onRefresh={loadData}
            isLoading={isLoading}
            alertsCount={alerts.length}
          />

          {/* Filters */}
          <div className="mb-6">
            <DashboardFiltersComponent
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
              {error}
            </div>
          )}

         {/* KPI Cards */}
<div className="mb-6">
  {isLoading ? (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="bg-card">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  ) : kpis ? (
    <KPICards
      totalRevenue={kpis.totalRevenue}
      totalBookings={kpis.totalBookings}
      totalNights={kpis.totalNights}
      averageRevenuePerBooking={kpis.averageRevenuePerBooking}
    />
  ) : null}
</div>
          {/* Charts Grid */}

{/* Charts Grid */}
        {/* Charts Grid */}
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            
            {/* Gráfico 1: Análisis de Ocupación (Real vs Predicha) */}
            <Card className="bg-card">
<CardHeader>
  <CardTitle>Métricas de Rendimiento</CardTitle>
  <CardDescription>
    Ingresos Totales: <span className="font-semibold text-primary">
      ${occupancyData?.totalRevenue?.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
    <br />
    Noches Totales: <span className="font-semibold text-amber-500">
      {occupancyData?.totalNights ?? 0} noches
    </span>
  </CardDescription>
</CardHeader>
              <CardContent className="h-[350px]">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : occupancyData?.data_points && occupancyData.data_points.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={occupancyData.data_points}
                      margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                      <XAxis 
                        dataKey="month" // Ajusta aquí si tu backend usa 'month_year' o 'date'
                        className="text-xs fill-muted-foreground" 
                      />
                      <YAxis unit="%" className="text-xs fill-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ background: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
                        labelStyle={{ color: 'var(--foreground)' }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Bar 
                        dataKey="actual_occupancy" // Nombre de la propiedad real en tu OccupancyDataPoint
                        name="Ocupación Real" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predicted_occupancy" // Nombre de la propiedad predicha en tu OccupancyDataPoint
                        name="Predicción" 
                        stroke="#f59e0b" 
                        strokeWidth={3} 
                        dot={{ r: 4 }} 
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No hay datos de ocupación disponibles para este periodo
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gráfico 2: Predicción de Reservas Futuras (LineChart de IA) */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Predicción de Reservas (IA)</CardTitle>
                <CardDescription>
                  Volumen de transacciones estimado para los próximos 12 meses ({filters.year})
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : predictions?.predictions && predictions.predictions.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={predictions.predictions}
                      margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" vertical={false} />
                      <XAxis 
                        dataKey="month_year" 
                        className="text-xs fill-muted-foreground"
                        tickFormatter={(value) => {
                          const [year, month] = value.split('-');
                          const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
                          return `${months[parseInt(month) - 1]} ${year.slice(-2)}`;
                        }}
                      />
                      <YAxis className="text-xs fill-muted-foreground" />
                      <Tooltip 
                        contentStyle={{ background: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
                        labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold' }}
                        labelFormatter={(value) => {
                          const [year, month] = value.split('-');
                          const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
                          return `${months[parseInt(month) - 1]} ${year}`;
                        }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Line 
                        type="monotone" 
                        dataKey="predicted_bookings" 
                        name="Reservas Proyectadas" 
                        stroke="#3b82f6" // Color azul vibrante para diferenciarlo del primer gráfico
                        strokeWidth={2.5} 
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No hay datos de predicciones disponibles
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
          {/* Grids de Alertas y Notificaciones */}
          <div className="grid gap-6 lg:grid-cols-3 mb-6">
            <div className="lg:col-span-1">
              {isLoading ? (
                <Card className="bg-card">
                  <CardHeader>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-56" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <SmartAlerts alerts={alerts} />
              )}
            </div>

            {/* Recent Bookings */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <Card className="bg-card">
                  <CardHeader>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <RecentBookings bookings={recentBookings} />
              )}
            </div>
          </div>

          {/* API Info Footer */}
          <div className="text-center text-xs text-muted-foreground py-4 border-t border-border">
            <p>
              Endpoint de predicciones: <code className="bg-secondary px-1.5 py-0.5 rounded">
                {API_BASE_URL}/bookings/predict-next-12-months?year={filters.year}
              </code>
            </p>
            {predictions && (
              <p className="mt-1">
                Precisión del modelo: <span className="text-primary font-medium">
                  {(predictions.model_accuracy * 100).toFixed(1)}%
                </span>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}