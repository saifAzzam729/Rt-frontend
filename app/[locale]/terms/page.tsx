import { getTranslations, getLocale } from "next-intl/server"
import { rtlLocales } from "@/i18n/config"
import { FileText, Sparkles } from "lucide-react"

export default async function TermsPage() {
  const t = await getTranslations("Terms")
  const locale = await getLocale()
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number])

  return (
    <div className="min-h-screen bg-gradient-professional-subtle relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className={`text-center space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
              <Sparkles className="h-3 w-3" />
              <span>{t("badge")}</span>
            </div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                <FileText className="h-6 w-6" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gradient-primary tracking-tight">
                {t("title")}
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("lastUpdated")}
            </p>
          </div>

          {/* Content Section */}
          <div className={`rounded-2xl border-2 border-white/60 bg-white/90 backdrop-blur-xl p-6 md:p-8 shadow-2xl space-y-6 ${isRTL ? "text-right" : "text-left"}`}>
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{t("sections.acceptance.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("sections.acceptance.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{t("sections.use.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("sections.use.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{t("sections.userAccounts.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("sections.userAccounts.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{t("sections.prohibited.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("sections.prohibited.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{t("sections.liability.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("sections.liability.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{t("sections.changes.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("sections.changes.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">{t("sections.contact.title")}</h2>
              <p className="text-muted-foreground leading-relaxed">{t("sections.contact.content")}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}


