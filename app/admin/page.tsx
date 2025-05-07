import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getAllPlaygrounds } from "@/lib/actions/playground"
import { getAllBookings } from "@/lib/actions/booking"
import { getAllUsers } from "@/lib/actions/user"
import { AdminStats } from "@/components/admin/admin-stats"
import { RecentUsers } from "@/components/admin/recent-users"
import { RecentBookings } from "@/components/dashboard/recent-bookings"

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "SUPER_ADMIN") {
    redirect("/dashboard")
  }

  const playgrounds = await getAllPlaygrounds()
  const bookings = await getAllBookings()
  const users = await getAllUsers()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <AdminStats users={users} playgrounds={playgrounds} bookings={bookings} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Recent bookings across all playgrounds</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentBookings bookings={bookings.slice(0, 5)} isAdmin />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Recently registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentUsers users={users.slice(0, 5)} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
