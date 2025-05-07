import { prisma } from "@/lib/prisma"
import { PlaygroundCard } from "@/components/playground/playground-card"
import { SearchFilters } from "@/components/playground/search-filters"
import type { Playground } from "@/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function PlaygroundsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extract search parameters
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined
  const city = typeof searchParams.city === "string" ? searchParams.city : undefined
  const sportType = typeof searchParams.sportType === "string" ? searchParams.sportType : undefined
  const minPrice = typeof searchParams.minPrice === "string" ? Number.parseInt(searchParams.minPrice) : undefined
  const maxPrice = typeof searchParams.maxPrice === "string" ? Number.parseInt(searchParams.maxPrice) : undefined
  const isAvailable = searchParams.isAvailable === "true"

  // Build filter conditions
  const where: any = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ]
  }

  if (city && city !== "all") {
    where.city = city
  }

  if (sportType && sportType !== "all") {
    where.sportType = sportType
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) {
      where.price.gte = minPrice
    }
    if (maxPrice !== undefined) {
      where.price.lte = maxPrice
    }
  }

  if (isAvailable) {
    where.isAvailable = true
  }

  // Fetch filtered playgrounds
  let playgrounds: Playground[] = []
  try {
    playgrounds = (await prisma.playground.findMany({
      where,
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
    })) as Playground[]
  } catch (error) {
    console.error("Error fetching playgrounds:", error)
    // If there's an error, we'll show an empty list
    playgrounds = []
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Browse Playgrounds</h1>

      <div className="mb-8">
        <SearchFilters />
      </div>

      {playgrounds.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playgrounds.map((playground) => (
            <PlaygroundCard key={playground.id} playground={playground} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-8 text-center">
          <h2 className="mb-2 text-xl font-semibold">No playgrounds found</h2>
          <p className="mb-8 text-muted-foreground">Try adjusting your search filters or browse all playgrounds.</p>
          <Button asChild>
            <Link href="/playgrounds">View All Playgrounds</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
