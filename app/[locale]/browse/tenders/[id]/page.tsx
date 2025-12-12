import { createServerApiClient } from "@/lib/api/server";
import { NavHeader } from "@/components/nav-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import { notFound } from "next/navigation";
import { MapPin, Clock, Building2, ArrowLeft, Calendar } from "lucide-react";
import { FeeDisclaimer } from "@/components/fee-disclaimer";
import { getTranslations, getLocale } from "next-intl/server";
import { rtlLocales } from "@/i18n/config";

export default async function TenderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("TenderDetail");
  const locale = await getLocale();
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number]);

  const { id } = await params;

  // Get user profile if authenticated (optional for browse pages)
  let profile = null;
  try {
    const apiClient = createServerApiClient();
    profile = await apiClient.getMyProfile();
  } catch {
    // Not authenticated, that's fine for browse pages
    profile = null;
  }

  // Fetch tender details from API
  const apiClient = createServerApiClient();
  let tender: any = null;
  let hasApplied = false;

  try {
    // Fetch tender from API (public endpoint)
    tender = await apiClient.getTender(id);

    if (!tender) {
      notFound();
    }

    // Check if user already applied
    if (profile) {
      try {
        const applications = await apiClient.getMyTenderApplications();
        hasApplied = Array.isArray(applications)
          ? applications.some((app: any) => app.tender_id === id || app.tender?.id === id)
          : false;
      } catch {
        hasApplied = false;
      }
    }
  } catch (error) {
    console.error('Error fetching tender from API:', error);
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavHeader
        user={profile ? { email: profile.email, role: profile.role } : null}
      />
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            asChild
            className={`mb-6 ${isRTL ? "flex-row" : ""}`}
          >
            <Link href="/browse/tenders" className={isRTL ? "flex-row" : ""}>
              <ArrowLeft
                className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`}
              />
              {t("backToTenders")}
            </Link>
          </Button>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div
                    className={`flex items-start justify-between mb-4 ${isRTL ? "flex-row" : ""
                      }`}
                  >
                    <div
                      className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}
                    >
                      <CardTitle className="text-2xl mb-2">
                        {tender.title}
                      </CardTitle>
                      <CardDescription
                        className={`flex flex-col gap-2 text-sm ${isRTL ? "text-right" : "text-left"
                          }`}
                      >
                        <span
                          className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""
                            }`}
                        >
                          <Building2 className="h-4 w-4 flex-shrink-0" />
                          {tender.organization?.name || t("organization")}
                        </span>
                        {tender.location && (
                          <span
                            className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""
                              }`}
                          >
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            {tender.location}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    {tender.deadline && (
                      <Badge
                        variant="secondary"
                        className={`text-sm ${isRTL ? "flex-row" : ""}`}
                      >
                        <Calendar
                          className={`h-3 w-3 flex-shrink-0 ${isRTL ? "ml-1" : "mr-1"
                            }`}
                        />
                        {t("deadline")}:{" "}
                        {new Date(tender.deadline).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>

                  <div
                    className={`flex flex-wrap gap-4 text-sm text-muted-foreground border-t pt-4 ${isRTL ? "flex-row" : ""
                      }`}
                  >
                    <span
                      className={`flex items-center gap-1 ${isRTL ? "flex-row" : ""
                        }`}
                    >
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      {t("posted")}{" "}
                      {new Date(tender.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent
                  className={`space-y-6 ${isRTL ? "text-right" : "text-left"}`}
                >
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      {t("tenderDescription")}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {tender.description}
                    </p>
                  </div>

                  {tender.requirements && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        {t("requirements")}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {tender.requirements}
                      </p>
                    </div>
                  )}

                  {tender.category && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        {t("category")}
                      </h3>
                      <Badge>{tender.category}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
              <FeeDisclaimer className="mt-4" showReportLink={false} />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className={isRTL ? "text-right" : "text-left"}>
                  <CardTitle>{t("applyForTender")}</CardTitle>
                </CardHeader>
                <CardContent className={isRTL ? "text-right" : "text-left"}>
                  {!profile ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {t("signInToApply")}
                      </p>
                      <Button asChild className="w-full">
                        <Link href="/auth/login">{t("signIn")}</Link>
                      </Button>
                    </div>
                  ) : hasApplied ? (
                    <div className="space-y-3">
                      <p className="text-sm text-green-600 font-medium">
                        {t("alreadyApplied")}
                      </p>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <Link href="/dashboard/applications/tenders">
                          {t("viewApplications")}
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <form action={`/api/apply/tender/${id}`} method="post">
                      <Button type="submit" className="w-full">
                        {t("applyNow")}
                      </Button>
                    </form>
                  )}
                  <div className={`pt-3 ${isRTL ? "text-left" : "text-right"}`}>
                    <Link
                      href="/report"
                      className="text-xs text-blue-600 underline"
                    >
                      {t("reportAd")}
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {tender.organization && (
                <Card>
                  <CardHeader className={isRTL ? "text-right" : "text-left"}>
                    <CardTitle>{t("aboutOrganization")}</CardTitle>
                  </CardHeader>
                  <CardContent
                    className={`space-y-3 ${isRTL ? "text-right" : "text-left"
                      }`}
                  >
                    <div>
                      <h4 className="font-semibold mb-1">
                        {tender.organization.name}
                      </h4>
                      {tender.organization.description && (
                        <p className="text-sm text-muted-foreground">
                          {tender.organization.description}
                        </p>
                      )}
                    </div>
                    {tender.organization.website && (
                      <Button
                        variant="outline"
                        asChild
                        className="w-full bg-transparent"
                      >
                        <a
                          href={tender.organization.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("visitWebsite")}
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
