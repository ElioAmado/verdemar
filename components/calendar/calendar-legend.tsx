/**
 * Componente para mostrar la leyenda de colores del calendario
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "./status-badge"

export function CalendarLegend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Leyenda</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <StatusBadge status="available" />
          <StatusBadge status="booked" />
          <StatusBadge status="checkin" />
          <StatusBadge status="checkout" />
        </div>
      </CardContent>
    </Card>
  )
}
