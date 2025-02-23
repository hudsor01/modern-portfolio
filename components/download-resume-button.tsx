"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"
import { toast } from "react-hot-toast"

export function DownloadResumeButton() {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      const response = await fetch("/api/download-resume")

      if (!response.ok) throw new Error("Download failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "richard-hudson-resume.pdf"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("Resume downloaded successfully!")
    } catch (error) {
      toast.error("Failed to download resume")
      console.error("Download error:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={isDownloading} className="bg-primary hover:bg-primary/90">
      <Download className="mr-2 h-4 w-4" />
      {isDownloading ? "Downloading..." : "Download Resume"}
    </Button>
  )
}

