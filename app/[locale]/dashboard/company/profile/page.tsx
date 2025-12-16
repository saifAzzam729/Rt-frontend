import { redirect } from "@/navigation"
import { requireAuth } from "@/lib/auth/server"
import { createServerApiClient } from "@/lib/api/server"
import { CompanyProfileForm } from "@/components/company-profile-form"
import { Button } from "@/components/ui/button"
import { Link } from "@/navigation"
import { ArrowLeft } from "lucide-react"
import { getTranslations, getLocale } from "next-intl/server"
import { rtlLocales } from "@/i18n/config"

export default async function CompanyProfilePage() {
  const t = await getTranslations("CompanyProfile")
  const tCompany = await getTranslations("CompanyDashboard")
  const locale = await getLocale()
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number])

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

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Button variant="ghost" asChild className={`mb-6 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Link href="/dashboard/company" className={isRTL ? "flex-row-reverse" : ""}>
              <ArrowLeft className={`h-4 w-4 ${isRTL ? "ml-2 rotate-180" : "mr-2"}`} />
              {tCompany("backToDashboard")}
            </Link>
          </Button>

          <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
            <h1 className="text-3xl font-bold text-foreground">{t("title")}</h1>
            <p className="text-muted-foreground mt-2">{t("subtitle")}</p>
          </div>

          <CompanyProfileForm company={company} />
        </div>
      </main>
    </div>
  )
}
