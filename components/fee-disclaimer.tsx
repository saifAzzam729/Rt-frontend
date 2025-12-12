"use client"

import { ShieldAlert } from "lucide-react"
import { useTranslations } from "next-intl"
import { Link } from "@/navigation"

export function FeeDisclaimer({
  className = "",
  showReportLink = true,
}: {
  className?: string
  showReportLink?: boolean
}) {
  const t = useTranslations("FeeDisclaimer")

  return (
    <div
      className={`rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-amber-600" aria-hidden="true" />
        <div>
          <p className="font-semibold">{t("title")}</p>
          <p className="text-xs text-amber-800">{t("description")}</p>
        </div>
      </div>
      {showReportLink && (
        <Link
          href="/report"
          className="text-sm font-medium text-amber-900 underline underline-offset-4 hover:text-amber-700"
        >
          {t("cta")}
        </Link>
      )}
    </div>
  )
}
