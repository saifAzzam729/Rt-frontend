import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/server"
import { createServerApiClient } from "@/lib/api/server"

const ALLOWED_STATUSES = ["new", "in_review", "resolved"]

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Authenticate user via JWT
  const jwtUser = await requireAuth();

  const apiClient = createServerApiClient();

  // Get profile and verify admin role
  const profile = await apiClient.getMyProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { id } = await params;
  const body = await request.json()
  const nextStatus = body.status as string

  if (!ALLOWED_STATUSES.includes(nextStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  try {
    // Update report status via backend API
    await apiClient.updateReportStatus(id, nextStatus)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating report status", error)
    return NextResponse.json({ error: "Unable to update status" }, { status: 500 })
  }
}

