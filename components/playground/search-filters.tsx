"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { egyptianCities, sportTypes } from "@/lib/constants"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, Search } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [city, setCity] = useState(searchParams.get("city") || "")
  const [sportType, setSportType] = useState(searchParams.get("sportType") || "")
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice") || 0),
    Number(searchParams.get("maxPrice") || 500),
  ])
  const [isAvailable, setIsAvailable] = useState(searchParams.get("isAvailable") !== "false")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    if (city && city !== "all") params.append("city", city)
    if (sportType && sportType !== "all") params.append("sportType", sportType)
    params.append("minPrice", priceRange[0].toString())
    params.append("maxPrice", priceRange[1].toString())
    params.append("isAvailable", isAvailable.toString())

    router.push(`/playgrounds?${params.toString()}`)
  }

  const handleReset = () => {
    setSearch("")
    setCity("")
    setSportType("")
    setPriceRange([0, 500])
    setIsAvailable(true)
    router.push("/playgrounds")
  }

  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-x-4 md:space-y-0">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search playgrounds..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch()
                }
              }}
            />
          </div>
        </div>
        <div className="hidden md:flex md:space-x-2">
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {egyptianCities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sportType} onValueChange={setSportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sport type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {sportTypes.map((sport) => (
                <SelectItem key={sport} value={sport}>
                  {sport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Playgrounds</SheetTitle>
                <SheetDescription>Adjust filters to find your perfect playground</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">City</Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {egyptianCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sport Type</Label>
                  <Select value={sportType} onValueChange={setSportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sport type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sports</SelectItem>
                      {sportTypes.map((sport) => (
                        <SelectItem key={sport} value={sport}>
                          {sport}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Price Range: {priceRange[0]} - {priceRange[1]} EGP
                  </Label>
                  <Slider
                    defaultValue={[0, 500]}
                    max={1000}
                    step={50}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                </div>
                <Button onClick={handleSearch} className="w-full">
                  Apply Filters
                </Button>
                <Button onClick={handleReset} variant="outline" className="w-full">
                  Reset Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <Button onClick={handleSearch}>Search</Button>
          <Button onClick={handleReset} variant="outline" className="hidden md:inline-flex">
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
