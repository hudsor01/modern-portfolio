import type React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

export function Loader({ size = "md", className, ...props }: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <Loader2
        className={cn("animate-spin", {
          "h-4 w-4": size === "sm",
          "h-6 w-6": size === "md",
          "h-8 w-8": size === "lg",
        })}
      />
    </div>
  )
}

