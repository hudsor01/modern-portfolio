"use client"

import * as React from "react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { UploadCloud, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/actions/upload"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function ImageUpload({ value, onChange, disabled, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false)

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true)
        const file = acceptedFiles[0]
        const imageUrl = await uploadImage(file)
        onChange(imageUrl)
      } catch (error) {
        console.error("Failed to upload image:", error)
      } finally {
        setIsUploading(false)
      }
    },
    [onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    disabled: disabled || isUploading,
    maxFiles: 1,
  })

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-4 transition-colors",
          isDragActive && "border-primary/50 bg-primary/5",
          disabled && "cursor-not-allowed opacity-60",
          value && "border-none p-0",
        )}
      >
        <input {...getInputProps()} />
        {value ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <Image src={value || "/placeholder.svg"} alt="Upload preview" fill className="object-cover" />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange("")
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <UploadCloud className="mb-4 h-8 w-8 text-muted-foreground" />
            <p className="mb-2 text-sm font-medium">
              {isDragActive ? "Drop the image here" : "Drag & drop an image here"}
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  )
}

