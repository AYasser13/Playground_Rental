import type { Playground } from "@/types"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Get all playgrounds with valid owners
export async function getPlaygrounds(): Promise<Playground[]> {
  try {
    const playgrounds = await prisma.playground.findMany({
      where: {
        ownerId: {
          not: null, // Correct syntax to find playgrounds with owners
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviews: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return playgrounds as Playground[]
  } catch (error) {
    console.error("Error fetching playgrounds:", error)
    return []
  }
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
