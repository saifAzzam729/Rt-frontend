"use client";

import React from "react";
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
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Mail, UserPlus, CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslations, useLocale } from "next-intl";
import { rtlLocales } from "@/i18n/config";

interface OrganizationSecondaryAccountsProps {
  organizationId: string;
}

export function OrganizationSecondaryAccounts({
  organizationId,
}: OrganizationSecondaryAccountsProps) {
  const t = useTranslations("OrganizationSecondaryAccounts");
  const locale = useLocale();
  const isRTL = rtlLocales.includes(locale as (typeof rtlLocales)[number]);

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [invitations, setInvitations] = useState<
    Array<{
      id: string;
      email: string;
      status: string;
      created_at: string;
    }>
  >([]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const invitationToken = crypto.randomUUID();

      const { error: inviteError } = await supabase
        .from("organization_secondary_accounts")
        .insert({
          organization_id: organizationId,
          email,
          invited_by: user.id,
          invitation_token: invitationToken,
          status: "pending",
        });

      if (inviteError) throw inviteError;

      // TODO: Send invitation email with token
      // For now, we'll just show success

      setSuccess(true);
      setEmail("");
      // Refresh invitations list
      loadInvitations();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t("alerts.error"));
    } finally {
      setIsLoading(false);
    }
  };

  const loadInvitations = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("organization_secondary_accounts")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (data) setInvitations(data);
  };

  React.useEffect(() => {
    loadInvitations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  return (
    <Card>
      <CardHeader className={isRTL ? "text-right" : "text-left"}>
        <CardTitle
          className={`flex items-center gap-2 ${isRTL ? "flex-row" : ""}`}
        >
          <UserPlus className="h-5 w-5 flex-shrink-0" />
          {t("title")}
        </CardTitle>
        <CardDescription className={isRTL ? "text-right" : "text-left"}>
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="grid gap-2">
            <Label
              htmlFor="email"
              className={isRTL ? "text-right" : "text-left"}
            >
              {t("fields.email")}
            </Label>
            <div className={`flex gap-2 ${isRTL ? "flex-row" : ""}`}>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("fields.emailPlaceholder")}
                required
                dir="ltr"
                className="bg-white/90 focus-visible:ring-indigo-500 text-left"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className={isRTL ? "flex-row" : ""}
              >
                <Mail className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {isLoading ? t("buttons.sending") : t("buttons.sendInvitation")}
              </Button>
            </div>
          </div>

          {error && (
            <Alert
              variant="destructive"
              className={isRTL ? "text-right" : "text-left"}
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert
              className={`border-green-200 bg-green-50 ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <CheckCircle2
                className={`h-4 w-4 text-green-600 ${isRTL ? "ml-2" : "mr-2"}`}
              />
              <AlertDescription className="text-green-800">
                {t("alerts.success.title")} {t("alerts.success.description")}
              </AlertDescription>
            </Alert>
          )}
        </form>

        {invitations.length > 0 && (
          <div className="space-y-2">
            <Label className={isRTL ? "text-right" : "text-left"}>
              {t("pendingInvitations")}
            </Label>
            <div className="space-y-2">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className={`flex items-center justify-between p-3 border rounded-md ${
                    isRTL ? "flex-row" : ""
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 ${
                      isRTL ? "flex-row" : ""
                    }`}
                  >
                    {invitation.status === "accepted" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : invitation.status === "rejected" ? (
                      <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    ) : (
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        isRTL ? "text-right" : "text-left"
                      }`}
                    >
                      {invitation.email}
                    </span>
                  </div>
                  <span
                    className={`text-xs text-muted-foreground capitalize ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {t(
                      `status.${
                        invitation.status as "pending" | "accepted" | "rejected"
                      }`
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
