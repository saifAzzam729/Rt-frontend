import { redirect } from "@/navigation";
import { requireAuth } from "@/lib/auth/server";
import { createServerApiClient } from "@/lib/api/server";
import { ProfileForm } from "@/components/profile-form";
import { getTranslations, getLocale } from "next-intl/server";
import { rtlLocales } from "@/i18n/config";

export default async function ProfilePage() {
  const t = await getTranslations("Profile");
  const locale = await getLocale();
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number]);

  // Authenticate user via JWT
  await requireAuth();

  const apiClient = createServerApiClient();
  const profile = await apiClient.getMyProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-gradient-professional-subtle">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
          <div className={`mb-8 ${isRTL ? "text-right" : "text-left"}`}>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground mt-3 text-base leading-relaxed">{t("subtitle")}</p>
          </div>

          <ProfileForm profile={profile} />
        </div>
      </main>
    </div>
  );
}
