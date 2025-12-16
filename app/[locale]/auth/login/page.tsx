"use client";

import type React from "react";

import { apiClient } from "@/lib/api/client";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@/navigation";
import { useRouter } from "@/navigation";
import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("Auth.login");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const validatePhone = (phoneNumber: string): boolean => {
    // Accepts formats like: +963123456789, 00963123456789, 1234567890, etc.
    // Removes spaces, dashes, parentheses for validation
    const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '')
    // Check if it's a valid phone number (at least 8 digits, can start with + or 00)
    return /^(\+|00)?[1-9]\d{7,14}$/.test(cleaned) && cleaned.replace(/^(\+|00)/, '').length >= 8
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!acceptedTerms) {
      setError(t("errors.termsRequired") || "You must accept the Terms of Service and Privacy Policy to continue.");
      setIsLoading(false);
      return;
    }

    if (!validatePhone(phone)) {
      setError(t("errors.phoneInvalid") || "Please enter a valid phone number");
      setIsLoading(false);
      return;
    }

    try {
      // Login via backend API - can use email or phone
      const response = await apiClient.login(email, password, phone);

      // Store tokens in cookies (server-side) via API route
      const sync = await fetch("/api/auth/set-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: response.access_token,
          refresh_token: response.refresh_token,
        }),
      });

      if (!sync.ok) {
        const message = await sync.json();
        throw new Error(message.error || "Unable to persist session");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "An error occurred";
      // Provide clearer guidance for common cases
      if (/confirm|verified/i.test(msg)) {
        setError(
          "Email not confirmed. Please verify your email first."
        );
      } else if (/invalid|credentials|password/i.test(msg)) {
        setError(
          "Invalid login credentials. Please check your email and password."
        );
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
      </div>

      {/* RT Logo Background - Large with effects - More Visible */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <Image
          src="/rtlogo.png"
          alt="RT Logo Background"
          width={900}
          height={900}
          className="object-contain drop-shadow-2xl animate-float-slow"
          priority
        />
      </div>

      {/* Rotating Logos - More Visible */}
      <Image
        src="/rtlogo.png"
        alt="RT Logo"
        width={384}
        height={384}
        className="absolute top-20 left-20 opacity-8 animate-spin-slow hidden lg:block object-contain drop-shadow-xl"
      />
      <Image
        src="/rtlogo.png"
        alt="RT Logo"
        width={384}
        height={384}
        className="absolute bottom-20 right-20 opacity-8 animate-spin-reverse-slow hidden lg:block object-contain drop-shadow-xl"
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-2">
            <Image
              src="/rtlogo.png"
              alt="RT Logo"
              width={64}
              height={64}
              className="animate-pulse-slow drop-shadow-lg"
            />
            <h1 className="text-3xl font-bold text-gradient-primary">
              RT-SYR
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            Recruitments & Tender
          </p>
        </div>
        <Card className="backdrop-blur-sm bg-white/90 border-gray-200/60 shadow-professional-xl animate-fade-in-delay">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">{t("title")}</CardTitle>
            <CardDescription className="mt-1">{t("description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-5">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="font-medium">{t("email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    dir="ltr"
                    className="text-left border-gray-200/60 shadow-professional"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone" className="font-medium">{t("phone")}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t("phonePlaceholder") || "+963 XXX XXX XXX"}
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    dir="ltr"
                    className="text-left border-gray-200/60 shadow-professional"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="font-medium">{t("password")}</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-200/60 shadow-professional"
                  />
                </div>
                {error && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive animate-fade-in font-medium">
                    {error}
                  </div>
                )}
                <div className={`flex items-start gap-3 p-4 rounded-lg bg-blue-50/80 border border-blue-200/60 ${isRTL ? "flex-row-reverse" : ""}`}>
                  <Checkbox
                    id="terms-checkbox-login"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor="terms-checkbox-login"
                    className={`text-sm text-blue-900 cursor-pointer flex-1 ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {t("termsAgreementCheckboxPrefix") || "I agree to the"}{" "}
                    <Link href="/terms" className="font-semibold underline hover:text-blue-950">
                      {t("termsLink") || "Terms of Service"}
                    </Link>
                    {" "}{t("termsAgreementCheckboxConjunction") || "and"}{" "}
                    <Link href="/privacy" className="font-semibold underline hover:text-blue-950">
                      {t("privacyLink") || "Privacy Policy"}
                    </Link>
                    .
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full btn-gradient-primary shadow-professional-md hover:shadow-professional-lg transition-all duration-200 text-white active:scale-[0.98]"
                  disabled={isLoading || !acceptedTerms}
                >
                  {isLoading ? t("signinLoading") : t("submit")}
                </Button>
              </div>
              <div className="mt-6 text-center text-sm">
                {t("subtext")}{" "}
                <Link
                  href="/auth/sign-up"
                  className="font-semibold text-blue-700 hover:text-blue-800 underline"
                >
                  {t("signup")}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
