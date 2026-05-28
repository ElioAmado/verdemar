"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookingWithDetails, BookingStatus } from "@/types/booking";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  Clock,
  LogIn,
  LogOut,
  User,
  ChevronRight,
} from "lucide-react";
import { format, isToday, isTomorrow, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";

interface UpcomingCheckinsProps {
  checkins: BookingWithDetails[];
  loading?: boolean;
}

const statusColors: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: "bg-warning/20 text-warning border-warning/30",
  [BookingStatus.CONFIRMED]: "bg-success/20 text-success border-success/30",
  [BookingStatus.CHECKED_IN]: "bg-info/20 text-info border-info/30",
  [BookingStatus.CHECKED_OUT]: "bg-muted text-muted-foreground border-border",
  [BookingStatus.CANCELLED]:
    "bg-destructive/20 text-destructive border-destructive/30",
};

const statusLabels: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: "Pendiente",
  [BookingStatus.CONFIRMED]: "Confirmada",
  [BookingStatus.CHECKED_IN]: "Check-in",
  [BookingStatus.CHECKED_OUT]: "Check-out",
  [BookingStatus.CANCELLED]: "Cancelada",
};

function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  if (isToday(date)) return "Hoy";
  if (isTomorrow(date)) return "Mañana";

  const days = differenceInDays(date, new Date());
  if (days > 0 && days <= 7) return `En ${days} días`;

  return format(date, "dd MMM", { locale: es });
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function UpcomingCheckins({
  checkins,
  loading = false,
}: UpcomingCheckinsProps) {
  if (loading) {
    return (
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <LogIn className="h-5 w-5 text-primary" />
            Próximos Check-ins
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border border-border p-3"
            >
              <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <LogIn className="h-5 w-5 text-primary" />
          Próximos Check-ins
        </CardTitle>
        <Badge variant="secondary" className="font-mono text-xs">
          {checkins.length}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        {checkins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 rounded-full bg-muted p-3">
              <CalendarCheck className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No hay check-ins próximos
            </p>
          </div>
        ) : (
          checkins.map((booking) => {
            const relativeDate = formatRelativeDate(booking.check_in_date);
            const isUrgent = isToday(new Date(booking.check_in_date));

            return (
              <div
                key={booking.id}
                className={cn(
                  "group flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-all hover:border-primary/30 hover:bg-accent",
                  isUrgent && "border-warning/30 bg-warning/5"
                )}
              >
              <Avatar className="h-10 w-10 border border-border">
                <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                    {getInitials(
                      booking.client.first_name,
                      booking.client.last_name
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {booking.client.first_name} {booking.client.last_name}
                    </p>
                    <Badge
                      variant="outline"
                      className={cn("text-xs", statusColors[booking.status])}
                    >
                      {statusLabels[booking.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {booking.apartment.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {booking.num_guests} huéspedes
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <Badge
                    variant={isUrgent ? "default" : "secondary"}
                    className={cn(
                      "text-xs",
                      isUrgent && "bg-warning text-warning-foreground"
                    )}
                  >
                    {relativeDate}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <LogIn className="h-3 w-3" />
                    {format(new Date(booking.check_in_date), "HH:mm")}
                    <span className="mx-1">→</span>
                    <LogOut className="h-3 w-3" />
                    {format(new Date(booking.check_out_date), "dd MMM", {
                      locale: es,
                    })}
                  </div>
                </div>

                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
