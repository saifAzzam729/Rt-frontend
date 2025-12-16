import { notFound } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import {
  ArrowLeft,
  Briefcase,
  Clock,
  DollarSign,
  Eye,
  MapPin,
  Settings,
} from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { rtlLocales } from "@/i18n/config";

export default async function CompanyJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("CompanyJobDetail");
  const tJobs = await getTranslations("CompanyJobs");
  const locale = await getLocale();
  const isRTL = rtlLocales.includes(locale as any);

  const { id } = await params;

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

  // Get job from API
  const job = await apiClient.getJob(id);

  if (!job || job.company_id !== company.id) {
    notFound();
  }

  // Get application count for this job
  const applications = await apiClient.getJobApplicationsForCompany(company.id).catch(() => []);
  const applicationCount = Array.isArray(applications)
    ? applications.filter((app: any) => app.job_id === id || app.job?.id === id).length
    : 0;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-gradient-to-br from-slate-50 via-indigo-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            asChild
            className={`mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Link
              href="/dashboard/company/jobs"
              className={isRTL ? "flex-row-reverse" : ""}
            >
              <ArrowLeft
                className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`}
              />
              {t("backToJobs")}
            </Link>
          </Button>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card className="border-none bg-white/90 shadow-xl">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{job.title}</CardTitle>
                      <CardDescription
                        className={`mt-2 flex flex-wrap items-center gap-4 text-sm ${isRTL ? "flex-row-reverse" : ""
                          }`}
                      >
                        {job.location && (
                          <span
                            className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""
                              }`}
                          >
                            <MapPin className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                            {job.location}
                          </span>
                        )}
                        <span
                          className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""
                            }`}
                        >
                          <Clock className="h-4 w-4 text-purple-600 flex-shrink-0" />
                          {t("posted")}{" "}
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`capitalize px-3 py-1 rounded-full ${job.status === "open"
                        ? "bg-emerald-100 text-emerald-700"
                        : job.status === "closed"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-700"
                        }`}
                    >
                      {tJobs(
                        `status.${job.status as "open" | "closed" | "draft"}`
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-2">
                    {job.employment_type && (
                      <span className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-700" />
                        {job.employment_type}
                      </span>
                    )}
                    {job.experience_level && (
                      <span className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-fuchsia-600" />
                        {job.experience_level}
                      </span>
                    )}
                    {job.salary_min && job.salary_max && (
                      <span className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-amber-600" />$
                        {job.salary_min.toLocaleString()} - $
                        {job.salary_max.toLocaleString()}
                      </span>
                    )}
                    <span
                      className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""
                        }`}
                    >
                      <Eye className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      {(job.views_count || 0).toLocaleString()} {t("views")}
                    </span>
                  </div>

                  <div className={isRTL ? "text-right" : "text-left"}>
                    <h2 className="text-lg font-semibold mb-3">
                      {t("description")}
                    </h2>
                    <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
                      {job.description}
                    </p>
                  </div>

                  {job.requirements && (
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <h2 className="text-lg font-semibold mb-3">
                        {t("requirements")}
                      </h2>
                      <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
                        {job.requirements}
                      </p>
                    </div>
                  )}

                  {job.category && (
                    <div className={isRTL ? "text-right" : "text-left"}>
                      <h2 className="text-lg font-semibold mb-3">
                        {t("category")}
                      </h2>
                      <Badge>{job.category}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none bg-white/90 shadow-lg">
                <CardHeader className={isRTL ? "text-right" : "text-left"}>
                  <CardTitle>{t("actions.title")}</CardTitle>
                  <CardDescription>{t("actions.description")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    asChild
                    className="w-full btn-gradient-primary text-white"
                  >
                    <Link href={`/dashboard/company/jobs/${job.id}/edit`}>
                      {t("actions.editJob")}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/browse/jobs/${job.id}`}>
                      {t("actions.viewPublicPosting")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-none bg-white/90 shadow-lg">
                <CardHeader className={isRTL ? "text-right" : "text-left"}>
                  <CardTitle>{t("performance.title")}</CardTitle>
                </CardHeader>
                <CardContent
                  className={`space-y-3 text-sm text-muted-foreground ${isRTL ? "text-right" : "text-left"
                    }`}
                >
                  <div
                    className={`flex items-center justify-between ${isRTL ? "flex-row" : ""
                      }`}
                  >
                    <span>{t("performance.applications")}</span>
                    <span className="font-semibold text-foreground">
                      {applicationCount.toLocaleString()}
                    </span>
                  </div>
                  <div
                    className={`flex items-center justify-between ${isRTL ? "flex-row" : ""
                      }`}
                  >
                    <span>{t("performance.views")}</span>
                    <span className="font-semibold text-foreground">
                      {(job.views_count || 0).toLocaleString()}
                    </span>
                  </div>
                  <div
                    className={`flex items-center justify-between ${isRTL ? "flex-row" : ""
                      }`}
                  >
                    <span>{t("performance.lastUpdated")}</span>
                    <span className="font-semibold text-foreground">
                      {job.updated_at
                        ? new Date(job.updated_at).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
