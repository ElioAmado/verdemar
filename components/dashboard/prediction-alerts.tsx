"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PredictionAlert } from "@/types/booking";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  Check,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface PredictionAlertsProps {
  alerts: PredictionAlert[];
  loading?: boolean;
  onMarkAsRead?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
}

const alertTypeConfig = {
  HIGH_DEMAND: {
    icon: TrendingUp,
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/30",
  },
  LOW_DEMAND: {
    icon: TrendingDown,
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
  },
  PRICE_ADJUSTMENT: {
    icon: DollarSign,
    color: "text-info",
    bgColor: "bg-info/10",
    borderColor: "border-info/30",
  },
  OVERBOOKING_RISK: {
    icon: AlertTriangle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/30",
  },
};

const severityColors = {
  LOW: "bg-muted text-muted-foreground",
  MEDIUM: "bg-warning/20 text-warning",
  HIGH: "bg-destructive/20 text-destructive",
  CRITICAL: "bg-destructive text-destructive-foreground",
};

export function PredictionAlerts({
  alerts,
  loading = false,
  onMarkAsRead,
  onDismiss,
}: PredictionAlertsProps) {
  if (loading) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-5 w-5 text-primary" />
            Alertas Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 w-full animate-pulse rounded-lg bg-muted"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="h-5 w-5 text-primary" />
            Alertas Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 rounded-full bg-success/10 p-3">
              <Check className="h-6 w-6 text-success" />
            </div>
            <p className="font-medium text-foreground">Todo en orden</p>
            <p className="text-sm text-muted-foreground">
              No hay alertas pendientes
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Sparkles className="h-5 w-5 text-primary" />
          Alertas Inteligentes
          {alerts.filter((a) => !a.is_read).length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {alerts.filter((a) => !a.is_read).length} nuevas
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => {
          const config = alertTypeConfig[alert.type];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={cn(
                "relative rounded-lg border p-4 transition-all",
                config.borderColor,
                config.bgColor,
                !alert.is_read && "ring-1 ring-primary/20"
              )}
            >
              {/* Dismiss button */}
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6 opacity-50 hover:opacity-100"
                  onClick={() => onDismiss(alert.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              <div className="flex items-start gap-3">
                <div className={cn("rounded-lg p-2", config.bgColor)}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                <div className="flex-1 pr-6">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn("text-xs", severityColors[alert.severity])}
                    >
                      {alert.severity}
                    </Badge>
                    {alert.apartment_type && (
                      <Badge variant="outline" className="text-xs">
                        {alert.apartment_type.replace("_", " ")}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.predicted_date).toLocaleDateString(
                        "es-ES",
                        {
                          day: "numeric",
                          month: "short",
                        }
                      )}
                    </span>
                  </div>
                  <p className="mb-1 text-sm font-medium text-foreground">
                    {alert.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {alert.recommendation}
                  </p>
                </div>
              </div>

              {!alert.is_read && onMarkAsRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-7 w-full justify-between text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => onMarkAsRead(alert.id)}
                >
                  <span>Marcar como leída</span>
                  <ChevronRight className="h-3 w-3" />
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
