import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Blog Container - Main layout wrapper
const blogContainerVariants = cva(
  [
    "mx-auto px-4 sm:px-6 lg:px-8",
    "transition-all duration-300 ease-in-out",
  ],
  {
    variants: {
      size: {
        sm: "max-w-3xl",
        default: "max-w-4xl", 
        lg: "max-w-5xl",
        xl: "max-w-6xl",
        full: "max-w-none",
      },
      padding: {
        none: "px-0",
        sm: "px-4",
        default: "px-4 sm:px-6 lg:px-8",
        lg: "px-6 sm:px-8 lg:px-12",
      },
    },
    defaultVariants: {
      size: "default",
      padding: "default",
    },
  }
)

interface BlogContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof blogContainerVariants> {}

const BlogContainer = React.forwardRef<HTMLDivElement, BlogContainerProps>(
  ({ className, size, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(blogContainerVariants({ size, padding }), className)}
        {...props}
      />
    )
  }
)
BlogContainer.displayName = "BlogContainer"

// Article Layout - Optimized reading container
const articleLayoutVariants = cva(
  [
    "mx-auto",
    "prose prose-slate prose-lg max-w-none",
    "dark:prose-invert",
    // Enhanced typography
    "prose-headings:scroll-mt-20 prose-headings:font-semibold prose-headings:tracking-tight",
    "prose-p:leading-7 prose-p:text-foreground",
    "prose-a:text-primary prose-a:no-underline prose-a:font-medium",
    "hover:prose-a:text-primary/80 hover:prose-a:underline prose-a:transition-all",
    "prose-strong:text-foreground prose-strong:font-semibold",
    "prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5",
    "prose-code:rounded-md prose-code:text-sm prose-code:font-mono",
    "prose-pre:bg-muted/30 prose-pre:border prose-pre:rounded-lg",
    "prose-blockquote:border-l-primary/30 prose-blockquote:bg-muted/30",
    "prose-blockquote:rounded-r-lg prose-blockquote:font-medium prose-blockquote:italic",
    "prose-img:rounded-lg prose-img:shadow-md",
    "prose-hr:border-border prose-hr:my-8",
    // List styling
    "prose-ul:list-disc prose-ol:list-decimal prose-li:my-1",
    "prose-li:text-foreground prose-li:leading-7",
    // Table styling
    "prose-table:border-collapse prose-table:border prose-table:border-border",
    "prose-th:border prose-th:border-border prose-th:bg-muted/50 prose-th:p-2",
    "prose-td:border prose-td:border-border prose-td:p-2",
  ],
  {
    variants: {
      size: {
        sm: "prose-sm max-w-2xl",
        default: "prose-lg max-w-3xl",
        lg: "prose-xl max-w-4xl",
      },
      spacing: {
        compact: "prose-p:mb-4 prose-headings:mb-4 prose-headings:mt-6",
        default: "prose-p:mb-6 prose-headings:mb-6 prose-headings:mt-8",
        relaxed: "prose-p:mb-8 prose-headings:mb-8 prose-headings:mt-10",
      },
    },
    defaultVariants: {
      size: "default",
      spacing: "default",
    },
  }
)

interface ArticleLayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof articleLayoutVariants> {}

const ArticleLayout = React.forwardRef<HTMLDivElement, ArticleLayoutProps>(
  ({ className, size, spacing, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(articleLayoutVariants({ size, spacing }), className)}
        {...props}
      />
    )
  }
)
ArticleLayout.displayName = "ArticleLayout"

// Blog Card - For post previews and content cards
const blogCardVariants = cva(
  [
    "bg-card border border-border rounded-xl shadow-sm",
    "transition-all duration-300 ease-out",
    "hover:shadow-md hover:border-border/60",
    "focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2",
  ],
  {
    variants: {
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
      hover: {
        none: "",
        subtle: "hover:bg-card/80",
        lift: "hover:-translate-y-1 hover:shadow-lg",
        scale: "hover:scale-[1.02]",
      },
      aspect: {
        auto: "",
        square: "aspect-square",
        video: "aspect-video",
        portrait: "aspect-[3/4]",
        golden: "aspect-[1.618/1]",
      },
    },
    defaultVariants: {
      size: "default",
      hover: "subtle",
      aspect: "auto",
    },
  }
)

