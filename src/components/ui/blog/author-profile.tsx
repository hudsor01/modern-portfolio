import * as React from "react"
import Image from "next/image"
import { Calendar, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

// Author Profile Component
interface AuthorProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  bio?: string
  avatar?: string
  href?: string
  publishedAt?: Date
  readingTime?: number
  compact?: boolean
}

export const AuthorProfile = React.forwardRef<HTMLDivElement, AuthorProfileProps>(
  ({ 
    className, 
    name, 
    bio, 
    avatar, 
    href, 
    publishedAt, 
    readingTime,
    compact = false,
    ...props 
  }, ref) => {
    const Wrapper = href ? "a" : "div"
    const wrapperProps = href ? { href, className: "block hover:opacity-80 transition-opacity" } : {}
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3",
          !compact && "flex-col sm:flex-row sm:justify-between",
          className
        )}
        {...props}
      >
        <Wrapper {...wrapperProps}>
          <div className="flex items-center gap-3">
            {avatar && (
              <Image
                src={avatar}
                alt={`${name}'s avatar`}
                width={compact ? 32 : 40}
                height={compact ? 32 : 40}
                className={cn(
                  "rounded-full object-cover",
                  compact ? "h-8 w-8" : "h-10 w-10"
                )}
              />
            )}
            <div className="flex-1 min-w-0">
              <p className={cn(
                "font-medium text-foreground",
                compact ? "text-sm" : "text-base"
              )}>
                {name}
              </p>
              {bio && !compact && (
                <p className="text-sm text-muted-foreground truncate">
                  {bio}
                </p>
              )}
            </div>
          </div>
        </Wrapper>
        
        {(publishedAt || readingTime) && (
          <div className={cn(
            "flex items-center gap-4 text-sm text-muted-foreground",
            compact && "text-xs"
          )}>
            {publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className={cn(compact ? "h-3 w-3" : "h-4 w-4")} />
                <time dateTime={publishedAt.toISOString()}>
                  {publishedAt.toLocaleDateString()}
                </time>
              </div>
            )}
            {readingTime && (
              <div className="flex items-center gap-1">
                <Clock className={cn(compact ? "h-3 w-3" : "h-4 w-4")} />
                <span>{readingTime} min read</span>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }
)
AuthorProfile.displayName = "AuthorProfile"