import { notFound } from "next/navigation"
import { getPlaygroundById } from "@/lib/actions/playground"
import { PlaygroundAmenities } from "@/components/playground/playground-amenities"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StarRating } from "@/components/playground/star-rating"
import { Calendar, Clock, MapPin, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default async function PlaygroundDetailPage({ params }: { params: { id: string } }) {
  const playground = await getPlaygroundById(params.id)

  if (!playground) {
    notFound()
  }

  // Parse JSON strings to arrays
  const images = JSON.parse(playground.images as string) as string[]
  const amenities = JSON.parse(playground.amenities as string) as string[]

  // Calculate average rating
  const averageRating =
    playground.reviews.length > 0
      ? playground.reviews.reduce((acc, review) => acc + review.rating, 0) / playground.reviews.length
      : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h1 className="mb-2 text-3xl font-bold">{playground.name}</h1>
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {playground.address}, {playground.city}
            </span>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <StarRating rating={averageRating} />
              <span className="text-sm text-muted-foreground">
                ({playground.reviews.length} {playground.reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Hosted by {playground.owner.name}</span>
            </div>
          </div>

          <div className="mb-8 overflow-hidden rounded-xl">
            {images.length > 0 ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                <Image
                  src={images[0] || "/placeholder.svg"}
                  alt={playground.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">About this playground</h2>
            <p className="text-muted-foreground">{playground.description}</p>
          </div>

          <PlaygroundAmenities amenities={amenities} />

          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Location</h2>
            <div className="overflow-hidden rounded-xl border">
              <div className="aspect-[16/9] w-full bg-muted">
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">Map will be displayed here</p>
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {playground.address}, {playground.city}, {playground.state} {playground.zipCode}
            </p>
          </div>
        </div>

        <div>
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <div className="mb-4 flex items-baseline justify-between">
                <div className="text-2xl font-bold">{playground.price} EGP</div>
                <div className="text-sm text-muted-foreground">per hour</div>
              </div>

              <div className="mb-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Available {playground.isAvailable ? "now" : "soon"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Instant booking available</span>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link href={`/playgrounds/${playground.id}/book`}>Book Now</Link>
              </Button>

              <p className="mt-4 text-center text-sm text-muted-foreground">You won't be charged yet</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Reviews</h2>
        {playground.reviews.length > 0 ? (
          <div className="space-y-4">
            {playground.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="font-medium">{review.user.name}</div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
        )}
      </div>

      <div className="flex justify-center">
        <Button asChild variant="outline">
          <Link href="/playgrounds">Back to Playgrounds</Link>
        </Button>
      </div>
    </div>
  )
}
