import { NextResponse } from "next/server"
import { createServerApiClient } from "@/lib/api/server"

export async function POST(request: Request) {
  const body = await request.json()

  if (!body.reportTopic || !body.details) {
    return NextResponse.json({ error: "Report topic and details are required." }, { status: 400 })
  }

  try {
    // Create report via backend API (public endpoint, but can include token if logged in)
    const apiClient = createServerApiClient();
    
    await apiClient.createReport({
      report_topic: body.reportTopic,
      listing_type: body.listingType || null,
      listing_id: body.listingId || null,
      listing_url: body.listingUrl || null,
      details: body.details,
      contact_email: body.contactEmail || null,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error inserting report", error)
    return NextResponse.json({ error: "Unable to submit report." }, { status: 500 })
  }
}

