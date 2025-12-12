import { NextResponse } from "next/server";
import { createServerApiClient } from "@/lib/api/server";

export async function GET() {
  try {
    const apiClient = createServerApiClient();

    // Fetch all necessary data in parallel
    const [jobs, tenders, analytics] = await Promise.all([
      apiClient.getJobs().catch(() => []),
      apiClient.getTenders().catch(() => []),
      apiClient.getAdminAnalytics().catch(() => null),
    ]);

    // Calculate active opportunities (jobs and tenders with status 'open')
    const activeJobs = Array.isArray(jobs)
      ? jobs.filter((job: any) => job.status === "open").length
      : 0;
    const activeTenders = Array.isArray(tenders)
      ? tenders.filter((tender: any) => tender.status === "open").length
      : 0;
    const activeOpportunities = activeJobs + activeTenders;

    // Get user count from analytics
    const registeredUsers = analytics?.total_users ?? 0;

    // Get company and organization counts from analytics
    const totalCompanies = analytics?.total_companies ?? 0;
    const totalOrganizations = analytics?.total_organizations ?? 0;
    const companiesAndOrganizations = totalCompanies + totalOrganizations;

    // Return stats in the expected format
    return NextResponse.json({
      activeOpportunities,
      registeredUsers,
      companiesAndOrganizations,
      breakdown: {
        activeJobs,
        activeTenders,
        totalCompanies,
        totalOrganizations,
      },
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    // Return default values on error
    return NextResponse.json(
      {
        activeOpportunities: 0,
        registeredUsers: 0,
        companiesAndOrganizations: 0,
        breakdown: {
          activeJobs: 0,
          activeTenders: 0,
          totalCompanies: 0,
          totalOrganizations: 0,
        },
      },
      { status: 500 }
    );
  }
}



