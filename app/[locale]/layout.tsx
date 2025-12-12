import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, unstable_setRequestLocale } from "next-intl/server"
import { Analytics } from "@vercel/analytics/next"
import { Inter } from "next/font/google"
import { locales, rtlLocales, type Locale } from "@/i18n/config"
import "../globals.css"

const inter = Inter({
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
})

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const safeLocale = locale as Locale

  if (!locales.includes(safeLocale)) {
    notFound()
  }

  unstable_setRequestLocale(safeLocale)
  const messages = await getMessages()
  const dir = rtlLocales.includes(safeLocale) ? "rtl" : "ltr"

  return (
    <html lang={safeLocale} dir={dir}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider locale={safeLocale} messages={messages}>
          {children}
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

