import type React from 'react';
import '@/app/globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeConfigProvider } from '@/components/theme-config';
import { LanguageProvider } from '@/contexts/language-context';
import { icons } from 'lucide-react';
import {routing} from '@/src/i18n/routing';
import {NextIntlClientProvider, hasLocale} from 'next-intl';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Apartamentos Verde Mar',
  icons: {
    icon: '/logo.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <body /*className={inter.className}*/>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeConfigProvider>
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </ThemeConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
