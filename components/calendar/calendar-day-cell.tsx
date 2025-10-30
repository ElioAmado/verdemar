/**
 * Componente para renderizar una celda del calendario
 */

import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import type { DayInfo } from "@/types/calendar"
import { getDayClassName } from "@/utils/calendar-helpers"
import { StatusBadge } from "./status-badge"

interface CalendarDayCellProps {
  dayInfo: DayInfo
}

export function CalendarDayCell({ dayInfo }: CalendarDayCellProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={getDayClassName(dayInfo)}>
            <div className="flex justify-between items-start">
              <span className={`text-sm font-medium ${dayInfo.isToday ? "text-primary" : ""}`}>
                {format(dayInfo.date, "d")}
              </span>
              {dayInfo.isBooked && <div className="w-2 h-2 rounded-full bg-red-500" />}
            </div>
            {dayInfo.bookings.length > 0 && (
              <div className="mt-1 space-y-1">
                {dayInfo.bookings.slice(0, 2).map((booking, i) => (
                  <div key={i} className="text-xs p-1 bg-background/80 rounded truncate">
                    {booking.clientName}
                  </div>
                ))}
                {dayInfo.bookings.length > 2 && (
                  <div className="text-xs text-muted-foreground">+{dayInfo.bookings.length - 2} más</div>
                )}
              </div>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2">
            <div className="font-semibold">{format(dayInfo.date, "dd 'de' MMMM, yyyy", { locale: es })}</div>
            <StatusBadge status={dayInfo.status} />
            {dayInfo.bookings.length > 0 && (
              <div className="space-y-1">
                <div className="text-sm font-medium">Reservas:</div>
                {dayInfo.bookings.map((booking, i) => (
                  <div key={i} className="text-sm">
                    • {booking.clientName} ({booking.guests} huéspedes)
                  </div>
                ))}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
