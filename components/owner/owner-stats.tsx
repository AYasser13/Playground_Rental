import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Playground, Booking } from "@/types"
import { Layers, CalendarDays, DollarSign, Users } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface OwnerStatsProps {
  playgrounds: Playground[]
  bookings: Booking[]
}

export function OwnerStats({ playgrounds, bookings }: OwnerStatsProps) {
  // Calculate stats
  const totalPlaygrounds = playgrounds.length
  const totalBookings = bookings.length

  // Calculate total revenue (only from confirmed and completed bookings)
  const totalRevenue = bookings
    .filter((booking) => booking.status === "CONFIRMED" || booking.status === "COMPLETED")
    .reduce((sum, booking) => sum + booking.totalAmount, 0)

  // Calculate unique users who have booked
  const uniqueUsers = new Set(bookings.map((booking) => booking.userId)).size

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Playgrounds</CardTitle>
          <Layers className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPlaygrounds}</div>
        </CardContent>
      </Card>

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
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueUsers}</div>
        </CardContent>
      </Card>
    </div>
  )
}
