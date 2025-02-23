"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export function DownloadResumeButton() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<{
    message: string
    code: string
    details?: any
  } | null>(null)

  const handleDownload = async () => {
    setIsDownloading(true)
    setError(null)

    try {
      const response = await fetch("/api/resume/download")

      if (!response.ok) {
        const errorData = await response.json()
        throw errorData
      }

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
    } catch (error: any) {
      console.error("Download error:", error)
      setError(
        error.error || {
          message: "Failed to download resume",
          code: "UNKNOWN_ERROR",
        },
      )
      toast.error("Failed to download resume")
    } finally {
      setIsDownloading(false)
    }
  }

  const getErrorMessage = (code: string) => {
    switch (code) {
      case "RESUME_DATABASE_ERROR":
        return "We're having trouble with our systems. Please try again later."
      case "RESUME_PDF_GENERATION_ERROR":
        return "Failed to generate the PDF. Please try again."
      case "RESUME_BROWSER_ERROR":
        return "Failed to initialize the download. Please try again."
      case "RESUME_NAVIGATION_ERROR":
        return "Failed to load resume content. Please check your connection and try again."
      case "RESUME_RENDER_ERROR":
        return "Failed to prepare the resume for download. Please try again."
      default:
        return "An unexpected error occurred. Please try again later."
    }
  }

  return (
    <>
      <Button onClick={handleDownload} disabled={isDownloading} className="bg-primary hover:bg-primary/90">
        <Download className="mr-2 h-4 w-4" />
        {isDownloading ? "Downloading..." : "Download Resume"}
      </Button>

      <Dialog open={!!error} onOpenChange={() => setError(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Error</DialogTitle>
            <DialogDescription className="space-y-4">
              <p>{error && getErrorMessage(error.code)}</p>
              <p className="text-sm text-muted-foreground">If this problem persists, please contact support.</p>
              {process.env.NODE_ENV === "development" && error?.details && (
                <pre className="mt-4 p-4 bg-muted rounded-md overflow-auto text-xs">
                  {JSON.stringify(error.details, null, 2)}
                </pre>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

