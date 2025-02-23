"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import type { MediaFile } from "@/lib/media/types"

interface MediaUploaderProps {
  onUploadComplete?: (file: MediaFile) => void
  maxSize?: number // in bytes
  acceptedTypes?: string[]
}

export function MediaUploader({
  onUploadComplete,
  maxSize = 5 * 1024 * 1024, // 5MB
  acceptedTypes = ["image/*", "application/pdf"],
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setUploading(true)
      setProgress(0)

      try {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const data = await response.json()

        if (data.success && data.file) {
          toast.success("File uploaded successfully")
          onUploadComplete?.(data.file)
        } else {
          throw new Error(data.error || "Upload failed")
        }
      } catch (error) {
        toast.error("Failed to upload file")
        console.error("Upload error:", error)
      } finally {
        setUploading(false)
        setProgress(0)
      }
    },
    [onUploadComplete],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple: false,
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200
        ${isDragActive ? "border-primary bg-primary/5" : "border-border"}
        ${uploading ? "pointer-events-none opacity-50" : ""}
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-2">
        <Upload className="h-8 w-8 text-muted-foreground" />

        <div className="text-sm text-muted-foreground">
          {isDragActive ? <p>Drop the file here</p> : <p>Drag & drop a file here, or click to select</p>}
        </div>

        {uploading && (
          <div className="w-full max-w-xs mt-4">
            <Progress value={progress} className="h-1" />
          </div>
        )}
      </div>
    </div>
  )
}

