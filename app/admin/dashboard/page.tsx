"use client";

import { useState, useCallback, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { KPICard } from "@/components/dashboard/kpi-card";
import { OccupancyChart } from "@/components/dashboard/occupancy-chart";
import { GlobalFilters } from "@/components/dashboard/global-filters";
import { PredictionAlerts } from "@/components/dashboard/prediction-alerts";
import { OccupancyByTypeCard } from "@/components/dashboard/occupancy-by-type";
import { UpcomingCheckins } from "@/components/dashboard/upcoming-checkins";
// Cambia tu import antiguo por este que se alinea con booking.ts
import {
  DashboardFilters,
  DashboardKPIs,
  OccupancyDataPoint,
  OccupancyByType,
  PredictionAlert,      // Cambiado de SmartAlert a PredictionAlert para hacer match con el mock
  BookingWithDetails,
  ApartmentType,
  BookingStatus,
} from "@/types/booking";
import { cn } from "@/lib/utils";
import { format, subDays, addDays } from "date-fns";
import { SiteHeaderAdmin } from "@/components/site-header-admin";
import { fetchAndCombineData } from "@/api/booking";

// =============================================================================
// MOCK DATA - Simula la respuesta del backend y modelo ML
// =============================================================================

function generateMockOccupancyData(): OccupancyDataPoint[] {
  const data: OccupancyDataPoint[] = [];
  const today = new Date();

  // Datos históricos (últimos 30 días)
  for (let i = 30; i >= 0; i--) {
    const date = subDays(today, i);
    const baseOccupancy = 65 + Math.sin(i * 0.3) * 15 + Math.random() * 10;

    data.push({
      date: format(date, "yyyy-MM-dd"),
      actual_occupancy_rate: Math.min(100, Math.max(0, baseOccupancy)),
      actual_booked_apartments: Math.floor((baseOccupancy / 100) * 50),
      actual_total_apartments: 50,
      actual_revenue: Math.floor((baseOccupancy / 100) * 50 * 150),
      predicted_occupancy_rate: null,
      predicted_booked_apartments: null,
      predicted_revenue: null,
      prediction_confidence: null,
      is_historical: true,
      is_prediction: false,
    });
  }

  // Predicciones (próximos 30 días)
  for (let i = 1; i <= 30; i++) {
    const date = addDays(today, i);
    const basePrediction = 70 + Math.sin(i * 0.2) * 20 + Math.random() * 5;
    const confidence = 0.85 - i * 0.01;

    data.push({
      date: format(date, "yyyy-MM-dd"),
      actual_occupancy_rate: null,
      actual_booked_apartments: null,
      actual_total_apartments: 50,
      actual_revenue: null,
      predicted_occupancy_rate: Math.min(100, Math.max(0, basePrediction)),
      predicted_booked_apartments: Math.floor((basePrediction / 100) * 50),
      predicted_revenue: Math.floor((basePrediction / 100) * 50 * 155),
      prediction_confidence: Math.max(0.5, confidence),
      is_historical: false,
      is_prediction: true,
    });
  }

  return data;
}

const mockKPIs: DashboardKPIs = {
  totalRevenue: 3781570.83,
  averageRevenuePerBooking: 2522.73,
  totalBookings: 1499,
  totalNights: 17687,
  startDateFiltered: "2026-01-07",
  endDateFiltered: "2026-06-07",
  apartmentTypeFiltered: "ONE_BEDROOM",
};

const mockOccupancyByType: OccupancyByType[] = [
  {
    apartment_type: ApartmentType.ONE_BEDROOM,
    current_occupancy_rate: 72,
    predicted_occupancy_rate: 78,
    trend: "INCREASING",
    available_count: 5,
    booked_count: 13,
  },
  {
    apartment_type: ApartmentType.TWO_BEDROOM,
    current_occupancy_rate: 68,
    predicted_occupancy_rate: 65,
    trend: "DECREASING",
    available_count: 4,
    booked_count: 8,
  }
];

const mockAlerts: PredictionAlert[] = [
  {
    id: "2",
    type: "PRICE_ADJUSTMENT",
    severity: "MEDIUM",
    apartment_type: ApartmentType.PENTHOUSE,
    message: "Oportunidad de ajuste de precios detectada",
    recommendation:
      "Baja demanda proyectada - considera ofrecer descuentos por estancias largas",
    predicted_date: format(addDays(new Date(), 21), "yyyy-MM-dd"),
    created_at: new Date().toISOString(),
    is_read: false,
  },
  {
    id: "3",
    type: "LOW_DEMAND",
    severity: "LOW",
    apartment_type: ApartmentType.TWO_BEDROOM,
    message: "Demanda moderada esperada",
    recommendation:
      "Mantén precios actuales o considera promociones de fin de semana",
    predicted_date: format(addDays(new Date(), 7), "yyyy-MM-dd"),
    created_at: new Date().toISOString(),
    is_read: true,
  },
];

const mockCheckins: BookingWithDetails[] = [
  {
    id: 1,
    apartment_id: 1,
    client_id: 1,
    check_in_date: format(new Date(), "yyyy-MM-dd'T'14:00:00"),
    check_out_date: format(addDays(new Date(), 3), "yyyy-MM-dd'T'11:00:00"),
    num_guests: 2,
    total_price: 450,
    discount_applied: null,
    status: BookingStatus.CONFIRMED,
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: {
      id: 1,
      first_name: "María",
      last_name: "García López",
      email: "maria.garcia@email.com",
      phone: "+34 612 345 678",
      document_number: "12345678A",
      nationality: "España",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    apartment: {
      id: 1,
      name: "Estudio Mar Vista",
      type: ApartmentType.STUDIO,
      capacity: 2,
      floor: 3,
      square_meters: 45,
      amenities: "WiFi, AC, Terraza",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 2,
    apartment_id: 5,
    client_id: 2,
    check_in_date: format(new Date(), "yyyy-MM-dd'T'16:00:00"),
    check_out_date: format(addDays(new Date(), 5), "yyyy-MM-dd'T'11:00:00"),
    num_guests: 4,
    total_price: 890,
    discount_applied: 10,
    status: BookingStatus.CONFIRMED,
    notes: "Early check-in requested",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: {
      id: 2,
      first_name: "John",
      last_name: "Smith",
      email: "john.smith@email.com",
      phone: "+1 555 123 4567",
      document_number: "AB123456",
      nationality: "USA",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    apartment: {
      id: 5,
      name: "Suite Panorámica",
      type: ApartmentType.SUITE,
      capacity: 4,
      floor: 8,
      square_meters: 85,
      amenities: "WiFi, AC, Jacuzzi, Vista Mar",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 3,
    apartment_id: 3,
    client_id: 3,
    check_in_date: format(addDays(new Date(), 1), "yyyy-MM-dd'T'15:00:00"),
    check_out_date: format(addDays(new Date(), 4), "yyyy-MM-dd'T'11:00:00"),
    num_guests: 3,
    total_price: 520,
    discount_applied: null,
    status: BookingStatus.PENDING,
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: {
      id: 3,
      first_name: "Pierre",
      last_name: "Dubois",
      email: "pierre.dubois@email.fr",
      phone: "+33 6 12 34 56 78",
      document_number: "FR98765432",
      nationality: "Francia",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    apartment: {
      id: 3,
      name: "Apartamento Central",
      type: ApartmentType.ONE_BEDROOM,
      capacity: 3,
      floor: 2,
      square_meters: 55,
      amenities: "WiFi, AC",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: 4,
    apartment_id: 7,
    client_id: 4,
    check_in_date: format(addDays(new Date(), 2), "yyyy-MM-dd'T'14:00:00"),
    check_out_date: format(addDays(new Date(), 7), "yyyy-MM-dd'T'11:00:00"),
    num_guests: 2,
    total_price: 1250,
    discount_applied: 15,
    status: BookingStatus.CONFIRMED,
    notes: "Anniversary trip",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    client: {
      id: 4,
      first_name: "Hans",
      last_name: "Mueller",
      email: "hans.mueller@email.de",
      phone: "+49 170 1234567",
      document_number: "DE12345678",
      nationality: "Alemania",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    apartment: {
      id: 7,
      name: "Penthouse Luxury",
      type: ApartmentType.PENTHOUSE,
      capacity: 4,
      floor: 10,
      square_meters: 120,
      amenities: "WiFi, AC, Jacuzzi, Terraza Privada, Vista 360°",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];

// =============================================================================
// MAIN DASHBOARD PAGE
// =============================================================================

export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Dashboard state
  const [kpis, setKPIs] = useState<DashboardKPIs | null>(null);
  const [occupancyData, setOccupancyData] = useState<OccupancyDataPoint[]>([]);
  const [occupancyByType, setOccupancyByType] = useState<OccupancyByType[]>([]);
  const [alerts, setAlerts] = useState<PredictionAlert[]>([]);
  const [checkins, setCheckins] = useState<BookingWithDetails[]>([]);

  // Filters
  const [filters, setFilters] = useState<DashboardFilters>({
    date_range: {
      start: format(subDays(new Date(), 30), "yyyy-MM-dd"),
      end: format(new Date(), "yyyy-MM-dd"),
    },
    apartment_types: [],
    booking_status: [],
    include_predictions: true,
    comparison_period: "PREVIOUS_PERIOD",
  });

  // Simulate data loading
const loadData = useCallback(async () => {
  setIsLoading(true); // Opcional: mostrar loading al refrescar
  
  try {
    // Ahora esta función usará el valor más actual de 'filters'
    const data = await fetchAndCombineData(filters); 
    
    setKPIs(mockKPIs); // Si tus KPIs también vienen de API, cámbialos aquí también
    setOccupancyData(data);
    setOccupancyByType(mockOccupancyByType);
    setAlerts(mockAlerts);
    setCheckins(mockCheckins);
    setLastUpdated(new Date().toISOString());
  } catch (error) {
    console.error("Error cargando datos:", error);
  } finally {
    setIsLoading(false);
  }
}, [filters]); // <--- ESTO ES LO QUE TE FALTA

  useEffect(() => {
    setIsLoading(true);
    loadData().finally(() => setIsLoading(false));
  }, [loadData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handleMarkAlertAsRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, is_read: true } : alert
      )
    );
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="">
      {/* Sidebar */}
      <SiteHeaderAdmin/>

      {/* Main Content */}
      <main
      >
        <DashboardHeader
          title="Dashboard"
          subtitle="Motor de Reservas - Panel de Administración"
          lastUpdated={lastUpdated}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          unreadAlerts={alerts.filter((a) => !a.is_read).length}
        />

        <div className="p-6">
          {/* KPI Cards */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
              title="Ingresos Totales"
              value={formatCurrency(kpis?.totalRevenue ?? 0)}
              icon="revenue"
              loading={isLoading}
            />
            <KPICard
              title="Ingreso Promedio/Reserva"
              value={formatCurrency(kpis?.averageRevenuePerBooking ?? 0)}
              icon="bookings"
              loading={isLoading}
            />
            <KPICard
              title="Total Reservas"
              value={String(kpis?.totalBookings ?? 0)}
              icon="checkins"
              loading={isLoading}
            />
            <KPICard
              title="Noches Totales"
              value={new Intl.NumberFormat("es-ES").format(kpis?.totalNights ?? 0)}
              icon="occupancy"
              loading={isLoading}
            />
          </div>

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Chart and Checkins */}
            <div className="space-y-6 lg:col-span-2">
              <OccupancyChart
                data={occupancyData}
                loading={isLoading}
                title="Ocupación: Real vs Predicción IA"
              />
              <UpcomingCheckins checkins={checkins} loading={isLoading} />
            </div>

            {/* Right Column - Filters, Alerts, Stats */}
            <div className="space-y-6">
              <GlobalFilters
                filters={filters}
                onFiltersChange={setFilters}
                loading={isLoading}
              />
              <OccupancyByTypeCard
                data={occupancyByType}
                loading={isLoading}
              />
              <PredictionAlerts
                alerts={alerts}
                loading={isLoading}
                onMarkAsRead={handleMarkAlertAsRead}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
