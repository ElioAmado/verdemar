"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type ThemeConfig = {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
}

type ThemeContextType = {
  theme: ThemeConfig
  updateTheme: (newTheme: Partial<ThemeConfig>) => void
}

const defaultTheme: ThemeConfig = {
  primaryColor: "175 70% 41%", // Verde azulado
  secondaryColor: "210 100% 40%", // Azul
  backgroundColor: "0 0% 100%", // Blanco
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeConfigProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme)

  // Actualizar las variables CSS cuando cambie el tema
  useEffect(() => {
    document.documentElement.style.setProperty("--primary", theme.primaryColor)
    document.documentElement.style.setProperty("--secondary", theme.secondaryColor)
    document.documentElement.style.setProperty("--background", theme.backgroundColor)
  }, [theme])

  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    setTheme((prevTheme) => ({
      ...prevTheme,
      ...newTheme,
    }))
  }

  return <ThemeContext.Provider value={{ theme, updateTheme }}>{children}</ThemeContext.Provider>
}

export function useThemeConfig() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeConfig must be used within a ThemeConfigProvider")
  }
  return context
}
