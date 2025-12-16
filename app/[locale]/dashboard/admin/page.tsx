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
import {
  Users,
  Briefcase,
  FileText,
  Building2,
  TrendingUp,
  Eye,
  ShieldAlert,
} from "lucide-react";
import { Link } from "@/navigation";
import { ApproveEntityButton } from "@/components/approve-entity-button";
import { getTranslations, getLocale } from "next-intl/server";
import { rtlLocales } from "@/i18n/config";

export default async function AdminDashboardPage() {
  const t = await getTranslations("AdminDashboard");
  const locale = await getLocale();
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number]);

  // Authenticate user via JWT
  const jwtUser = await requireAuth();

  const apiClient = createServerApiClient();

  // Get profile and verify role
  const profile = await apiClient.getMyProfile();
  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  // Get platform statistics from API
  const apiClient = createServerApiClient();

  let analytics = null;
  let pendingApprovals = null;
  let allJobs: any[] = [];
  let allTenders: any[] = [];
  let reports: any[] = [];

  try {
    // Fetch analytics and pending approvals from API
    [analytics, pendingApprovals, allJobs, allTenders, reports] = await Promise.all([
      apiClient.getAdminAnalytics().catch(() => null),
      apiClient.getPendingApprovals().catch(() => null),
      apiClient.getJobs().catch(() => []),
      apiClient.getTenders().catch(() => []),
      apiClient.getReports().catch(() => []),
    ]);
  } catch (error) {
    console.error('Error fetching admin data from API:', error);
  }

  // Extract statistics from analytics response
  const usersCount = analytics?.total_users ?? 0;
  const organizationsCount = analytics?.total_organizations ?? 0;
  const companiesCount = analytics?.total_companies ?? 0;
  const jobsCount = analytics?.total_jobs ?? 0;
  const tendersCount = analytics?.total_tenders ?? 0;
  const jobApplicationsCount = 0; // Not in analytics API, would need separate call
  const tenderApplicationsCount = 0; // Not in analytics API, would need separate call
  const analyticsCount = 0; // Not in analytics API
  const newReportsCount = Array.isArray(reports) ? reports.filter((r: any) => r.status === "new").length : (analytics?.pending_approvals ?? 0);

  // Get recent jobs and tenders from API data
  const recentJobs = Array.isArray(allJobs)
    ? allJobs
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map((job: any) => ({
        id: job.id,
        title: job.title,
        created_at: job.created_at,
        companies: job.company ? { name: job.company.name } : null,
      }))
    : [];

  const recentTenders = Array.isArray(allTenders)
    ? allTenders
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map((tender: any) => ({
        id: tender.id,
        title: tender.title,
        created_at: tender.created_at,
        organizations: tender.organization ? { name: tender.organization.name } : null,
      }))
    : [];

  // Get pending approvals from API
  const pendingOrganizations = pendingApprovals?.organizations
    ? (Array.isArray(pendingApprovals.organizations) ? pendingApprovals.organizations : [])
      .slice(0, 5)
      .map((org: any) => ({
        id: org.id,
        name: org.name,
        created_at: org.created_at,
        profiles: null, // API doesn't return user email in pending approvals
      }))
    : [];

  const pendingCompanies = pendingApprovals?.companies
    ? (Array.isArray(pendingApprovals.companies) ? pendingApprovals.companies : [])
      .slice(0, 5)
      .map((company: any) => ({
        id: company.id,
        name: company.name,
        created_at: company.created_at,
        profiles: null, // API doesn't return user email in pending approvals
      }))
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-gradient-professional-subtle">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground mt-3 text-base leading-relaxed">{t("subtitle")}</p>
          </div>

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
                  {t("stats.totalUsers.title")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Users className="h-5 w-5 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">{usersCount || 0}</div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {t("stats.totalUsers.description")}
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
                  {t("stats.organizations.title")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Building2 className="h-5 w-5 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">
                  {organizationsCount || 0}
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {t("stats.organizations.description")}
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
                  {t("stats.companies.title")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Building2 className="h-5 w-5 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">{companiesCount || 0}</div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {t("stats.companies.description")}
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
                  {t("stats.totalEvents.title")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-700">
                  <Eye className="h-5 w-5 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">{analyticsCount || 0}</div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {t("stats.totalEvents.description")}
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
                  {t("stats.newReports.title")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-700">
                  <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">{newReportsCount || 0}</div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {t("stats.newReports.description")}
                </p>
                <div className="mt-3">
                  <Link
                    href="/dashboard/admin/reports"
                    className={`text-sm font-semibold text-blue-600 hover:text-blue-700 underline ${isRTL ? "text-right" : "text-left"
                      }`}
                  >
                    {t("stats.newReports.reviewReports")}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader
                className={`flex flex-row items-center justify-between pb-3 ${isRTL ? "flex-row" : ""
                  }`}
              >
                <CardTitle
                  className={`text-sm font-semibold text-gray-700 ${isRTL ? "text-right" : "text-left"
                    }`}
                >
                  {t("stats.jobs.title")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Briefcase className="h-5 w-5 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                <div className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{jobsCount || 0}</div>
                <p className="text-sm text-muted-foreground mb-4 font-medium">
                  {t("stats.jobs.description")}
                </p>
                <div
                  className={`flex items-center gap-2 text-sm ${isRTL ? "flex-row" : ""
                    }`}
                >
                  <TrendingUp className="h-4 w-4 text-blue-700 flex-shrink-0" />
                  <span className="text-muted-foreground font-medium">
                    {jobApplicationsCount || 0} {t("stats.jobs.applications")}
                  </span>
                </div>
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
                  {t("stats.tenders.title")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <FileText className="h-5 w-5 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                <div className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                  {tendersCount || 0}
                </div>
                <p className="text-sm text-muted-foreground mb-4 font-medium">
                  {t("stats.tenders.description")}
                </p>
                <div
                  className={`flex items-center gap-2 text-sm ${isRTL ? "flex-row" : ""
                    }`}
                >
                  <TrendingUp className="h-4 w-4 text-blue-700 flex-shrink-0" />
                  <span className="text-muted-foreground font-medium">
                    {tenderApplicationsCount || 0}{" "}
                    {t("stats.tenders.applications")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className={isRTL ? "text-right" : "text-left"}>
                <CardTitle className="text-lg font-semibold">{t("recentJobs.title")}</CardTitle>
                <CardDescription className="mt-1">{t("recentJobs.description")}</CardDescription>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                {recentJobs && recentJobs.length > 0 ? (
                  <div className="space-y-4">
                    {recentJobs.map((job) => (
                      <div
                        key={job.id}
                        className={`flex items-start justify-between border-b pb-3 last:border-0 ${isRTL ? "flex-row" : ""
                          }`}
                      >
                        <div
                          className={`flex-1 ${isRTL ? "text-right" : "text-left"
                            }`}
                        >
                          <p className="font-medium text-sm">{job.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {job.companies?.name || t("recentJobs.company")}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t("recentJobs.noJobs")}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className={isRTL ? "text-right" : "text-left"}>
                <CardTitle className="text-lg font-semibold">{t("recentTenders.title")}</CardTitle>
                <CardDescription className="mt-1">
                  {t("recentTenders.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                {recentTenders && recentTenders.length > 0 ? (
                  <div className="space-y-4">
                    {recentTenders.map((tender) => (
                      <div
                        key={tender.id}
                        className={`flex items-start justify-between border-b pb-3 last:border-0 ${isRTL ? "flex-row" : ""
                          }`}
                      >
                        <div
                          className={`flex-1 ${isRTL ? "text-right" : "text-left"
                            }`}
                        >
                          <p className="font-medium text-sm">{tender.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {tender.organizations?.name ||
                              t("recentTenders.organization")}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(tender.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t("recentTenders.noTenders")}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mt-8">
            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className={isRTL ? "text-right" : "text-left"}>
                <CardTitle className="text-lg font-semibold">{t("pendingOrganizations.title")}</CardTitle>
                <CardDescription className="mt-1">
                  {t("pendingOrganizations.description")}
                </CardDescription>
              </CardHeader>
              <CardContent
                className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}
              >
                {pendingOrganizations && pendingOrganizations.length > 0 ? (
                  pendingOrganizations.map((org) => (
                    <div
                      key={org.id}
                      className={`flex items-center justify-between border-b pb-3 last:border-0 ${isRTL ? "flex-row" : ""
                        }`}
                    >
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className="font-medium">{org.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {org.profiles?.email ||
                            t("pendingOrganizations.unknownOwner")}
                        </p>
                      </div>
                      <ApproveEntityButton
                        entityId={org.id}
                        entityType="organization"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t("pendingOrganizations.noPending")}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className={isRTL ? "text-right" : "text-left"}>
                <CardTitle className="text-lg font-semibold">{t("pendingCompanies.title")}</CardTitle>
                <CardDescription className="mt-1">
                  {t("pendingCompanies.description")}
                </CardDescription>
              </CardHeader>
              <CardContent
                className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}
              >
                {pendingCompanies && pendingCompanies.length > 0 ? (
                  pendingCompanies.map((company) => (
                    <div
                      key={company.id}
                      className={`flex items-center justify-between border-b pb-3 last:border-0 ${isRTL ? "flex-row" : ""
                        }`}
                    >
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className="font-medium">{company.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {company.profiles?.email ||
                            t("pendingCompanies.unknownOwner")}
                        </p>
                      </div>
                      <ApproveEntityButton
                        entityId={company.id}
                        entityType="company"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t("pendingCompanies.noPending")}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
