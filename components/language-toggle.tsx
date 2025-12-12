"use client"

import { Button } from "@/components/ui/button"
import { locales, type Locale } from "@/i18n/config"
import { usePathname, useRouter } from "@/navigation"
import { useLocale, useTranslations } from "next-intl"

export function LanguageToggle() {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("Common.actions.language")

  const nextLocale = locales.find((item) => item !== locale) ?? locale

  return (
    <Button
      variant="ghost"
      size="sm"
      className="font-semibold"
      onClick={() => router.replace(pathname, { locale: nextLocale })}
    >
      {t(nextLocale)}
    </Button>
  )
}

