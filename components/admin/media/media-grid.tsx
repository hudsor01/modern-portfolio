"use client"

import { useState } from "react"
import Image from "next/image"
import { Trash2, Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import type { MediaFile } from "@/lib/media/types"
import { formatBytes, formatDate } from "@/lib/utils"

interface MediaGridProps {
  files: MediaFile[]
  onDelete?: (id: string) => void
  onSelect?: (file: MediaFile) => void
  selectable?: boolean
}

export function MediaGrid({ files, onDelete, onSelect, selectable = false }: MediaGridProps) {
  const [selectedId, setSelectedId] = useState<string>()

  const handleSelect = (file: MediaFile) => {
    setSelectedId(file.id)
    onSelect?.(file)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <Card
          key={file.id}
          className={`
            overflow-hidden
            ${selectedId === file.id ? "ring-2 ring-primary" : ""}
            ${selectable ? "cursor-pointer" : ""}
          `}
          onClick={() => selectable && handleSelect(file)}
        >
          <CardHeader className="p-0">
            {file.type.startsWith("image/") ? (
              <div className="relative aspect-video">
                <Image src={file.url || "/placeholder.svg"} alt={file.filename} fill className="object-cover" />
              </div>
            ) : (
              <div className="aspect-video bg-muted flex items-center justify-center">
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </CardHeader>

          <CardContent className="p-4">
            <p className="font-medium truncate" title={file.filename}>
              {file.filename}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatBytes(file.size)} • {formatDate(file.uploadedAt)}
            </p>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex justify-between">
            <Button variant="ghost" size="icon" onClick={() => window.open(file.url, "_blank")}>
              <Download className="h-4 w-4" />
            </Button>

            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(file.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

