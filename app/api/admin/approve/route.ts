import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth/server"
import { createServerApiClient } from "@/lib/api/server"

export async function POST(request: Request) {
  // Authenticate user via JWT
  const jwtUser = await requireAuth();

  const apiClient = createServerApiClient();

  // Get profile and verify admin role
  const profile = await apiClient.getMyProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const body = await request.json()
  const entityType = body.entityType as "organization" | "company"
  const entityId = body.entityId as string
  const approved = body.approved !== undefined ? body.approved : true

  if (!entityId || !entityType || (entityType !== "organization" && entityType !== "company")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  try {
    // Approve/reject entity via backend API
    await apiClient.approveEntity({
      entityType,
      entityId,
      approved,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Approval update failed", error)
    return NextResponse.json({ error: "Unable to approve entity" }, { status: 500 })
  }
}

