import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Booking } from "@/types"
import { CalendarDays, CheckCircle, Clock, XCircle } from "lucide-react"

interface DashboardStatsProps {
  bookings: Booking[]
}

export function DashboardStats({ bookings }: DashboardStatsProps) {
  // Calculate stats
  const totalBookings = bookings.length
  const upcomingBookings = bookings.filter(
    (booking) => new Date(booking.startTime) > new Date() && booking.status !== "CANCELLED",
  ).length
  const completedBookings = bookings.filter((booking) => booking.status === "COMPLETED").length
  const cancelledBookings = bookings.filter((booking) => booking.status === "CANCELLED").length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBookings}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingBookings}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedBookings}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cancelledBookings}</div>
        </CardContent>
      </Card>
    </div>
  )
}
