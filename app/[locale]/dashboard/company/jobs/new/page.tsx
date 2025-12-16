import { redirect } from "@/navigation";
import { requireAuth } from "@/lib/auth/server";
import { createServerApiClient } from "@/lib/api/server";
import { JobForm } from "@/components/job-form";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { ArrowLeft } from "lucide-react";
import { FREE_JOB_POST_LIMIT } from "@/lib/constants";
import { getTranslations, getLocale } from "next-intl/server";
import { rtlLocales } from "@/i18n/config";

export default async function NewJobPage() {
  const t = await getTranslations("CompanyJobNew");
  const tJobs = await getTranslations("CompanyJobs");
  const locale = await getLocale();
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number]);

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

  if (!company.approved) {
    redirect("/dashboard/company?pending_approval=1");
  }

  // Get quota from API
  const quota = await apiClient.getCompanyQuota(company.id).catch(() => null);
  const freeJobPostLimit = quota?.jobs_limit ?? FREE_JOB_POST_LIMIT;
  const freeJobPostsRemaining = quota?.remaining ?? freeJobPostLimit;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-gradient-to-br from-slate-50 via-indigo-50 to-white">
        <div className="relative">
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-purple-300/30 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Button variant="ghost" asChild className={`mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Link href="/dashboard/company/jobs" className={isRTL ? "flex-row-reverse" : ""}>
              <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
              {tJobs("backToJobs")}
            </Link>
          </Button>

          <div className={`mb-8 rounded-2xl border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur-md ${isRTL ? "text-right" : "text-left"}`}>
            <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {t("subtitle")}
            </p>
          </div>

          <JobForm
            companyId={company.id}
            freePostLimit={freeJobPostLimit}
            freePostsRemaining={freeJobPostsRemaining}
          />
        </div>
      </main>
    </div>
  );
}
