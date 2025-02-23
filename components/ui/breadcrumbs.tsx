import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { Fragment } from "react"

interface Breadcrumb {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items: Breadcrumb[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <Fragment key={item.href}>
            <li className="flex items-center">
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </li>
            <li>
              <Link
                href={item.href}
                className={`text-sm hover:text-foreground transition-colors ${
                  index === items.length - 1 ? "font-medium text-foreground" : "text-muted-foreground"
                }`}
                aria-current={index === items.length - 1 ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}

