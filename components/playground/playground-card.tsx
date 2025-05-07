import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Playground } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/playground/star-rating"
import { formatCurrency } from "@/lib/utils"

interface PlaygroundCardProps {
  playground: Playground
}

export function PlaygroundCard({ playground }: PlaygroundCardProps) {
  // Parse the images JSON string to get the first image
  let firstImage = "/placeholder.svg?height=225&width=400"
  try {
    const imagesStr = typeof playground.images === "string" ? playground.images : "[]"
    const images = JSON.parse(imagesStr)
    if (images && images.length > 0 && images[0]) {
      firstImage = images[0]
    }
  } catch (error) {
    console.error("Error parsing playground images:", error)
  }

  // Calculate average rating
  const avgRating =
    playground.reviews && playground.reviews.length > 0
      ? playground.reviews.reduce((acc, review) => acc + review.rating, 0) / playground.reviews.length
      : 0

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/playgrounds/${playground.id}`}>
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={firstImage || "/placeholder.svg"}
            alt={playground.name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          <Badge className="absolute right-2 top-2" variant={playground.isAvailable ? "default" : "secondary"}>
            {playground.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">{playground.name}</h3>
            <Badge variant="outline">{playground.sportType}</Badge>
          </div>
          <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{playground.description}</p>
          <p className="text-sm text-muted-foreground">
            {playground.city}, {playground.state}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t p-4">
          <StarRating rating={avgRating} reviewCount={playground.reviews ? playground.reviews.length : 0} />
          <p className="font-semibold text-primary">{formatCurrency(playground.price)}/hr</p>
        </CardFooter>
      </Link>
    </Card>
  )
}
