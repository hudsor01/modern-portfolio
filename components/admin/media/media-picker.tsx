"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ImageIcon, X } from "lucide-react"
import { MediaGrid } from "./media-grid"
import { useQuery } from "@tanstack/react-query"

interface MediaPickerProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
}

async function getMedia() {
  const response = await fetch("/api/media")
  if (!response.ok) throw new Error("Failed to fetch media")
  return response.json()
}

export function MediaPicker({ value, onChange, disabled }: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const {
    data: media,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["media"],
    queryFn: getMedia,
  })

  const handleSelect = (url: string) => {
    onChange(url)
    setIsOpen(false)
  }

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative">
          <Card className="overflow-hidden">
            <div className="aspect-video relative">
              <Image src={value || "/placeholder.svg"} alt="Selected image" fill className="object-cover" />
            </div>
          </Card>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => onChange("")}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" className="w-full" disabled={disabled}>
              <ImageIcon className="mr-2 h-4 w-4" />
              Choose Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Choose Image</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">Failed to load media</div>
              ) : (
                <MediaGrid media={media} view="grid" onSelect={handleSelect} selectable />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

