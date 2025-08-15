import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import Image from "next/image"
import { Calendar, Clock, AlertTriangle, Info, CheckCircle, XCircle, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

// Callout/Alert Component for important content
const calloutVariants = cva(
  [
    "rounded-lg border p-4 my-6",
    "[&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
    "relative",
  ],
  {
    variants: {
      variant: {
        info: [
          "border-blue-200 bg-blue-50 text-blue-800",
          "dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
          "[&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
        ],
        warning: [
          "border-yellow-200 bg-yellow-50 text-yellow-800",
          "dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
          "[&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400",
        ],
        error: [
          "border-red-200 bg-red-50 text-red-800",
          "dark:border-red-800 dark:bg-red-950 dark:text-red-200",
          "[&>svg]:text-red-600 dark:[&>svg]:text-red-400",
        ],
        success: [
          "border-green-200 bg-green-50 text-green-800",
          "dark:border-green-800 dark:bg-green-950 dark:text-green-200",
          "[&>svg]:text-green-600 dark:[&>svg]:text-green-400",
        ],
        tip: [
          "border-purple-200 bg-purple-50 text-purple-800",
          "dark:border-purple-800 dark:bg-purple-950 dark:text-purple-200",
          "[&>svg]:text-purple-600 dark:[&>svg]:text-purple-400",
        ],
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

const calloutIcons = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle,
  tip: Lightbulb,
} as const

interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calloutVariants> {
  title?: string
}

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, variant = "info", title, children, ...props }, ref) => {
    const Icon = variant ? calloutIcons[variant] : calloutIcons.info
    
    return (
      <div
        ref={ref}
        className={cn(calloutVariants({ variant }), className)}
        role="alert"
        {...props}
      >
        <Icon className="h-4 w-4" />
        <div>
          {title && (
            <h5 className="mb-2 font-medium leading-none tracking-tight">
              {title}
            </h5>
          )}
          <div className="text-sm [&_p]:leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Callout.displayName = "Callout"

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

const AuthorProfile = React.forwardRef<HTMLDivElement, AuthorProfileProps>(
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

// Image Gallery Component
interface ImageGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  images: Array<{
    src: string
    alt: string
    caption?: string
  }>
  columns?: 1 | 2 | 3 | 4
  aspectRatio?: "square" | "landscape" | "portrait"
}

const ImageGallery = React.forwardRef<HTMLDivElement, ImageGalleryProps>(
  ({ className, images, columns = 2, aspectRatio = "landscape", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "grid gap-4 my-8",
          columns === 1 && "grid-cols-1",
          columns === 2 && "grid-cols-1 sm:grid-cols-2",
          columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
          className
        )}
        {...props}
      >
        {images.map((image, index) => (
          <figure key={index} className="group">
            <div className={cn(
              "relative overflow-hidden rounded-lg bg-muted",
              "transition-transform duration-300 group-hover:scale-105",
              aspectRatio === "square" && "aspect-square",
              aspectRatio === "landscape" && "aspect-video",
              aspectRatio === "portrait" && "aspect-[3/4]",
            )}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            {image.caption && (
              <figcaption className="mt-2 text-sm text-muted-foreground text-center">
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    )
  }
)
ImageGallery.displayName = "ImageGallery"

// Video Embed Component
interface VideoEmbedProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string
  title: string
  aspectRatio?: "video" | "square" | "ultrawide"
  thumbnail?: string
  autoPlay?: boolean
}

const VideoEmbed = React.forwardRef<HTMLDivElement, VideoEmbedProps>(
  ({ 
    className, 
    src, 
    title, 
    aspectRatio = "video", 
    thumbnail,
    autoPlay = false,
    ...props 
  }, ref) => {
    const [isPlaying, setIsPlaying] = React.useState(autoPlay)
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-lg bg-muted my-8",
          aspectRatio === "video" && "aspect-video",
          aspectRatio === "square" && "aspect-square",
          aspectRatio === "ultrawide" && "aspect-[21/9]",
          className
        )}
        {...props}
      >
        {!isPlaying && thumbnail ? (
          <div className="relative h-full w-full cursor-pointer group" onClick={() => setIsPlaying(true)}>
            <Image
              src={thumbnail}
              alt={`${title} thumbnail`}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-full group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6 text-primary-foreground ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={src}
            title={title}
            className="h-full w-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        )}
      </div>
    )
  }
)
VideoEmbed.displayName = "VideoEmbed"

// Table Component optimized for blog content
const BlogTable = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    data: Array<Record<string, string | number>>
    columns: Array<{
      key: string
      header: string
      width?: string
      align?: "left" | "center" | "right"
    }>
    caption?: string
  }
>(({ className, data, columns, caption, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("my-8 overflow-x-auto", className)}
      {...props}
    >
      <table className="w-full border-collapse border border-border rounded-lg overflow-hidden">
        {caption && (
          <caption className="mb-3 text-sm text-muted-foreground text-left font-medium">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="bg-muted/50">
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "border border-border px-4 py-3 text-sm font-medium text-foreground",
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right",
                )}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-muted/20 transition-colors">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "border border-border px-4 py-3 text-sm text-foreground",
                    column.align === "center" && "text-center",
                    column.align === "right" && "text-right",
                  )}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
BlogTable.displayName = "BlogTable"

// Newsletter Signup Component
const NewsletterSignup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title?: string
    description?: string
    onSubscribe?: (email: string) => Promise<void>
    compact?: boolean
  }
>(({ 
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
})
NewsletterSignup.displayName = "NewsletterSignup"

export {
  Callout,
  AuthorProfile,
  ImageGallery,
  VideoEmbed,
  BlogTable,
  NewsletterSignup,
  calloutVariants,
}