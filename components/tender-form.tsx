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
import { ShieldQuestion } from "lucide-react";
import { TOTAL_FREE_POSTS } from "@/lib/constants";
import { useTranslations, useLocale } from "next-intl";
import { rtlLocales } from "@/i18n/config";

interface TenderFormProps {
  organizationId: string;
  freePostLimit: number;
  freePostsRemaining: number;
  tender?: {
    id: string;
    title: string;
    description: string;
    requirements: string | null;
    deadline: string | null;
    location: string | null;
    category: string | null;
    status: string;
  };
}

export function TenderForm({
  organizationId,
  freePostLimit,
  freePostsRemaining,
  tender,
}: TenderFormProps) {
  const t = useTranslations("TenderForm");
  const locale = useLocale();
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number]);

  const [title, setTitle] = useState(tender?.title || "");
  const [description, setDescription] = useState(tender?.description || "");
  const [requirements, setRequirements] = useState(tender?.requirements || "");
  const [deadline, setDeadline] = useState(
    tender?.deadline?.split("T")[0] || ""
  );
  const [location, setLocation] = useState(tender?.location || "");
  const [category, setCategory] = useState(tender?.category || "");
  const [status, setStatus] = useState<"draft" | "open" | "closed">(
    (tender?.status as "draft" | "open" | "closed") || "draft"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isEditing = Boolean(tender);
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
      const tenderData = {
        organization_id: organizationId,
        title,
        description,
        requirements: requirements || null,
        deadline: deadline || null,
        location: location || null,
        category: category || null,
        status,
      };

      if (tender) {
        // Update existing tender
        await apiClient.updateTender(tender.id, tenderData);
      } else {
        // Create new tender
        await apiClient.createTender(tenderData);
      }

      router.push("/dashboard/organization/tenders");
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t("errors.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className={isRTL ? "text-right" : "text-left"}>
        <div
          className={`inline-flex items-center gap-2 rounded-full bg-gradient-primary px-3 py-1 text-xs font-medium text-white w-max shadow-md ${isRTL ? "flex-row" : ""
            }`}
        >
          {tender ? t("badge.edit") : t("badge.new")}
        </div>
        <CardTitle
          className={`mt-2 text-xl font-semibold tracking-tight ${isRTL ? "text-right" : "text-left"
            }`}
        >
          {tender ? t("title.edit") : t("title.new")}
        </CardTitle>
        <CardDescription className={isRTL ? "text-right" : "text-left"}>
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Alert
            variant={hasFreePosts ? "default" : "destructive"}
            className={isRTL ? "text-right" : "text-left"}
          >
            <div
              className={`flex items-start gap-3 ${isRTL ? "flex-row" : ""}`}
            >
              <ShieldQuestion className="mt-1 h-5 w-5 text-indigo-600 flex-shrink-0" />
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

          <div className="grid gap-2">
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
              placeholder={t("placeholders.title")}
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
              rows={6}
              required
              dir={isRTL ? "rtl" : "ltr"}
              className={`bg-white/90 focus-visible:ring-indigo-500 ${isRTL ? "text-right" : "text-left"
                }`}
            />
          </div>

          <div className="grid gap-2">
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
              placeholder={t("placeholders.requirements")}
              rows={4}
              dir={isRTL ? "rtl" : "ltr"}
              className={`bg-white/90 focus-visible:ring-indigo-500 ${isRTL ? "text-right" : "text-left"
                }`}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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
                htmlFor="deadline"
                className={isRTL ? "text-right" : "text-left"}
              >
                {t("fields.deadline")}
              </Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                dir="ltr"
                className="bg-white/90 focus-visible:ring-indigo-500 text-left"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
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
                placeholder={t("placeholders.category")}
                dir={isRTL ? "rtl" : "ltr"}
                className={`bg-white/90 focus-visible:ring-indigo-500 ${isRTL ? "text-right" : "text-left"
                  }`}
              />
            </div>

            <div className="grid gap-2">
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
          </div>

          {error && (
            <div
              className={`rounded-lg bg-destructive/10 p-3 text-sm text-destructive ${isRTL ? "text-right" : "text-left"
                }`}
            >
              {error}
            </div>
          )}

          <div className={`flex gap-3 ${isRTL ? "flex-row" : ""}`}>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading
                ? t("buttons.saving")
                : tender
                  ? t("buttons.updateTender")
                  : t("buttons.postTender")}
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
