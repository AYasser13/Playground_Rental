import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getOwnerBookings } from "@/lib/actions/booking"
import { BookingsList } from "@/components/dashboard/bookings-list"

export default async function OwnerBookingsPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "OWNER") {
    redirect("/dashboard")
  }

  const bookings = await getOwnerBookings()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Playground Bookings</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>Manage bookings for your playgrounds</CardDescription>
        </CardHeader>
        <CardContent>
          <BookingsList bookings={bookings} isOwner />
        </CardContent>
      </Card>
    </div>
  )
}
