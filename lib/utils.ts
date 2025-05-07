import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} at ${formatTime(date)}`
}

export function getTimeSlots(startTime: Date, endTime: Date, intervalMinutes = 60): Date[] {
  const slots: Date[] = []
  const current = new Date(startTime)

  while (current < endTime) {
    slots.push(new Date(current))
    current.setMinutes(current.getMinutes() + intervalMinutes)
  }

  return slots
}

export function isAvailable(timeSlot: Date, bookings: { startTime: Date; endTime: Date }[]): boolean {
  const slotEnd = new Date(timeSlot)
  slotEnd.setHours(timeSlot.getHours() + 1)

  return !bookings.some(
    (booking) =>
      (timeSlot >= new Date(booking.startTime) && timeSlot < new Date(booking.endTime)) ||
      (slotEnd > new Date(booking.startTime) && slotEnd <= new Date(booking.endTime)) ||
      (timeSlot <= new Date(booking.startTime) && slotEnd >= new Date(booking.endTime)),
  )
}
