"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { Playground } from "@/types"

// Helper function to check if the total size of images is too large
function checkImagesSize(images: string[]): boolean {
  // Estimate the size of the stringified images array
  const totalSize = JSON.stringify(images).length
  // MySQL LONGTEXT can handle up to 4GB, but we'll set a reasonable limit
  const MAX_SIZE = 16 * 1024 * 1024 // 16MB as a safe limit
  return totalSize > MAX_SIZE
}

export async function getPlaygroundById(id: string): Promise<Playground | null> {
  try {
    const playground = await prisma.playground.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!playground || !playground.owner) {
      return null
    }

    return playground as Playground
  } catch (error) {
    console.error("Error fetching playground:", error)
    return null
  }
}

export async function getOwnerPlaygrounds(): Promise<Playground[]> {
  const user = await getCurrentUser()

  if (!user || user.role !== "OWNER") {
    throw new Error("You must be logged in as an owner to view your playgrounds")
  }

  try {
    const playgrounds = await prisma.playground.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
    })

    return playgrounds as Playground[]
  } catch (error) {
    console.error("Error fetching owner playgrounds:", error)
    return []
  }
}

export async function getAllPlaygrounds(): Promise<Playground[]> {
  try {
    const playgrounds = await prisma.playground.findMany({
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return playgrounds as Playground[]
  } catch (error) {
    console.error("Error fetching all playgrounds:", error)
    return []
  }
}

export async function createPlayground(data: {
  name: string
  description: string
  address: string
  city: string
  state: string
  zipCode: string
  price: number
  images: string[]
  sportType: string
  amenities: string[]
}): Promise<Playground> {
  const user = await getCurrentUser()

  if (!user || user.role !== "OWNER") {
    throw new Error("You must be logged in as an owner to create a playground")
  }

  try {
    // Ensure images is an array before stringifying
    const imagesArray = Array.isArray(data.images) ? data.images : []
    const amenitiesArray = Array.isArray(data.amenities) ? data.amenities : []

    // Check if the total size of images is too large
    if (checkImagesSize(imagesArray)) {
      throw new Error("The total size of images is too large. Please reduce the number or size of images.")
    }

    // Create the playground
    const playground = await prisma.playground.create({
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        price: data.price,
        images: JSON.stringify(imagesArray),
        sportType: data.sportType,
        amenities: JSON.stringify(amenitiesArray),
        ownerId: user.id,
      },
    })

    revalidatePath("/owner/playgrounds")
    revalidatePath("/playgrounds")

    return playground as Playground
  } catch (error) {
    console.error("Error creating playground:", error)
    if (error instanceof Error) {
      throw new Error(error.message || "Failed to create playground. Please try again.")
    }
    throw new Error("Failed to create playground. Please try again.")
  }
}

export async function updatePlayground(
  id: string,
  data: {
    name: string
    description: string
    address: string
    city: string
    state: string
    zipCode: string
    price: number
    images: string[]
    sportType: string
    amenities: string[]
    isAvailable: boolean
  },
): Promise<Playground> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("You must be logged in to update a playground")
  }

  try {
    // Check if user is the owner or an admin
    const playground = await prisma.playground.findUnique({
      where: { id },
    })

    if (!playground) {
      throw new Error("Playground not found")
    }

    const isOwner = playground.ownerId === user.id
    const isAdmin = user.role === "SUPER_ADMIN"

    if (!isOwner && !isAdmin) {
      throw new Error("You don't have permission to update this playground")
    }

    // Ensure images and amenities are arrays before stringifying
    const imagesArray = Array.isArray(data.images) ? data.images : []
    const amenitiesArray = Array.isArray(data.amenities) ? data.amenities : []

    // Check if the total size of images is too large
    if (checkImagesSize(imagesArray)) {
      throw new Error("The total size of images is too large. Please reduce the number or size of images.")
    }

    const updatedPlayground = await prisma.playground.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        price: data.price,
        images: JSON.stringify(imagesArray),
        sportType: data.sportType,
        amenities: JSON.stringify(amenitiesArray),
        isAvailable: data.isAvailable,
      },
    })

    revalidatePath(`/playgrounds/${id}`)
    revalidatePath("/owner/playgrounds")
    revalidatePath("/playgrounds")

    return updatedPlayground as Playground
  } catch (error) {
    console.error("Error updating playground:", error)
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw error
  }
}

export async function togglePlaygroundAvailability(id: string): Promise<Playground> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("You must be logged in to update a playground")
  }

  try {
    // Check if user is the owner or an admin
    const playground = await prisma.playground.findUnique({
      where: { id },
    })

    if (!playground) {
      throw new Error("Playground not found")
    }

    const isOwner = playground.ownerId === user.id
    const isAdmin = user.role === "SUPER_ADMIN"

    if (!isOwner && !isAdmin) {
      throw new Error("You don't have permission to update this playground")
    }

    const updatedPlayground = await prisma.playground.update({
      where: { id },
      data: {
        isAvailable: !playground.isAvailable,
      },
    })

    revalidatePath(`/playgrounds/${id}`)
    revalidatePath("/owner/playgrounds")
    revalidatePath("/playgrounds")

    return updatedPlayground as Playground
  } catch (error) {
    console.error("Error toggling availability:", error)
    throw error
  }
}

export async function deletePlayground(id: string): Promise<void> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("You must be logged in to delete a playground")
  }

  try {
    // Check if user is the owner or an admin
    const playground = await prisma.playground.findUnique({
      where: { id },
    })

    if (!playground) {
      throw new Error("Playground not found")
    }

    const isOwner = playground.ownerId === user.id
    const isAdmin = user.role === "SUPER_ADMIN"

    if (!isOwner && !isAdmin) {
      throw new Error("You don't have permission to delete this playground")
    }

    // Delete the playground
    await prisma.playground.delete({
      where: { id },
    })

    revalidatePath("/owner/playgrounds")
    revalidatePath("/playgrounds")
  } catch (error) {
    console.error("Error deleting playground:", error)
    throw error
  }
}
