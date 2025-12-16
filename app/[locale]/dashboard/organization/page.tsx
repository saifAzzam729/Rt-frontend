import { redirect as nextRedirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/server";
import { createServerApiClient } from "@/lib/api/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PostTenderCTA } from "@/components/post-tender-cta";
import { Link } from "@/navigation";
import {
  FileText,
  Users,
  Building2,
  Eye,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getTranslations, getLocale } from "next-intl/server";
import { rtlLocales } from "@/i18n/config";

export default async function OrganizationDashboardPage() {
  const t = await getTranslations("OrganizationDashboard");
  const locale = await getLocale();
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number]);

  // Authenticate user via JWT
  const jwtUser = await requireAuth();

  const apiClient = createServerApiClient();

  // Get profile and verify role
  const profile = await apiClient.getMyProfile();
  if (!profile || profile.role !== "organization") {
    nextRedirect(`/${locale}/dashboard`);
  }

  // Get organization data from API
  const organizations = await apiClient.getMyOrganizations();
  const organization = Array.isArray(organizations) && organizations.length > 0 ? organizations[0] : null;

  if (!organization) {
    nextRedirect(`/${locale}/dashboard/organization/profile`);
  }

  // Fetch tenders and applications from API
  const [tenders, applications] = await Promise.all([
    apiClient.getTendersByOrganization(organization.id).catch(() => []),
    apiClient.getTenderApplicationsForOrganization(organization.id).catch(() => []),
  ]);

  // Manually recalculate profile_complete to ensure accuracy
  const isProfileComplete =
    organization.license_number &&
    organization.license_number.trim() !== "" &&
    organization.license_file_url &&
    organization.license_file_url.trim() !== "" &&
    organization.work_sectors &&
    Array.isArray(organization.work_sectors) &&
    organization.work_sectors.length > 0;

  // Calculate stats from API data
  const safeTendersCount = Array.isArray(tenders) ? tenders.length : 0;
  const safeOpenTendersCount = Array.isArray(tenders) ? tenders.filter((tender: any) => tender.status === "open").length : 0;
  const safeApplicationsCount = Array.isArray(applications) ? applications.length : 0;
  const totalViews = Array.isArray(tenders) ? tenders.reduce((sum: number, tender: any) => sum + (tender.views_count || 0), 0) : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-gradient-professional-subtle">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div
            className={`mb-8 flex items-center justify-between ${isRTL ? "flex-row" : ""
              }`}
          >
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                {t("title")}
              </h1>
              <p className="text-muted-foreground mt-3 text-base font-medium">{organization.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t("subtitle")}
              </p>
            </div>
            <PostTenderCTA
              disabled={
                !organization.profile_complete || !organization.approved
              }
              title={
                !organization.profile_complete
                  ? t("postTenderTooltips.completeProfile")
                  : !organization.approved
                    ? t("postTenderTooltips.pendingApproval")
                    : t("postTenderTooltips.createTender")
              }
            />
          </div>

          {!organization.profile_complete && (
            <Alert
              className={`mb-6 border-amber-200/60 bg-amber-50/80 backdrop-blur-sm shadow-professional ${isRTL ? "text-right" : "text-left"
                }`}
            >
              <AlertCircle
                className={`h-4 w-4 text-amber-600 ${isRTL ? "ml-2" : "mr-2"}`}
              />
              <AlertTitle
                className={`text-amber-900 font-semibold ${isRTL ? "text-right" : "text-left"
                  }`}
              >
                {t("alerts.profileIncomplete.title")}
              </AlertTitle>
              <AlertDescription
                className={`text-amber-800 ${isRTL ? "text-right" : "text-left"
                  }`}
              >
                {t("alerts.profileIncomplete.description")}{" "}
                <Link
                  href="/dashboard/organization/profile"
                  className="font-semibold underline hover:text-amber-900"
                >
                  {t("alerts.profileIncomplete.completeProfile")}
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {organization.profile_complete && !organization.approved && (
            <Alert
              className={`mb-6 border-blue-200/60 bg-blue-50/80 backdrop-blur-sm shadow-professional ${isRTL ? "text-right" : "text-left"
                }`}
            >
              <AlertCircle
                className={`h-4 w-4 text-blue-600 ${isRTL ? "ml-2" : "mr-2"}`}
              />
              <AlertTitle
                className={`text-blue-900 font-semibold ${isRTL ? "text-right" : "text-left"
                  }`}
              >
                {t("alerts.pendingApproval.title")}
              </AlertTitle>
              <AlertDescription
                className={`text-blue-800 ${isRTL ? "text-right" : "text-left"
                  }`}
              >
                {t("alerts.pendingApproval.description")}
              </AlertDescription>
            </Alert>
          )}

          {organization.profile_complete && organization.approved && (
            <Alert
              className={`mb-6 border-green-200/60 bg-green-50/80 backdrop-blur-sm shadow-professional ${isRTL ? "text-right" : "text-left"
                }`}
            >
              <CheckCircle2
                className={`h-4 w-4 text-green-600 ${isRTL ? "ml-2" : "mr-2"}`}
              />
              <AlertTitle
                className={`text-green-900 font-semibold ${isRTL ? "text-right" : "text-left"
                  }`}
              >
                {t("alerts.accountApproved.title")}
              </AlertTitle>
              <AlertDescription
                className={`text-green-800 ${isRTL ? "text-right" : "text-left"
                  }`}
              >
                {t("alerts.accountApproved.description")}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader
                className={`flex flex-row items-center justify-between pb-3 ${isRTL ? "flex-row" : ""
                  }`}
              >
                <CardTitle
                  className={`text-sm font-semibold text-gray-700 ${isRTL ? "text-right" : "text-left"
                    }`}
                >
                  {t("stats.totalTenders.title")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <FileText className="h-5 w-5 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">
                  {safeTendersCount.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {t("stats.totalTenders.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader
                className={`flex flex-row items-center justify-between pb-3 ${isRTL ? "flex-row" : ""
                  }`}
              >
                <CardTitle
                  className={`text-sm font-semibold text-gray-700 ${isRTL ? "text-right" : "text-left"
                    }`}
                >
                  {t("stats.openTenders.title")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <FileText className="h-5 w-5 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">
                  {safeOpenTendersCount.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {t("stats.openTenders.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader
                className={`flex flex-row items-center justify-between pb-3 ${isRTL ? "flex-row" : ""
                  }`}
              >
                <CardTitle
                  className={`text-sm font-semibold text-gray-700 ${isRTL ? "text-right" : "text-left"
                    }`}
                >
                  {t("stats.applications.title")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-700">
                  <Users className="h-5 w-5 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">
                  {safeApplicationsCount.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {t("stats.applications.description")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader
                className={`flex flex-row items-center justify-between pb-3 ${isRTL ? "flex-row" : ""
                  }`}
              >
                <CardTitle
                  className={`text-sm font-semibold text-gray-700 ${isRTL ? "text-right" : "text-left"
                    }`}
                >
                  {t("stats.totalViews.title")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-700">
                  <Eye className="h-5 w-5 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">
                  {totalViews.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {t("stats.totalViews.description")}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className={isRTL ? "text-right" : "text-left"}>
                <CardTitle className="text-lg font-semibold">{t("quickActions.title")}</CardTitle>
                <CardDescription className="mt-1">
                  {t("quickActions.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <PostTenderCTA
                  variant="outline"
                  className={`w-full justify-start bg-transparent ${isRTL ? "flex-row" : ""
                    }`}
                  disabled={
                    !organization.profile_complete || !organization.approved
                  }
                >
                  {t("quickActions.postNewTender")}
                </PostTenderCTA>
                <Button
                  asChild
                  className={`w-full justify-start bg-transparent hover:bg-gray-50/80 ${isRTL ? "flex-row" : ""
                    }`}
                  variant="outline"
                >
                  <Link
                    href="/dashboard/organization/tenders"
                    className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <FileText
                      className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    <span className="font-medium">{t("quickActions.manageTenders")}</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  className={`w-full justify-start bg-transparent hover:bg-gray-50/80 ${isRTL ? "flex-row" : ""
                    }`}
                  variant="outline"
                >
                  <Link
                    href="/dashboard/organization/profile"
                    className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <Building2
                      className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    <span className="font-medium">{t("quickActions.editProfile")}</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className={isRTL ? "text-right" : "text-left"}>
                <CardTitle className="text-lg font-semibold">{t("applications.title")}</CardTitle>
                <CardDescription className="mt-1">
                  {t("applications.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <Button
                  asChild
                  className={`w-full justify-start bg-transparent hover:bg-gray-50/80 ${isRTL ? "flex-row" : ""
                    }`}
                  variant="outline"
                >
                  <Link
                    href="/dashboard/organization/applications"
                    className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <Users className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                    <span className="font-medium">{t("applications.viewAll")}</span>
                    <span className={`ml-auto ${isRTL ? "mr-auto ml-0" : ""} text-sm text-muted-foreground`}>
                      ({safeApplicationsCount || 0})
                    </span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
