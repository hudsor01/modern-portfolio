import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Search, Filter, ChevronDown, Share2, Bookmark, BookmarkCheck, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Blog Search Component
const BlogSearch = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    onSearch?: (query: string) => void
    loading?: boolean
  }
>(({ className, onSearch, loading = false, ...props }, ref) => {
  const [query, setQuery] = React.useState("")
  
  const handleSearch = (value: string) => {
    setQuery(value)
    onSearch?.(value)
  }
  
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={ref}
        type="search"
        placeholder="Search articles..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        className={cn("pl-10 pr-4", className)}
        {...props}
      />
      {loading && (
        <div className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-muted-foreground border-t-primary" />
      )}
    </div>
  )
})
BlogSearch.displayName = "BlogSearch"

// Blog Filter Component
interface FilterOption {
  label: string
  value: string
  count?: number
}

interface BlogFilterProps {
  title: string
  options: FilterOption[]
  selected: string[]
  onSelectionChange: (selected: string[]) => void
  multiSelect?: boolean
  className?: string
}

const BlogFilter = React.forwardRef<HTMLDivElement, BlogFilterProps>(
  ({ title, options, selected, onSelectionChange, multiSelect = true, className }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false)
    
    const handleOptionClick = (value: string) => {
      if (multiSelect) {
        const newSelected = selected.includes(value)
          ? selected.filter(item => item !== value)
          : [...selected, value]
        onSelectionChange(newSelected)
      } else {
        onSelectionChange(selected.includes(value) ? [] : [value])
      }
    }
    
    const clearAll = () => {
      onSelectionChange([])
    }
    
    return (
      <div ref={ref} className={cn("relative", className)}>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>{title}</span>
            {selected.length > 0 && (
              <span className="inline-flex items-center justify-center h-5 px-1.5 text-xs rounded-full bg-secondary text-secondary-foreground">
                {selected.length}
              </span>
            )}
          </div>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </Button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-lg border bg-popover p-2 shadow-md">
            <div className="max-h-60 overflow-y-auto">
              <div className="space-y-1">
                {options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      selected.includes(option.value) && "bg-primary text-primary-foreground"
                    )}
                  >
                    <span>{option.label}</span>
                    {option.count !== undefined && (
                      <span className={cn(
                        "text-xs",
                        selected.includes(option.value) ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {option.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {selected.length > 0 && (
                <div className="mt-2 border-t pt-2">
                  <Button variant="ghost" size="sm" onClick={clearAll} className="w-full">
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
)
BlogFilter.displayName = "BlogFilter"

// Tag/Category Badge Component
const tagVariants = cva(
  [
    "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
    "transition-all duration-200 ease-out",
    "focus:outline-none focus:ring-2 focus:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-primary/10 text-primary border border-primary/20",
          "hover:bg-primary/20 hover:border-primary/30",
          "focus:ring-primary/50",
        ],
        secondary: [
          "bg-secondary/80 text-secondary-foreground",
          "hover:bg-secondary",
          "focus:ring-secondary/50",
        ],
        muted: [
          "bg-muted text-muted-foreground",
          "hover:bg-muted/80 hover:text-foreground",
          "focus:ring-muted-foreground/50",
        ],
        success: [
          "bg-green-100 text-green-800 border border-green-200",
          "hover:bg-green-200 hover:border-green-300",
          "dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
          "focus:ring-green-500/50",
        ],
        warning: [
          "bg-yellow-100 text-yellow-800 border border-yellow-200",
          "hover:bg-yellow-200 hover:border-yellow-300",
          "dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
          "focus:ring-yellow-500/50",
        ],
        error: [
          "bg-red-100 text-red-800 border border-red-200",
          "hover:bg-red-200 hover:border-red-300",
          "dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
          "focus:ring-red-500/50",
        ],
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
      interactive: {
        true: "cursor-pointer hover:scale-105 active:scale-95",
        false: "cursor-default",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
    },
  }
)

interface TagProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof tagVariants> {
  asChild?: boolean
}

const Tag = React.forwardRef<HTMLButtonElement, TagProps>(
  ({ className, variant, size, interactive, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button"
    
    return (
      <Comp
        ref={ref}
        className={cn(tagVariants({ variant, size, interactive }), className)}
        {...(!asChild && { type: "button" })}
        {...props}
      />
    )
  }
)
Tag.displayName = "Tag"

// Social Share Component
interface ShareButton {
  platform: string
  icon: React.ComponentType<{ className?: string }>
  getUrl: (url: string, title: string) => string
  color?: string
}

const shareButtons: ShareButton[] = [
  {
    platform: "Twitter",
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    getUrl: (url, title) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    color: "hover:text-blue-500",
  },
  {
    platform: "LinkedIn",
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    getUrl: (url, _title) => `https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    color: "hover:text-blue-700",
  },
]

const SocialShare = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    url: string
    title: string
    compact?: boolean
  }
>(({ className, url, title, compact = false, ...props }, ref) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      // Could trigger a toast here
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-2",
        !compact && "flex-col sm:flex-row",
        className
      )}
      {...props}
    >
      {!compact && (
        <span className="text-sm font-medium text-muted-foreground">
          Share this article:
        </span>
      )}
      <div className="flex items-center gap-2">
        {shareButtons.map((button) => (
          <Button
            key={button.platform}
            variant="ghost"
            size="sm"
            onClick={() => window.open(button.getUrl(url, title), "_blank", "noopener,noreferrer")}
            className={cn("hover:bg-accent", button.color)}
            aria-label={`Share on ${button.platform}`}
          >
            <button.icon className="h-4 w-4" />
            {!compact && <span className="ml-1">{button.platform}</span>}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="hover:bg-accent"
          aria-label="Copy link"
        >
          <Share2 className="h-4 w-4" />
          {!compact && <span className="ml-1">Copy</span>}
        </Button>
      </div>
    </div>
  )
})
SocialShare.displayName = "SocialShare"

// Bookmark Button Component
const BookmarkButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    bookmarked?: boolean
    onToggle?: (bookmarked: boolean) => void
  }
>(({ className, bookmarked = false, onToggle, ...props }, ref) => {
  const handleClick = () => {
    onToggle?.(!bookmarked)
  }
  
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn(
        "hover:bg-accent transition-colors",
        bookmarked && "text-primary hover:text-primary/80",
        className
      )}
      aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
      {...props}
    >
      {bookmarked ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
    </Button>
  )
})
BookmarkButton.displayName = "BookmarkButton"

// Reading Time Component
const ReadingTime = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    minutes: number
    showIcon?: boolean
  }
>(({ className, minutes, showIcon = true, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)}
      {...props}
    >
      {showIcon && <Eye className="h-3 w-3" />}
      <span>{minutes} min read</span>
    </span>
  )
})
ReadingTime.displayName = "ReadingTime"

// Load More Button with loading state
const LoadMoreButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    loading?: boolean
    hasMore?: boolean
    loadingText?: string
    endText?: string
  }
>(({ 
  className, 
  loading = false, 
  hasMore = true, 
  loadingText = "Loading...", 
  endText = "No more posts",
  children,
  disabled,
  ..._props 
}, ref) => {
  if (!hasMore && !loading) {
    return (
      <div className="text-center py-8">
        <span className="text-muted-foreground text-sm">{endText}</span>
      </div>
    )
  }
  
  return (
    <div className="text-center py-8">
      <Button
        ref={ref}
        variant="outline"
        disabled={disabled || loading}
        className={className}
        {..._props}
      >
        {loading ? loadingText : (children || "Load More")}
      </Button>
    </div>
  )
})
LoadMoreButton.displayName = "LoadMoreButton"

export {
  BlogSearch,
  BlogFilter,
  Tag,
  SocialShare,
  BookmarkButton,
  ReadingTime,
  LoadMoreButton,
  tagVariants,
  type FilterOption,
}