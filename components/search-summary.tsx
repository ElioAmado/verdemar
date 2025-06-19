import { useLanguage } from "@/contexts/language-context"
import { Calendar, Users, Building } from "lucide-react"

interface SearchSummaryProps {
  formattedDates: {
    start: string
    end: string
  } | null
  adults: string | null
  children: string | null
  type: string | null
  numberOfNights: number
}

export function SearchSummary({ formattedDates, adults, children, type, numberOfNights }: SearchSummaryProps) {
  if (!formattedDates) return null
  const {t} = useLanguage();

  return (
    <div className="bg-muted/50 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Check-in:</span>
          <span>{formattedDates.start}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Check-out:</span>
          <span>{formattedDates.end}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Huéspedes:</span>
          <span>
            {adults} adultos{children && `, ${children} niños`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Tipo:</span>
          <span className="capitalize">{t(`${type}`)}</span>
        </div>
      </div>
      {numberOfNights > 0 && (
        <div className="mt-2 text-sm text-muted-foreground">
          {numberOfNights} {numberOfNights === 1 ? "noche" : "noches"}
        </div>
      )}
    </div>
  )
}
