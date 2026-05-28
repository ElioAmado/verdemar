"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Building2,
  DollarSign,
  CalendarCheck,
  Users,
} from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: "occupancy" | "revenue" | "bookings" | "checkins";
  loading?: boolean;
}

const iconMap = {
  occupancy: Building2,
  revenue: DollarSign,
  bookings: CalendarCheck,
  checkins: Users,
};

export function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon,
  loading = false,
}: KPICardProps) {
  const Icon = iconMap[icon];

  const getTrendIcon = () => {
    if (change === undefined || change === 0) return Minus;
    return change > 0 ? TrendingUp : TrendingDown;
  };

  const getTrendColor = () => {
    if (change === undefined || change === 0) return "text-muted-foreground";
    return change > 0 ? "text-success" : "text-destructive";
  };

  const TrendIcon = getTrendIcon();

  if (loading) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-8 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            {change !== undefined && (
              <div className={cn("flex items-center gap-1 text-sm", getTrendColor())}>
                <TrendIcon className="h-4 w-4" />
                <span className="font-medium">
                  {change > 0 ? "+" : ""}
                  {change.toFixed(1)}%
                </span>
                {changeLabel && (
                  <span className="text-muted-foreground">{changeLabel}</span>
                )}
              </div>
            )}
          </div>
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
