import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Blog Article Typography Component
const articleVariants = cva(
  [
    "prose prose-slate max-w-none",
    "selection:bg-blue-100 selection:text-blue-900",
    // Enhanced readability
    "text-balance leading-relaxed tracking-normal",
    // Dark mode support
    "dark:prose-invert dark:selection:bg-blue-900 dark:selection:text-blue-100",
    // Focus styles for accessibility
    "[&_*:focus-visible]:outline-2 [&_*:focus-visible]:outline-blue-500 [&_*:focus-visible]:outline-offset-2",
  ],
  {
    variants: {
      size: {
        sm: "text-sm leading-7",
        base: "text-base leading-7 sm:text-lg sm:leading-8",
        lg: "text-lg leading-8 sm:text-xl sm:leading-9",
      },
      width: {
        prose: "max-w-prose",
        wide: "max-w-4xl",
        full: "max-w-none",
      },
    },
    defaultVariants: {
      size: "base",
      width: "prose",
    },
  }
)

interface ArticleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof articleVariants> {
  children: React.ReactNode
}

const Article = React.forwardRef<HTMLDivElement, ArticleProps>(
  ({ className, size, width, children, ...props }, ref) => {
    return (
      <article
        ref={ref}
        className={cn(articleVariants({ size, width }), className)}
        {...props}
      >
        {children}
      </article>
    )
  }
)
Article.displayName = "Article"

// Blog Headings with consistent spacing and typography
const headingVariants = cva(
  [
    "font-semibold tracking-tight text-foreground",
    "scroll-mt-20", // Account for sticky headers
  ],
  {
    variants: {
      level: {
        h1: [
          "text-3xl sm:text-4xl lg:text-5xl",
          "leading-tight font-bold",
          "mb-6 mt-0",
        ],
        h2: [
          "text-2xl sm:text-3xl lg:text-4xl",
          "leading-tight font-semibold",
          "mb-4 mt-12 first:mt-0",
          "border-b border-border pb-2",
        ],
        h3: [
          "text-xl sm:text-2xl lg:text-3xl",
          "leading-snug font-semibold",
          "mb-3 mt-8 first:mt-0",
        ],
        h4: [
          "text-lg sm:text-xl lg:text-2xl",
          "leading-snug font-semibold",
          "mb-2 mt-6 first:mt-0",
        ],
        h5: [
          "text-base sm:text-lg lg:text-xl",
          "leading-normal font-medium",
          "mb-2 mt-4 first:mt-0",
        ],
        h6: [
          "text-sm sm:text-base lg:text-lg",
          "leading-normal font-medium",
          "mb-1 mt-3 first:mt-0",
          "text-muted-foreground",
        ],
      },
      anchor: {
        true: [
          "group relative",
          "hover:text-primary transition-colors",
          // Anchor link styling
          "[&>a]:absolute [&>a]:-left-6 [&>a]:opacity-0",
          "[&>a]:text-muted-foreground [&>a]:hover:text-primary",
          "hover:[&>a]:opacity-100 [&>a]:transition-opacity",
          "[&>a]:text-lg [&>a]:no-underline",
        ],
        false: "",
      },
    },
    defaultVariants: {
      level: "h2",
      anchor: false,
    },
  }
)

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  id?: string
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = "h2", anchor = false, as, id, children, ...props }, ref) => {
    const Component = as || level
    
    return React.createElement(
      Component as keyof JSX.IntrinsicElements,
      {
        ref,
        id,
        className: cn(headingVariants({ level, anchor }), className),
        ...props,
      },
      children,
      anchor && id && React.createElement(
        'a',
        {
          href: `#${id}`,
          'aria-label': `Link to ${children}`,
          className: 'ml-2 text-muted-foreground hover:text-primary'
        },
        '#'
      )
    )
  }
)
Heading.displayName = "Heading"

// Enhanced Paragraph component for blog content
const Paragraph = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    lead?: boolean
  }
