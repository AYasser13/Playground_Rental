"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createPlayground } from "@/lib/actions/playground"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUploader } from "@/components/playground/image-uploader"
import { egyptianCities } from "@/lib/constants"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function NewPlaygroundPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate form
      if (!name || !description || !address || !city || !state || !zipCode || !price || !sportType) {
        throw new Error("Please fill in all required fields")
      }

      // Validate images
      if (images.length === 0) {
        throw new Error("Please upload at least one image of your playground")
      }

      if (images.length > 10) {
        throw new Error("You can upload a maximum of 10 images")
      }

      // Parse amenities
      const amenitiesList = amenities
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item)

      // Create playground
      const playground = await createPlayground({
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
      })

      toast({
        title: "Playground created",
        description: "Your playground has been successfully created.",
      })

      // Redirect to playground page
      router.push(`/owner/playgrounds`)
    } catch (error) {
      console.error("Error creating playground:", error)
      setError(error instanceof Error ? error.message : "Failed to create playground")
      toast({
        title: "Creation failed",
        description: error instanceof Error ? error.message : "Failed to create playground",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const sportTypes = ["Football", "Basketball", "Tennis", "Volleyball", "Cricket", "Baseball", "Swimming"]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New Playground</h1>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Playground Information</CardTitle>
            <CardDescription>Enter the details of your playground</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

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
              <Label>Playground Images * (Maximum 10 images)</Label>
              <ImageUploader images={images} setImages={setImages} disabled={isSubmitting} />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Playground"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
