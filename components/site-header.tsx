'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLanguage } from '@/contexts/language-context';

export function SiteHeader() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSearchButton = () => {
    const element = document.getElementById('search-button');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false); // cerrar menú si estaba abierto
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Image src="/logo.png" alt="Logo" width={32} height={32} />
          <span>Apartamentos Verde Mar</span>
        </Link>

        {/* Nav escritorio */}
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            {t('common.home')}
          </Link>
          <Link href="/amenities" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            {t('common.amenities')}
          </Link>
          <Link href="/gallery" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            {t('common.gallery')}
          </Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            {t('common.contact')}
          </Link>
        </nav>

        {/* Controles derecha */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher className="mr-2" />
          {/* <Button size="sm" className="hidden md:flex" onClick={scrollToSearchButton}>
            {t('common.bookNow')}
          </Button> */}
          {/* Botón hamburguesa móvil */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
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

      {/* Menú móvil */}
      {isOpen && (
        <nav className="md:hidden bg-background border-t shadow-lg p-4 space-y-2">
          <Link href="/" onClick={() => setIsOpen(false)} className="block text-sm font-medium">
            {t('common.home')}
          </Link>
          <Link href="/rooms" onClick={() => setIsOpen(false)} className="block text-sm font-medium">
            {t('common.rooms')}
          </Link>
          <Link href="/amenities" onClick={() => setIsOpen(false)} className="block text-sm font-medium">
            {t('common.amenities')}
          </Link>
          <Link href="/gallery" onClick={() => setIsOpen(false)} className="block text-sm font-medium">
            {t('common.gallery')}
          </Link>
          <Link href="/contact" onClick={() => setIsOpen(false)} className="block text-sm font-medium">
            {t('common.contact')}
          </Link>
        </nav>
      )}
    </header>
  );
}
