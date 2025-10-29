/**
 * Componente de encabezado para el panel de administración
 */

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, Calendar, List, Settings } from 'lucide-react';

export function SiteHeaderAdmin() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-bold">Panel de Administración</h2>
          <nav className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/dashboard')}
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/calendar')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendario
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/bookings')}
            >
              <List className="h-4 w-4 mr-2" />
              Reservas
            </Button>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin/settings')}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
