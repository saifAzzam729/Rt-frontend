import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createServerApiClient } from "@/lib/api/server"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  try {
    // Check if already applied and create application via backend API
    const apiClient = createServerApiClient();
    
    // Check existing applications
    const applications = await apiClient.getMyTenderApplications();
    const hasApplied = Array.isArray(applications)
      ? applications.some((app: any) => app.tender_id === id || app.tender?.id === id)
      : false;

    if (hasApplied) {
      return NextResponse.redirect(new URL(`/browse/tenders/${id}`, request.url))
    }

    // Create application via backend API
    await apiClient.applyToTender(id);

    return NextResponse.redirect(new URL("/dashboard/applications/tenders", request.url))
  } catch (error) {
    console.error("Error creating tender application:", error)
    return NextResponse.redirect(new URL(`/browse/tenders/${id}?error=application_failed`, request.url))
  }
}
