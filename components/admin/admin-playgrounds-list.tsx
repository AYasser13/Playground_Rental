"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Playground } from "@/types"
import { togglePlaygroundAvailability, deletePlayground } from "@/lib/actions/playground"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Trash } from "lucide-react"
import Link from "next/link"

interface AdminPlaygroundsListProps {
  playgrounds: Playground[]
}

export function AdminPlaygroundsList({ playgrounds }: AdminPlaygroundsListProps) {
  const [selectedPlayground, setSelectedPlayground] = useState<Playground | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTogglingAvailability, setIsTogglingAvailability] = useState(false)
  const { toast } = useToast()

  const handleToggleAvailability = async (playground: Playground) => {
    setIsTogglingAvailability(true)

    try {
      await togglePlaygroundAvailability(playground.id)

      // Update the playground availability in the UI
      playground.isAvailable = !playground.isAvailable

      toast({
        title: "Availability updated",
        description: `${playground.name} is now ${playground.isAvailable ? "available" : "unavailable"} for booking.`,
      })
    } catch (error) {
      console.error("Error toggling availability:", error)
      toast({
        title: "Update failed",
        description: "Failed to update playground availability.",
        variant: "destructive",
      })
    } finally {
      setIsTogglingAvailability(false)
    }
  }

  const handleDeletePlayground = async () => {
    if (!selectedPlayground) return

    setIsDeleting(true)

    try {
      await deletePlayground(selectedPlayground.id)

      toast({
        title: "Playground deleted",
        description: "The playground has been successfully deleted.",
      })

      // Remove the playground from the UI
      playgrounds = playgrounds.filter((p) => p.id !== selectedPlayground.id)
    } catch (error) {
      console.error("Error deleting playground:", error)
      toast({
        title: "Deletion failed",
        description: "Failed to delete playground.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setSelectedPlayground(null)
    }
  }

  if (playgrounds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">No playgrounds found</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Sport Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {playgrounds.map((playground) => (
              <TableRow key={playground.id}>
                <TableCell className="font-medium">
                  <Link href={`/playgrounds/${playground.id}`} className="hover:underline">
                    {playground.name}
                  </Link>
                </TableCell>
                <TableCell>{playground.owner?.name || "Unknown"}</TableCell>
                <TableCell>{playground.sportType}</TableCell>
                <TableCell>
                  {playground.city}, {playground.state}
                </TableCell>
                <TableCell>{formatCurrency(playground.price)}/hr</TableCell>
                <TableCell>
                  <Badge variant={playground.isAvailable ? "default" : "secondary"}>
                    {playground.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(playground.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleAvailability(playground)}
                      disabled={isTogglingAvailability}
                    >
                      {playground.isAvailable ? "Set Unavailable" : "Set Available"}
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setSelectedPlayground(playground)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedPlayground} onOpenChange={(open) => !open && setSelectedPlayground(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Playground</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this playground? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {selectedPlayground && (
            <div className="space-y-2 py-4">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{selectedPlayground.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Sport Type:</span>
                <span>{selectedPlayground.sportType}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Location:</span>
                <span>
                  {selectedPlayground.city}, {selectedPlayground.state}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPlayground(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePlayground} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Playground"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
