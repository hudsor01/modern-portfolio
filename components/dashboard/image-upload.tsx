"use client"

import * as React from "react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"
import { UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { uploadImage } from "@/lib/actions/upload"

interface ImageUploadProps {
  value?: string
  onChange?: (url: string) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false)

  const onDrop = React.useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setIsUploading(true)
        const file = acceptedFiles[0]
        const url = await uploadImage(file)
        onChange?.(url)
      } catch (error) {
        console.error("Error uploading image:", error)
      } finally {
        setIsUploading(false)
      }
    },
    [onChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    disabled: disabled || isUploading,
    multiple: false,
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border border-dashed p-6 transition-colors",
          isDragActive ? "border-primary/50 bg-primary/5" : "border-muted-foreground/25",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <input {...getInputProps()} />
        {value ? (
          <div className="relative h-48 w-full">
            <Image src={value || "/placeholder.svg"} alt="Upload preview" fill className="rounded-lg object-cover" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <div className="text-sm font-medium">
              {isUploading ? (
                <span className="text-muted-foreground">Uploading...</span>
              ) : (
                <span className="text-primary">
                  Drop your image here, or <span className="text-primary underline">browse</span>
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">PNG, JPG or GIF, up to 10MB</div>
          </div>
        )}
      </div>
      {value && !disabled && (
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => onChange?.("")}>
          Remove Image
        </Button>
      )}
    </div>
  )
}

