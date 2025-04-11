"use client"

import Image from "next/image"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage, languages } from "@/contexts/language-context"

interface LanguageSwitcherProps {
  className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { currentLanguage, setLanguage } = useLanguage()

  const handleLanguageChange = (code: string) => {
    setLanguage(code)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("flex items-center gap-1 px-2", className)}
          aria-label="Select language"
        >
          <Image
            src={currentLanguage.flag || "/placeholder.svg"}
            alt={currentLanguage.name}
            width={20}
            height={15}
            className="rounded-sm"
          />
          <span className="hidden sm:inline-block ml-1">{currentLanguage.name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              currentLanguage.code === language.code && "bg-muted",
            )}
            onClick={() => handleLanguageChange(language.code)}
          >
            <Image
              src={language.flag || "/placeholder.svg"}
              alt={language.name}
              width={20}
              height={15}
              className="rounded-sm"
            />
            <span className="flex-1">{language.name}</span>
            {currentLanguage.code === language.code && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
