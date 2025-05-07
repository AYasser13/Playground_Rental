"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export function BookingCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Example of unavailable dates (in a real app, these would come from the API)
  const unavailableDates = [
    new Date(2023, 4, 10), // May 10, 2023
    new Date(2023, 4, 15), // May 15, 2023
    new Date(2023, 4, 20), // May 20, 2023
  ]

  // Function to check if a date is unavailable
  const isUnavailable = (date: Date) => {
    return unavailableDates.some(
      (unavailableDate) =>
        unavailableDate.getDate() === date.getDate() &&
        unavailableDate.getMonth() === date.getMonth() &&
        unavailableDate.getFullYear() === date.getFullYear(),
    )
  }

  // Function to disable past dates and unavailable dates
  const disabledDays = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today || isUnavailable(date)
  }

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={disabledDays}
        className="rounded-md border"
        modifiers={{
          unavailable: unavailableDates,
        }}
        modifiersClassNames={{
          unavailable: "text-destructive line-through",
        }}
        components={{
          Day: (props) => {
            const isUnavailable = unavailableDates.some(
              (unavailableDate) =>
                unavailableDate.getDate() === props.date.getDate() &&
                unavailableDate.getMonth() === props.date.getMonth() &&
                unavailableDate.getFullYear() === props.date.getFullYear(),
            )

            return (
              <div
                {...props}
                className={cn(props.className, isUnavailable && "bg-destructive/10 text-destructive line-through")}
              />
            )
          },
        }}
      />

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-destructive/10" />
          <span>Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-muted" />
          <span>Past dates</span>
        </div>
      </div>
    </div>
  )
}
