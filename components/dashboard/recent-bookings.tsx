import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Booking } from "@/types"
import { formatDate, formatTime } from "@/lib/utils"
import Link from "next/link"

interface RecentBookingsProps {
  bookings: Booking[]
  isAdmin?: boolean
  isOwner?: boolean
}

export function RecentBookings({ bookings, isAdmin, isOwner }: RecentBookingsProps) {
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="mb-4 text-muted-foreground">No bookings found</p>
        <Button asChild>
          <Link href="/playgrounds">Browse Playgrounds</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div key={booking.id} className="flex flex-col space-y-2 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{booking.playground?.name || "Unknown Playground"}</h3>
            <Badge
              variant={
                booking.status === "CONFIRMED"
                  ? "default"
                  : booking.status === "COMPLETED"
                    ? "outline"
                    : booking.status === "CANCELLED"
                      ? "destructive"
                      : "secondary"
              }
            >
              {booking.status}
            </Badge>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              {formatDate(booking.startTime)} at {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </p>
            {isAdmin && <p className="mt-1">Booked by: {booking.user?.name || "Unknown User"}</p>}
            {isOwner && <p className="mt-1">Booked by: {booking.user?.name || "Unknown User"}</p>}
          </div>
        </div>
      ))}

      {bookings.length > 0 && (
        <Button variant="outline" className="w-full" asChild>
          <Link href={isAdmin ? "/admin/bookings" : isOwner ? "/owner/bookings" : "/dashboard/bookings"}>
            View All Bookings
          </Link>
        </Button>
      )}
    </div>
  )
}
