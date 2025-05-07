import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUserReviews } from "@/lib/actions/review"
import { ReviewsList } from "@/components/dashboard/reviews-list"

export default async function ReviewsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const reviews = await getUserReviews()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Reviews</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
          <CardDescription>Reviews you've left for playgrounds</CardDescription>
        </CardHeader>
        <CardContent>
          <ReviewsList reviews={reviews} />
        </CardContent>
      </Card>
    </div>
  )
}