>(({ className, lead = false, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "mb-6 leading-7 text-foreground",
        lead && [
          "text-lg sm:text-xl leading-8 sm:leading-9",
          "text-muted-foreground font-light",
          "mb-8",
        ],
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
})
Paragraph.displayName = "Paragraph"

// Enhanced Blockquote component
const Blockquote = React.forwardRef<
  HTMLQuoteElement,
  React.BlockquoteHTMLAttributes<HTMLQuoteElement> & {
    author?: string
    source?: string
  }
>(({ className, author, source, children, ...props }, ref) => {
  return (
    <blockquote
      ref={ref}
      className={cn(
        [
          "my-8 border-l-4 border-primary/30 pl-6 py-2",
          "bg-muted/30 rounded-r-lg",
          "text-lg leading-8 text-muted-foreground",
          "italic font-medium",
        ],
        className
      )}
      {...props}
    >
      <div className="mb-2">{children}</div>
      {(author || source) && (
        <footer className="text-sm text-muted-foreground not-italic font-normal mt-4">
          {author && <cite className="font-medium text-foreground">{author}</cite>}
          {author && source && <span className="mx-2">—</span>}
          {source && <span>{source}</span>}
        </footer>
      )}
    </blockquote>
  )
})
Blockquote.displayName = "Blockquote"

// Enhanced List components
const List = React.forwardRef<
  HTMLUListElement | HTMLOListElement,
  React.HTMLAttributes<HTMLUListElement | HTMLOListElement> & {
    ordered?: boolean
    spacing?: "compact" | "relaxed"
  }
>(({ className, ordered = false, spacing = "relaxed", children, ...props }, ref) => {
  const Component = ordered ? "ol" : "ul"
  
  return (
    <Component
      ref={ref as React.RefObject<HTMLUListElement & HTMLOListElement>}
      className={cn(
        [
          "my-6 text-foreground",
          spacing === "relaxed" ? "space-y-2" : "space-y-1",
          ordered ? "list-decimal" : "list-disc",
          "list-outside ml-6",
        ],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
})
List.displayName = "List"

const ListItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, children, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn("pl-2 leading-7", className)}
      {...props}
    >
      {children}
    </li>
  )
})
ListItem.displayName = "ListItem"

// Inline Code component
const InlineCode = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => {
  return (
    <code
      ref={ref}
      className={cn(
        [
          "relative rounded-md bg-muted px-1.5 py-0.5",
          "text-sm font-mono font-medium",
          "text-foreground",
          "before:content-none after:content-none", // Remove default prose styling
        ],
        className
      )}
      {...props}
    >
      {children}
    </code>
  )
})
InlineCode.displayName = "InlineCode"

// Code Block component
const CodeBlock = React.forwardRef<
  HTMLPreElement,
  React.HTMLAttributes<HTMLPreElement> & {
    language?: string
    filename?: string
    showLineNumbers?: boolean
  }
>(({ className, language, filename, showLineNumbers = false, children, ...props }, ref) => {
  return (
    <div className="my-8 overflow-hidden rounded-lg border bg-muted/30">
      {filename && (
        <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2 text-sm">
          <span className="font-medium text-foreground">{filename}</span>
          {language && (
            <span className="text-muted-foreground capitalize">{language}</span>
          )}
        </div>
      )}
      <pre
        ref={ref}
        className={cn(
          [
            "overflow-x-auto p-4",
            "text-sm font-mono leading-6",
            "bg-muted/20",
            showLineNumbers && "pl-12 relative",
          ],
          className
        )}
        {...props}
      >
        <code className="text-foreground">{children}</code>
      </pre>
    </div>
  )
})
CodeBlock.displayName = "CodeBlock"

// Link component optimized for blog content
const BlogLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    external?: boolean
  }
>(({ className, external = false, children, href, ...props }, ref) => {
  return (
    <a
      ref={ref}
      href={href}
      className={cn(
        [
          "font-medium text-primary underline underline-offset-4",
          "hover:text-primary/80 hover:no-underline",
          "transition-colors duration-200",
          "focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
          external && "after:content-['↗'] after:ml-1 after:text-xs",
        ],
        className
      )}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  )
})
BlogLink.displayName = "BlogLink"

export {
  Article,
  Heading,
  Paragraph,
  Blockquote,
  List,
  ListItem,
  InlineCode,
  CodeBlock,
  BlogLink,
  articleVariants,
  headingVariants,
}