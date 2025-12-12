"use client";

import type React from "react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { rtlLocales } from "@/i18n/config";

interface PostTenderCTAProps {
  variant?: React.ComponentProps<typeof Button>["variant"];
  className?: string;
  disabled?: boolean;
  title?: string;
  children?: React.ReactNode;
}

export function PostTenderCTA({
  variant = "default",
  className,
  disabled,
  title,
  children,
}: PostTenderCTAProps) {
  const t = useTranslations("PostTenderCTA");
  const locale = useLocale();
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number]);

  return (
    <Button
      asChild
      variant={variant}
      className={className}
      disabled={disabled}
      title={title}
    >
      <Link
        href="/dashboard/organization/tenders/new"
        className={isRTL ? "flex-row" : ""}
      >
        <Plus
          className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
          aria-hidden="true"
        />
        {children ?? t("defaultText")}
      </Link>
    </Button>
  );
}
