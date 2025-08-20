'use client'

import React from 'react'
import Link from 'next/link'
import { m as motion } from 'framer-motion'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

interface BlogBreadcrumbsProps {
  path: string
  items?: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

export function BlogBreadcrumbs({
  path,
  items,
  className,
  showHome = true
}: BlogBreadcrumbsProps) {
  // Generate breadcrumb items from path if not provided
  const generateBreadcrumbsFromPath = (pathname: string): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    // Add home if enabled
    if (showHome) {
      breadcrumbs.push({
        label: 'Home',
        href: '/',
        isActive: false
      })
    }

    // Always add blog root
    breadcrumbs.push({
      label: 'Blog',
      href: '/blog',
      isActive: segments.length === 1 && segments[0] === 'blog'
    })

    // Process remaining segments
    let currentPath = ''
    for (let i = 0; i < segments.length; i++) {
      if (segments[i] === 'blog') continue // Skip blog as we already added it
      
      currentPath += `/${segments[i]}`
      const isLast = i === segments.length - 1
      
      // Format segment label
      const segment = segments[i];
      if (!segment) continue;
      
      let label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      // Handle special cases
      if (segments[i-1] === 'category') {
        label = `Category: ${label}`
      } else if (segments[i-1] === 'tag') {
        label = `Tag: ${label}`
      } else if (segments[i-1] === 'author') {
        label = `Author: ${label}`
      }

      breadcrumbs.push({
        label,
        href: isLast ? undefined : `/blog${currentPath}`,
        isActive: isLast
      })
    }

    return breadcrumbs
  }

  const breadcrumbItems = items || generateBreadcrumbsFromPath(path)

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn('flex items-center space-x-1 text-sm', className)}
      aria-label="Breadcrumb navigation"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => (
          <motion.li
            key={index}
            variants={itemVariants}
            className="flex items-center space-x-1"
          >
            {/* Separator */}
            {index > 0 && (
              <ChevronRight
                className="h-4 w-4 text-gray-400 dark:text-gray-500"
                aria-hidden="true"
              />
            )}

            {/* Breadcrumb Item */}
            {item.href && !item.isActive ? (
              <Link
                href={item.href}
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors font-medium"
              >
                {index === 0 && showHome ? (
                  <div className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    <span className="sr-only">{item.label}</span>
                  </div>
                ) : (
                  item.label
                )}
              </Link>
            ) : (
              <span
                className={cn(
                  'font-medium',
                  item.isActive
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                )}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {index === 0 && showHome ? (
                  <div className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    <span className="sr-only">{item.label}</span>
                  </div>
                ) : (
                  item.label
                )}
              </span>
            )}
          </motion.li>
        ))}
      </ol>
    </motion.nav>
  )
}

// Utility function to create custom breadcrumb items
export function createBreadcrumbItems(items: Array<{
  label: string
  href?: string
  isActive?: boolean
}>): BreadcrumbItem[] {
  return items.map(item => ({
    label: item.label,
    href: item.href,
    isActive: item.isActive
  }))
}

// Pre-defined breadcrumb configurations for common pages
export const blogBreadcrumbConfigs = {
  home: (): BreadcrumbItem[] => [
    { label: 'Home', href: '/' },
    { label: 'Blog', isActive: true }
  ],
  
  post: (postTitle: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: postTitle, isActive: true }
  ],
  
  category: (categoryName: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Categories', href: '/blog/categories' },
    { label: categoryName, isActive: true }
  ],
  
  tag: (tagName: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Tags', href: '/blog/tags' },
    { label: tagName, isActive: true }
  ],
  
  author: (authorName: string): BreadcrumbItem[] => [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: 'Authors', href: '/blog/authors' },
    { label: authorName, isActive: true }
  ],
  
  archive: (year?: string, month?: string): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog' },
      { label: 'Archive', href: '/blog/archive' }
    ]
    
    if (year) {
      items.push({ 
        label: year, 
        href: month ? `/blog/archive/${year}` : undefined,
        isActive: !month
      })
    }
    
    if (month && year) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ]
      items.push({ 
        label: monthNames[parseInt(month) - 1] || month, 
        isActive: true 
      })
    }
    
    return items
  }
}