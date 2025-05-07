"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StarRating } from "@/components/playground/star-rating"
import { formatDate } from "@/lib/utils"
import { getPlaygroundReviews } from "@/lib/actions/review"
import type { Review } from "@/types"
import { Loader2 } from "lucide-react"
import { ReviewForm } from "@/components/playground/review-form"
import { useAuth } from "@/hooks/use-auth"

interface PlaygroundReviewsProps {
  playgroundId: string
}

export function PlaygroundReviews({ playgroundId }: PlaygroundReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getPlaygroundReviews(playgroundId)
        setReviews(data)
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [playgroundId])

  const handleReviewSubmitted = (newReview: Review) => {
    setReviews((prevReviews) => [newReview, ...prevReviews])
    setShowReviewForm(false)
  }

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Reviews</h2>
        {user && !showReviewForm && <Button onClick={() => setShowReviewForm(true)}>Write a Review</Button>}
      </div>

      {showReviewForm && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <ReviewForm
              playgroundId={playgroundId}
              onReviewSubmitted={handleReviewSubmitted}
              onCancel={() => setShowReviewForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="font-medium">{review.user?.name || "Anonymous"}</div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="mb-2 text-sm text-muted-foreground">{formatDate(review.createdAt)}</p>
                {review.comment && <p>{review.comment}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="py-4 text-center text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
      )}
    </div>
  )
}
