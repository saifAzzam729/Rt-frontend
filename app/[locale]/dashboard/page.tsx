import { redirect as nextRedirect } from "next/navigation";
import { getCurrentUserProfile, requireAuth } from "@/lib/auth/server";
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
import { Link } from "@/navigation";
import { Briefcase, FileText, User, Settings } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { rtlLocales } from "@/i18n/config";

export default async function DashboardPage() {
  const t = await getTranslations("Dashboard");
  const locale = await getLocale();
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number]);

  // Authenticate user via JWT
  const jwtUser = await requireAuth();

  const apiClient = createServerApiClient();

  // Get profile and applications from API
  const [profile, jobApplications, tenderApplications] = await Promise.all([
    apiClient.getMyProfile(),
    apiClient.getMyJobApplications().catch(() => []),
    apiClient.getMyTenderApplications().catch(() => []),
  ]);

  if (!profile) {
    nextRedirect(`/${locale}/auth/login`);
  }

  const jobApplicationsCount = Array.isArray(jobApplications) ? jobApplications.length : 0;
  const tenderApplicationsCount = Array.isArray(tenderApplications) ? tenderApplications.length : 0;

  // Redirect based on role
  if (profile.role === "organization") {
    nextRedirect(`/${locale}/dashboard/organization`);
  } else if (profile.role === "company") {
    nextRedirect(`/${locale}/dashboard/company`);
  } else if (profile.role === "admin") {
    nextRedirect(`/${locale}/dashboard/admin`);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavHeader user={{ email: profile.email, role: profile.role }} />
      <main className="flex-1 bg-gradient-professional-subtle">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {profile.full_name
                ? t("welcome", { name: profile.full_name })
                : t("welcomeFallback")}
            </h1>
            <p className="text-muted-foreground mt-3 text-base leading-relaxed">{t("subtitle")}</p>
          </div>

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
                  {t("stats.jobApplications")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <Briefcase className="h-5 w-5 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">
                  {(jobApplicationsCount ?? 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {t("stats.totalApplicationsSubmitted")}
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
                  {t("stats.tenderApplications")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                  <FileText className="h-5 w-5 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">
                  {(tenderApplicationsCount ?? 0).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {t("stats.totalApplicationsSubmitted")}
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
                  {t("stats.profile")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-700">
                  <User className="h-5 w-5 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">
                  {profile.full_name
                    ? t("stats.complete")
                    : t("stats.incomplete")}
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {t("stats.profileStatus")}
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
                  {t("stats.account")}
                </CardTitle>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-700">
                  <Settings className="h-5 w-5 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className={isRTL ? "text-right" : "text-left"}>
                <div className="text-3xl font-bold text-gray-900 tracking-tight">
                  {t(
                    `roles.${profile.role as
                    | "user"
                    | "organization"
                    | "company"
                    | "admin"
                    }`
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">
                  {t("stats.accountType")}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className={isRTL ? "text-right" : "text-left"}>
                <CardTitle className="text-lg font-semibold">{t("quickActions.title")}</CardTitle>
                <CardDescription className="mt-1">
                  {t("quickActions.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <Button
                  asChild
                  className={`w-full justify-start bg-transparent hover:bg-gray-50/80 ${isRTL ? "flex-row-reverse" : ""
                    }`}
                  variant="outline"
                >
                  <Link
                    href="/browse/jobs"
                    className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <Briefcase
                      className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    <span className="font-medium">{t("quickActions.browseJobs")}</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  className={`w-full justify-start bg-transparent hover:bg-gray-50/80 ${isRTL ? "flex-row-reverse" : ""
                    }`}
                  variant="outline"
                >
                  <Link
                    href="/browse/tenders"
                    className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <FileText
                      className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    <span className="font-medium">{t("quickActions.browseTenders")}</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  className={`w-full justify-start bg-transparent hover:bg-gray-50/80 ${isRTL ? "flex-row-reverse" : ""
                    }`}
                  variant="outline"
                >
                  <Link
                    href="/dashboard/profile"
                    className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <User className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                    <span className="font-medium">{t("quickActions.editProfile")}</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader className={isRTL ? "text-right" : "text-left"}>
                <CardTitle className="text-lg font-semibold">{t("myApplications.title")}</CardTitle>
                <CardDescription className="mt-1">
                  {t("myApplications.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2.5">
                <Button
                  asChild
                  className={`w-full justify-start bg-transparent hover:bg-gray-50/80 ${isRTL ? "flex-row-reverse" : ""
                    }`}
                  variant="outline"
                >
                  <Link
                    href="/dashboard/applications/jobs"
                    className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <Briefcase
                      className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    <span className="font-medium">{t("myApplications.jobApplications")}</span>
                    <span className={`ml-auto ${isRTL ? "mr-auto ml-0" : ""} text-sm text-muted-foreground`}>
                      {(jobApplicationsCount ?? 0).toLocaleString()}
                    </span>
                  </Link>
                </Button>
                <Button
                  asChild
                  className={`w-full justify-start bg-transparent hover:bg-gray-50/80 ${isRTL ? "flex-row-reverse" : ""
                    }`}
                  variant="outline"
                >
                  <Link
                    href="/dashboard/applications/tenders"
                    className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <FileText
                      className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    <span className="font-medium">{t("myApplications.tenderApplications")}</span>
                    <span className={`ml-auto ${isRTL ? "mr-auto ml-0" : ""} text-sm text-muted-foreground`}>
                      {(tenderApplicationsCount ?? 0).toLocaleString()}
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
