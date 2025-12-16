import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, unstable_setRequestLocale } from "next-intl/server"
import { Analytics } from "@vercel/analytics/next"
import { Inter } from "next/font/google"
import { locales, rtlLocales, type Locale } from "@/i18n/config"
import { NavHeader } from "@/components/nav-header"
import { getCurrentUserProfile } from "@/lib/auth/server"
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

  // Get user profile if authenticated (optional, won't throw if not authenticated)
  let profile = null
  try {
    profile = await getCurrentUserProfile()
  } catch {
    // Not authenticated, that's fine
    profile = null
  }

  return (
    <html lang={safeLocale} dir={dir}>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextIntlClientProvider locale={safeLocale} messages={messages}>
          <NavHeader
            user={profile ? { email: profile.email, role: profile.role } : null}
          />
          {children}
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

