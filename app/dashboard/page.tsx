import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserBookings } from "@/lib/actions/booking"
import { getUserNotifications } from "@/lib/actions/notification"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentBookings } from "@/components/dashboard/recent-bookings"
import { NotificationsList } from "@/components/dashboard/notifications-list"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Redirect to appropriate dashboard based on role
  if (user.role === "OWNER") {
    redirect("/owner")
  } else if (user.role === "SUPER_ADMIN") {
    redirect("/admin")
  }

  const bookings = await getUserBookings()
  const notifications = await getUserNotifications()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <DashboardStats bookings={bookings} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your most recent playground bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentBookings bookings={bookings.slice(0, 5)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Your latest notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationsList notifications={notifications} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
