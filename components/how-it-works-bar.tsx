"use client";

import { CheckCircle2, FileText, Users } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

const STEP_KEYS = [
  {
    icon: CheckCircle2,
    key: "createAccount",
  },
  {
    icon: FileText,
    key: "completeProfile",
  },
  {
    icon: Users,
    key: "postAndApply",
  },
] as const;

export function HowItWorksBar() {
  const t = useTranslations("HowItWorks");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className="rounded-3xl border border-white/40 bg-white/80 backdrop-blur shadow-xl p-6">
      <div className="mb-4 text-center">
        <p
          className={`text-sm uppercase tracking-wide text-blue-700 font-semibold ${isRTL ? "text-right" : "text-left"
            }`}
        >
          {t("title")}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {STEP_KEYS.map((step) => (
          <div
            key={step.key}
            className="flex gap-4 rounded-2xl border border-slate-100 bg-white/90 p-4 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-700 flex-shrink-0">
              <step.icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div
              className={`space-y-1 text-sm flex-1 ${isRTL ? "text-right" : "text-left"
                }`}
            >
              <p className="font-semibold text-foreground">
                {t(`steps.${step.key}.title`)}
              </p>
              <p className="text-xs text-muted-foreground">
                {t(`steps.${step.key}.description`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
