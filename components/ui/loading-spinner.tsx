"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ size = "md", className, ...props }: LoadingSpinnerProps) {
  return (
    <div role="status" aria-label="Loading" className={cn("flex items-center justify-center", className)} {...props}>
      <Loader2
        className={cn("animate-spin", {
          "h-4 w-4": size === "sm",
          "h-6 w-6": size === "md",
          "h-8 w-8": size === "lg",
        })}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

