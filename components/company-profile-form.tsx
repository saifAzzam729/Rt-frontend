"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { apiClient } from "@/lib/api/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { rtlLocales } from "@/i18n/config"

interface CompanyProfileFormProps {
  company: {
    id: string
    name: string
    description: string | null
    website: string | null
    location: string | null
    industry: string | null
    size: string | null
  }
}

export function CompanyProfileForm({ company }: CompanyProfileFormProps) {
  const t = useTranslations("CompanyProfileForm")
  const locale = useLocale()
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number])

  const [name, setName] = useState(company.name || "")
  const [description, setDescription] = useState(company.description || "")
  const [website, setWebsite] = useState(company.website || "")
  const [location, setLocation] = useState(company.location || "")
  const [industry, setIndustry] = useState(company.industry || "")
  const [size, setSize] = useState(company.size || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await apiClient.updateCompany(company.id, {
        name,
        description: description || null,
        website: website || null,
        location: location || null,
        industry: industry || null,
        size: size || null,
      })

      setSuccess(true)
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t("errors.generic"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className={isRTL ? "text-right" : "text-left"}>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name" className={isRTL ? "text-right" : "text-left"}>
              {t("fields.name")}
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("fields.namePlaceholder")}
              required
              dir={isRTL ? "rtl" : "ltr"}
              className={`${isRTL ? "text-right" : "text-left"}`}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className={isRTL ? "text-right" : "text-left"}>
              {t("fields.description")}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("fields.descriptionPlaceholder")}
              rows={4}
              dir={isRTL ? "rtl" : "ltr"}
              className={`${isRTL ? "text-right" : "text-left"}`}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="website" className={isRTL ? "text-right" : "text-left"}>
              {t("fields.website")}
            </Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder={t("fields.websitePlaceholder")}
              dir="ltr"
              className="text-left"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location" className={isRTL ? "text-right" : "text-left"}>
              {t("fields.location")}
            </Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={t("fields.locationPlaceholder")}
              dir={isRTL ? "rtl" : "ltr"}
              className={`${isRTL ? "text-right" : "text-left"}`}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="industry" className={isRTL ? "text-right" : "text-left"}>
              {t("fields.industry")}
            </Label>
            <Input
              id="industry"
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder={t("fields.industryPlaceholder")}
              dir={isRTL ? "rtl" : "ltr"}
              className={`${isRTL ? "text-right" : "text-left"}`}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="size" className={isRTL ? "text-right" : "text-left"}>
              {t("fields.size")}
            </Label>
            <Input
              id="size"
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder={t("fields.sizePlaceholder")}
              dir={isRTL ? "rtl" : "ltr"}
              className={`${isRTL ? "text-right" : "text-left"}`}
            />
          </div>

          {error && (
            <div className={`rounded-lg bg-destructive/10 p-3 text-sm text-destructive ${isRTL ? "text-right" : "text-left"}`}>
              {error}
            </div>
          )}

          {success && (
            <div className={`rounded-lg bg-green-50 p-3 text-sm text-green-600 ${isRTL ? "text-right" : "text-left"}`}>
              {t("success")}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("buttons.saving") : t("buttons.saveChanges")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
