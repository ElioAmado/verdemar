/**
 * Constantes para el calendario de administración
 */

export const WEEK_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export const STATUS_CONFIG = {
  available: {
    variant: 'outline' as const,
    label: 'Disponible',
    bgClass: 'bg-background',
  },
  booked: {
    variant: 'destructive' as const,
    label: 'Ocupado',
    bgClass: 'bg-red-100 border-red-200 dark:bg-red-900/20 dark:border-red-800',
  },
  checkin: {
    variant: 'default' as const,
    label: 'Check-in',
    bgClass:
      'bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800',
  },
  checkout: {
    variant: 'secondary' as const,
    label: 'Check-out',
    bgClass:
      'bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
  },
} as const;
