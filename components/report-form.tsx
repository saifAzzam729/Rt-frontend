"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TOPICS = [
  { value: "suspicious_job", label: "Suspicious job listing" },
  { value: "suspicious_tender", label: "Suspicious tender listing" },
  { value: "payment_request", label: "Request for payment or fee" },
  { value: "other", label: "Other issue" },
]

export function ReportForm() {
  const supabase = createClient()
  const [reportTopic, setReportTopic] = useState(TOPICS[0].value)
  const [listingUrl, setListingUrl] = useState("")
  const [listingType, setListingType] = useState<"job" | "tender" | "other">("job")
  const [details, setDetails] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSuccess(false)
    setError(null)

    try {
      const payload = {
        reportTopic,
        listingType,
        listingUrl,
        details,
        contactEmail,
      }

      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const res = await response.json()
        throw new Error(res.error || "Unable to submit report")
      }

      setSuccess(true)
      setListingUrl("")
      setDetails("")
      setContactEmail("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label htmlFor="topic" className="text-sm font-medium text-foreground">
          What are you reporting?
        </label>
        <Select value={reportTopic} onValueChange={setReportTopic}>
          <SelectTrigger id="topic" className="bg-slate-50">
            <SelectValue placeholder="Choose type" />
          </SelectTrigger>
          <SelectContent>
            {TOPICS.map((topic) => (
              <SelectItem key={topic.value} value={topic.value}>
                {topic.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-foreground">Listing type</label>
        <Select value={listingType} onValueChange={(value) => setListingType(value as "job" | "tender" | "other")}>
          <SelectTrigger className="bg-slate-50">
            <SelectValue placeholder="Select listing type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="job">Job</SelectItem>
            <SelectItem value="tender">Tender</SelectItem>
            <SelectItem value="other">Other / unspecified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <label htmlFor="listing-url" className="text-sm font-medium text-foreground">
          Listing link or ID
        </label>
        <Input
          id="listing-url"
          type="text"
          className="bg-slate-50"
          value={listingUrl}
          onChange={(e) => setListingUrl(e.target.value)}
          placeholder="https://techno-syr.com/browse/tenders/..."
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="details" className="text-sm font-medium text-foreground">
          Details
        </label>
        <Textarea
          id="details"
          className="bg-slate-50"
          minLength={10}
          required
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Describe what happened, screenshots, payment requests, etc."
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
          Your email
        </label>
        <Input
          id="contact-email"
          type="email"
          className="bg-slate-50"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>

      {success && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">Report submitted. Thank you!</p>}
      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Report"}
      </Button>
    </form>
  )
}

