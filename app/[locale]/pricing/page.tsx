"use client"

import { useState, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import { rtlLocales } from "@/i18n/config"
import { apiClient } from "@/lib/api/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2, Sparkles, TrendingUp, Building2, FileText, Briefcase, Users, Zap } from "lucide-react"
import { Link } from "@/navigation"

interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  period: "one-time" | "yearly"
  features: string[]
}

interface PricingData {
  tender: {
    single: PricingPlan
    yearly: PricingPlan
  }
  job: {
    single: PricingPlan
    yearly: PricingPlan
  }
  combined: PricingPlan
  vendor: PricingPlan
  vendorAdvertisement: PricingPlan
}

export default function PricingPage() {
  const t = useTranslations("Pricing")
  const locale = useLocale()
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number])

  const [pricing, setPricing] = useState<PricingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await apiClient.getPricing()
        setPricing(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : t("errors.fetchFailed"))
      } finally {
        setLoading(false)
      }
    }

    fetchPricing()
  }, [t])

  const formatPrice = (price: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getPlanIcon = (planId: string) => {
    if (planId.includes("tender")) return FileText
    if (planId.includes("job")) return Briefcase
    if (planId.includes("combined")) return Zap
    if (planId.includes("vendor")) return Building2
    return TrendingUp
  }

  const getPlanBadge = (period: string) => {
    if (period === "yearly") {
      return (
        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-md px-2 py-1 text-xs font-semibold">
          {t("badges.yearly")}
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="border-blue-400/60 text-blue-700 bg-blue-50/50 px-2 py-1 text-xs font-semibold">
        {t("badges.oneTime")}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-professional-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (error || !pricing) {
    return (
      <div className="min-h-screen bg-gradient-professional-subtle flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-destructive text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold">{t("errors.title")}</h2>
            <p className="text-muted-foreground">{error || t("errors.fetchFailed")}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              {t("errors.retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const planSections = [
    {
      title: t("sections.tender.title"),
      description: t("sections.tender.description"),
      plans: [
        { key: "single", plan: pricing.tender.single },
        { key: "yearly", plan: pricing.tender.yearly },
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: t("sections.job.title"),
      description: t("sections.job.description"),
      plans: [
        { key: "single", plan: pricing.job.single },
        { key: "yearly", plan: pricing.job.yearly },
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      title: t("sections.combined.title"),
      description: t("sections.combined.description"),
      plans: [{ key: "combined", plan: pricing.combined }],
      color: "from-emerald-500 to-teal-500",
      featured: true,
    },
    {
      title: t("sections.vendor.title"),
      description: t("sections.vendor.description"),
      plans: [
        { key: "yearly", plan: pricing.vendor },
        { key: "advertisement", plan: pricing.vendorAdvertisement },
      ],
      color: "from-orange-500 to-red-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-professional-subtle relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-blue-400/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 md:py-20 pb-40 md:pb-48 relative z-10">
        {/* Hero Section */}
        <div className={`text-center space-y-6 mb-20 max-w-4xl mx-auto ${isRTL ? "text-right" : "text-left"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 text-blue-700 text-sm font-semibold mb-4 shadow-sm">
            <Sparkles className="h-4 w-4" />
            <span>{t("badge")}</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gradient-primary tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Pricing Plans */}
        <div className="space-y-16 md:space-y-20 lg:space-y-24">
          {planSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-10 md:space-y-12">
              <div className="text-center space-y-3 mb-10 md:mb-12">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-primary mb-3">
                  {section.title}
                </h2>
                <p className="text-muted-foreground text-base md:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                  {section.description}
                </p>
              </div>

              <div
                className={`grid gap-6 md:gap-8 items-stretch ${section.plans.length === 1
                  ? "md:grid-cols-1 max-w-2xl mx-auto"
                  : section.plans.length === 2
                    ? "md:grid-cols-2 lg:grid-cols-2"
                    : "md:grid-cols-3"
                  }`}
              >
                {section.plans.map(({ key, plan }) => {
                  const Icon = getPlanIcon(plan.id)
                  const isFeatured = section.featured && key === "combined"

                  return (
                    <Card
                      key={plan.id}
                      className={`group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white/95 backdrop-blur-sm flex flex-col h-full ${isFeatured
                        ? "border-2 border-blue-500/50 shadow-2xl scale-[1.02] ring-4 ring-blue-500/10"
                        : "border border-gray-200/60 shadow-lg hover:border-blue-300/50"
                        }`}
                    >
                      {isFeatured && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white px-3 py-1 text-xs font-bold rounded-bl-xl shadow-lg z-10">
                          <span className="flex items-center gap-1">
                            <Sparkles className="h-2.5 w-2.5" />
                            {t("badges.popular")}
                          </span>
                        </div>
                      )}

                      {/* Gradient overlay for featured */}
                      {isFeatured && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 pointer-events-none"></div>
                      )}

                      <CardHeader className="pb-4 relative z-10 flex-shrink-0">
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${section.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          {getPlanBadge(plan.period)}
                        </div>
                        <CardTitle className="text-xl md:text-2xl font-bold mb-1">{plan.name}</CardTitle>
                        <CardDescription className="text-sm md:text-base text-muted-foreground">
                          {plan.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex flex-col flex-grow relative z-10 p-6 md:p-8">
                        <div className="space-y-2 pb-5 border-b border-gray-200/60 mb-6">
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl md:text-4xl font-extrabold text-gradient-primary">
                              {formatPrice(plan.price, plan.currency)}
                            </span>
                            {plan.period === "yearly" && (
                              <span className="text-muted-foreground text-sm font-medium">
                                {t("perYear")}
                              </span>
                            )}
                          </div>
                          {plan.period === "yearly" && (
                            <p className="text-xs text-muted-foreground font-medium">
                              {t("billedAnnually")}
                            </p>
                          )}
                          {plan.period === "one-time" && plan.price === 0 && (
                            <p className="text-xs font-semibold text-emerald-600">
                              Free
                            </p>
                          )}
                        </div>

                        <div className="flex-grow mb-6">
                          <h4 className="text-xs font-semibold text-foreground mb-4 uppercase tracking-wide">
                            Features
                          </h4>
                          <ul className={`space-y-3 ${isRTL ? "text-right" : "text-left"}`}>
                            {plan.features.map((feature, idx) => (
                              <li key={idx} className={`flex items-start gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 flex-shrink-0 mt-0.5 shadow-sm">
                                  <Check className="h-3 w-3" />
                                </div>
                                <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          className={`w-full btn-gradient-primary text-white shadow-professional-md hover:shadow-professional-lg transition-all duration-300 font-semibold mt-auto ${isFeatured
                            ? "text-sm py-3.5 hover:scale-105"
                            : "text-sm py-3 hover:scale-[1.02]"
                            }`}
                          asChild
                        >
                          <Link href={`/auth/sign-up`}>
                            {t("cta.selectPlan")}
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ or Additional Info Section */}
        <div className={`mt-24 md:mt-32 max-w-5xl mx-auto ${isRTL ? "text-right" : "text-left"}`}>
          <Card className="border border-gray-200/60 bg-white/95 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-10 md:p-12 space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-3">
                  {t("faq.title")}
                </h3>
                <p className="text-muted-foreground text-lg">
                  Frequently asked questions about our pricing plans
                </p>
              </div>
              <div className="space-y-8">
                <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 border border-blue-100/50">
                  <h4 className="font-bold text-xl mb-3 text-foreground">{t("faq.q1.question")}</h4>
                  <p className="text-muted-foreground leading-relaxed text-base">{t("faq.q1.answer")}</p>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 border border-purple-100/50">
                  <h4 className="font-bold text-xl mb-3 text-foreground">{t("faq.q2.question")}</h4>
                  <p className="text-muted-foreground leading-relaxed text-base">{t("faq.q2.answer")}</p>
                </div>
                <div className="p-6 rounded-xl bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border border-emerald-100/50">
                  <h4 className="font-bold text-xl mb-3 text-foreground">{t("faq.q3.question")}</h4>
                  <p className="text-muted-foreground leading-relaxed text-base">{t("faq.q3.answer")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <div className={`mt-12 md:mt-16 text-center ${isRTL ? "text-right" : "text-left"}`}>
          <div className="inline-block p-8 rounded-2xl bg-gradient-to-r from-blue-50/80 to-purple-50/80 border border-blue-200/50 shadow-lg">
            <p className="text-lg text-foreground mb-6 font-medium">{t("contact.needHelp")}</p>
            <Button variant="outline" size="lg" className="font-semibold" asChild>
              <Link href="/contact">{t("contact.contactUs")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

