import { redirect as nextRedirect } from "next/navigation";
import { requireAuth } from "@/lib/auth/server";
import { createServerApiClient } from "@/lib/api/server";
import { OrganizationProfileForm } from "@/components/organization-profile-form";
import { OrganizationSecondaryAccounts } from "@/components/organization-secondary-accounts";
import { OrganizationPermissionsGuide } from "@/components/organization-permissions-guide";
import { Button } from "@/components/ui/button";
import { Link } from "@/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { rtlLocales } from "@/i18n/config";

export default async function OrganizationProfilePage() {
  const t = await getTranslations("OrganizationProfile");
  const locale = await getLocale();
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number]);

  // Authenticate user via JWT
  const jwtUser = await requireAuth();

  const apiClient = createServerApiClient();

  // Get profile and verify role
  const profile = await apiClient.getMyProfile();
  if (!profile || profile.role !== "organization") {
    nextRedirect(`/${locale}/dashboard`);
  }

  // Get organization from API
  const organizations = await apiClient.getMyOrganizations();
  const organization = Array.isArray(organizations) && organizations.length > 0 ? organizations[0] : null;

  // If no organization exists, create a minimal one to allow the form to work
  // The form will handle the actual creation/update
  const organizationForForm = organization || {
    id: "", // Will be created by the form
    name: "",
    description: "",
    website: "",
    location: "",
    industry: "",
    license_number: "",
    license_file_url: "",
    work_sectors: [],
    profile_complete: false,
    approved: false,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
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

          <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
            <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
            <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
          </div>

          <div className="space-y-6">
            <OrganizationProfileForm
              organization={organizationForForm}
              ownerId={profile.id}
            />
            {organization && (
              <>
                <OrganizationSecondaryAccounts organizationId={organization.id} />
                <OrganizationPermissionsGuide />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
