"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Calendar from "@/components/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface CalendarProps {
    initialStartDate?: Date | null;
    initialEndDate?: Date | null;
    onRangeChange?: (range: DateRange) => void;
  }

export function DatePickerWithRange({
    className,
    onRangeChange,
  } : {
    className?: string
    onRangeChange?: (range: DateRange | undefined) => void
  }) {

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  const handleRangeChange = (range: DateRange | undefined) => {
    setDate(range)
    if (onRangeChange) {
      onRangeChange(range)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL d", { locale: es })} -{" "}
                  {format(date.to, "LLL d", { locale: es })}
                </>
              ) : (
                format(date.from, "d 'de' MMMM 'de' yyyy", { locale: es })
              )
            ) : (
              <span>Selecciona un rango de fechas</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialStartDate={date?.from ?? null}
            initialEndDate={date?.to ?? null}
            onRangeChange={handleRangeChange}
          />

        </PopoverContent>
      </Popover>
    </div>
  )
}
