import { redirect } from "@/navigation";
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
import { Link } from "@/navigation";
import {
  Briefcase,
  Users,
  Building2,
  Plus,
  Eye,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getTranslations, getLocale } from "next-intl/server";
import { rtlLocales } from "@/i18n/config";

export default async function CompanyDashboardPage() {
  const t = await getTranslations("CompanyDashboard");
  const locale = await getLocale();
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number]);

  // Authenticate user via JWT
  const jwtUser = await requireAuth();

  const apiClient = createServerApiClient();

  // Get profile and verify role
  const profile = await apiClient.getMyProfile();
  if (!profile || profile.role !== "company") {
    redirect("/dashboard");
  }

  // Get company data from API
  const companies = await apiClient.getMyCompanies();
  const company = Array.isArray(companies) && companies.length > 0 ? companies[0] : null;

  if (!company) {
    redirect("/dashboard");
  }

  // Fetch jobs and applications from API
  const [jobs, applications] = await Promise.all([
    apiClient.getJobsByCompany(company.id).catch(() => []),
    apiClient.getJobApplicationsForCompany(company.id).catch(() => []),
  ]);

  if (!company) {
    redirect("/dashboard");
  }

  // Calculate stats from API data
  const safeJobsCount = Array.isArray(jobs) ? jobs.length : 0;
  const safeOpenJobsCount = Array.isArray(jobs) ? jobs.filter((job: any) => job.status === "open").length : 0;
  const safeApplicationsCount = Array.isArray(applications) ? applications.length : 0;
  const totalViews = Array.isArray(jobs) ? jobs.reduce((sum: number, job: any) => sum + (job.views_count || 0), 0) : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-gradient-professional-subtle">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="mb-8 flex items-center justify-between rounded-xl border border-gray-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-professional-lg">
            <div className="flex items-center gap-4">
              <Avatar className="size-14 ring-2 ring-indigo-200">
                <AvatarImage
                  src={company.logo_url || "/rtlogo.png"}
                  alt={company.name}
                />
                <AvatarFallback className="text-lg font-semibold">
                  {company.name?.substring(0, 2)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className={isRTL ? "text-right" : "text-left"}>
                <h1 className="text-2xl font-bold tracking-tight">
                  {t("title")}
                </h1>
                <p className="text-muted-foreground mt-1">{company.name}</p>
              </div>
            </div>
            <Button
              asChild
              className="btn-gradient-primary shadow-professional-md hover:shadow-professional-lg transition-all duration-200 text-white"
              disabled={!company.approved}
              title={
                !company.approved
                  ? t("approval.pendingApprovalTooltip")
                  : t("approval.postJobTooltip")
              }
            >
              <Link
                href="/dashboard/company/jobs/new"
                className={isRTL ? "flex-row-reverse" : ""}
              >
                <Plus className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {t("actions.postNewJob")}
              </Link>
            </Button>
          </div>

          {!company.approved && (
            <Alert
              className={`mb-6 border-blue-200/60 bg-blue-50/80 backdrop-blur-sm shadow-professional ${isRTL ? "text-right" : "text-left"
                }`}
            >
              <AlertTitle
                className={`text-blue-900 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""
                  }`}
              >
                <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                {t("approval.pendingTitle")}
              </AlertTitle>
              <AlertDescription className="text-blue-800">
                {t("approval.pendingDescription")}{" "}
                <Link
                  href="/dashboard/company/profile"
                  className="font-semibold text-blue-600 underline"
                >
                  {t("approval.pendingDescriptionLink")}
                </Link>
                .
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader
                className={`flex flex-row items-center justify-between pb-3 ${isRTL ? "flex-row-reverse" : ""
                  }`}
              >
                <CardTitle
                  className={`text-sm font-semibold text-gray-700 ${isRTL ? "text-right" : "text-left"
                    }`}
                >
                  {t("stats.totalJobs")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Briefcase className="h-5 w-5 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">
                  {safeJobsCount.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {t("stats.allJobsPosted")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader
                className={`flex flex-row items-center justify-between pb-3 ${isRTL ? "flex-row-reverse" : ""
                  }`}
              >
                <CardTitle
                  className={`text-sm font-semibold text-gray-700 ${isRTL ? "text-right" : "text-left"
                    }`}
                >
                  {t("stats.openJobs")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Briefcase className="h-5 w-5 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">
                  {safeOpenJobsCount.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {t("stats.currentlyAccepting")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader
                className={`flex flex-row items-center justify-between pb-3 ${isRTL ? "flex-row-reverse" : ""
                  }`}
              >
                <CardTitle
                  className={`text-sm font-semibold text-gray-700 ${isRTL ? "text-right" : "text-left"
                    }`}
                >
                  {t("stats.applications")}
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
                  {t("stats.totalReceived")}
                </p>
              </CardContent>
            </Card>

            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader
                className={`flex flex-row items-center justify-between pb-3 ${isRTL ? "flex-row-reverse" : ""
                  }`}
              >
                <CardTitle
                  className={`text-sm font-semibold text-gray-700 ${isRTL ? "text-right" : "text-left"
                    }`}
                >
                  {t("stats.totalViews")}
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
                  {t("stats.jobViews")}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className={isRTL ? "text-right" : "text-left"}>
                <CardTitle className="text-lg font-semibold">{t("actions.quickActionsTitle")}</CardTitle>
                <CardDescription className="mt-1">
                  {t("actions.quickActionsDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <Button
                  asChild
                  className={`group w-full justify-between rounded-lg border-gray-200/60 bg-white hover:bg-gray-50/80 shadow-professional hover:shadow-professional-md transition-all ${isRTL ? "flex-row-reverse" : ""
                    }`}
                  variant="outline"
                  disabled={!company.approved}
                >
                  <Link
                    href="/dashboard/company/jobs/new"
                    className={`flex w-full items-center ${isRTL ? "flex-row-reverse" : ""
                      }`}
                  >
                    <Plus
                      className={`h-4 w-4 text-blue-700 ${isRTL ? "ml-3" : "mr-3"
                        }`}
                    />
                    <span className="font-medium">
                      {t("actions.postNewJobAction")}
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 opacity-60 group-hover:translate-x-0.5 group-hover:opacity-100 transition ${isRTL ? "mr-auto rotate-180" : "ml-auto"
                        }`}
                    />
                  </Link>
                </Button>
                <Button
                  asChild
                  className={`group w-full justify-between rounded-lg border-gray-200/60 bg-white hover:bg-gray-50/80 shadow-professional hover:shadow-professional-md transition-all ${isRTL ? "flex-row-reverse" : ""
                    }`}
                  variant="outline"
                >
                  <Link
                    href="/dashboard/company/jobs"
                    className={`flex w-full items-center ${isRTL ? "flex-row-reverse" : ""
                      }`}
                  >
                    <Briefcase
                      className={`h-4 w-4 text-blue-700 ${isRTL ? "ml-3" : "mr-3"
                        }`}
                    />
                    <span className="font-medium">
                      {t("actions.manageJobs")}
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 opacity-60 group-hover:translate-x-0.5 group-hover:opacity-100 transition ${isRTL ? "mr-auto rotate-180" : "ml-auto"
                        }`}
                    />
                  </Link>
                </Button>
                <Button
                  asChild
                  className={`group w-full justify-between rounded-lg border-gray-200/60 bg-white hover:bg-gray-50/80 shadow-professional hover:shadow-professional-md transition-all ${isRTL ? "flex-row-reverse" : ""
                    }`}
                  variant="outline"
                >
                  <Link
                    href="/dashboard/company/profile"
                    className={`flex w-full items-center ${isRTL ? "flex-row-reverse" : ""
                      }`}
                  >
                    <Building2
                      className={`h-4 w-4 text-slate-700 ${isRTL ? "ml-3" : "mr-3"
                        }`}
                    />
                    <span className="font-medium">
                      {t("actions.editCompanyProfile")}
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 opacity-60 group-hover:translate-x-0.5 group-hover:opacity-100 transition ${isRTL ? "mr-auto rotate-180" : "ml-auto"
                        }`}
                    />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className={isRTL ? "text-right" : "text-left"}>
                <CardTitle className="text-lg font-semibold">{t("actions.applicationsTitle")}</CardTitle>
                <CardDescription className="mt-1">
                  {t("actions.applicationsDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <Button
                  asChild
                  className={`group w-full justify-between rounded-lg border-gray-200/60 bg-white hover:bg-gray-50/80 shadow-professional hover:shadow-professional-md transition-all ${isRTL ? "flex-row-reverse" : ""
                    }`}
                  variant="outline"
                >
                  <Link
                    href="/dashboard/company/applications"
                    className={`flex w-full items-center ${isRTL ? "flex-row-reverse" : ""
                      }`}
                  >
                    <Users
                      className={`h-4 w-4 text-slate-700 ${isRTL ? "ml-3" : "mr-3"
                        }`}
                    />
                    <span className="font-medium">
                      {t("actions.viewAllApplications")}
                    </span>
                    <span className={`ml-auto ${isRTL ? "mr-auto ml-0" : ""} text-sm text-muted-foreground`}>
                      ({safeApplicationsCount || 0})
                    </span>
                    <ChevronRight
                      className={`h-4 w-4 opacity-60 group-hover:translate-x-0.5 group-hover:opacity-100 transition ${isRTL ? "mr-auto rotate-180" : "ml-auto"
                        }`}
                    />
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
