import type React from "react"
import { cn } from "@/lib/utils"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
  className?: string
}

export function DashboardHeader({ heading, text, children, className }: DashboardHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 px-2", className)}>
      <div className="grid gap-1">
        <h1 className="font-playfair text-3xl font-bold tracking-tight md:text-4xl">{heading}</h1>
        {text && <p className="font-roboto text-lg text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  )
}

