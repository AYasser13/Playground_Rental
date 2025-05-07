import { Button } from "@/components/ui/button"
import { PlaygroundCard } from "@/components/playground/playground-card"
import { SearchFilters } from "@/components/playground/search-filters"
import Link from "next/link"
import { getPlaygrounds } from "@/lib/data/playground"

export default async function Home() {
  const playgrounds = await getPlaygrounds()

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 rounded-2xl bg-gradient-to-r from-primary to-accent p-8 text-white shadow-xl">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Find and Book Your Perfect Playground</h1>
          <p className="mb-6 text-lg md:text-xl">
            Browse through hundreds of sports facilities and book your next game in minutes
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="bg-white text-primary hover:bg-gray-100">
              <Link href="/playgrounds">Browse Playgrounds</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
              <Link href="/register?role=OWNER">List Your Playground</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Featured Playgrounds</h2>
          <Link href="/playgrounds" className="text-primary hover:underline dark:text-primary">
            View all
          </Link>
        </div>
        <SearchFilters />
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playgrounds.map((playground) => (
            <PlaygroundCard key={playground.id} playground={playground} />
          ))}
        </div>
      </section>

      <section className="mb-12 rounded-2xl bg-muted p-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold">How It Works</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-background p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                1
              </div>
              <h3 className="mb-2 text-xl font-semibold">Find a Playground</h3>
              <p className="text-muted-foreground">Search for playgrounds by location, sport type, or availability</p>
            </div>
            <div className="rounded-xl bg-background p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                2
              </div>
              <h3 className="mb-2 text-xl font-semibold">Book a Time Slot</h3>
              <p className="text-muted-foreground">Select your preferred date and time, and make a secure payment</p>
            </div>
            <div className="rounded-xl bg-background p-6 shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                3
              </div>
              <h3 className="mb-2 text-xl font-semibold">Play & Enjoy</h3>
              <p className="text-muted-foreground">Receive confirmation and enjoy your game at the booked facility</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
