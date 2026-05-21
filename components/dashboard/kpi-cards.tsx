'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Building2, DollarSign, Calendar, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number | undefined | null; // Permite nulos temporalmente
  subtitle?: string;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  format?: 'number' | 'currency' | 'percentage';
}

function formatValue(value: string | number | undefined | null, format?: 'number' | 'currency' | 'percentage'): string {
  // Protección si el dato aún no llega de la API
  if (value === undefined || value === null) return "---";
  if (typeof value === 'string') return value;
  
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('es-ES', { 
        style: 'currency', 
        currency: 'EUR',
        minimumFractionDigits: 2, // Cambiado a 2 para ver los centavos reales de tu API
        maximumFractionDigits: 2,
      }).format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    default:
      return new Intl.NumberFormat('es-ES').format(value);
  }
}

function KPICard({ title, value, subtitle, change, changeLabel, icon, format }: KPICardProps) {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {formatValue(value, format)}
        </div>
        {(subtitle || change !== undefined) && (
          <div className="flex items-center gap-2 mt-1">
            {change !== undefined && (
              <span className={cn(
                "flex items-center text-xs font-medium",
                isPositive ? "text-primary" : "text-destructive"
              )}>
                {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {isPositive ? '+' : ''}{change.toFixed(1)}%
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 1. Modificamos esta interfaz para usar los datos reales de tu backend
interface KPICardsProps {
  totalRevenue: number | undefined;
  totalBookings: number | undefined;
  totalNights: number | undefined;
  averageRevenuePerBooking: number | undefined;
}

export function KPICards({
  totalRevenue,
  totalBookings,
  totalNights,
  averageRevenuePerBooking,
}: KPICardsProps) {
  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Ingresos Totales"
        value={totalRevenue}
        format="currency"
        icon={<DollarSign className="h-4 w-4" />}
      />
      <KPICard
        title="Reservas Totales"
        value={totalBookings}
        format="number"
        icon={<Calendar className="h-4 w-4" />}
      />
      <KPICard
        title="Noches Totales"
        value={totalNights}
        format="number"
        icon={<Building2 className="h-4 w-4" />}
      />
      <KPICard
        title="Ingreso Promedio x Reserva"
        value={averageRevenuePerBooking}
        format="currency"
        icon={<ShieldAlert className="h-4 w-4" />}
      />
    </div>
  );
}