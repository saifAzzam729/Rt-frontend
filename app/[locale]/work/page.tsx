import { Link } from "@/navigation"
import { Button } from "@/components/ui/button"
import { HowItWorksBar } from "@/components/how-it-works-bar"
import { getTranslations, getLocale } from "next-intl/server"
import { rtlLocales } from "@/i18n/config"
import { Search, Shield, CheckCircle2, ArrowRight, Sparkles } from "lucide-react"

const STEP_KEYS = ["browse", "createProfile", "postOrApply"] as const

const STEP_ICONS = {
  browse: Search,
  createProfile: Shield,
  postOrApply: CheckCircle2,
}

export default async function WorkPage() {
  const t = await getTranslations("Work")
  const tCommon = await getTranslations("Common")
  const locale = await getLocale()
  const isRTL = rtlLocales.includes(locale as any)

  const steps = STEP_KEYS.map((key, index) => ({
    key,
    number: index + 1,
    title: t(`steps.${key}.title`),
    description: t(`steps.${key}.description`),
    icon: STEP_ICONS[key as keyof typeof STEP_ICONS],
  }))

  return (
    <div className="min-h-screen bg-gradient-professional-subtle relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Hero Section */}
        <div className={`max-w-4xl mx-auto text-center space-y-6 mb-20 ${isRTL ? "text-right" : "text-left"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 border border-blue-100 text-blue-700 text-sm font-semibold mb-4">
            <Sparkles className="h-4 w-4" />
            <span>{t("subtitle")}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gradient-primary tracking-tight">
            {t("title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Steps Section */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid gap-8 md:grid-cols-3 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 -z-10"></div>

            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.key}
                  className="relative group"
                >
                  {/* Step Card */}
                  <div className="relative h-full rounded-3xl border-2 border-white/60 bg-white/90 backdrop-blur-xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-300/60">
                    {/* Number Badge */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {step.number}
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="mt-6 mb-6 flex items-center justify-center md:justify-start">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 text-blue-700 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                        <Icon className="h-8 w-8" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
                      <h3 className="text-2xl font-bold text-foreground leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow (Desktop) */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-24 -right-4 z-10">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-blue-200 shadow-md">
                          <ArrowRight className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className={`max-w-4xl mx-auto rounded-3xl border-2 border-white/60 bg-gradient-to-br from-white/95 via-blue-50/30 to-white/95 backdrop-blur-xl p-10 shadow-2xl ${isRTL ? "text-right" : "text-left"}`}>
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">{t("cta.title")}</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{t("cta.description")}</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row pt-4">
              <Button
                asChild
                className="flex-1 btn-gradient-primary text-white h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Link href="/browse/tenders" className="flex items-center justify-center gap-2">
                  {tCommon("actions.browseTenders")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 h-12 text-base font-semibold border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 hover:scale-105"
              >
                <Link href="/browse/jobs" className="flex items-center justify-center gap-2">
                  {tCommon("actions.browseJobs")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* How It Works Bar */}
        <div className="max-w-4xl mx-auto mt-20">
          <HowItWorksBar />
        </div>
      </div>
    </div>
  )
}

