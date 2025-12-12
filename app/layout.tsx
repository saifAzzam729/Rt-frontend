import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "RT-SYR - Browse Jobs & Tenders in Syria #SyrianJobs #SyrianTenders",
  description:
    "Browse Syrian jobs or tender opportunities from verified organizations and companies. Apply for roles, post tenders, and connect with top talent in both English and Arabic. #SyrianTalent #SyrianJobs",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
