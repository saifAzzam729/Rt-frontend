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
import { useTranslations } from "next-intl"

interface ProfileFormProps {
  profile: {
    id: string
    full_name: string | null
    phone: string | null
    bio: string | null
    role: string
  }
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const t = useTranslations("ProfileForm")
  const [fullName, setFullName] = useState(profile.full_name || "")
  const [phone, setPhone] = useState(profile.phone || "")
  const [bio, setBio] = useState(profile.bio || "")
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
      await apiClient.updateMyProfile({
        full_name: fullName,
        phone: phone || null,
        bio: bio || null,
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
    <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{t("title")}</CardTitle>
        <CardDescription className="mt-1">{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-2">
            <Label htmlFor="fullName" className="font-medium">{t("fields.fullName")}</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("placeholders.fullName")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone" className="font-medium">{t("fields.phone")}</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("placeholders.phone")}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio" className="font-medium">{t("fields.bio")}</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("placeholders.bio")}
              rows={4}
              className="border-gray-200/60 shadow-professional rounded-lg"
            />
          </div>

          <div className="grid gap-2">
            <Label className="font-medium">{t("fields.accountType")}</Label>
            <Input value={profile.role} disabled className="capitalize bg-gray-50/80" />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-green-50/80 border border-green-200/60 p-3 text-sm text-green-700 font-medium">
              {t("success")}
            </div>
          )}

          <Button
            type="submit"
            className="w-full btn-gradient-primary shadow-professional-md hover:shadow-professional-lg transition-all duration-200 text-white active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? t("buttons.saving") : t("buttons.saveChanges")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
