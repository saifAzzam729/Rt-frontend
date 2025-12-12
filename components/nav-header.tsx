"use client"

import { useState } from "react"
import { Building2, Menu, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { logout } from "@/lib/auth/client"
import { Button } from "@/components/ui/button"
import { Link, useRouter } from "@/navigation"
import { LanguageToggle } from "@/components/language-toggle"

interface NavHeaderProps {
  user?: {
    email: string
    role: string
  } | null
}

export function NavHeader({ user }: NavHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const tNav = useTranslations("Navigation")
  const tCommon = useTranslations("Common")

  const handleSignOut = async () => {
    logout()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/60 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-professional">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-3 group transition-all duration-200 hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-professional-md group-hover:shadow-professional-lg transition-all duration-200">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gradient-primary">{tCommon("brand")}</h1>
            <p className="text-xs text-muted-foreground font-medium">{tCommon("tagline")}</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/work" className="text-sm font-medium text-foreground hover:text-blue-700 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50/80">
            {tNav("work")}
          </Link>
          <Link href="/browse/jobs" className="text-sm font-medium text-foreground hover:text-blue-700 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50/80">
            {tNav("jobs")}
          </Link>
          <Link href="/browse/tenders" className="text-sm font-medium text-foreground hover:text-blue-700 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50/80">
            {tNav("tenders")}
          </Link>
          <Link href="/about" className="text-sm font-medium text-foreground hover:text-blue-700 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50/80">
            {tNav("about")}
          </Link>
          {user && (
            <Link href="/dashboard" className="text-sm font-medium text-foreground hover:text-blue-700 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50/80">
              {tNav("dashboard")}
            </Link>
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageToggle />
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" onClick={handleSignOut}>
                {tCommon("actions.signOut")}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/auth/login">{tCommon("actions.signIn")}</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/sign-up">{tCommon("actions.getStarted")}</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200/60 bg-white/95 backdrop-blur-md p-4 md:hidden shadow-professional-md">
          <div className="flex justify-end pb-4">
            <LanguageToggle />
          </div>
          <nav className="flex flex-col gap-2">
            <Link
              href="/work"
              className="text-sm font-medium text-foreground hover:text-blue-700 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50/80"
              onClick={() => setMobileMenuOpen(false)}
            >
              {tNav("work")}
            </Link>
            <Link
              href="/browse/jobs"
              className="text-sm font-medium text-foreground hover:text-blue-700 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50/80"
              onClick={() => setMobileMenuOpen(false)}
            >
              {tNav("jobs")}
            </Link>
            <Link
              href="/browse/tenders"
              className="text-sm font-medium text-foreground hover:text-blue-700 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50/80"
              onClick={() => setMobileMenuOpen(false)}
            >
              {tNav("tenders")}
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-foreground hover:text-blue-700 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50/80"
              onClick={() => setMobileMenuOpen(false)}
            >
              {tNav("about")}
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-foreground hover:text-blue-700 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                {tNav("dashboard")}
              </Link>
            )}
            <div className="flex flex-col gap-2 pt-4 border-t">
              {user ? (
                <>
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                  <Button variant="outline" onClick={handleSignOut} className="w-full bg-transparent">
                    {tCommon("actions.signOut")}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/auth/login">{tCommon("actions.signIn")}</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/auth/sign-up">{tCommon("actions.getStarted")}</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
