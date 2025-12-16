import { createServerApiClient } from "@/lib/api/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/navigation";
import { Briefcase, MapPin, DollarSign, Clock, Search, Sparkles, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getTranslations, getLocale } from "next-intl/server";
import { rtlLocales } from "@/i18n/config";

export default async function BrowseJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const t = await getTranslations("BrowseJobs");
  const locale = await getLocale();
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number]);

  const params = await searchParams;

  // Fetch open jobs from API
  const apiClient = createServerApiClient();
  let jobs: any[] = [];

  try {
    // Build query params for API
    const apiParams: { search?: string; category?: string; location?: string } = {};
    if (params.search) {
      apiParams.search = params.search;
    }
    if (params.category) {
      apiParams.category = params.category;
    }

    // Fetch jobs from API (public endpoint, no auth required)
    const apiJobs = await apiClient.getJobs(apiParams);
    jobs = Array.isArray(apiJobs)
      ? apiJobs.filter((job: any) => job.status === "open")
      : [];
  } catch (error) {
    console.error('Error fetching jobs from API:', error);
    jobs = [];
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-gradient-professional-subtle relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className={`text-center mb-10 ${isRTL ? "text-right" : "text-left"}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 border border-blue-100 text-blue-700 text-sm font-semibold mb-6">
                <Sparkles className="h-4 w-4" />
                <span>{t("title")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gradient-primary tracking-tight mb-4">
                {t("title")}
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {t("subtitle")}
              </p>
            </div>

            {/* Enhanced Search Bar */}
            <div className="group relative">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-10 blur-xl group-hover:opacity-20 transition-opacity duration-500"></div>

              <form
                action="/browse/jobs"
                method="get"
                className="relative rounded-2xl border-2 border-white/60 bg-white/95 backdrop-blur-xl p-4 shadow-2xl"
              >
                <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <div className="relative flex-1">
                    <Search className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground ${isRTL ? "right-4" : "left-4"}`} />
                    <Input
                      name="search"
                      placeholder={t("searchPlaceholder")}
                      defaultValue={params.search}
                      dir={isRTL ? "rtl" : "ltr"}
                      className={`h-14 pl-12 pr-4 rounded-xl bg-white/90 border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 text-base shadow-sm transition-all duration-200 hover:shadow-md ${isRTL ? "text-right" : "text-left"}`}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-14 px-8 btn-gradient-primary text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn"
                  >
                    <span className="flex items-center gap-2">
                      {t("searchButton")}
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </span>
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-6">
              {jobs && jobs.length > 0 ? (
                jobs.map((job) => (
                  <Card
                    key={job.id}
                    className="group relative border-2 border-white/60 bg-white/90 backdrop-blur-xl hover:border-blue-300/60 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                  >
                    {/* Gradient accent on hover */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none"></div>

                    <CardHeader className="relative z-10">
                      <div
                        className={`flex items-start justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                          <CardTitle className="text-2xl font-bold tracking-tight mb-3 text-foreground group-hover:text-blue-700 transition-colors duration-300">
                            {job.title}
                          </CardTitle>
                          <CardDescription
                            className={`flex flex-wrap items-center gap-4 text-sm mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <span
                              className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                                <Briefcase className="h-4 w-4" />
                              </div>
                              <span className="font-semibold text-foreground">{job.company?.name || t("company")}</span>
                            </span>
                            {job.location && (
                              <span
                                className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                              >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
                                  <MapPin className="h-4 w-4" />
                                </div>
                                <span className="font-semibold text-foreground">{job.location}</span>
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        <Badge
                          variant="secondary"
                          className="rounded-full px-4 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-2 border-indigo-200/60 font-semibold text-sm shadow-sm"
                        >
                          {job.employment_type || t("fullTime")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p
                        className={`text-muted-foreground mb-6 line-clamp-2 leading-relaxed text-base ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {job.description}
                      </p>
                      <div
                        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-100 ${isRTL ? "sm:flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`flex flex-wrap items-center gap-4 text-sm ${isRTL ? "flex-row-reverse" : ""}`}
                        >
                          {job.salary_min && job.salary_max && (
                            <span
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 font-semibold ${isRTL ? "flex-row-reverse" : ""}`}
                            >
                              <DollarSign className="h-4 w-4" />
                              <span>${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}</span>
                            </span>
                          )}
                          <span
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 font-medium ${isRTL ? "flex-row-reverse" : ""}`}
                          >
                            <Clock className="h-4 w-4" />
                            <span>{new Date(job.created_at).toLocaleDateString()}</span>
                          </span>
                        </div>
                        <Button
                          asChild
                          className="btn-gradient-primary text-white rounded-xl font-semibold px-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn"
                        >
                          <Link href={`/browse/jobs/${job.id}`} className="flex items-center gap-2">
                            {t("viewDetails")}
                            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-2 border-white/60 bg-white/90 backdrop-blur-xl shadow-2xl">
                  <CardContent className={`py-20 text-center ${isRTL ? "text-right" : "text-left"}`}>
                    <div className="flex flex-col items-center justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-purple-50 mb-6">
                        <Briefcase className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{t("noJobsFound")}</h3>
                      <p className="text-muted-foreground text-base max-w-md">
                        {params.search
                          ? "Try adjusting your search terms or browse all available positions."
                          : "Check back soon for new opportunities!"}
                      </p>
                    </div>
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
