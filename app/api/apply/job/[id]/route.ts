import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createServerApiClient } from "@/lib/api/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
    const applications = await apiClient.getMyJobApplications();
    const hasApplied = Array.isArray(applications)
      ? applications.some((app: any) => app.job_id === id || app.job?.id === id)
      : false;

    if (hasApplied) {
      return NextResponse.redirect(new URL(`/browse/jobs/${id}`, request.url))
    }

    // Create application via backend API
    await apiClient.applyToJob(id);

    return NextResponse.redirect(new URL("/dashboard/applications/jobs", request.url))
  } catch (error) {
    console.error("Error creating job application:", error)
    return NextResponse.redirect(new URL(`/browse/jobs/${id}?error=application_failed`, request.url))
  }
}
