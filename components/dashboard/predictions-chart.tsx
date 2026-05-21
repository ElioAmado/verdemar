'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BookingPrediction } from '@/types/booking';

interface PredictionsChartProps {
  predictions: BookingPrediction[];
  year: number;
}

const chartConfig = {
  predicted_revenue: {
    label: 'Ingresos Predichos',
    color: 'var(--chart-1)',
  },
  predicted_bookings: {
    label: 'Reservas Predichas',
    color: 'var(--chart-2)',
  },
};

function formatMonth(monthStr: string): string {
  const [, month] = monthStr.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return months[parseInt(month) - 1];
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function PredictionsChart({ predictions, year }: PredictionsChartProps) {
  const chartData = useMemo(() => {
    return predictions.map(pred => ({
      month: formatMonth(pred.month),
      fullMonth: pred.month,
      predicted_revenue: pred.predicted_revenue,
      predicted_bookings: pred.predicted_bookings,
      predicted_occupancy: pred.predicted_occupancy,
      confidence: pred.confidence,
    }));
  }, [predictions]);

  const totalRevenue = predictions.reduce((sum, p) => sum + p.predicted_revenue, 0);
  const totalBookings = predictions.reduce((sum, p) => sum + p.predicted_bookings, 0);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Predicción de Ingresos {year}</CardTitle>
            <CardDescription className="text-muted-foreground">
              Ingresos mensuales predichos por el modelo de IA
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</p>
            <p className="text-xs text-muted-foreground">{totalBookings} reservas previstas</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--border)" 
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                tickMargin={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                tickMargin={8}
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      if (name === 'predicted_revenue') {
                        return [formatCurrency(Number(value)), 'Ingresos'];
                      }
                      return [value, name];
                    }}
                  />
                }
              />
              <Bar
                dataKey="predicted_revenue"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
