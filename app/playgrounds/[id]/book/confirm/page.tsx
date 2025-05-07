import { notFound } from "next/navigation"
import { getPlaygroundById } from "@/lib/actions/playground"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default async function BookingConfirmationPage({ params }: { params: { id: string } }) {
  const playground = await getPlaygroundById(params.id)

  if (!playground) {
    notFound()
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Booking Confirmed!</CardTitle>
          <CardDescription>Your booking for {playground.name} has been confirmed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-2 text-sm font-medium text-muted-foreground">Booking Details</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Playground</span>
                <span className="font-medium">{playground.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date</span>
                <span className="font-medium">May 15, 2023</span>
              </div>
              <div className="flex justify-between">
                <span>Time</span>
                <span className="font-medium">2:00 PM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Duration</span>
                <span className="font-medium">2 hours</span>
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-medium">{playground.price * 2} EGP</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="mb-2 text-sm font-medium text-muted-foreground">Payment Information</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Payment Method</span>
                <span className="font-medium">Credit Card</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-medium text-green-600">Paid</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction ID</span>
                <span className="font-medium">TXN-12345678</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/dashboard/bookings">View My Bookings</Link>
          </Button>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
