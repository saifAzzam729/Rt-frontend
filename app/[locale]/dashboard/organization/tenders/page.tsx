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
import { Button } from "@/components/ui/button";
import { PostTenderCTA } from "@/components/post-tender-cta";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import { FileText, MapPin, Clock, ArrowLeft, Eye, Users } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { rtlLocales } from "@/i18n/config";

export default async function ManageTendersPage() {
  const t = await getTranslations("OrganizationTenders");
  const locale = await getLocale();
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number]);

  // Authenticate user via JWT
  await requireAuth();

  const apiClient = createServerApiClient();

  // Get profile and verify role
  const profile = await apiClient.getMyProfile();
  if (!profile || profile.role !== "organization") {
    redirect("/dashboard");
  }

  // Get organization from API
  const organizations = await apiClient.getMyOrganizations();
  const organization = Array.isArray(organizations) && organizations.length > 0 ? organizations[0] : null;

  if (!organization) {
    redirect("/dashboard/organization");
  }

  // Fetch organization's tenders from API
  const tenders = await apiClient.getTendersByOrganization(organization.id);
  let tenderList: any[] = Array.isArray(tenders) ? tenders : [];

  // Get application counts for each tender
  if (tenderList.length > 0) {
    const applications = await apiClient.getTenderApplicationsForOrganization(organization.id).catch(() => []);
    const applicationsMap = new Map();

    if (Array.isArray(applications)) {
      applications.forEach((app: any) => {
        const tenderId = app.tender_id || app.tender?.id;
        if (tenderId) {
          const count = applicationsMap.get(tenderId) || 0;
          applicationsMap.set(tenderId, count + 1);
        }
      });
    }

    // Add application counts to tenders
    tenderList = tenderList.map((tender: any) => ({
      ...tender,
      tender_applications: [{ count: applicationsMap.get(tender.id) || 0 }],
    }));
  }

  return (
    <div className="flex min-h-screen flex-col">
      <NavHeader user={{ email: profile.email, role: profile.role }} />
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Button
            variant="ghost"
            asChild
            className={`mb-6 ${isRTL ? "flex-row" : ""}`}
          >
            <Link
              href="/dashboard/organization"
              className={isRTL ? "flex-row" : ""}
            >
              <ArrowLeft
                className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`}
              />
              {t("backToDashboard")}
            </Link>
          </Button>

          <div
            className={`mb-8 flex items-center justify-between ${isRTL ? "flex-row" : ""
              }`}
          >
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="text-3xl font-bold text-foreground">
                {t("manageTitle")}
              </h1>
              <p className="text-muted-foreground mt-2">
                {t("manageSubtitle")}
              </p>
            </div>
            <PostTenderCTA />
          </div>

          <div className="grid gap-6">
            {tenderList.length > 0 ? (
              tenderList.map((tender) => (
                <Card
                  key={tender.id}
                  className="hover:border-blue-200 transition-colors"
                >
                  <CardHeader>
                    <div
                      className={`flex items-start justify-between ${isRTL ? "flex-row" : ""
                        }`}
                    >
                      <div
                        className={`flex-1 ${isRTL ? "text-right" : "text-left"
                          }`}
                      >
                        <CardTitle className="text-xl mb-2">
                          {tender.title}
                        </CardTitle>
                        <CardDescription
                          className={`flex items-center gap-4 text-sm ${isRTL ? "flex-row" : ""
                            }`}
                        >
                          {tender.location && (
                            <span
                              className={`flex items-center gap-1 ${isRTL ? "flex-row" : ""
                                }`}
                            >
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              {tender.location}
                            </span>
                          )}
                          <span
                            className={`flex items-center gap-1 ${isRTL ? "flex-row" : ""
                              }`}
                          >
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            {t("tenderCard.posted")}{" "}
                            {new Date(tender.created_at).toLocaleDateString()}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          tender.status === "open" ? "default" : "secondary"
                        }
                        className="capitalize"
                      >
                        {t(
                          `status.${tender.status as "open" | "closed" | "draft"
                          }`
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className={isRTL ? "text-right" : "text-left"}>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {tender.description}
                    </p>
                    <div
                      className={`flex items-center justify-between ${isRTL ? "flex-row" : ""
                        }`}
                    >
                      <div
                        className={`flex items-center gap-4 text-sm text-muted-foreground ${isRTL ? "flex-row" : ""
                          }`}
                      >
                        <span
                          className={`flex items-center gap-1 ${isRTL ? "flex-row" : ""
                            }`}
                        >
                          <Eye className="h-4 w-4 flex-shrink-0" />
                          {(tender.views_count || 0).toLocaleString()}{" "}
                          {t("tenderCard.views")}
                        </span>
                        <span
                          className={`flex items-center gap-1 ${isRTL ? "flex-row" : ""
                            }`}
                        >
                          <Users className="h-4 w-4 flex-shrink-0" />
                          {(
                            tender.tender_applications?.[0]?.count || tender.application_count || 0
                          ).toLocaleString()}{" "}
                          {t("tenderCard.applications")}
                        </span>
                      </div>
                      <div className={`flex gap-2 ${isRTL ? "flex-row" : ""}`}>
                        <Button
                          asChild
                          variant="outline"
                          className="bg-transparent"
                        >
                          <Link
                            href={`/dashboard/organization/tenders/${tender.id}/edit`}
                          >
                            {t("tenderCard.edit")}
                          </Link>
                        </Button>
                        <Button asChild>
                          <Link
                            href={`/dashboard/organization/tenders/${tender.id}`}
                          >
                            {t("tenderCard.view")}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent
                  className={`py-12 text-center ${isRTL ? "text-right" : "text-left"
                    }`}
                >
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {t("noTendersYet")}
                  </p>
                  <PostTenderCTA>{t("postYourFirstTender")}</PostTenderCTA>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
