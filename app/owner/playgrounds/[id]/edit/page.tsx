"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { getPlaygroundById, updatePlayground } from "@/lib/actions/playground"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ImageUploader } from "@/components/playground/image-uploader"
import { egyptianCities } from "@/lib/constants"

export default function EditPlaygroundPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])

  // Form state
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [price, setPrice] = useState("")
  const [sportType, setSportType] = useState("")
  const [amenities, setAmenities] = useState("")
  const [isAvailable, setIsAvailable] = useState(true)

  useEffect(() => {
    const fetchPlayground = async () => {
      try {
        const playground = await getPlaygroundById(params.id)

        if (!playground) {
          toast({
            title: "Playground not found",
            description: "The playground you're trying to edit doesn't exist.",
            variant: "destructive",
          })
          router.push("/owner/playgrounds")
          return
        }

        // Set form values
        setName(playground.name)
        setDescription(playground.description)
        setAddress(playground.address)
        setCity(playground.city)
        setState(playground.state)
        setZipCode(playground.zipCode)
        setPrice(playground.price.toString())
        setSportType(playground.sportType)
        setAmenities(JSON.parse(playground.amenities).join(", "))
        setIsAvailable(playground.isAvailable)
        setImages(JSON.parse(playground.images))
      } catch (error) {
        console.error("Error fetching playground:", error)
        toast({
          title: "Error",
          description: "Failed to load playground details.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayground()
  }, [params.id, router, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)

    try {
      // Validate form
      if (!name || !description || !address || !city || !state || !zipCode || !price || !sportType) {
        throw new Error("Please fill in all required fields")
      }

      // Parse amenities
      const amenitiesList = amenities
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item)

      // Update playground
      await updatePlayground(params.id, {
        name,
        description,
        address,
        city,
        state,
        zipCode,
        price: Number.parseFloat(price),
        images,
        sportType,
        amenities: amenitiesList,
        isAvailable,
      })

      toast({
        title: "Playground updated",
        description: "Your playground has been successfully updated.",
      })

      // Redirect to playgrounds list
      router.push("/owner/playgrounds")
    } catch (error) {
      console.error("Error updating playground:", error)
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update playground",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const sportTypes = ["Football", "Basketball", "Tennis", "Volleyball", "Cricket", "Baseball", "Swimming"]

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit Playground</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Playground Information</CardTitle>
            <CardDescription>Update the details of your playground</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Playground Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isSubmitting}
                required
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sportType">Sport Type *</Label>
              <Select value={sportType} onValueChange={setSportType} disabled={isSubmitting} required>
                <SelectTrigger id="sportType">
                  <SelectValue placeholder="Select sport type" />
                </SelectTrigger>
                <SelectContent>
                  {sportTypes.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Select value={city} onValueChange={setCity} disabled={isSubmitting} required>
                  <SelectTrigger id="city">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {egyptianCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Governorate *</Label>
                <Input
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">Postal Code *</Label>
                <Input
                  id="zipCode"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Hour (EGP) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amenities">Amenities (comma-separated)</Label>
              <Input
                id="amenities"
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
                disabled={isSubmitting}
                placeholder="Showers, Lockers, Water Fountains"
              />
              <p className="text-xs text-muted-foreground">Enter amenities separated by commas</p>
            </div>

            <div className="space-y-2">
              <Label>Playground Images</Label>
              <ImageUploader images={images} setImages={setImages} disabled={isSubmitting} />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isAvailable" checked={isAvailable} onCheckedChange={setIsAvailable} disabled={isSubmitting} />
              <Label htmlFor="isAvailable">Playground is available for booking</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/owner/playgrounds")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Playground"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
