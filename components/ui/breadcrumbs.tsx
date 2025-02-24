import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface Breadcrumb {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: Breadcrumb[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex", className)}>
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link
              href={item.href}
              className={cn(
                "ml-2 text-sm hover:text-foreground transition-colors",
                index === items.length - 1 ? "font-medium text-foreground" : "text-muted-foreground",
              )}
              aria-current={index === items.length - 1 ? "page" : undefined}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

