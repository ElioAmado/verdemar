'use client';

import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { OccupancyDataPoint } from '@/types/booking';

interface OccupancyChartProps {
  data: OccupancyDataPoint[];
  averageOccupancy: number;
  averagePredicted: number;
}

const chartConfig = {
  occupancy_real: {
    label: 'Ocupación Real',
    color: 'var(--chart-1)',
  },
  occupancy_predicted: {
    label: 'Predicción IA',
    color: 'var(--chart-2)',
  },
};

function formatMonth(dateStr: string): string {
  const [year, month] = dateStr.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${months[parseInt(month) - 1]} ${year.slice(2)}`;
}

export function OccupancyChart({ data, averageOccupancy, averagePredicted }: OccupancyChartProps) {
  const chartData = useMemo(() => {
    return data.map(point => ({
      month: formatMonth(point.date),
      fullDate: point.date,
      occupancy_real: point.occupancy_real,
      occupancy_predicted: point.occupancy_predicted,
      is_prediction: point.is_prediction,
    }));
  }, [data]);

  // Find the transition point between real and predicted data
  const transitionIndex = chartData.findIndex(d => d.is_prediction);

  return (
    <Card className="bg-card border-border col-span-full lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Gráfica de Ocupación</CardTitle>
            <CardDescription className="text-muted-foreground">
              Ocupación real vs. predicción de IA para los próximos 12 meses
            </CardDescription>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--chart-1)' }} />
              <span className="text-muted-foreground">
                Real: <span className="text-foreground font-medium">{averageOccupancy.toFixed(1)}%</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--chart-2)' }} />
              <span className="text-muted-foreground">
                Predicción: <span className="text-foreground font-medium">{averagePredicted.toFixed(1)}%</span>
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="realGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
                tickMargin={8}
              />
              <ChartTooltip 
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      const label = name === 'occupancy_real' ? 'Ocupación Real' : 'Predicción IA';
                      return [`${Number(value).toFixed(1)}%`, label];
                    }}
                  />
                }
              />
              {transitionIndex > 0 && (
                <ReferenceLine
                  x={chartData[transitionIndex]?.month}
                  stroke="var(--muted-foreground)"
                  strokeDasharray="5 5"
                  strokeOpacity={0.5}
                  label={{
                    value: 'Predicciones',
                    position: 'insideTopRight',
                    fill: 'var(--muted-foreground)',
                    fontSize: 11,
                  }}
                />
              )}
              <Area
                type="monotone"
                dataKey="occupancy_real"
                stroke="var(--chart-1)"
                strokeWidth={2}
                fill="url(#realGradient)"
                connectNulls={false}
                dot={{ fill: 'var(--chart-1)', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: 'var(--chart-1)' }}
              />
              <Area
                type="monotone"
                dataKey="occupancy_predicted"
                stroke="var(--chart-2)"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#predictedGradient)"
                connectNulls={false}
                dot={{ fill: 'var(--chart-2)', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: 'var(--chart-2)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
