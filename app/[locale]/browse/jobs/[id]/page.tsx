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
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  ArrowLeft,
} from "lucide-react";
import { FeeDisclaimer } from "@/components/fee-disclaimer";
import { getTranslations, getLocale } from "next-intl/server";
import { rtlLocales } from "@/i18n/config";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("JobDetail");
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

  // Fetch job details from API
  const apiClient = createServerApiClient();
  let job: any = null;
  let hasApplied = false;

  try {
    // Fetch job from API (public endpoint)
    job = await apiClient.getJob(id);

    if (!job) {
      notFound();
    }

    // Check if user already applied
    if (profile) {
      try {
        const applications = await apiClient.getMyJobApplications();
        hasApplied = Array.isArray(applications)
          ? applications.some((app: any) => app.job_id === id || app.job?.id === id)
          : false;
      } catch {
        hasApplied = false;
      }
    }
  } catch (error) {
    console.error('Error fetching job from API:', error);
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
            <Link href="/browse/jobs" className={isRTL ? "flex-row" : ""}>
              <ArrowLeft
                className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`}
              />
              {t("backToJobs")}
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
                        {job.title}
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
                          {job.company?.name || t("company")}
                        </span>
                        {job.location && (
                          <span
                            className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""
                              }`}
                          >
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            {job.location}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {job.employment_type || t("fullTime")}
                    </Badge>
                  </div>

                  <div
                    className={`flex flex-wrap gap-4 text-sm text-muted-foreground border-t pt-4 ${isRTL ? "flex-row" : ""
                      }`}
                  >
                    {job.salary_min && job.salary_max && (
                      <span
                        className={`flex items-center gap-1 ${isRTL ? "flex-row" : ""
                          }`}
                      >
                        <DollarSign className="h-4 w-4 flex-shrink-0" />$
                        {job.salary_min.toLocaleString()} - $
                        {job.salary_max.toLocaleString()}
                      </span>
                    )}
                    <span
                      className={`flex items-center gap-1 ${isRTL ? "flex-row" : ""
                        }`}
                    >
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      {t("posted")}{" "}
                      {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    {job.experience_level && (
                      <span
                        className={`flex items-center gap-1 ${isRTL ? "flex-row" : ""
                          }`}
                      >
                        <Briefcase className="h-4 w-4 flex-shrink-0" />
                        {job.experience_level}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent
                  className={`space-y-6 ${isRTL ? "text-right" : "text-left"}`}
                >
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      {t("jobDescription")}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {job.description}
                    </p>
                  </div>

                  {job.requirements && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        {t("requirements")}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {job.requirements}
                      </p>
                    </div>
                  )}

                  {job.category && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        {t("category")}
                      </h3>
                      <Badge>{job.category}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
              <FeeDisclaimer className="mt-4" showReportLink={false} />
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader className={isRTL ? "text-right" : "text-left"}>
                  <CardTitle>{t("applyForJob")}</CardTitle>
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
                        <Link href="/dashboard/applications/jobs">
                          {t("viewApplications")}
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <form action={`/api/apply/job/${id}`} method="post">
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

              {job.company && (
                <Card>
                  <CardHeader className={isRTL ? "text-right" : "text-left"}>
                    <CardTitle>{t("aboutCompany")}</CardTitle>
                  </CardHeader>
                  <CardContent
                    className={`space-y-3 ${isRTL ? "text-right" : "text-left"
                      }`}
                  >
                    <div>
                      <h4 className="font-semibold mb-1">
                        {job.company.name}
                      </h4>
                      {job.company.description && (
                        <p className="text-sm text-muted-foreground">
                          {job.company.description}
                        </p>
                      )}
                    </div>
                    {job.company.website && (
                      <Button
                        variant="outline"
                        asChild
                        className="w-full bg-transparent"
                      >
                        <a
                          href={job.company.website}
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
