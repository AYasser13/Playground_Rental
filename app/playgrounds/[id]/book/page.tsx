import { notFound } from "next/navigation"
import { getPlaygroundById } from "@/lib/actions/playground"
import { BookingCalendar } from "@/components/booking/booking-calendar"
import { TimeSlotPicker } from "@/components/booking/time-slot-picker"
import { BookingSummary } from "@/components/booking/booking-summary"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default async function BookPlaygroundPage({ params }: { params: { id: string } }) {
  const playground = await getPlaygroundById(params.id)

  if (!playground) {
    notFound()
  }

  // Parse JSON strings to arrays
  const images = JSON.parse(playground.images as string) as string[]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4 -ml-4 flex items-center gap-1">
          <Link href={`/playgrounds/${playground.id}`}>
            <ChevronLeft className="h-4 w-4" />
            Back to playground
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Book {playground.name}</h1>
        <p className="text-muted-foreground">
          {playground.address}, {playground.city}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-6 overflow-hidden rounded-xl">
            {images.length > 0 ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                <Image
                  src={images[0] || "/placeholder.svg"}
                  alt={playground.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-muted">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
                <CardDescription>Choose the date for your booking</CardDescription>
              </CardHeader>
              <CardContent>
                <BookingCalendar />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select Time</CardTitle>
                <CardDescription>Choose the time slot for your booking</CardDescription>
              </CardHeader>
              <CardContent>
                <TimeSlotPicker />
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <BookingSummary playground={playground} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
