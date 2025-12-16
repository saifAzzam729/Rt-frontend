"use client"

import React from "react"

import { apiClient } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Link } from "@/navigation"
import { useRouter } from "@/navigation"
import { useState } from "react"
import { CheckCircle2, CircleAlert, ChevronRight, ChevronLeft, User, Lock, Building2, CheckCircle } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { Checkbox } from "@/components/ui/checkbox"

const PASSWORD_REQUIREMENT_IDS = [
  "length",
  "uppercase",
  "lowercase",
  "number",
  "symbol",
] as const

const getPasswordRequirements = (t: ReturnType<typeof useTranslations>) => [
  {
    id: "length",
    label: t("Auth.signUp.passwordRequirements.length"),
    test: (value: string) => value.length >= 10,
  },
  {
    id: "uppercase",
    label: t("Auth.signUp.passwordRequirements.uppercase"),
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: "lowercase",
    label: t("Auth.signUp.passwordRequirements.lowercase"),
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    id: "number",
    label: t("Auth.signUp.passwordRequirements.number"),
    test: (value: string) => /[0-9]/.test(value),
  },
  {
    id: "symbol",
    label: t("Auth.signUp.passwordRequirements.symbol"),
    test: (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
  },
]

const isPasswordValid = (password: string, requirements: ReturnType<typeof getPasswordRequirements>) =>
  requirements.every((rule) => rule.test(password))

type Step = 1 | 2 | 3 | 4

export default function SignUpPage() {
  const t = useTranslations()
  const tAuth = useTranslations("Auth.signUp")
  const locale = useLocale()
  const isRTL = locale === "ar"

  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<"user" | "organization" | "company">("user")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const passwordRequirements = getPasswordRequirements(t)

  const STEPS = [
    { id: 1, label: tAuth("steps.personalInfo") || "Personal Info", icon: User },
    { id: 2, label: tAuth("steps.security") || "Security", icon: Lock },
    { id: 3, label: tAuth("steps.accountType") || "Account Type", icon: Building2 },
    { id: 4, label: tAuth("steps.review") || "Review", icon: CheckCircle },
  ] as const

  const validatePhone = (phoneNumber: string): boolean => {
    // Accepts formats like: +963123456789, 00963123456789, 1234567890, etc.
    // Removes spaces, dashes, parentheses for validation
    const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '')
    // Check if it's a valid phone number (at least 8 digits, can start with + or 00)
    return /^(\+|00)?[1-9]\d{7,14}$/.test(cleaned) && cleaned.replace(/^(\+|00)/, '').length >= 8
  }

  const validateStep = (step: Step): boolean => {
    switch (step) {
      case 1:
        return fullName.trim().length > 0 && email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && validatePhone(phone)
      case 2:
        return isPasswordValid(password, passwordRequirements)
      case 3:
        return role !== null
      case 4:
        return acceptedTerms
      default:
        return true
    }
  }

  const canProceed = validateStep(currentStep)
  const canGoBack = currentStep > 1

  const handleNext = () => {
    if (canProceed && currentStep < 4) {
      setError(null)
      setCurrentStep((prev) => (prev + 1) as Step)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setError(null)
      setCurrentStep((prev) => (prev - 1) as Step)
    }
  }

  const handleSignUp = async () => {
    setIsLoading(true)
    setError(null)

    if (!acceptedTerms) {
      setError(tAuth("errors.termsRequired") || "You must accept the Terms of Service and Privacy Policy to continue.")
      setIsLoading(false)
      return
    }

    if (!isPasswordValid(password, passwordRequirements)) {
      setError(tAuth("errors.passwordInvalid"))
      setIsLoading(false)
      return
    }

    if (!validatePhone(phone)) {
      setError(tAuth("errors.phoneInvalid") || "Please enter a valid phone number")
      setIsLoading(false)
      return
    }

    try {
      // Sign up via backend API
      await apiClient.signup({
        email,
        password,
        full_name: fullName,
        phone,
        role,
      })

      // Backend API sends OTP email, redirect to verification page
      router.push(`/auth/verify?email=${encodeURIComponent(email)}`)
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : tAuth("errors.generic")
      setError(msg)
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5 animate-fade-in">
            <div className="grid gap-2">
              <Label htmlFor="fullName" className={`font-semibold text-sm ${isRTL ? "text-right" : "text-left"}`}>
                {tAuth("fullName")}
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder={tAuth("fullNamePlaceholder")}
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                dir={isRTL ? "rtl" : "ltr"}
                className={`border-gray-200/60 shadow-professional ${isRTL ? "text-right" : "text-left"}`}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email" className={`font-semibold text-sm ${isRTL ? "text-right" : "text-left"}`}>
                {tAuth("email")}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={tAuth("emailPlaceholder")}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                dir="ltr"
                className="text-left border-gray-200/60 shadow-professional"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className={`font-semibold text-sm ${isRTL ? "text-right" : "text-left"}`}>
                {tAuth("phone")}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder={tAuth("phonePlaceholder") || "+963 XXX XXX XXX"}
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                dir="ltr"
                className="text-left border-gray-200/60 shadow-professional"
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-5 animate-fade-in">
            <div className="grid gap-2">
              <Label htmlFor="password" className={`font-semibold text-sm ${isRTL ? "text-right" : "text-left"}`}>
                {tAuth("password")}
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir={isRTL ? "rtl" : "ltr"}
                className={`border-gray-200/60 shadow-professional ${isRTL ? "text-right" : "text-left"}`}
              />
              <p className={`text-xs text-muted-foreground mt-1 ${isRTL ? "text-right" : "text-left"}`}>
                {tAuth("passwordHelp")}
              </p>
              <div className={`mt-3 p-4 rounded-lg bg-gray-50/80 border border-gray-200/60 ${isRTL ? "text-right" : "text-left"}`}>
                <ul className={`space-y-2 text-xs ${isRTL ? "text-right" : "text-left"}`}>
                  {passwordRequirements.map((rule) => {
                    const passes = rule.test(password)
                    return (
                      <li key={rule.id} className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                        {passes ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <CircleAlert className="h-4 w-4 text-amber-500 flex-shrink-0" />
                        )}
                        <span className={passes ? "text-emerald-700 font-medium" : "text-muted-foreground"}>
                          {rule.label}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-5 animate-fade-in">
            <div className="grid gap-2">
              <Label htmlFor="role" className={`font-semibold text-sm ${isRTL ? "text-right" : "text-left"}`}>
                {tAuth("accountType")}
              </Label>
              <Select value={role} onValueChange={(value) => setRole(value as "user" | "organization" | "company")}>
                <SelectTrigger className={`w-full border-gray-200/60 shadow-professional rounded-lg ${isRTL ? "text-right" : "text-left"}`}>
                  <SelectValue placeholder={tAuth("accountTypePlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">{tAuth("roles.user")}</SelectItem>
                  <SelectItem value="organization">{tAuth("roles.organization")}</SelectItem>
                  <SelectItem value="company">{tAuth("roles.company")}</SelectItem>
                </SelectContent>
              </Select>
              <p className={`text-xs text-muted-foreground mt-1 ${isRTL ? "text-right" : "text-left"}`}>
                {tAuth("accountTypeHelp") || "Choose the account type that matches your needs"}
              </p>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-5 animate-fade-in">
            <div className="p-5 rounded-lg bg-gradient-professional border border-gray-200/60">
              <h3 className={`font-semibold text-base mb-4 ${isRTL ? "text-right" : "text-left"}`}>
                {tAuth("steps.reviewTitle") || "Review Your Information"}
              </h3>
              <div className="space-y-3">
                <div className={`flex justify-between items-center ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="text-sm text-muted-foreground">{tAuth("fullName")}:</span>
                  <span className="text-sm font-medium">{fullName || "—"}</span>
                </div>
                <div className={`flex justify-between items-center ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="text-sm text-muted-foreground">{tAuth("email")}:</span>
                  <span className="text-sm font-medium">{email || "—"}</span>
                </div>
                <div className={`flex justify-between items-center ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="text-sm text-muted-foreground">{tAuth("phone")}:</span>
                  <span className="text-sm font-medium">{phone || "—"}</span>
                </div>
                <div className={`flex justify-between items-center ${isRTL ? "flex-row-reverse" : ""}`}>
                  <span className="text-sm text-muted-foreground">{tAuth("accountType")}:</span>
                  <span className="text-sm font-medium">{tAuth(`roles.${role}`)}</span>
                </div>
              </div>
            </div>
            <div className={`flex items-start gap-3 p-4 rounded-lg bg-blue-50/80 border border-blue-200/60 ${isRTL ? "flex-row-reverse" : ""}`}>
              <Checkbox
                id="terms-checkbox"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                className="mt-0.5"
              />
              <label
                htmlFor="terms-checkbox"
                className={`text-sm text-blue-900 cursor-pointer flex-1 ${isRTL ? "text-right" : "text-left"}`}
              >
                {tAuth("termsAgreementCheckboxPrefix") || "I agree to the"}{" "}
                <Link href="/terms" className="font-semibold underline hover:text-blue-950">
                  {tAuth("termsLink") || "Terms of Service"}
                </Link>
                {" "}{tAuth("termsAgreementCheckboxConjunction") || "and"}{" "}
                <Link href="/privacy" className="font-semibold underline hover:text-blue-950">
                  {tAuth("privacyLink") || "Privacy Policy"}
                </Link>
                .
              </label>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-professional-subtle p-6">
      {/* Enhanced Gradient Shadow Background */}
      <div className="absolute inset-0">
        {/* Base gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-slate-50/50"></div>

        {/* Animated gradient shadows */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/30 to-blue-600/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/25 to-slate-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-slate-400/20 to-blue-400/25 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Additional shadow layers for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(30,58,138,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(37,99,235,0.06),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            {tAuth("title")}
          </h1>
          <p className="text-sm text-muted-foreground font-medium">{tAuth("description")}</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 border-gray-200/60 shadow-professional-xl">
          <CardHeader className="pb-4">
            {/* Progress Stepper with Professional Arrow Connectors */}
            <div className="relative">
              {/* Background progress line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                <div
                  className="h-full bg-gradient-primary transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                />
              </div>

              <div className={`relative flex justify-between ${isRTL ? "flex-row-reverse" : ""}`}>
                {STEPS.map((step) => {
                  const isActive = currentStep === step.id
                  const isCompleted = currentStep > step.id
                  const StepIcon = step.icon

                  return (
                    <div key={step.id} className="flex flex-col items-center relative z-10 flex-1">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${isCompleted
                          ? "bg-gradient-primary border-blue-700 text-white shadow-professional-md"
                          : isActive
                            ? "bg-white border-blue-700 text-blue-700 shadow-professional-md scale-110"
                            : "bg-white border-gray-300 text-gray-400"
                          }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <StepIcon className="h-5 w-5" />
                        )}
                      </div>
                      <span
                        className={`mt-2 text-xs font-medium hidden sm:block transition-colors duration-300 ${isActive ? "text-blue-700 font-semibold" : isCompleted ? "text-gray-600" : "text-gray-400"
                          }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); currentStep === 4 ? handleSignUp() : handleNext() }}>
              <div className="min-h-[300px] py-4">
                {renderStepContent()}
              </div>

              {error && (
                <div className={`mb-5 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive animate-fade-in font-medium ${isRTL ? "text-right" : "text-left"}`}>
                  {error}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className={`flex items-center gap-3 pt-6 border-t border-gray-200/60 ${isRTL ? "flex-row-reverse" : ""}`}>
                {canGoBack && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className={`flex-1 sm:flex-initial border-gray-200/60 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <ChevronLeft className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                    {tAuth("buttons.back") || "Back"}
                  </Button>
                )}
                {currentStep < 4 ? (
                  <Button
                    type="submit"
                    disabled={!canProceed}
                    className={`flex-1 sm:flex-initial btn-gradient-primary shadow-professional-md hover:shadow-professional-lg transition-all duration-200 text-white ${isRTL ? "flex-row-reverse" : ""} ${!canGoBack ? "ml-auto" : ""}`}
                  >
                    {tAuth("buttons.next") || "Next"}
                    <ChevronRight className={`h-4 w-4 ${isRTL ? "mr-2" : "ml-2"}`} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isLoading || !canProceed}
                    className="flex-1 sm:flex-initial btn-gradient-primary shadow-professional-md hover:shadow-professional-lg transition-all duration-200 text-white"
                  >
                    {isLoading ? tAuth("submitting") : tAuth("submit")}
                  </Button>
                )}
              </div>

              <div className={`mt-6 text-center text-sm ${isRTL ? "text-right" : "text-left"}`}>
                {tAuth("alreadyHaveAccount")}{" "}
                <Link href="/auth/login" className="font-semibold text-blue-700 hover:text-blue-800 underline">
                  {tAuth("signIn")}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
