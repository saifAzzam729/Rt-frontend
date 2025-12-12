"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useTranslations, useLocale } from "next-intl"
import { rtlLocales } from "@/i18n/config"

export function ReportStatusForm({ reportId, currentStatus }: { reportId: string; currentStatus: string }) {
  const t = useTranslations("ReportStatusForm")
  const locale = useLocale()
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number])
  
  const STATUSES = [
    { value: "new", label: t("status.new") },
    { value: "in_review", label: t("status.inReview") },
    { value: "resolved", label: t("status.resolved") },
  ]
  
  const [status, setStatus] = useState(currentStatus)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  const handleChange = (nextStatus: string) => {
    setStatus(nextStatus)
    setError(null)
    startTransition(async () => {
      const res = await fetch(`/api/report/${reportId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (!res.ok) {
        const message = await res.json()
        setError(message.error || t("error"))
      } else {
        router.refresh()
      }
    })
  }

  return (
    <div className={`space-y-2 ${isRTL ? "text-right" : "text-left"}`}>
      <Label className={`text-xs font-semibold text-foreground ${isRTL ? "text-right" : "text-left"}`}>
        {t("label")}
      </Label>
      <Select value={status} onValueChange={handleChange} disabled={pending}>
        <SelectTrigger className={`w-40 ${isRTL ? "text-right" : "text-left"}`}>
          <SelectValue placeholder={t("selectPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className={`text-xs text-red-600 ${isRTL ? "text-right" : "text-left"}`}>{error}</p>}
    </div>
  )
}

