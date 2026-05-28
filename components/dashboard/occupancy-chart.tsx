"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import { OccupancyDataPoint } from "@/types/booking";
import { Info } from "lucide-react";

interface OccupancyChartProps {
  data: OccupancyDataPoint[];
  loading?: boolean;
  title?: string;
  showLegend?: boolean;
}

/**
 * Componente principal de gráfica de ocupación
 * 
 * Muestra datos reales (históricos) y predicciones de IA en una sola visualización
 * 
 * Cálculo matemático de ocupación:
 * 
 * Ocupación Diaria (%) = (Apartamentos Ocupados / Total Apartamentos) × 100
 * 
 * Donde:
 * - Apartamentos Ocupados = COUNT de apartments con booking activo para esa fecha
 * - Un booking está activo si: check_in_date <= fecha <= check_out_date
 */
export function OccupancyChart({
  data,
  loading = false,
  title = "Ocupación",
  showLegend = true,
}: OccupancyChartProps) {
  // Procesar datos para la gráfica
  const chartData = useMemo(() => {
    return data.map((point) => ({
      date: new Date(point.date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
      }),
      fullDate: point.date,
      actual: point.actual_occupancy_rate,
      predicted: point.predicted_occupancy_rate,
      confidence: point.prediction_confidence,
      isHistorical: point.is_historical,
      isPrediction: point.is_prediction,
    }));
  }, [data]);

  // Encontrar la fecha de transición (hoy)
  const todayIndex = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return chartData.findIndex((d) => d.fullDate >= today);
  }, [chartData]);

  if (loading) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full animate-pulse rounded-lg bg-muted" />
        </CardContent>
      </Card>
    );
  }

  // Colores del tema - Verde azulado (primary) y Azul (secondary)
  const primaryColor = "hsl(175, 70%, 41%)";
  const secondaryColor = "hsl(210, 100%, 50%)";
  const mutedColor = "hsl(215, 16%, 47%)";
  const borderColor = "hsl(214, 32%, 91%)";

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-primary/50 bg-primary/10 text-primary"
            >
              <span className="mr-1.5 h-2 w-2 rounded-full bg-primary" />
              Real
            </Badge>
            <Badge
              variant="outline"
              className="border-secondary/50 bg-secondary/10 text-secondary"
            >
              <span className="mr-1.5 h-2 w-2 rounded-full bg-secondary" />
              Predicción IA
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          <span>Hover para ver detalles</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={primaryColor}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor={primaryColor}
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient
                  id="predictedGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={secondaryColor}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor={secondaryColor}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={borderColor}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke={mutedColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: mutedColor }}
              />
              <YAxis
                stroke={mutedColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
                tick={{ fill: mutedColor }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
                        <p className="mb-2 font-medium text-foreground">
                          {label}
                        </p>
                        {data.actual !== null && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-muted-foreground">Real:</span>
                            <span className="font-semibold text-primary">
                              {data.actual.toFixed(1)}%
                            </span>
                          </div>
                        )}
                        {data.predicted !== null && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="h-2 w-2 rounded-full bg-secondary" />
                            <span className="text-muted-foreground">
                              Predicción:
                            </span>
                            <span className="font-semibold text-secondary">
                              {data.predicted.toFixed(1)}%
                            </span>
                            {data.confidence && (
                              <span className="text-xs text-muted-foreground">
                                (±{((1 - data.confidence) * 10).toFixed(1)}%)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {showLegend && (
                <Legend
                  verticalAlign="top"
                  height={36}
                  content={() => null}
                />
              )}
              {todayIndex > 0 && (
                <ReferenceLine
                  x={chartData[todayIndex]?.date}
                  stroke={mutedColor}
                  strokeDasharray="4 4"
                  label={{
                    value: "Hoy",
                    position: "top",
                    fill: mutedColor,
                    fontSize: 11,
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey="actual"
                stroke={primaryColor}
                strokeWidth={2}
                fill="url(#actualGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: primaryColor,
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                connectNulls
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke={secondaryColor}
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#predictedGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: secondaryColor,
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                connectNulls
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
