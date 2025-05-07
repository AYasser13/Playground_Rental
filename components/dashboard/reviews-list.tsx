import { Card, CardContent } from "@/components/ui/card"
import { StarRating } from "@/components/playground/star-rating"
import { formatDate } from "@/lib/utils"
import type { Review } from "@/types"
import Link from "next/link"

interface ReviewsListProps {
  reviews: Review[]
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">You haven't left any reviews yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id}>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <Link href={`/playgrounds/${review.playgroundId}`} className="font-medium hover:underline">
                {review.playground?.name || "Unknown Playground"}
              </Link>
              <StarRating rating={review.rating} />
            </div>
            <p className="mb-2 text-sm text-muted-foreground">{formatDate(review.createdAt)}</p>
            {review.comment && <p>{review.comment}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
