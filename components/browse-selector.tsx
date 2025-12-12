"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter } from "@/navigation"

const OPTIONS = [
  {
    labelKey: "Common.actions.browseJobs",
    value: "jobs",
    descriptionKey: "BrowseSelector.jobsDescription",
    href: "/browse/jobs",
  },
  {
    labelKey: "Common.actions.browseTenders",
    value: "tenders",
    descriptionKey: "BrowseSelector.tendersDescription",
    href: "/browse/tenders",
  },
] satisfies ReadonlyArray<{
  value: "jobs" | "tenders"
  labelKey: string
  descriptionKey: string
  href: string
}>

type SelectorOption = (typeof OPTIONS)[number]

export function BrowseSelector() {
  const t = useTranslations()
  const [selection, setSelection] = useState<SelectorOption["value"]>("jobs")
  const router = useRouter()
  const option = OPTIONS.find((opt) => opt.value === selection) ?? OPTIONS[0]

  return (
    <div className="group relative w-full">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"></div>

      {/* Main container */}
      <div className="relative rounded-2xl border-2 border-white/60 bg-white/95 backdrop-blur-xl p-4 shadow-2xl hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-500">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          {/* Dropdown and Button */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Select
                value={selection}
                onValueChange={(value) => setSelection(value as SelectorOption["value"])}
              >
                <SelectTrigger className="h-11 w-full sm:w-[180px] bg-white/90 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 rounded-xl text-base font-medium shadow-sm transition-all duration-200 hover:shadow-md">
                  <SelectValue placeholder={t("BrowseSelector.choose")} />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 shadow-xl">
                  {OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="rounded-lg cursor-pointer hover:bg-blue-50 focus:bg-blue-50"
                    >
                      {t(opt.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              className="h-11 px-6 btn-gradient-primary text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn"
              onClick={() => router.push(option.href)}
            >
              <span className="flex items-center gap-2">
                {t("BrowseSelector.browse")}
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
