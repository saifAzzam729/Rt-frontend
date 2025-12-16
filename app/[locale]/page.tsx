import {
  Briefcase,
  FileText,
  Users,
  TrendingUp,
  Building2,
  Search,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BrowseSelector } from "@/components/browse-selector";
import { FeeDisclaimer } from "@/components/fee-disclaimer";
import { HowItWorksBar } from "@/components/how-it-works-bar";
import { NumberTicker } from "@/components/ui/number-ticker";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { Link } from "@/navigation";

export default async function HomePage() {
  const tHome = await getTranslations("Home");
  const tCommonActions = await getTranslations("Common.actions");
  const tCommon = await getTranslations("Common");
  const tFooter = await getTranslations("Footer");

  // Fetch stats from API
  let statsData = {
    activeOpportunities: 0,
    registeredUsers: 0,
    companiesAndOrganizations: 0,
  };

  try {
    // Get the host from headers to construct the API URL
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const response = await fetch(`${baseUrl}/api/stats`, {
      cache: 'no-store', // Always fetch fresh data
    });
    if (response.ok) {
      statsData = await response.json();
    }
  } catch (error) {
    console.error("Error fetching stats:", error);
  }

  const heroWords = [
    {
      text: tHome("hero.typewriter.connect"),
      className:
        "text-5xl md:text-6xl lg:text-7xl font-extrabold text-gradient-primary tracking-tight",
    },
    {
      text: tHome("hero.typewriter.talent"),
      className:
        "text-5xl md:text-6xl lg:text-7xl font-extrabold text-gradient-primary tracking-tight",
    },
    {
      text: tHome("hero.typewriter.with"),
      className:
        "text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-700 dark:text-slate-300 mx-2",
    },
    {
      text: tHome("hero.typewriter.opportunities"),
      className:
        "text-6xl md:text-7xl lg:text-8xl font-extrabold text-gradient-primary block mt-2 tracking-tighter",
    },
  ];

  const featureCards = [
    {
      icon: Briefcase,
      border: "border-blue-200/60 hover:border-blue-400/80",
      title: tHome("features.cards.jobSeekers.title"),
      body: tHome("features.cards.jobSeekers.body"),
      cta: tHome("features.cards.jobSeekers.cta"),
      className:
        "bg-gradient-to-br from-blue-50/80 via-slate-50 to-blue-50/80 hover:shadow-blue-500/20",
    },
    {
      icon: FileText,
      border: "border-blue-200/60 hover:border-blue-400/80",
      title: tHome("features.cards.organizations.title"),
      body: tHome("features.cards.organizations.body"),
      cta: tHome("features.cards.organizations.cta"),
      className:
        "bg-gradient-to-br from-blue-50/80 via-slate-50 to-blue-50/80 hover:shadow-blue-500/20",
    },
    {
      icon: Users,
      border: "border-blue-200/60 hover:border-blue-400/80",
      title: tHome("features.cards.companies.title"),
      body: tHome("features.cards.companies.body"),
      cta: tHome("features.cards.companies.cta"),
      className:
        "bg-gradient-to-br from-blue-50/80 via-slate-50 to-blue-50/80 hover:shadow-blue-500/20",
    },
  ];

  const stats = [
    {
      label: tHome("stats.opportunities"),
      value: statsData.activeOpportunities,
      icon: TrendingUp,
      gradient: "from-yellow-500/20 to-orange-500/20",
    },
    {
      label: tHome("stats.users"),
      value: statsData.registeredUsers,
      icon: Users,
      gradient: "from-pink-500/20 to-rose-500/20",
      delay: 300,
    },
    {
      label: tHome("stats.companies"),
      value: statsData.companiesAndOrganizations,
      icon: Building2,
      gradient: "from-cyan-500/20 to-blue-500/20",
      delay: 500,
    },
  ];

  const footerColumns = [
    {
      icon: Briefcase,
      color: "text-blue-700",
      title: tFooter("jobSeekers"),
      links: [
        { href: "/browse/jobs", label: tFooter("links.jobs") },
        { href: "/browse/tenders", label: tFooter("links.tenders") },
        { href: "/dashboard", label: tFooter("links.dashboard") },
      ],
    },
    {
      icon: FileText,
      color: "text-blue-700",
      title: tFooter("employers"),
      links: [
        { href: "/auth/sign-up", label: tFooter("links.postJob") },
        { href: "/auth/sign-up", label: tFooter("links.postTender") },
        { href: "/dashboard", label: tFooter("links.manage") },
      ],
    },
    {
      icon: Search,
      color: "text-blue-700",
      title: tFooter("company"),
      links: [
        { href: "/about", label: tFooter("links.about") },
        { href: "/contact", label: tFooter("links.contact") },
        { href: "/terms", label: tFooter("links.terms") },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-professional-subtle"></div>
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-slate-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        {/* Logo watermark */}
        <div className="absolute inset-0 opacity-5">
          <Image
            src="/rtlogo.png"
            alt="RT Logo"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 overflow-hidden py-20 md:py-32">
        {/* Logo Background with Effects */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 animate-pulse-slow">
          <div className="relative w-[600px] h-[600px] animate-float">
            <Image
              src="/rtlogo.png"
              alt="RT Logo Background"
              fill
              className="object-contain filter blur-sm"
            />
          </div>
        </div>
        {/* Additional Rotating Logo Effects */}
        <div className="absolute top-20 right-20 w-96 h-96 opacity-5 animate-spin-slow hidden md:block">
          <Image
            src="/rtlogo.png"
            alt="RT Logo Decorative"
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-20 left-20 w-80 h-80 opacity-5 animate-spin-reverse-slow hidden md:block">
          <Image
            src="/rtlogo.png"
            alt="RT Logo Decorative"
            fill
            className="object-contain"
          />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="mx-auto max-w-4xl text-center animate-fade-in">
            <div className="mb-8 font-space-grotesk">
              <TypewriterEffect
                words={heroWords}
                speed={100}
                delay={500}
                repeat={3000}
                className="leading-tight flex flex-wrap justify-center items-baseline gap-2"
              />
            </div>
            <p className="mt-6 text-pretty text-lg text-muted-foreground leading-relaxed animate-fade-in-delay">
              {tHome("hero.description")}{" "}
              <span className="font-semibold text-blue-600">
                {tHome("hero.hashtags")}
              </span>
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-delay-2">
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <Link href="/auth/sign-up">
                  {tCommonActions("createAccount")}
                </Link>
              </Button>
              {/* <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto bg-white/50 backdrop-blur-sm border-2 hover:bg-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Link href="/browse/jobs">{tCommonActions("browseJobs")}</Link>
              </Button> */}
            </div>
            <div className="mt-6 animate-fade-in-delay-3 w-full max-w-2xl mx-auto">
              <BrowseSelector />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 relative mt-10">
          <HowItWorksBar />
        </div>
        <div className="container mx-auto px-4 relative mt-6">
          <FeeDisclaimer />
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16 animate-fade-in">
            <h3 className="text-3xl font-bold text-gradient-primary">
              {tHome("features.heading")}
            </h3>
            <p className="mt-4 text-muted-foreground">
              {tHome("features.description")}
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {featureCards.map((card) => (
              <Card
                key={card.title}
                className={`group relative border-2 ${card.border} transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 ${card.className} overflow-hidden`}
              >
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="pt-6 relative z-10">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary text-white transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 group-hover:rounded-full animate-pulse-slow shadow-lg shadow-blue-500/30">
                    <card.icon className="h-8 w-8" />
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-gradient-primary group-hover:scale-105 transition-transform">
                    {card.title}
                  </h4>
                  <p className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors font-medium">
                    {card.body}
                  </p>
                  <div className="mt-4 flex items-center text-blue-700 font-semibold group-hover:translate-x-2 transition-transform">
                    {card.cta} →
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 bg-gradient-primary text-white animate-gradient-xy overflow-hidden">
        {/* Enhanced RT Logo Background - More Prominent */}
        <div className="absolute inset-0 flex items-center justify-center opacity-15 animate-pulse-slow">
          <div className="relative w-[900px] h-[900px] animate-float-slow">
            <Image
              src="/rtlogo.png"
              alt="RT Logo Background Stats"
              fill
              className="object-contain"
            />
          </div>
        </div>
        {/* Decorative Rotating Logos - More Visible */}
        <div className="absolute top-20 left-20 w-80 h-80 opacity-8 animate-spin-slow hidden lg:block">
          <Image
            src="/rtlogo.png"
            alt="RT Logo Decorative"
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-20 right-20 w-96 h-96 opacity-8 animate-spin-reverse-slow hidden lg:block">
          <Image
            src="/rtlogo.png"
            alt="RT Logo Decorative"
            fill
            className="object-contain"
          />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="grid gap-8 md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center relative p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl group hover:scale-110 transition-all duration-500 cursor-pointer hover:bg-white/15"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>
                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-center">
                    <div className="relative h-24 w-24 flex items-center justify-center rounded-full bg-white/20 text-white transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 animate-pulse-slow shadow-2xl">
                      <stat.icon className="h-12 w-12 stroke-[3] drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="text-6xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-200">
                    <NumberTicker
                      value={stat.value}
                      delay={stat.delay}
                      duration={2000}
                      className="inline"
                    />
                    +
                  </div>
                  <div className="mt-4 text-blue-100 text-xl font-bold group-hover:text-white transition-colors">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 bg-gradient-professional-subtle overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(30,58,138,0.08),transparent_50%)]"></div>
        <div className="container mx-auto px-4 relative">
          <div className="mx-auto max-w-2xl text-center animate-fade-in">
            <div className="mb-8 inline-block hover:scale-110 transition-transform duration-300">
              <Search className="mx-auto h-20 w-20 text-blue-700 animate-pulse" />
            </div>
            <h3 className="text-4xl font-bold text-gradient-primary mb-4">
              {tHome("cta.title")}
            </h3>
            <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
              {tHome("cta.body")}
            </p>
            <Button
              size="lg"
              asChild
              className="btn-gradient-primary transition-all duration-300 hover:scale-110 hover:shadow-2xl text-lg px-8 py-6 text-white"
            >
              <Link href="/auth/sign-up">{tHome("cta.button")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t bg-gradient-to-b from-white via-slate-50/50 to-white py-16 overflow-hidden">
        {/* RT Logo Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 animate-pulse-slow">
          <div className="relative w-[600px] h-[600px] animate-float-slow">
            <Image
              src="/rtlogo.png"
              alt="RT Logo Background Footer"
              fill
              className="object-contain"
            />
          </div>
        </div>
        {/* Additional Decorative RT Logos */}
        <div className="absolute top-10 left-10 w-64 h-64 opacity-3 animate-spin-slow hidden lg:block">
          <Image
            src="/rtlogo.png"
            alt="RT Logo Decorative"
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute bottom-10 right-10 w-72 h-72 opacity-3 animate-spin-reverse-slow hidden lg:block">
          <Image
            src="/rtlogo.png"
            alt="RT Logo Decorative"
            fill
            className="object-contain"
          />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-400 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid gap-12 md:grid-cols-4 mb-12">
            {/* Brand Section - Enhanced */}
            <div className="group md:col-span-1">
              <div className="flex items-center gap-3 mb-6 transition-transform duration-300 group-hover:translate-x-2">
                <div className="relative h-14 w-14 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 animate-pulse-slow">
                  <Image
                    src="/rtlogo.png"
                    alt="RT Logo"
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                </div>
                <div>
                  <div className="font-extrabold text-xl text-gradient-primary">
                    {tCommon("brand")}
                  </div>
                  <div className="text-sm font-medium text-blue-700">
                    {tCommon("tagline")}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-xs">
                {tFooter("brandDescription")}
              </p>
              {/* Social Icons */}
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </div>

            {footerColumns.map((column) => (
              <div className="group" key={column.title}>
                <h4 className="font-bold text-lg mb-6 text-gray-900 flex items-center gap-2">
                  <column.icon className={`h-5 w-5 ${column.color}`} />
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 hover:text-blue-700 transition-all duration-300 hover:translate-x-2 flex items-center gap-2 group/link"
                      >
                        <span className="w-1.5 h-1.5 bg-blue-700 rounded-full group-hover/link:scale-150 transition-transform"></span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600">
                &copy; 2025{" "}
                <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {tCommon("brand")}
                </span>
                . {tFooter("copyright")}
              </p>
              <div className="flex gap-6 text-sm text-gray-600">
                <Link
                  href="/terms"
                  className="hover:text-blue-700 transition-colors"
                >
                  {tFooter("links.terms")}
                </Link>
                <Link
                  href="/privacy"
                  className="hover:text-blue-700 transition-colors"
                >
                  {tFooter("links.privacy")}
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-blue-700 transition-colors"
                >
                  {tFooter("links.support")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
