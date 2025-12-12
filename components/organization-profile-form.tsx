"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiClient } from "@/lib/api/client";
import { useRouter, usePathname } from "@/navigation";
import { useState, useEffect } from "react";
import { FileText, Info, CheckCircle2 } from "lucide-react";
import { WORK_SECTORS } from "@/lib/constants";
import { useTranslations, useLocale } from "next-intl";
import { rtlLocales } from "@/i18n/config";

interface OrganizationProfileFormProps {
  organization: {
    id?: string;
    name: string;
    description: string | null;
    website: string | null;
    location: string | null;
    industry: string | null;
    license_number: string | null;
    license_file_url: string | null;
    work_sectors: string[] | null;
    profile_complete?: boolean | null;
    approved?: boolean | null;
  };
  ownerId: string;
}

export function OrganizationProfileForm({
  organization,
  ownerId,
}: OrganizationProfileFormProps) {
  const t = useTranslations("OrganizationProfileForm");
  const locale = useLocale();
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number]);

  const [name, setName] = useState(organization.name || "");
  const [description, setDescription] = useState(
    organization.description || ""
  );
  const [website, setWebsite] = useState(organization.website || "");
  const [location, setLocation] = useState(organization.location || "");
  const [industry, setIndustry] = useState(organization.industry || "");
  const [licenseNumber, setLicenseNumber] = useState(
    organization.license_number || ""
  );
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const licenseFilePath = organization.license_file_url || "";
  const [workSectors, setWorkSectors] = useState<string[]>(
    organization.work_sectors || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [profileComplete, setProfileComplete] = useState(
    organization.profile_complete || false
  );
  const [signedLicenseUrl, setSignedLicenseUrl] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Generate signed URL for license file when component mounts or path changes
  useEffect(() => {
    const generateSignedUrl = async () => {
      if (licenseFilePath && !licenseFile) {
        // Extract file path from URL if it's a full URL, otherwise use as-is
        let filePath = licenseFilePath;

        // Handle different URL formats
        if (
          licenseFilePath.includes(
            "/storage/v1/object/public/organization-licenses/"
          )
        ) {
          filePath = licenseFilePath.split(
            "/storage/v1/object/public/organization-licenses/"
          )[1];
        } else if (
          licenseFilePath.includes(
            "/storage/v1/object/sign/organization-licenses/"
          )
        ) {
          filePath = licenseFilePath
            .split("/storage/v1/object/sign/organization-licenses/")[1]
            .split("?")[0];
        } else if (licenseFilePath.includes("organization-licenses/")) {
          filePath = licenseFilePath
            .split("organization-licenses/")[1]
            .split("?")[0];
        }

        // For API-based storage, use the URL directly if it's a full URL
        // The backend API returns full URLs for uploaded files
        if (licenseFilePath.startsWith('http://') || licenseFilePath.startsWith('https://')) {
          setSignedLicenseUrl(licenseFilePath);
        } else {
          // If it's just a path, you might need to construct the full URL
          // This depends on how your backend stores and serves files
          setSignedLicenseUrl(licenseFilePath);
        }
      } else if (!licenseFilePath) {
        setSignedLicenseUrl(null);
      }
    };

    generateSignedUrl();
  }, [licenseFilePath, licenseFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError(t("errors.fileSize"));
        return;
      }
      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        setError(t("errors.fileType"));
        return;
      }
      setLicenseFile(file);
      setError(null);
    }
  };

  const handleSectorToggle = (sector: string) => {
    setWorkSectors((prev) =>
      prev.includes(sector)
        ? prev.filter((s) => s !== sector)
        : [...prev, sector]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let finalLicensePath = licenseFilePath;

      // Upload license file if new file selected
      if (licenseFile) {
        const uploadResult = await apiClient.uploadLicense(licenseFile);
        finalLicensePath = uploadResult.url;
      }

      // Create or update organization via API
      let updatedOrg;
      if (organization.id && organization.id.trim() !== "") {
        // Update existing organization
        updatedOrg = await apiClient.updateOrganization(organization.id, {
          name,
          description: description || null,
          website: website || null,
          location: location || null,
          industry: industry || null,
          license_number: licenseNumber || null,
          license_file_url: finalLicensePath || null,
          work_sectors: workSectors.length > 0 ? workSectors : null,
        });
      } else {
        // Create new organization
        updatedOrg = await apiClient.createOrganization({
          name,
          description: description || null,
          website: website || null,
          location: location || null,
          industry: industry || null,
          license_number: licenseNumber || null,
          license_file_url: finalLicensePath || null,
          work_sectors: workSectors.length > 0 ? workSectors : null,
        });
      }

      // Check if profile is complete based on API response
      if (updatedOrg) {
        const isComplete =
          updatedOrg.license_number &&
          updatedOrg.license_file_url &&
          updatedOrg.work_sectors &&
          Array.isArray(updatedOrg.work_sectors) &&
          updatedOrg.work_sectors.length > 0;
        setProfileComplete(isComplete);
      }

      setSuccess(true);
      // Use router.push to force a full page reload and get fresh data
      setTimeout(() => {
        router.push(pathname);
      }, 1500);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!profileComplete && (
        <Alert
          className={`border-amber-200 bg-amber-50 ${isRTL ? "text-right" : "text-left"
            }`}
        >
          <Info
            className={`h-4 w-4 text-amber-600 ${isRTL ? "ml-2" : "mr-2"}`}
          />
          <AlertTitle
            className={`text-amber-900 ${isRTL ? "text-right" : "text-left"}`}
          >
            {t("alerts.incomplete.title")}
          </AlertTitle>
          <AlertDescription
            className={`text-amber-800 ${isRTL ? "text-right" : "text-left"}`}
          >
            {t("alerts.incomplete.description")}
          </AlertDescription>
        </Alert>
      )}

      {profileComplete && (
        <Alert
          className={`border-green-200 bg-green-50 ${isRTL ? "text-right" : "text-left"
            }`}
        >
          <CheckCircle2
            className={`h-4 w-4 text-green-600 ${isRTL ? "ml-2" : "mr-2"}`}
          />
          <AlertTitle
            className={`text-green-900 ${isRTL ? "text-right" : "text-left"}`}
          >
            {t("alerts.complete.title")}
          </AlertTitle>
          <AlertDescription
            className={`text-green-800 ${isRTL ? "text-right" : "text-left"}`}
          >
            {t("alerts.complete.description")}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className={isRTL ? "text-right" : "text-left"}>
          <CardTitle>{t("card.title")}</CardTitle>
          <CardDescription>{t("card.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label
                htmlFor="name"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("fields.name")}
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("placeholders.name")}
                required
                dir={isRTL ? "rtl" : "ltr"}
                className={`bg-white/90 focus-visible:ring-indigo-500 ${isRTL ? "text-right" : "text-left"
                  }`}
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="description"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("fields.description")}
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("placeholders.description")}
                rows={4}
                dir={isRTL ? "rtl" : "ltr"}
                className={`bg-white/90 focus-visible:ring-indigo-500 ${isRTL ? "text-right" : "text-left"
                  }`}
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="website"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("fields.website")}
              </Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder={t("placeholders.website")}
                dir="ltr"
                className="bg-white/90 focus-visible:ring-indigo-500 text-left"
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="location"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("fields.location")}
              </Label>
              <Input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t("placeholders.location")}
                dir={isRTL ? "rtl" : "ltr"}
                className={`bg-white/90 focus-visible:ring-indigo-500 ${isRTL ? "text-right" : "text-left"
                  }`}
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="industry"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("fields.industry")}
              </Label>
              <Input
                id="industry"
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder={t("placeholders.industry")}
                dir={isRTL ? "rtl" : "ltr"}
                className={`bg-white/90 focus-visible:ring-indigo-500 ${isRTL ? "text-right" : "text-left"
                  }`}
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="licenseNumber"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("fields.licenseNumber")}{" "}
                <span className="text-muted-foreground text-xs">
                  {t("fields.licenseNumberHint")}
                </span>
              </Label>
              <Input
                id="licenseNumber"
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder={t("placeholders.licenseNumber")}
                required
                dir={isRTL ? "rtl" : "ltr"}
                className={`bg-white/90 focus-visible:ring-indigo-500 ${isRTL ? "text-right" : "text-left"
                  }`}
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="licenseFile"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("fields.licenseFile")}{" "}
                <span className="text-muted-foreground text-xs">
                  {t("fields.licenseFileHint")}
                </span>
              </Label>
              {licenseFilePath && !licenseFile && (
                <div
                  className={`flex items-center gap-2 p-2 bg-muted rounded-md ${isRTL ? "flex-row" : ""
                    }`}
                >
                  <FileText className="h-4 w-4 flex-shrink-0" />
                  <span
                    className={`text-sm ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {t("fields.licenseFileUploaded")}
                  </span>
                  {signedLicenseUrl ? (
                    <a
                      href={signedLicenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm text-blue-600 hover:underline ${isRTL ? "mr-auto" : "ml-auto"
                        }`}
                    >
                      {t("fields.view")}
                    </a>
                  ) : (
                    <span
                      className={`text-sm text-muted-foreground ${isRTL ? "mr-auto" : "ml-auto"
                        }`}
                    >
                      {t("fields.loading") || "Loading..."}
                    </span>
                  )}
                </div>
              )}
              <div
                className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""}`}
              >
                <Input
                  id="licenseFile"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {licenseFile && (
                  <span
                    className={`text-sm text-muted-foreground ${isRTL ? "text-right" : "text-left"
                      }`}
                  >
                    {licenseFile.name}
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label className={isRTL ? "text-right" : "text-left"}>
                {t("fields.workSectors")}{" "}
                <span className="text-muted-foreground text-xs">
                  {t("fields.workSectorsHint")}
                </span>
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-md max-h-64 overflow-y-auto">
                {WORK_SECTORS.map((sector) => (
                  <div
                    key={sector}
                    className={`flex items-center ${isRTL ? "space-x space-x-2" : "space-x-2"
                      }`}
                  >
                    <Checkbox
                      id={`sector-${sector}`}
                      checked={workSectors.includes(sector)}
                      onCheckedChange={() => handleSectorToggle(sector)}
                    />
                    <Label
                      htmlFor={`sector-${sector}`}
                      className={`text-sm font-normal cursor-pointer ${isRTL ? "text-right" : "text-left"
                        }`}
                    >
                      {sector}
                    </Label>
                  </div>
                ))}
              </div>
              {workSectors.length > 0 && (
                <p
                  className={`text-sm text-muted-foreground ${isRTL ? "text-right" : "text-left"
                    }`}
                >
                  {t("fields.selected")} {workSectors.join(", ")}
                </p>
              )}
            </div>

            {error && (
              <div
                className={`rounded-lg bg-destructive/10 p-3 text-sm text-destructive ${isRTL ? "text-right" : "text-left"
                  }`}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                className={`rounded-lg bg-green-50 p-3 text-sm text-green-600 ${isRTL ? "text-right" : "text-left"
                  }`}
              >
                {t("success")}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("buttons.saving") : t("buttons.saveChanges")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
