'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlogBreadcrumbProps {
  category?: { name: string; slug: string }
  title?: string
  className?: string
}

export function BlogBreadcrumb({ category, title, className }: BlogBreadcrumbProps) {
  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}
    >
      <Link 
        href="/" 
        className="flex items-center hover:text-foreground transition-colors"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      <ChevronRight className="h-4 w-4" />
      
      <Link 
        href="/blog" 
        className="hover:text-foreground transition-colors"
      >
        Blog
      </Link>
      
      {category && (
        <>
          <ChevronRight className="h-4 w-4" />
          <Link 
            href={`/blog/category/${category.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {category.name}
          </Link>
        </>
      )}
      
      {title && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium line-clamp-1">
            {title}
          </span>
        </>
      )}
    </nav>
  )
}