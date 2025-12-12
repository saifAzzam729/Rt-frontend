import { redirect } from "@/navigation";
import { requireAuth } from "@/lib/auth/server";
import { createServerApiClient } from "@/lib/api/server";
import { NavHeader } from "@/components/nav-header";
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
  Briefcase,
  MapPin,
  Clock,
  ArrowLeft,
  User,
  Mail,
  FileText,
} from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { rtlLocales } from "@/i18n/config";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function CompanyApplicationsPage() {
  const t = await getTranslations("CompanyApplications");
  const tCompany = await getTranslations("CompanyDashboard");
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

  // Fetch applications for company's jobs from API
  const applicationsList = await apiClient.getJobApplicationsForCompany(company.id).catch(() => []);

  return (
    <div className="flex min-h-screen flex-col">
      <NavHeader user={{ email: profile.email, role: profile.role }} />
      <main className="flex-1 bg-gradient-to-br from-slate-50 via-indigo-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            asChild
            className={`mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <Link
              href="/dashboard/company"
              className={isRTL ? "flex-row-reverse" : ""}
            >
              <ArrowLeft
                className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`}
              />
              {tCompany("backToDashboard")}
            </Link>
          </Button>

          <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
            <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
            <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
          </div>

          <div className="grid gap-6">
            {applicationsList && applicationsList.length > 0 ? (
              applicationsList.map((application: any) => (
                <Card
                  key={application.id}
                  className="hover:border-indigo-200 transition-colors"
                >
                  <CardHeader>
                    <div
                      className={`flex items-start justify-between ${isRTL ? "flex-row-reverse" : ""
                        }`}
                    >
                      <div
                        className={`flex-1 ${isRTL ? "text-right" : "text-left"
                          }`}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={undefined}
                              alt={
                                application.user?.full_name || "Applicant"
                              }
                            />
                            <AvatarFallback>
                              {application.user?.full_name
                                ?.substring(0, 2)
                                ?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className={isRTL ? "text-right" : "text-left"}>
                            <CardTitle className="text-lg">
                              {application.user?.full_name ||
                                t("anonymous")}
                            </CardTitle>
                            <CardDescription
                              className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""
                                }`}
                            >
                              <Mail className="h-3 w-3" />
                              {application.user?.email}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h3 className="font-semibold mb-2">
                            {application.job?.title || "Job Application"}
                          </h3>
                          <CardDescription
                            className={`flex flex-wrap items-center gap-4 text-sm ${isRTL ? "flex-row-reverse" : ""
                              }`}
                          >
                            {application.job?.location && (
                              <span
                                className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""
                                  }`}
                              >
                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                {application.job?.location}
                              </span>
                            )}
                            {application.job?.employment_type && (
                              <Badge variant="outline">
                                {application.job.employment_type}
                              </Badge>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={
                          application.status === "accepted"
                            ? "default"
                            : application.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                        className="capitalize"
                      >
                        {t(
                          `status.${application.status as
                          | "pending"
                          | "accepted"
                          | "rejected"
                          }`
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""
                        }`}
                    >
                      <div
                        className={`flex items-center gap-4 text-sm text-muted-foreground ${isRTL ? "flex-row-reverse" : ""
                          }`}
                      >
                        <span
                          className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""
                            }`}
                        >
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          {t("applied")}{" "}
                          {new Date(
                            application.created_at
                          ).toLocaleDateString()}
                        </span>
                        {application.cover_letter && (
                          <span
                            className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""
                              }`}
                          >
                            <FileText className="h-4 w-4 flex-shrink-0" />
                            {t("hasCoverLetter")}
                          </span>
                        )}
                        {application.resume_url && (
                          <span
                            className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""
                              }`}
                          >
                            <FileText className="h-4 w-4 flex-shrink-0" />
                            {t("hasResume")}
                          </span>
                        )}
                      </div>
                      <div
                        className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""
                          }`}
                      >
                        <Button
                          asChild
                          variant="outline"
                          className="bg-transparent"
                        >
                          <Link
                            href={`/dashboard/company/jobs/${application.job?.id}`}
                          >
                            {t("viewJob")}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className={`py-12 text-center`}>
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {t("noApplications")}
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/company/jobs">
                      {t("manageJobs")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
