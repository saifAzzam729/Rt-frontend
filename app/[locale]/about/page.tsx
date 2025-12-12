import { getTranslations, getLocale } from "next-intl/server"
import { rtlLocales } from "@/i18n/config"
import { Target, Shield, Users, Heart, Globe, CheckCircle2, Sparkles } from "lucide-react"

export default async function AboutPage() {
  const t = await getTranslations("About")
  const locale = await getLocale()
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number])

  const milestones = [
    {
      key: "mission",
      title: t("milestones.mission.title"),
      description: t("milestones.mission.description"),
      icon: Target,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      key: "safeAccess",
      title: t("milestones.safeAccess.title"),
      description: t("milestones.safeAccess.description"),
      icon: Shield,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    },
    {
      key: "builtForAll",
      title: t("milestones.builtForAll.title"),
      description: t("milestones.builtForAll.description"),
      icon: Users,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
    },
  ]

  const guidingPrinciples = [
    {
      icon: CheckCircle2,
      text: t("whatGuidesUs.fairAccess"),
      color: "blue",
    },
    {
      icon: CheckCircle2,
      text: t("whatGuidesUs.trustTransparency"),
      color: "purple",
    },
    {
      icon: CheckCircle2,
      text: t("whatGuidesUs.security"),
      color: "green",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-professional-subtle relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/3 to-purple-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Hero Section */}
          <div className={`text-center space-y-4 ${isRTL ? "text-right" : "text-left"}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
              <Sparkles className="h-3 w-3" />
              <span>{t("badge")}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gradient-primary tracking-tight">
              {t("title")}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* Milestones Cards */}
          <div className="grid gap-5 md:grid-cols-3">
            {milestones.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={item.key}
                  className="group relative"
                >
                  {/* Glow effect */}
                  <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}></div>

                  {/* Card */}
                  <div className={`relative h-full rounded-2xl border-2 border-white/60 bg-white/90 backdrop-blur-xl p-5 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:border-blue-300/60 ${isRTL ? "text-right" : "text-left"}`}>
                    {/* Icon */}
                    <div className="mb-4">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.bgGradient} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                        {item.key === "mission" && <Icon className="h-6 w-6 text-blue-600" />}
                        {item.key === "safeAccess" && <Icon className="h-6 w-6 text-purple-600" />}
                        {item.key === "builtForAll" && <Icon className="h-6 w-6 text-green-600" />}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-blue-700 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Proudly Serving Section */}
          <div className="group relative">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500"></div>

            <div className={`relative rounded-2xl border-2 border-white/60 bg-gradient-to-br from-white/95 via-blue-50/30 to-white/95 backdrop-blur-xl p-6 md:p-8 shadow-2xl ${isRTL ? "text-right" : "text-left"}`}>
              <div className="flex items-start gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg flex-shrink-0">
                  <Heart className="h-5 w-5" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground flex-1">
                  {t("proudlyServing.title")}
                </h2>
              </div>
              <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
                {t("proudlyServing.description")}
              </p>
            </div>
          </div>

          {/* What Guides Us Section */}
          <div className="group relative">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500"></div>

            <div className={`relative rounded-2xl border-2 border-white/60 bg-white/90 backdrop-blur-xl p-6 md:p-8 shadow-2xl ${isRTL ? "text-right" : "text-left"}`}>
              <div className="flex items-start gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg flex-shrink-0">
                  <Globe className="h-5 w-5" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground flex-1">
                  {t("whatGuidesUs.title")}
                </h2>
              </div>
              <div className="space-y-3">
                {guidingPrinciples.map((principle, index) => {
                  const Icon = principle.icon
                  const colorClasses = {
                    blue: "bg-blue-50 text-blue-700 border-blue-200",
                    purple: "bg-purple-50 text-purple-700 border-purple-200",
                    green: "bg-green-50 text-green-700 border-green-200",
                  }
                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg border-2 ${colorClasses[principle.color as keyof typeof colorClasses]} transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 flex-shrink-0`}>
                        <Icon className={`h-4 w-4 ${colorClasses[principle.color as keyof typeof colorClasses].split(' ')[1]}`} />
                      </div>
                      <p className="text-sm font-medium leading-relaxed flex-1">
                        {principle.text}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

