import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-4xl font-bold">About PlayRental</h1>

        <div className="mb-12 space-y-6">
          <p className="text-lg text-muted-foreground">
            PlayRental is a platform that connects sports enthusiasts with playground owners, making it easy to find and
            book sports facilities for your next game or practice session.
          </p>

          <p className="text-lg text-muted-foreground">
            Our mission is to make sports more accessible to everyone by simplifying the process of finding and booking
            playgrounds, while also helping playground owners maximize the use of their facilities.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Our Story</h2>
          <p className="mb-4 text-muted-foreground">
            PlayRental was founded in 2023 by a group of sports enthusiasts who were frustrated with the difficulty of
            finding and booking sports facilities. We realized that there was a need for a platform that would make it
            easy for players to find and book playgrounds, and for playground owners to manage their facilities and
            bookings.
          </p>
          <p className="text-muted-foreground">
            Since then, we've been working hard to build a platform that meets the needs of both players and playground
            owners, with a focus on simplicity, reliability, and excellent customer service.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Our Team</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <div className="mb-4 h-24 w-24 overflow-hidden rounded-full bg-muted">
                <img
                  src="/placeholder.svg?height=96&width=96"
                  alt="Team Member"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mb-1 text-lg font-semibold">John Doe</h3>
              <p className="mb-2 text-sm text-muted-foreground">CEO & Founder</p>
              <p className="text-sm text-muted-foreground">
                Sports enthusiast and tech entrepreneur with a passion for making sports more accessible.
              </p>
            </div>
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <div className="mb-4 h-24 w-24 overflow-hidden rounded-full bg-muted">
                <img
                  src="/placeholder.svg?height=96&width=96"
                  alt="Team Member"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mb-1 text-lg font-semibold">Jane Smith</h3>
              <p className="mb-2 text-sm text-muted-foreground">CTO</p>
              <p className="text-sm text-muted-foreground">
                Tech wizard with a background in sports management and a love for building user-friendly platforms.
              </p>
            </div>
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <div className="mb-4 h-24 w-24 overflow-hidden rounded-full bg-muted">
                <img
                  src="/placeholder.svg?height=96&width=96"
                  alt="Team Member"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mb-1 text-lg font-semibold">Mike Johnson</h3>
              <p className="mb-2 text-sm text-muted-foreground">Head of Operations</p>
              <p className="text-sm text-muted-foreground">
                Former professional athlete with a keen eye for operational excellence and customer satisfaction.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold">Join Our Community</h2>
          <p className="mb-6 text-muted-foreground">
            Whether you're a player looking for a place to play or a playground owner looking to maximize the use of
            your facilities, we'd love to have you join our community.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/register">Sign Up as a Player</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register?role=OWNER">List Your Playground</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