interface BlogCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof blogCardVariants> {
  asChild?: boolean
}

const BlogCard = React.forwardRef<HTMLDivElement, BlogCardProps>(
  ({ className, size, hover, aspect, asChild = false, children, ...props }, ref) => {
    if (asChild) {
      return <>{children}</>
    }
    
    return (
      <div
        ref={ref}
        className={cn(blogCardVariants({ size, hover, aspect }), className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
BlogCard.displayName = "BlogCard"

// Sidebar Layout - For blog navigation and meta content
const sidebarVariants = cva(
  [
    "flex flex-col space-y-6",
    "border-l border-border pl-6",
    "transition-all duration-300 ease-in-out",
  ],
  {
    variants: {
      position: {
        left: "border-l-0 border-r pr-6 pl-0",
        right: "border-l pl-6",
      },
      width: {
        sm: "w-48",
        default: "w-64",
        lg: "w-80",
      },
      sticky: {
        true: "sticky top-20 self-start",
        false: "",
      },
    },
    defaultVariants: {
      position: "right",
      width: "default",
      sticky: true,
    },
  }
)

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, position, width, sticky, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(sidebarVariants({ position, width, sticky }), className)}
        {...props}
      />
    )
  }
)
Sidebar.displayName = "Sidebar"

// Table of Contents component
const TableOfContents = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    headings?: Array<{ id: string; text: string; level: number }>
    activeId?: string
  }
>(({ className, headings = [], activeId, ...props }, ref) => {
  return (
    <nav
      ref={ref}
      className={cn(
        [
          "bg-muted/30 rounded-lg p-4 border border-border",
          "text-sm leading-6",
        ],
        className
      )}
      aria-label="Table of contents"
      {...props}
    >
      <h3 className="font-semibold text-foreground mb-3">On this page</h3>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                [
                  "block py-1 text-muted-foreground hover:text-foreground",
                  "transition-colors duration-200",
                  "focus:outline-none focus:text-foreground",
                  heading.level === 2 && "pl-0",
                  heading.level === 3 && "pl-4",
                  heading.level === 4 && "pl-8",
                  heading.level >= 5 && "pl-12",
                ],
                activeId === heading.id && "text-primary font-medium"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
})
TableOfContents.displayName = "TableOfContents"

// Grid Layout for blog post listings
const BlogGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    columns?: 1 | 2 | 3 | 4
    gap?: "sm" | "default" | "lg"
  }
>(({ className, columns = 2, gap = "default", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        [
          "grid",
          columns === 1 && "grid-cols-1",
          columns === 2 && "grid-cols-1 md:grid-cols-2",
          columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          gap === "sm" && "gap-4",
          gap === "default" && "gap-6",
          gap === "lg" && "gap-8",
        ],
        className
      )}
      {...props}
    />
  )
})
BlogGrid.displayName = "BlogGrid"

// Reading Progress Bar
const ReadingProgress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    progress: number
    position?: "top" | "bottom"
  }
>(({ className, progress, position = "top", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        [
          "fixed left-0 right-0 z-50 h-1 bg-muted",
          position === "top" && "top-0",
          position === "bottom" && "bottom-0",
        ],
        className
      )}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      {...props}
    >
      <div
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  )
})
ReadingProgress.displayName = "ReadingProgress"

export {
  BlogContainer,
  ArticleLayout,
  BlogCard,
  Sidebar,
  TableOfContents,
  BlogGrid,
  ReadingProgress,
  blogContainerVariants,
  articleLayoutVariants,
  blogCardVariants,
  sidebarVariants,
}