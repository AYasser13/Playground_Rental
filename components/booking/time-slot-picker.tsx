"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Generate time slots from 8 AM to 10 PM in 1-hour increments
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 8; hour < 22; hour++) {
    const startTime = `${hour.toString().padStart(2, "0")}:00`
    const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`
    slots.push({
      id: `${startTime}-${endTime}`,
      startTime,
      endTime,
      isAvailable: Math.random() > 0.3, // Randomly mark some slots as unavailable for demo
    })
  }
  return slots
}

export function TimeSlotPicker() {
  const timeSlots = generateTimeSlots()
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {timeSlots.map((slot) => (
          <Button
            key={slot.id}
            variant="outline"
            className={cn(
              "h-auto flex-col py-2",
              slot.isAvailable ? "hover:border-primary" : "opacity-50 cursor-not-allowed",
              selectedSlot === slot.id && "border-primary bg-primary/10",
            )}
            disabled={!slot.isAvailable}
            onClick={() => setSelectedSlot(slot.id)}
          >
            <span className="text-sm font-medium">{slot.startTime}</span>
            <span className="text-xs text-muted-foreground">to {slot.endTime}</span>
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary/10 border border-primary" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-muted" />
          <span>Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span>Selected</span>
        </div>
      </div>
    </div>
  )
}
