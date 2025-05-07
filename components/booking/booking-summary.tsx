"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"
import type { Playground } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface BookingSummaryProps {
  playground: Playground
}

export function BookingSummary({ playground }: BookingSummaryProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // In a real app, these would come from the selected date and time slots
  const bookingDetails = {
    date: "May 15, 2023",
    startTime: "14:00",
    endTime: "16:00",
    hours: 2,
    subtotal: playground.price * 2,
    serviceFee: Math.round(playground.price * 0.1 * 2),
    total: Math.round(playground.price * 2 * 1.1),
  }

  const handleBooking = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would call a server action to create the booking
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

      toast({
        title: "Booking successful",
        description: "Your booking has been confirmed",
      })

      router.push(`/playgrounds/${playground.id}/book/confirm`)
    } catch (error) {
      console.error("Error creating booking:", error)
      toast({
        title: "Booking failed",
        description: "There was an error creating your booking. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">{playground.name}</h3>
        <p className="text-sm text-muted-foreground">{playground.sportType}</p>
      </div>

      <div className="rounded-lg border bg-card p-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Date</span>
            <span className="font-medium">{bookingDetails.date}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Time</span>
            <span className="font-medium">
              {bookingDetails.startTime} - {bookingDetails.endTime}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Duration</span>
            <span className="font-medium">{bookingDetails.hours} hours</span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>
            {playground.price} EGP x {bookingDetails.hours} hours
          </span>
          <span>{bookingDetails.subtotal} EGP</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Service fee</span>
          <span>{bookingDetails.serviceFee} EGP</span>
        </div>
        <Separator />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{bookingDetails.total} EGP</span>
        </div>
      </div>

      <Button onClick={handleBooking} className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Confirm and Pay"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        You won't be charged yet. Payment will be processed after the owner confirms your booking.
      </p>
    </div>
  )
}
