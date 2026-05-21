'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, TrendingDown, Lightbulb, Info } from 'lucide-react';
import { SmartAlert, AlertType, AlertPriority } from '@/types/booking';
import { cn } from '@/lib/utils';

interface SmartAlertsProps {
  alerts: SmartAlert[];
}

const alertConfig: Record<AlertType, { icon: React.ReactNode; color: string }> = {
  high_demand: {
    icon: <TrendingUp className="h-4 w-4" />,
    color: 'text-primary',
  },
  low_occupancy: {
    icon: <TrendingDown className="h-4 w-4" />,
    color: 'text-chart-3',
  },
  price_suggestion: {
    icon: <Lightbulb className="h-4 w-4" />,
    color: 'text-chart-2',
  },
  maintenance: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'text-destructive',
  },
  info: {
    icon: <Info className="h-4 w-4" />,
    color: 'text-muted-foreground',
  },
};

const priorityConfig: Record<AlertPriority, { badge: string; bgColor: string }> = {
  high: {
    badge: 'Alta',
    bgColor: 'bg-destructive/20 text-destructive border-destructive/30',
  },
  medium: {
    badge: 'Media',
    bgColor: 'bg-chart-3/20 text-chart-3 border-chart-3/30',
  },
  low: {
    badge: 'Baja',
    bgColor: 'bg-muted text-muted-foreground border-border',
  },
};

function AlertItem({ alert }: { alert: SmartAlert }) {
  const config = alertConfig[alert.type];
  const priority = priorityConfig[alert.priority];

  return (
    <div className="flex gap-3 p-3 rounded-lg bg-secondary/50 border border-border hover:bg-secondary/80 transition-colors">
      <div className={cn("mt-0.5", config.color)}>
        {config.icon}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground">{alert.title}</span>
          <Badge variant="outline" className={cn("text-xs", priority.bgColor)}>
            {priority.badge}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {alert.message}
        </p>
        {alert.suggested_action && (
          <div className="flex items-center gap-1 pt-1">
            <Lightbulb className="h-3 w-3 text-primary" />
            <span className="text-xs text-primary font-medium">{alert.suggested_action}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function SmartAlerts({ alerts }: SmartAlertsProps) {
  if (alerts.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Alertas Inteligentes</CardTitle>
          <CardDescription className="text-muted-foreground">
            Recomendaciones basadas en predicciones de IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Info className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No hay alertas activas en este momento</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Alertas Inteligentes</CardTitle>
            <CardDescription className="text-muted-foreground">
              Recomendaciones basadas en predicciones de IA
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            {alerts.length} {alerts.length === 1 ? 'alerta' : 'alertas'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </CardContent>
    </Card>
  );
}
