import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAllBookings } from "@/lib/actions/booking"
import { BookingsList } from "@/components/dashboard/bookings-list"

export default async function AdminBookingsPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/dashboard")
  }

  const bookings = await getAllBookings()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Booking Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>Manage all bookings in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <BookingsList bookings={bookings} isAdmin />
        </CardContent>
      </Card>
    </div>
  )
}
