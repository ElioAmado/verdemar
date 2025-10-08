import type React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });
import { ThemeConfigProvider } from '@/components/theme-config';
import { LanguageProvider } from '@/contexts/language-context';
import { icons } from 'lucide-react';

export const metadata = {
  title: 'Apartamentos formentera Verde Mar',
  description:
    'Disfruta de una estancia inolvidable en nuestros apartamentos turísticos en Es Pujols, Formentera. Perfectamente ubicados cerca de la playa, ofrecen confort, tranquilidad y todas las comodidades para unas vacaciones relajantes en un entorno natural único. Ideal para parejas, familias y amantes del mar.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeConfigProvider>
            <LanguageProvider>
              {children} {/* 👈 Aquí pintas las páginas */}
            </LanguageProvider>
          </ThemeConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
