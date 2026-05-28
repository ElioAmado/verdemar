"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { OccupancyByType, ApartmentType } from "@/types/booking";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Building } from "lucide-react";

interface OccupancyByTypeProps {
  data: OccupancyByType[];
  loading?: boolean;
}

const apartmentTypeLabels: Record<ApartmentType, string> = {
  [ApartmentType.STUDIO]: "Estudio",
  [ApartmentType.ONE_BEDROOM]: "1 Habitación",
  [ApartmentType.TWO_BEDROOM]: "2 Habitaciones",
  [ApartmentType.PENTHOUSE]: "Penthouse",
  [ApartmentType.SUITE]: "Suite",
};

const trendConfig = {
  INCREASING: {
    icon: TrendingUp,
    color: "text-success",
    label: "Subiendo",
  },
  DECREASING: {
    icon: TrendingDown,
    color: "text-destructive",
    label: "Bajando",
  },
  STABLE: {
    icon: Minus,
    color: "text-muted-foreground",
    label: "Estable",
  },
};

export function OccupancyByTypeCard({ data, loading = false }: OccupancyByTypeProps) {
  if (loading) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Building className="h-5 w-5 text-primary" />
            Ocupación por Tipo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-2 w-full animate-pulse rounded bg-muted" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Building className="h-5 w-5 text-primary" />
          Ocupación por Tipo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item) => {
          const trend = trendConfig[item.trend];
          const TrendIcon = trend.icon;

          return (
            <div key={item.apartment_type} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {apartmentTypeLabels[item.apartment_type]}
                  </span>
                  <div className={cn("flex items-center gap-1", trend.color)}>
                    <TrendIcon className="h-3 w-3" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-chart-actual">
                    {item.current_occupancy_rate.toFixed(0)}%
                  </span>
                  <span className="text-xs text-muted-foreground">→</span>
                  <span className="text-sm font-semibold text-chart-predicted">
                    {item.predicted_occupancy_rate.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div className="relative">
                <Progress
                  value={item.current_occupancy_rate}
                  className="h-2 bg-secondary"
                />
                {/* Predicted indicator */}
                <div
                  className="absolute top-0 h-2 w-1 rounded bg-chart-predicted"
                  style={{
                    left: `${Math.min(item.predicted_occupancy_rate, 100)}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {item.booked_count} de {item.available_count + item.booked_count} unidades
                </span>
                <Badge variant="outline" className={cn("text-xs", trend.color)}>
                  {trend.label}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
