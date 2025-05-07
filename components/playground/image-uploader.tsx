"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Upload, ImageIcon } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"

interface ImageUploaderProps {
  images: string[]
  setImages: (images: string[]) => void
  disabled?: boolean
}

export function ImageUploader({ images, setImages, disabled = false }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const MAX_IMAGE_DIMENSION = 1200 // Maximum width or height in pixels

  const optimizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        reject(new Error(`${file.name} exceeds the 5MB limit.`))
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        if (!event.target?.result) {
          reject(new Error(`Failed to read ${file.name}.`))
          return
        }

        const img = new Image()
        img.onload = () => {
          // Determine if resizing is needed
          let width = img.width
          let height = img.height
          const needsResize = width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION

          if (!needsResize) {
            // If no resizing needed, return the original data
            resolve(event.target.result as string)
            return
          }

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            height = Math.round((height * MAX_IMAGE_DIMENSION) / width)
            width = MAX_IMAGE_DIMENSION
          } else {
            width = Math.round((width * MAX_IMAGE_DIMENSION) / height)
            height = MAX_IMAGE_DIMENSION
          }

          // Create canvas for resizing
          const canvas = document.createElement("canvas")
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")

          if (!ctx) {
            reject(new Error("Could not get canvas context"))
            return
          }

          // Draw image at new size
          ctx.drawImage(img, 0, 0, width, height)

          // Get the resized image as base64
          const quality = 0.85 // Adjust quality for JPEG compression
          const optimizedDataUrl = canvas.toDataURL("image/jpeg", quality)
          resolve(optimizedDataUrl)
        }

        img.onerror = () => {
          reject(new Error(`Failed to load image ${file.name}.`))
        }

        img.src = event.target.result as string
      }

      reader.onerror = () => {
        reject(new Error(`Failed to read ${file.name}.`))
      }

      reader.readAsDataURL(file)
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setIsUploading(true)

    const newImages: string[] = []
    const filePromises = Array.from(e.target.files).map((file) => {
      return optimizeImage(file)
        .then((optimizedImage) => {
          newImages.push(optimizedImage)
        })
        .catch((error) => {
          toast({
            title: "Upload failed",
            description: error.message,
            variant: "destructive",
          })
        })
    })

    Promise.all(filePromises)
      .then(() => {
        if (newImages.length > 0) {
          setImages([...images, ...newImages])
        }
      })
      .catch((error) => {
        console.error("Error uploading images:", error)
        toast({
          title: "Upload failed",
          description: "There was an error uploading your images.",
          variant: "destructive",
        })
      })
      .finally(() => {
        setIsUploading(false)
        // Clear the input value to allow uploading the same file again
        if (e.target) {
          e.target.value = ""
        }
      })
  }

  const removeImage = (index: number) => {
    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    setImages(updatedImages)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-video rounded-md border bg-muted">
            <Image
              src={image || "/placeholder.svg"}
              alt={`Playground image ${index + 1}`}
              fill
              className="rounded-md object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-1 top-1 h-6 w-6"
              onClick={() => removeImage(index)}
              disabled={disabled}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {images.length === 0 && (
          <div className="flex aspect-video items-center justify-center rounded-md border bg-muted">
            <div className="flex flex-col items-center text-muted-foreground">
              <ImageIcon className="mb-2 h-8 w-8" />
              <span className="text-xs">No images</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          disabled={disabled || isUploading}
          className="hidden"
          id="image-upload"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("image-upload")?.click()}
          disabled={disabled || isUploading}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload Images"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Upload images of your playground. Images will be automatically optimized. Maximum file size: 5MB.
      </p>
    </div>
  )
}
