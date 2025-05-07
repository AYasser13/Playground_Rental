"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { Booking } from "@/types"

export async function createBooking(data: {
  playgroundId: string
  date: string
  startTime: string
  endTime: string
  totalPrice: number
}): Promise<Booking> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("You must be logged in to create a booking")
  }

  try {
    // Check if the playground exists and is available
    const playground = await prisma.playground.findUnique({
      where: { id: data.playgroundId },
    })

    if (!playground) {
      throw new Error("Playground not found")
    }

    if (!playground.isAvailable) {
      throw new Error("This playground is not available for booking")
    }

    // Check if the time slot is available
    const existingBooking = await prisma.booking.findFirst({
      where: {
        playgroundId: data.playgroundId,
        date: new Date(data.date),
        OR: [
          {
            startTime: { lte: data.startTime },
            endTime: { gt: data.startTime },
          },
          {
            startTime: { lt: data.endTime },
            endTime: { gte: data.endTime },
          },
          {
            startTime: { gte: data.startTime },
            endTime: { lte: data.endTime },
          },
        ],
      },
    })

    if (existingBooking) {
      throw new Error("This time slot is already booked")
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        playgroundId: data.playgroundId,
        userId: user.id,
        date: new Date(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        totalAmount: data.totalPrice,
        status: "PENDING",
      },
    })

    // Create a notification for the playground owner
    await prisma.notification.create({
      data: {
        userId: playground.ownerId,
        type: "BOOKING_CONFIRMATION",
        message: `New booking for ${playground.name} on ${new Date(data.date).toLocaleDateString()}`,
        isRead: false,
      },
    })

    revalidatePath(`/playgrounds/${data.playgroundId}`)
    revalidatePath("/dashboard/bookings")
    revalidatePath("/owner/bookings")

    return booking as Booking
  } catch (error) {
    console.error("Error creating booking:", error)
    throw error
  }
}

export async function getUserBookings(): Promise<Booking[]> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("You must be logged in to view your bookings")
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        playground: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return bookings as Booking[]
  } catch (error) {
    console.error("Error fetching user bookings:", error)
    return []
  }
}

export async function getOwnerBookings(): Promise<Booking[]> {
  const user = await getCurrentUser()

  if (!user || user.role !== "OWNER") {
    throw new Error("You must be logged in as an owner to view bookings")
  }

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        playground: {
          ownerId: user.id,
        },
      },
      include: {
        playground: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return bookings as Booking[]
  } catch (error) {
    console.error("Error fetching owner bookings:", error)
    return []
  }
}

export async function getAllBookings(): Promise<Booking[]> {
  const user = await getCurrentUser()

  if (!user || user.role !== "SUPER_ADMIN") {
    throw new Error("You must be logged in as an admin to view all bookings")
  }

  try {
    const bookings = await prisma.booking.findMany({
      include: {
        playground: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return bookings as Booking[]
  } catch (error) {
    console.error("Error fetching all bookings:", error)
    return []
  }
}

export async function cancelBooking(id: string): Promise<void> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("You must be logged in to cancel a booking")
  }

  try {
    // Check if the booking exists
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        playground: true,
      },
    })

    if (!booking) {
      throw new Error("Booking not found")
    }

    // Check if user is the owner of the playground or the user who made the booking
    const isOwner = booking.playground.ownerId === user.id
    const isBookingUser = booking.userId === user.id
    const isAdmin = user.role === "SUPER_ADMIN"

    if (!isOwner && !isBookingUser && !isAdmin) {
      throw new Error("You don't have permission to cancel this booking")
    }

    // Update the booking status to cancelled
    await prisma.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
      },
    })

    revalidatePath("/dashboard/bookings")
    revalidatePath("/owner/bookings")
  } catch (error) {
    console.error("Error cancelling booking:", error)
    throw error
  }
}

export async function updateBookingStatus(id: string, status: string): Promise<Booking> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("You must be logged in to update a booking")
  }

  try {
    // Check if the booking exists
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        playground: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!booking) {
      throw new Error("Booking not found")
    }

    // Check if user is the owner of the playground or the user who made the booking
    const isOwner = booking.playground.ownerId === user.id
    const isBookingUser = booking.userId === user.id
    const isAdmin = user.role === "SUPER_ADMIN"

    if (!isOwner && !isBookingUser && !isAdmin) {
      throw new Error("You don't have permission to update this booking")
    }

    // Update the booking status
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status,
      },
      include: {
        playground: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    revalidatePath("/dashboard/bookings")
    revalidatePath("/owner/bookings")

    return updatedBooking as Booking
  } catch (error) {
    console.error("Error updating booking status:", error)
    throw error
  }
}

export async function deleteBooking(id: string): Promise<void> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("You must be logged in to delete a booking")
  }

  try {
    // Check if the booking exists
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        playground: true,
      },
    })

    if (!booking) {
      throw new Error("Booking not found")
    }

    // Check if user is the owner of the playground or the user who made the booking
    const isOwner = booking.playground.ownerId === user.id
    const isBookingUser = booking.userId === user.id
    const isAdmin = user.role === "SUPER_ADMIN"

    if (!isOwner && !isBookingUser && !isAdmin) {
      throw new Error("You don't have permission to delete this booking")
    }

    // Delete the booking
    await prisma.booking.delete({
      where: { id },
    })

    revalidatePath("/dashboard/bookings")
    revalidatePath("/owner/bookings")
  } catch (error) {
    console.error("Error deleting booking:", error)
    throw error
  }
}
