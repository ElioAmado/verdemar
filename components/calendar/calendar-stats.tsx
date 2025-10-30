/**
 * Componente para mostrar las estadísticas del calendario
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle, Info, XCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { CalendarStats } from "@/types/calendar"

interface CalendarStatsProps {
  stats: CalendarStats
  currentDate: Date
}

export function CalendarStatsCards({ stats, currentDate }: CalendarStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Días del Mes</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDays}</div>
          <p className="text-xs text-muted-foreground">{format(currentDate, "MMMM yyyy", { locale: es })}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Días Ocupados</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.bookedDays}</div>
          <p className="text-xs text-muted-foreground">Reservas confirmadas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Días Disponibles</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.availableDays}</div>
          <p className="text-xs text-muted-foreground">Sin reservas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ocupación</CardTitle>
          <Info className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.occupancyRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">Tasa de ocupación</p>
        </CardContent>
      </Card>
    </div>
  )
}
