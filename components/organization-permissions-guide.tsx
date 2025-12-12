"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Info, FileText, Users, Eye, Settings } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { rtlLocales } from "@/i18n/config";

export function OrganizationPermissionsGuide() {
  const t = useTranslations("OrganizationPermissionsGuide");
  const locale = useLocale();
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number]);

  return (
    <Card>
      <CardHeader className={isRTL ? "text-right" : "text-left"}>
        <CardTitle
          className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""}`}
        >
          <Info className="h-5 w-5 flex-shrink-0" />
          {t("title")}
        </CardTitle>
        <CardDescription className={isRTL ? "text-right" : "text-left"}>
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className={`flex items-start gap-3 ${isRTL ? "flex-row" : ""}`}>
            <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className={isRTL ? "text-right" : "text-left"}>
              <h4 className="font-semibold">{t("postTenders.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("postTenders.description")}
              </p>
            </div>
          </div>

          <div className={`flex items-start gap-3 ${isRTL ? "flex-row" : ""}`}>
            <Users className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className={isRTL ? "text-right" : "text-left"}>
              <h4 className="font-semibold">{t("manageApplications.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("manageApplications.description")}
              </p>
            </div>
          </div>

          <div className={`flex items-start gap-3 ${isRTL ? "flex-row" : ""}`}>
            <Eye className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className={isRTL ? "text-right" : "text-left"}>
              <h4 className="font-semibold">{t("viewAnalytics.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("viewAnalytics.description")}
              </p>
            </div>
          </div>

          <div className={`flex items-start gap-3 ${isRTL ? "flex-row" : ""}`}>
            <Settings className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className={isRTL ? "text-right" : "text-left"}>
              <h4 className="font-semibold">{t("teamManagement.title")}</h4>
              <p className="text-sm text-muted-foreground">
                {t("teamManagement.description")}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`mt-4 p-3 bg-muted rounded-md ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          <p className="text-sm text-muted-foreground">{t("note")}</p>
        </div>
      </CardContent>
    </Card>
  );
}
