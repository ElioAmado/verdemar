'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, RefreshCcw } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
  alertsCount?: number;
}

export function DashboardHeader({
  title,
  subtitle,
  onRefresh,
  isLoading,
  alertsCount = 0,
}: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {/* Notifications */}
        {/* <Button variant="outline" size="icon" className="relative bg-secondary border-border">
          <Bell className="h-4 w-4" />
          {alertsCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-primary-foreground text-xs"
            >
              {alertsCount > 9 ? '9+' : alertsCount}
            </Badge>
          )}
        </Button> */}
        
        {/* Refresh Button */}
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isLoading}
            className="bg-secondary border-border"
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        )}
      </div>
    </header>
  );
}
