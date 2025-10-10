'use client';

import Link from 'next/link';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLanguage } from '@/contexts/language-context';

export function SiteHeaderAdmin() {
  const { t } = useLanguage();

  const scrollToSearchButton = () => {
    const element = document.getElementById('search-button');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
          />
          <span>Apartamentos Verde Mar</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link
            href="/admin/dashboard"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Inicio
          </Link>
          <Link
            href="/admin/bookings"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Reservas
          </Link>
          <Link
            href="/admin/prices"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Precios
          </Link>

          <Link
            href="/admin/clients"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Clientes
          </Link>
          <Link
            href="/admin/settings"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Configuracion
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {/* <Link href="/sign-in">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              {t('common.signIn')}
            </Button>
          </Link> */}
          <Button variant="outline" size="icon" className="md:hidden">
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
}
