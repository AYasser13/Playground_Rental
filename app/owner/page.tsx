import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getOwnerPlaygrounds } from "@/lib/actions/playground"
import { getOwnerBookings } from "@/lib/actions/booking"
import { OwnerStats } from "@/components/owner/owner-stats"
import { RecentBookings } from "@/components/dashboard/recent-bookings"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default async function OwnerDashboardPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "OWNER") {
    redirect("/dashboard")
  }

  const playgrounds = await getOwnerPlaygrounds()
  const bookings = await getOwnerBookings()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Owner Dashboard</h1>
        <Button asChild>
          <Link href="/owner/playgrounds/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Playground
          </Link>
        </Button>
      </div>

      <OwnerStats playgrounds={playgrounds} bookings={bookings} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Recent bookings for your playgrounds</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentBookings bookings={bookings.slice(0, 5)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Playgrounds</CardTitle>
            <CardDescription>
              {playgrounds.length > 0
                ? `You have ${playgrounds.length} playground${playgrounds.length > 1 ? "s" : ""}`
                : "You haven't added any playgrounds yet"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {playgrounds.length > 0 ? (
              <div className="space-y-4">
                {playgrounds.slice(0, 3).map((playground) => (
                  <div key={playground.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <h3 className="font-medium">{playground.name}</h3>
                      <p className="text-sm text-muted-foreground">{playground.sportType}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/owner/playgrounds/${playground.id}`}>Manage</Link>
                    </Button>
                  </div>
                ))}
                {playgrounds.length > 3 && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/owner/playgrounds">View All Playgrounds</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="mb-4 text-muted-foreground">
                  You haven't added any playgrounds yet. Add your first playground to start receiving bookings.
                </p>
                <Button asChild>
                  <Link href="/owner/playgrounds/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Playground
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
