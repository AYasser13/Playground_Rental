import { Star } from "lucide-react"

interface StarRatingProps {
  rating: number
  reviewCount?: number
}

export function StarRating({ rating, reviewCount }: StarRatingProps) {
  // Round to nearest half
  const roundedRating = Math.round(rating * 2) / 2

  return (
    <div className="flex items-center">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= roundedRating
                ? "fill-primary text-primary"
                : star - 0.5 <= roundedRating
                  ? "fill-primary/50 text-primary"
                  : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="ml-2 text-xs text-muted-foreground">
          ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  )
}
