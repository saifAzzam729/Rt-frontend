import { ReportForm } from "@/components/report-form"

export default function ReportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        <div className="text-center space-y-4">
          <p className="text-sm uppercase tracking-wide text-amber-600 font-semibold">Report Activity</p>
          <h1 className="text-4xl font-bold text-foreground">Help us keep RT SYR safe</h1>
          <p className="text-muted-foreground text-lg">
            We never charge applicants for jobs or tenders. If someone requests payment or you see suspicious activity,
            let us know immediately.
          </p>
        </div>

        <div className="rounded-3xl border border-white/60 bg-white p-8 shadow-xl space-y-6">
          <ReportForm />
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50/80 p-6 text-sm text-amber-900 space-y-2">
          <p className="font-semibold">What we’ll do</p>
          <ul className="list-disc list-inside text-amber-800 space-y-1">
            <li>Review the listing or account</li>
            <li>Suspend or block accounts violating our policies</li>
            <li>Notify you once the investigation is complete</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

