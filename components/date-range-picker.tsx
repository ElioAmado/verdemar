"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { es, fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import type { Locale } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useLanguage } from "@/contexts/language-context"

// Mapa de locales para date-fns
const localeMap: Record<string, Locale> = {
  en: undefined, // date-fns usa inglés por defecto
  es: es,
  fr: fr,
  // Añadir más locales según sea necesario
}

export function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const { t, currentLanguage } = useLanguage()
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  // Obtener el locale de date-fns según el idioma actual
  const locale = localeMap[currentLanguage.code]

  // Función personalizada para formatear fechas según el idioma
  const formatDate = (date: Date | undefined) => {
    if (!date) return ""

    try {
      // Usar el formato corto de mes (LLL) y día (dd)
      return format(date, "LLL dd", { locale })
    } catch (error) {
      console.error("Error formatting date:", error)
      // Fallback a un formato básico en caso de error
      return date.toLocaleDateString(currentLanguage.code)
    }
  }

  // Crear labels personalizados para el calendario según el idioma
  const calendarLabels = {
    months: t("datePicker.months", {}),
    weekdays: t("datePicker.weekdays", {}),
    today: t("datePicker.today"),
    previous: t("datePicker.previous"),
    next: t("datePicker.next"),
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
                  {formatDate(date.from)} - {formatDate(date.to)}
                </>
              ) : (
                formatDate(date.from)
              )
            ) : (
              <span>{t("datePicker.pickDate")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={locale}
            classNames={{
              caption_label: "font-medium",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              day_selected:
                "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
              caption: "flex justify-center pt-1 relative items-center",
              caption_dropdowns: "flex justify-center gap-1",
              dropdown:
                "appearance-none bg-transparent border-none p-0 m-0 text-center text-sm font-medium focus:outline-none focus:ring-0",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day_range_end: "rounded-r-md",
              day_range_start: "rounded-l-md",
            }}
            labels={{
              months: calendarLabels.months,
              weekdays: calendarLabels.weekdays,
              today: calendarLabels.today,
              previous: calendarLabels.previous,
              next: calendarLabels.next,
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
