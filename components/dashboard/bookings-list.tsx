"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency, formatDate, formatTime } from "@/lib/utils"
import type { Booking } from "@/types"
import { cancelBooking } from "@/lib/actions/booking"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface BookingsListProps {
  bookings: Booking[]
  isAdmin?: boolean
  isOwner?: boolean
}

export function BookingsList({ bookings, isAdmin, isOwner }: BookingsListProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)
  const { toast } = useToast()

  const handleCancelBooking = async () => {
    if (!selectedBooking) return

    setIsCancelling(true)

    try {
      await cancelBooking(selectedBooking.id)

      toast({
        title: "Booking cancelled",
        description: "The booking has been successfully cancelled.",
      })

      // Update the booking status in the UI
      selectedBooking.status = "CANCELLED"
      if (selectedBooking.payment) {
        selectedBooking.payment.status = "REFUNDED"
      }
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast({
        title: "Cancellation failed",
        description: error instanceof Error ? error.message : "Failed to cancel booking",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
      setSelectedBooking(null)
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">No bookings found</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Playground</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              {(isAdmin || isOwner) && <TableHead>User</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell className="font-medium">{booking.playground?.name || "Unknown"}</TableCell>
                <TableCell>{formatDate(booking.startTime)}</TableCell>
                <TableCell>
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
                {(isAdmin || isOwner) && <TableCell>{booking.user?.name || "Unknown"}</TableCell>}
                <TableCell className="text-right">
                  {booking.status === "CONFIRMED" && (
                    <Button variant="outline" size="sm" onClick={() => setSelectedBooking(booking)}>
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-2 py-4">
              <div className="flex justify-between">
                <span className="font-medium">Playground:</span>
                <span>{selectedBooking.playground?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{formatDate(selectedBooking.startTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Time:</span>
                <span>
                  {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span>{formatCurrency(selectedBooking.totalAmount)}</span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedBooking(null)} disabled={isCancelling}>
              Keep Booking
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking} disabled={isCancelling}>
              {isCancelling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                "Cancel Booking"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
