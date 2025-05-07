import { getUserBookings } from "@/lib/actions/booking"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function UserBookingsPage() {
  const bookings = await getUserBookings()

  // Group bookings by status
  const upcomingBookings = bookings.filter(
    (booking) => booking.status === "CONFIRMED" && new Date(booking.date) >= new Date(),
  )
  const pendingBookings = bookings.filter((booking) => booking.status === "PENDING")
  const pastBookings = bookings.filter(
    (booking) => booking.status === "CONFIRMED" && new Date(booking.date) < new Date(),
  )
  const cancelledBookings = bookings.filter((booking) => booking.status === "CANCELLED")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">My Bookings</h1>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingBookings.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingBookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <EmptyState message="You don't have any upcoming bookings" />
          )}
        </TabsContent>

        <TabsContent value="pending">
          {pendingBookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pendingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <EmptyState message="You don't have any pending bookings" />
          )}
        </TabsContent>

        <TabsContent value="past">
          {pastBookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pastBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <EmptyState message="You don't have any past bookings" />
          )}
        </TabsContent>

        <TabsContent value="cancelled">
          {cancelledBookings.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cancelledBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <EmptyState message="You don't have any cancelled bookings" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BookingCard({ booking }: { booking: any }) {
  // Parse images from JSON string
  const images = JSON.parse(booking.playground.images as string) as string[]

  // Format date and time
  const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-500"
      case "PENDING":
        return "bg-yellow-500"
      case "CANCELLED":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <div className="relative">
        <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
          {images.length > 0 ? (
            <Image
              src={images[0] || "/placeholder.svg"}
              alt={booking.playground.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center bg-muted">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}
        </div>
        <Badge className={`absolute right-2 top-2 ${getStatusColor(booking.status)}`} variant="secondary">
          {booking.status}
        </Badge>
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{booking.playground.name}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {booking.playground.city}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-primary" />
            <span>
              {booking.startTime} - {booking.endTime}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="font-medium">{booking.totalPrice} EGP</p>
          </div>
          <Button asChild size="sm">
            <Link href={`/dashboard/bookings/${booking.id}`}>View Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border bg-card p-8 text-center">
      <h2 className="mb-2 text-xl font-semibold">No Bookings Found</h2>
      <p className="mb-6 text-muted-foreground">{message}</p>
      <Button asChild>
        <Link href="/playgrounds">Browse Playgrounds</Link>
      </Button>
    </div>
  )
}
