"use server"

import { PrismaClient } from "@prisma/client"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { Review } from "@/types"

const prisma = new PrismaClient()

export async function submitReview({
  playgroundId,
  bookingId,
  rating,
  comment,
}: {
  playgroundId: string
  bookingId?: string
  rating: number
  comment?: string
}): Promise<Review> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("You must be logged in to submit a review")
  }

  // Validate rating
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5")
  }

  // For demo purposes, we'll allow reviews without a booking
  // In a real app, you might want to check if the user has a completed booking for this playground

  // Create the review
  const review = await prisma.review.create({
    data: {
      rating,
      comment: comment || null,
      userId: user.id,
      playgroundId,
      bookingId: bookingId || "demo_booking_id", // In a real app, this would be a valid booking ID
    },
    include: {
      user: true,
    },
  })

  revalidatePath(`/playgrounds/${playgroundId}`)

  return review as Review
}

export async function getPlaygroundReviews(playgroundId: string): Promise<Review[]> {
  const reviews = await prisma.review.findMany({
    where: { playgroundId },
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return reviews as Review[]
}

export async function getUserReviews(): Promise<Review[]> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("You must be logged in to view your reviews")
  }

  const reviews = await prisma.review.findMany({
    where: { userId: user.id },
    include: {
      playground: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return reviews as Review[]
}
