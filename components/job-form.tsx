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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { apiClient } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BadgeInfo } from "lucide-react";
import { TOTAL_FREE_POSTS } from "@/lib/constants";
import { useTranslations, useLocale } from "next-intl";
import { rtlLocales } from "@/i18n/config";

interface JobFormProps {
  companyId: string;
  freePostLimit: number;
  freePostsRemaining: number;
  job?: {
    id: string;
    title: string;
    description: string;
    requirements: string | null;
    salary_min: number | null;
    salary_max: number | null;
    employment_type: string | null;
    experience_level: string | null;
    location: string | null;
    category: string | null;
    status: string;
  };
}

export function JobForm({
  companyId,
  freePostLimit,
  freePostsRemaining,
  job,
}: JobFormProps) {
  const t = useTranslations("JobForm");
  const locale = useLocale();
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number]);

  const [title, setTitle] = useState(job?.title || "");
  const [description, setDescription] = useState(job?.description || "");
  const [requirements, setRequirements] = useState(job?.requirements || "");
  const [salaryMin, setSalaryMin] = useState(job?.salary_min?.toString() || "");
  const [salaryMax, setSalaryMax] = useState(job?.salary_max?.toString() || "");
  const [employmentType, setEmploymentType] = useState(
    job?.employment_type || "Full-time"
  );
  const [experienceLevel, setExperienceLevel] = useState(
    job?.experience_level || "Mid-level"
  );
  const [location, setLocation] = useState(job?.location || "");
  const [category, setCategory] = useState(job?.category || "");
  const [status, setStatus] = useState<"draft" | "open" | "closed">(
    (job?.status as "draft" | "open" | "closed") || "draft"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isEditing = Boolean(job);
  const hasFreePosts = freePostsRemaining > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!isEditing && !hasFreePosts) {
      setError(t("errors.noFreePosts"));
      setIsLoading(false);
      return;
    }

    try {
      const jobData = {
        company_id: companyId,
        title,
        description,
        requirements: requirements || null,
        salary_min: salaryMin ? Number.parseFloat(salaryMin) : null,
        salary_max: salaryMax ? Number.parseFloat(salaryMax) : null,
        employment_type: employmentType || null,
        experience_level: experienceLevel || null,
        location: location || null,
        category: category || null,
        status,
      };

      if (job) {
        // Update existing job
        await apiClient.updateJob(job.id, jobData);
      } else {
        // Create new job
        await apiClient.createJob(jobData);
      }

      router.push("/dashboard/company/jobs");
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-gray-200/60 bg-white/80 backdrop-blur-sm shadow-professional-lg">
      <CardHeader className={isRTL ? "text-right" : "text-left"}>
        <div
          className={`inline-flex items-center gap-2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-medium text-white w-max shadow-md ${isRTL ? "flex-row-reverse" : ""
            }`}
        >
          {job ? t("badge.edit") : t("badge.new")}
        </div>
        <CardTitle
          className={`mt-2 text-xl font-semibold tracking-tight ${isRTL ? "text-right" : "text-left"
            }`}
        >
          {t("title")}
        </CardTitle>
        <CardDescription className={isRTL ? "text-right" : "text-left"}>
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Alert
            variant={hasFreePosts ? "default" : "destructive"}
            className={`rounded-2xl border border-indigo-100 bg-white/80 backdrop-blur ${isRTL ? "text-right" : "text-left"
              }`}
          >
            <div
              className={`flex items-start gap-3 ${isRTL ? "flex-row" : ""}`}
            >
              <BadgeInfo className="mt-1 h-5 w-5 text-indigo-600 flex-shrink-0" />
              <div className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}>
                <AlertTitle className="text-base font-semibold">
                  {t("freePostsRemaining", {
                    remaining: Math.max(0, freePostsRemaining),
                    limit: freePostLimit,
                  })}
                </AlertTitle>
                <AlertDescription className="text-sm text-muted-foreground">
                  {hasFreePosts ? t("freePostsAvailable") : t("freePostsUsed")}
                  <br />
                  {t("freePostsInfo", { total: TOTAL_FREE_POSTS })}
                </AlertDescription>
              </div>
            </div>
          </Alert>

          <div className="grid gap-2 rounded-xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
            <Label
              htmlFor="title"
              className={isRTL ? "text-right" : "text-left"}
            >
              {t("fields.title")}
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("fields.titlePlaceholder")}
              required
              dir={isRTL ? "rtl" : "ltr"}
              className={`bg-white/90 focus-visible:ring-indigo-500 ${isRTL ? "text-right" : "text-left"
                }`}
            />
          </div>

          <div className="grid gap-2 rounded-xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
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
              placeholder={t("fields.descriptionPlaceholder")}
              rows={6}
              required
              dir={isRTL ? "rtl" : "ltr"}
              className={`bg-white/90 focus-visible:ring-indigo-500 ${isRTL ? "text-right" : "text-left"
                }`}
            />
          </div>

          <div className="grid gap-2 rounded-xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
            <Label
              htmlFor="requirements"
              className={isRTL ? "text-right" : "text-left"}
            >
              {t("fields.requirements")}
            </Label>
            <Textarea
              id="requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder={t("fields.requirementsPlaceholder")}
              rows={4}
              dir={isRTL ? "rtl" : "ltr"}
              className={`bg-white/90 focus-visible:ring-indigo-500 ${isRTL ? "text-right" : "text-left"
                }`}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2 rounded-xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
              <Label
                htmlFor="salaryMin"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("fields.salaryMin")}
              </Label>
              <Input
                id="salaryMin"
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder={t("fields.salaryMinPlaceholder")}
                min="0"
                step="1000"
                dir="ltr"
                className="bg-white/90 focus-visible:ring-indigo-500 text-left"
              />
            </div>

            <div className="grid gap-2 rounded-xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
              <Label
                htmlFor="salaryMax"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("fields.salaryMax")}
              </Label>
              <Input
                id="salaryMax"
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder={t("fields.salaryMaxPlaceholder")}
                min="0"
                step="1000"
                dir="ltr"
                className="bg-white/90 focus-visible:ring-indigo-500 text-left"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2 rounded-xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
              <Label
                htmlFor="employmentType"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("fields.employmentType")}
              </Label>
              <Select value={employmentType} onValueChange={setEmploymentType}>
                <SelectTrigger
                  className={`bg-white/90 focus:ring-indigo-500 ${isRTL ? "text-right" : "text-left"
                    }`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">
                    {t("employmentTypes.fullTime")}
                  </SelectItem>
                  <SelectItem value="Part-time">
                    {t("employmentTypes.partTime")}
                  </SelectItem>
                  <SelectItem value="Contract">
                    {t("employmentTypes.contract")}
                  </SelectItem>
                  <SelectItem value="Freelance">
                    {t("employmentTypes.freelance")}
                  </SelectItem>
                  <SelectItem value="Internship">
                    {t("employmentTypes.internship")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2 rounded-xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
              <Label
                htmlFor="experienceLevel"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("fields.experienceLevel")}
              </Label>
              <Select
                value={experienceLevel}
                onValueChange={setExperienceLevel}
              >
                <SelectTrigger
                  className={`bg-white/90 focus:ring-indigo-500 ${isRTL ? "text-right" : "text-left"
                    }`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry-level">
                    {t("experienceLevels.entry")}
                  </SelectItem>
                  <SelectItem value="Mid-level">
                    {t("experienceLevels.mid")}
                  </SelectItem>
                  <SelectItem value="Senior">
                    {t("experienceLevels.senior")}
                  </SelectItem>
                  <SelectItem value="Lead">
                    {t("experienceLevels.lead")}
                  </SelectItem>
                  <SelectItem value="Executive">
                    {t("experienceLevels.executive")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2 rounded-xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
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
                placeholder={t("fields.locationPlaceholder")}
                dir={isRTL ? "rtl" : "ltr"}
                className={`bg-white/90 focus-visible:ring-indigo-500 ${isRTL ? "text-right" : "text-left"
                  }`}
              />
            </div>

            <div className="grid gap-2 rounded-xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
              <Label
                htmlFor="category"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("fields.category")}
              </Label>
              <Input
                id="category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder={t("fields.categoryPlaceholder")}
                dir={isRTL ? "rtl" : "ltr"}
                className={`bg-white/90 focus-visible:ring-indigo-500 ${isRTL ? "text-right" : "text-left"
                  }`}
              />
            </div>
          </div>

          <div className="grid gap-2 rounded-xl border border-white/60 bg-white/80 p-4 shadow-sm backdrop-blur">
            <Label
              htmlFor="status"
              className={isRTL ? "text-right" : "text-left"}
            >
              {t("fields.status")}
            </Label>
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as "draft" | "open" | "closed")
              }
            >
              <SelectTrigger
                className={`bg-white/90 focus:ring-indigo-500 ${isRTL ? "text-right" : "text-left"
                  }`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">{t("status.draft")}</SelectItem>
                <SelectItem value="open">{t("status.open")}</SelectItem>
                <SelectItem value="closed">{t("status.closed")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div
              className={`rounded-lg bg-destructive/10 p-3 text-sm text-destructive ${isRTL ? "text-right" : "text-left"
                }`}
            >
              {error}
            </div>
          )}

          <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <Button
              type="submit"
              className="flex-1 btn-gradient-primary shadow-lg text-white"
              disabled={isLoading}
            >
              {isLoading
                ? t("buttons.saving")
                : job
                  ? t("buttons.updateJob")
                  : t("buttons.postJob")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="bg-transparent"
            >
              {t("buttons.cancel")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
