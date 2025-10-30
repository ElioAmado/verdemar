/**
 * Componente Badge para mostrar el estado de disponibilidad
 */

import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, XCircle } from "lucide-react"
import type { DayStatus } from "@/types/calendar"
import { STATUS_CONFIG } from "@/constants/calendar"

interface StatusBadgeProps {
  status: DayStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  const icons = {
    available: CheckCircle,
    booked: XCircle,
    checkin: Clock,
    checkout: Clock,
  }

  const Icon = icons[status]

  return (
    <Badge variant={config.variant} className="text-xs">
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}
