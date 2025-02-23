"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye, Smartphone, Tablet, Monitor } from "lucide-react"

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  content: React.ReactNode
  title: string
}

export function PreviewModal({ isOpen, onClose, content, title }: PreviewModalProps) {
  const [device, setDevice] = React.useState<"mobile" | "tablet" | "desktop">("desktop")

  const deviceStyles = {
    mobile: "w-[375px]",
    tablet: "w-[768px]",
    desktop: "w-[1280px]",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Preview: {title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={device === "mobile" ? "default" : "outline"}
                size="icon"
                onClick={() => setDevice("mobile")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
              <Button
                variant={device === "tablet" ? "default" : "outline"}
                size="icon"
                onClick={() => setDevice("tablet")}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={device === "desktop" ? "default" : "outline"}
                size="icon"
                onClick={() => setDevice("desktop")}
              >
                <Monitor className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 flex justify-center overflow-auto">
          <div className={`${deviceStyles[device]} rounded-lg border`}>
            <div className="h-[calc(100vh-12rem)] overflow-auto bg-background">{content}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

