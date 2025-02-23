"use client"

import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { MediaGrid } from "./media-grid"
import { MediaUploader } from "./media-uploader"
import { MediaToolbar } from "./media-toolbar"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { MediaItem } from "@/lib/media/types"

interface MediaManagerProps {
  initialMedia: MediaItem[]
}

export function MediaManager({ initialMedia }: MediaManagerProps) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia)
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"date" | "name" | "size">("date")
  const [isUploading, setIsUploading] = useState(false)

  const filteredMedia = media.filter((item) => item.filename.toLowerCase().includes(searchQuery.toLowerCase()))

  const sortedMedia = [...filteredMedia].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.filename.localeCompare(b.filename)
      case "size":
        return b.size - a.size
      default:
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    }
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    onDrop: async (acceptedFiles) => {
      setIsUploading(true)
      try {
        const newMedia = await Promise.all(
          acceptedFiles.map(async (file) => {
            const formData = new FormData()
            formData.append("file", file)
            const response = await fetch("/api/media/upload", {
              method: "POST",
              body: formData,
            })
            if (!response.ok) throw new Error("Upload failed")
            return response.json()
          }),
        )
        setMedia((prev) => [...newMedia, ...prev])
        toast.success("Files uploaded successfully")
      } catch (error) {
        toast.error("Failed to upload files")
      } finally {
        setIsUploading(false)
      }
    },
  })

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/media/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Delete failed")
      setMedia((prev) => prev.filter((item) => item.id !== id))
      toast.success("File deleted successfully")
    } catch (error) {
      toast.error("Failed to delete file")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <MediaToolbar view={view} onViewChange={setView} sortBy={sortBy} onSortChange={setSortBy} />
      </div>

      <MediaUploader
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
        isUploading={isUploading}
      />

      <MediaGrid media={sortedMedia} view={view} onDelete={handleDelete} />
    </div>
  )
}

