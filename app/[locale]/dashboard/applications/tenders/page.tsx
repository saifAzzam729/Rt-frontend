import { redirect } from "@/navigation"
import { requireAuth } from "@/lib/auth/server"
import { createServerApiClient } from "@/lib/api/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/navigation"
import { FileText, MapPin, Clock, ArrowLeft, Calendar } from "lucide-react"

export default async function TenderApplicationsPage() {
  // Authenticate user via JWT
  await requireAuth();

  const apiClient = createServerApiClient();
  const profile = await apiClient.getMyProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  // Fetch user's tender applications from API
  const applications = await apiClient.getMyTenderApplications().catch(() => []);

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">My Tender Applications</h1>
            <p className="text-muted-foreground mt-2">Track the status of your tender applications</p>
          </div>

          <div className="grid gap-6">
            {applications && applications.length > 0 ? (
              applications.map((application) => (
                <Card key={application.id} className="hover:border-blue-200 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{application.tender?.title || "Tender Application"}</CardTitle>
                        <CardDescription className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {application.tender?.organization?.name || "Organization"}
                          </span>
                          {application.tender?.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {application.tender.location}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          application.status === "accepted"
                            ? "default"
                            : application.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                        className="capitalize"
                      >
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Applied {new Date(application.created_at).toLocaleDateString()}
                        </span>
                        {application.tender?.deadline && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Deadline: {new Date(application.tender.deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <Button asChild variant="outline" className="bg-transparent">
                        <Link href={`/browse/tenders/${application.tender_id || application.tender?.id}`}>View Tender</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">You haven&apos;t applied to any tenders yet</p>
                  <Button asChild>
                    <Link href="/browse/tenders">Browse Tenders</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
