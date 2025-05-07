import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"

interface PlaygroundAmenitiesProps {
  amenities: string[]
}

export function PlaygroundAmenities({ amenities }: PlaygroundAmenitiesProps) {
  // If amenities is not an array or is empty, show a message
  if (!Array.isArray(amenities) || amenities.length === 0) {
    return (
      <div>
        <h2 className="mb-4 text-xl font-semibold">Amenities</h2>
        <p className="text-muted-foreground">No amenities listed for this playground.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Amenities</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {amenities.map((amenity, index) => (
          <Card key={index} className="border-primary/20">
            <CardContent className="flex items-center gap-2 p-4">
              <Check className="h-5 w-5 text-primary" />
              <span>{amenity}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
