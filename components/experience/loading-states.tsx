"use client"

import type * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <Loader2 className={cn("animate-spin text-muted-foreground", sizeClasses[size])} />
    </div>
  )
}

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: React.ReactNode
}

export function LoadingButton({ loading, children, disabled, ...props }: LoadingButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn("inline-flex items-center justify-center", loading && "cursor-wait opacity-50")}
      {...props}
    >
      {loading && <Spinner size="sm" className="mr-2" />}
      {children}
    </button>
  )
}

interface LoadingPageProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoadingPage({ className, ...props }: LoadingPageProps) {
  return (
    <div className={cn("flex min-h-[400px] flex-col items-center justify-center gap-2", className)} {...props}>
      <Spinner size="lg" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  )
}

