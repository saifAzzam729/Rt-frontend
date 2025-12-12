import { redirect } from "@/navigation";
import { requireAuth } from "@/lib/auth/server";
import { createServerApiClient } from "@/lib/api/server";
import { NavHeader } from "@/components/nav-header";
import { TenderForm } from "@/components/tender-form";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { ArrowLeft } from "lucide-react";
import { FREE_TENDER_POST_LIMIT } from "@/lib/constants";
import { getTranslations, getLocale } from "next-intl/server";
import { rtlLocales } from "@/i18n/config";

export default async function NewTenderPage() {
  const t = await getTranslations("OrganizationTenderNew");
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

  // Check if profile is complete
  if (!organization.profile_complete) {
    redirect("/dashboard/organization/profile?incomplete=true");
  }

  // Check if organization is approved
  if (!organization.approved) {
    redirect("/dashboard/organization?pending_approval=true");
  }

  // Get quota from API
  const quota = await apiClient.getOrganizationQuota(organization.id).catch(() => null);
  const freeTenderPostLimit = quota?.tenders_limit ?? FREE_TENDER_POST_LIMIT;
  const freeTenderPostsRemaining = quota?.remaining ?? freeTenderPostLimit;

  return (
    <div className="flex min-h-screen flex-col">
      <NavHeader user={{ email: profile.email, role: profile.role }} />
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Button
            variant="ghost"
            asChild
            className={`mb-6 ${isRTL ? "flex-row" : ""}`}
          >
            <Link
              href="/dashboard/organization/tenders"
              className={isRTL ? "flex-row" : ""}
            >
              <ArrowLeft
                className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`}
              />
              {t("backToTenders")}
            </Link>
          </Button>

          <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
            <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
            <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
          </div>

          <TenderForm
            organizationId={organization.id}
            freePostLimit={freeTenderPostLimit}
            freePostsRemaining={freeTenderPostsRemaining}
          />
        </div>
      </main>
    </div>
  );
}
