'use client'

import * as React from "react"
import { CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Newsletter Signup Component
interface NewsletterSignupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  onSubscribe?: (email: string) => Promise<void>
  compact?: boolean
}

export const NewsletterSignup = React.forwardRef<HTMLDivElement, NewsletterSignupProps>(
  ({ 
    className, 
    title = "Subscribe to our newsletter",
    description = "Get the latest articles and insights delivered to your inbox.",
    onSubscribe,
    compact = false,
    ...props 
  }, ref) => {
    const [email, setEmail] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [isSubscribed, setIsSubscribed] = React.useState(false)
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!email || !onSubscribe) return
      
      setIsLoading(true)
      try {
        await onSubscribe(email)
        setIsSubscribed(true)
        setEmail("")
      } catch (error) {
        console.error("Subscription failed:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (isSubscribed) {
      return (
        <div
          ref={ref}
          className={cn(
            "rounded-lg border bg-muted/30 p-6 text-center my-8",
            compact && "p-4",
            className
          )}
          {...props}
        >
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="font-semibold text-foreground mb-1">
            Thanks for subscribing!
          </h3>
          <p className="text-sm text-muted-foreground">
            You'll receive our latest articles in your inbox.
          </p>
        </div>
      )
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-gradient-to-br from-primary/5 to-primary/10 p-6 my-8",
          compact && "p-4",
          className
        )}
        {...props}
      >
        <div className={cn("text-center", compact ? "space-y-2" : "space-y-3")}>
          <h3 className={cn(
            "font-semibold text-foreground",
            compact ? "text-base" : "text-lg"
          )}>
            {title}
          </h3>
          <p className={cn(
            "text-muted-foreground",
            compact ? "text-sm" : "text-base"
          )}>
            {description}
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                compact && "py-1.5 text-xs"
              )}
              required
            />
            <button
              type="submit"
              disabled={isLoading || !email}
              className={cn(
                "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
                "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20",
                "disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                compact && "px-3 py-1.5 text-xs"
              )}
            >
              {isLoading ? "..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    )
  }
)
NewsletterSignup.displayName = "NewsletterSignup"