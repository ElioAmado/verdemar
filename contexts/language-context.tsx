'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import enTranslations from '@/locales/en.json';
import esTranslations from '@/locales/es.json';
import frTranslations from '@/locales/fr.json';
import itTranslations from '@/locales/it.json';
import ptTranslations from '@/locales/pt.json';
import catTranslations from '@/locales/cat.json';
import deTranslations from '@/locales/de.json';

export type Language = {
  code: string;
  name: string;
  flag: string;
};

export const languages: Language[] = [
  { code: 'es', name: 'Español', flag: 'es' },
  { code: 'cat', name: 'Català', flag: '/flags/catala.svg' },
  { code: 'it', name: 'Italiano', flag: 'it' },
  { code: 'en', name: 'English', flag: 'gb' },
  { code: 'fr', name: 'Français', flag: 'fr' },
  { code: 'de', name: 'Deutsch', flag: 'de' },
  { code: 'pt', name: 'Português', flag: 'pt' },
];


const translations: Record<string, any> = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
  it: itTranslations,
  pt: ptTranslations,
  cat: catTranslations,
  de: deTranslations,
};

type LanguageContextType = {
  currentLanguage: Language;
  setLanguage: (code: string) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages[0]
  );

  useEffect(() => {
    // Check if there's a saved language preference in localStorage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      const language = languages.find((lang) => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }
  }, []);

  const setLanguage = (code: string) => {
    const language = languages.find((lang) => lang.code === code);
    if (language) {
      setCurrentLanguage(language);
      localStorage.setItem('language', code);
    }
  };

  // Translation function
  const t = (
    key: string,
    params?: Record<string, string | number> & { defaultValue?: string }
  ): string => {
    const defaultValue = params?.defaultValue;
    // Eliminar defaultValue de params para no usarlo como parámetro de reemplazo
    if (params?.defaultValue) {
      const { defaultValue: _, ...restParams } = params;
      params = restParams;
    }

    const keys = key.split('.');
    let value = translations[currentLanguage.code];

    // Navigate through the nested keys
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if the key doesn't exist in the current language
        let fallbackValue = translations['es'];
        for (const fallbackKey of keys) {
          if (
            fallbackValue &&
            typeof fallbackValue === 'object' &&
            fallbackKey in fallbackValue
          ) {
            fallbackValue = fallbackValue[fallbackKey];
          } else {
            return defaultValue || key; // Return the defaultValue or key itself if not found in fallback
          }
        }
        value = fallbackValue;
      }
    }

    // Replace parameters in the string if any
    if (typeof value === 'string' && params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(
          new RegExp(`{${paramKey}}`, 'g'),
          String(paramValue)
        );
      }, value);
    }

    // return typeof value === "string" ? value : defaultValue || key
    return value; // Return the value if it's a string, otherwise return the defaultValue or key itself
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
