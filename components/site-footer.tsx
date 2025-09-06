'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-context';

export function SiteFooter() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand + Social */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <Image
                src="/logo.png"
                alt="Logo de Apartamentos Verde Mar"
                width={32}
                height={32}
              />
              <span>Apartamentos Verde Mar</span>
            </Link>
            <p className="text-muted-foreground">{t('footer.description')}</p>
            {/* 
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full">

                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">

                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">

                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
                <span className="sr-only">Twitter</span>
              </Button>
            </div> 
            */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-muted-foreground hover:text-foreground">{t('common.home')}</Link>
              <Link href="/rooms" className="text-muted-foreground hover:text-foreground">{t('common.rooms')}</Link>
              <Link href="/amenities" className="text-muted-foreground hover:text-foreground">{t('common.amenities')}</Link>
              <Link href="/gallery" className="text-muted-foreground hover:text-foreground">{t('common.gallery')}</Link>
              {/* <Link href="/about" className="text-muted-foreground hover:text-foreground">{t('common.about')}</Link> */}
              <Link href="/contact" className="text-muted-foreground hover:text-foreground">{t('common.contact')}</Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <address className="not-italic space-y-2 text-muted-foreground">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t('footer.address')}
              </p>
              <p className="flex items-center gap-2">
                {/* Tel Icon */}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.1 4.11 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {t('common.phone')}
              </p>
              <p className="flex items-center gap-2">
                {/* Email Icon */}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                {t('common.email')}
              </p>
            </address>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
          <p>{t('common.footer.copyright', { year: currentYear })}</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/terms" className="hover:text-foreground">{t('common.footer.terms')}</Link>
            <Link href="/privacy" className="hover:text-foreground">{t('common.footer.privacy')}</Link>
            <Link href="/contact" className="hover:text-foreground">{t('common.footer.contact')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
