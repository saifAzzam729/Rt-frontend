import { redirect } from "@/navigation"
import { requireAuth } from "@/lib/auth/server"
import { createServerApiClient } from "@/lib/api/server"
import { NavHeader } from "@/components/nav-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/navigation"
import { Briefcase, MapPin, DollarSign, Clock, ArrowLeft, Eye, Users, ShieldAlert } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getTranslations, getLocale } from "next-intl/server"
import { rtlLocales } from "@/i18n/config"

export default async function ManageJobsPage() {
  const t = await getTranslations("CompanyJobs")
  const tCompany = await getTranslations("CompanyDashboard")
  const locale = await getLocale()
  const isRTL = rtlLocales.includes(locale as any)

  // Authenticate user via JWT
  await requireAuth();

  const apiClient = createServerApiClient();

  // Get profile and verify role
  const profile = await apiClient.getMyProfile();
  if (!profile || profile.role !== "company") {
    redirect("/dashboard");
  }

  // Get company from API
  const companies = await apiClient.getMyCompanies();
  const company = Array.isArray(companies) && companies.length > 0 ? companies[0] : null;

  if (!company) {
    redirect("/dashboard/company");
  }

  // Fetch company's jobs from API
  const jobs = await apiClient.getJobsByCompany(company.id);
  let jobList: any[] = Array.isArray(jobs) ? jobs : [];

  // Get application counts for each job
  if (jobList.length > 0) {
    const applications = await apiClient.getJobApplicationsForCompany(company.id).catch(() => []);
    const applicationsMap = new Map();

    if (Array.isArray(applications)) {
      applications.forEach((app: any) => {
        const jobId = app.job_id || app.job?.id;
        if (jobId) {
          const count = applicationsMap.get(jobId) || 0;
          applicationsMap.set(jobId, count + 1);
        }
      });
    }

    // Add application counts to jobs
    jobList = jobList.map((job: any) => ({
      ...job,
      job_applications: [{ count: applicationsMap.get(job.id) || 0 }],
    }));
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavHeader user={{ email: profile.email, role: profile.role }} />
      <main className="flex-1 bg-gradient-to-br from-slate-50 via-indigo-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className={`mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Link href="/dashboard/company" className={isRTL ? "flex-row-reverse" : ""}>
              <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
              {tCompany("backToDashboard")}
            </Link>
          </Button>

          <div className={`mb-8 flex items-center justify-between rounded-2xl border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-md ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="text-2xl font-bold tracking-tight">{t("manageTitle")}</h1>
              <p className="text-sm text-muted-foreground mt-1">{t("manageSubtitle")}</p>
            </div>
            <Button
              asChild
              className="btn-gradient-primary shadow-lg text-white"
              disabled={!company.approved}
              title={!company.approved ? tCompany("approval.pendingApprovalTooltipShort") : tCompany("approval.createJobTooltip")}
            >
              <Link href="/dashboard/company/jobs/new">{t("postNewJob")}</Link>
            </Button>
          </div>

          {!company.approved && (
            <Alert className={`mb-6 border-blue-200 bg-blue-50 ${isRTL ? "text-right" : "text-left"}`}>
              <AlertTitle className={`text-blue-900 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                {tCompany("approval.awaitingTitle")}
              </AlertTitle>
              <AlertDescription className="text-blue-800">
                {tCompany("approval.awaitingDescription")}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6">
            {jobList.length > 0 ? (
              jobList.map((job) => (
                <Card key={job.id} className="border-none bg-white/80 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold tracking-tight mb-1">{job.title}</CardTitle>
                        <CardDescription className={`flex flex-wrap items-center gap-4 text-sm ${isRTL ? "flex-row-reverse" : ""}`}>
                          {job.location && (
                            <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                              <MapPin className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                              {job.location}
                            </span>
                          )}
                          <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <Clock className="h-4 w-4 text-purple-600 flex-shrink-0" />
                            {t("jobCard.posted")} {new Date(job.created_at).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`capitalize px-3 py-1 rounded-full ${job.status === "open" ? "bg-emerald-100 text-emerald-700" : job.status === "closed" ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-700"}`}
                      >
                        {t(`status.${job.status as "open" | "closed" | "draft"}`)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-5 line-clamp-2">{job.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        {job.salary_min && job.salary_max && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-amber-600" />${job.salary_min.toLocaleString()} - $
                            {job.salary_max.toLocaleString()}
                          </span>
                        )}
                        <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <Eye className="h-4 w-4 text-blue-700 flex-shrink-0" />
                          {(job.views_count || 0).toLocaleString()} {t("jobCard.views")}
                        </span>
                        <span className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <Users className="h-4 w-4 text-fuchsia-600 flex-shrink-0" />
                          {(job.job_applications?.[0]?.count || job.application_count || 0).toLocaleString()} {t("jobCard.applications")}
                        </span>
                      </div>
                      <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        <Button asChild variant="outline" className="border-none bg-gradient-to-r from-indigo-50 to-white hover:from-indigo-100 hover:to-white shadow-sm">
                          <Link href={`/dashboard/company/jobs/${job.id}/edit`}>{t("jobCard.edit")}</Link>
                        </Button>
                        <Button asChild className="btn-gradient-primary shadow-md text-white">
                          <Link href={`/dashboard/company/jobs/${job.id}`}>{t("jobCard.view")}</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-none bg-gradient-to-br from-white to-indigo-50 shadow-xl">
                <CardContent className={`py-16 text-center ${isRTL ? "text-right" : "text-left"}`}>
                  <Briefcase className="mx-auto h-14 w-14 text-indigo-500 mb-4" />
                  <p className="text-muted-foreground mb-6">{t("emptyState.title")}</p>
                  <Button asChild className="btn-gradient-primary shadow-lg text-white">
                    <Link href="/dashboard/company/jobs/new">{t("emptyState.cta")}</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
