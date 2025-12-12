import { redirect } from "@/navigation";
import { requireAuth } from "@/lib/auth/server";
import { createServerApiClient } from "@/lib/api/server";
import { NavHeader } from "@/components/nav-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import { ReportStatusForm } from "@/components/report-status-form";
import { getTranslations, getLocale } from "next-intl/server";
import { rtlLocales } from "@/i18n/config";

export default async function AdminReportsPage() {
  const t = await getTranslations("AdminReports");
  const locale = await getLocale();
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number]);

  // Authenticate user via JWT
  await requireAuth();

  const apiClient = createServerApiClient();

  // Get profile and verify role
  const profile = await apiClient.getMyProfile();
  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  // Get reports from API
  const reports = await apiClient.getReports().catch(() => []);

  const STATUS_LABELS: Record<
    string,
    { text: string; variant: "default" | "secondary" | "destructive" }
  > = {
    new: { text: t("status.new"), variant: "destructive" },
    in_review: { text: t("status.inReview"), variant: "secondary" },
    resolved: { text: t("status.resolved"), variant: "default" },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavHeader user={{ email: profile.email, role: profile.role }} />
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div
            className={`flex items-center justify-between ${isRTL ? "flex-row" : ""
              }`}
          >
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="text-3xl font-bold text-foreground">
                {t("title")}
              </h1>
              <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
            </div>
            <Link
              href="/dashboard/admin"
              className={`text-sm font-medium text-blue-600 underline ${isRTL ? "text-right" : "text-left"
                }`}
            >
              {t("backToDashboard")}
            </Link>
          </div>

          {reports && reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => {
                const badge = STATUS_LABELS[report.status] ?? STATUS_LABELS.new;
                return (
                  <Card
                    key={report.id}
                    className="border border-slate-200 shadow-sm"
                  >
                    <CardHeader
                      className={`flex flex-row items-start justify-between gap-4 ${isRTL ? "flex-row" : ""
                        }`}
                    >
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <CardTitle className="text-lg font-semibold capitalize">
                          {report.report_topic || t("report")}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {t("submitted")}{" "}
                          {new Date(report.created_at).toLocaleString()}{" "}
                          {t("by")} {report.contact_email || t("anonymous")}
                        </CardDescription>
                      </div>
                      <Badge variant={badge.variant}>{badge.text}</Badge>
                    </CardHeader>
                    <CardContent
                      className={`space-y-3 text-sm ${isRTL ? "text-right" : "text-left"
                        }`}
                    >
                      <div className="grid gap-1">
                        <p className="text-muted-foreground">
                          {t("listingType")}{" "}
                          <span className="font-medium">
                            {report.listing_type || t("unknown")}
                          </span>
                        </p>
                        {report.listing_url && (
                          <Link
                            href={report.listing_url}
                            target="_blank"
                            className="text-blue-600 underline text-sm"
                          >
                            {t("viewListing")}
                          </Link>
                        )}
                      </div>
                      <div>
                        <p className="font-medium mb-1">{t("details")}</p>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {report.details}
                        </p>
                      </div>
                      {report.contact_email && (
                        <p className="text-muted-foreground">
                          {t("contact")}{" "}
                          <a
                            href={`mailto:${report.contact_email}`}
                            className="text-blue-600 underline"
                          >
                            {report.contact_email}
                          </a>
                        </p>
                      )}
                      <div className="pt-2 border-t">
                        <ReportStatusForm
                          reportId={report.id}
                          currentStatus={report.status}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent
                className={`py-12 text-center text-sm text-muted-foreground ${isRTL ? "text-right" : "text-left"
                  }`}
              >
                {t("noReports")}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
