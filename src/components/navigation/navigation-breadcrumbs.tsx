'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'
import { useKeyboardNavigation } from './keyboard-navigation'
import type { BreadcrumbItem as BreadcrumbItemType } from '@/lib/design-system/types'

export interface NavigationBreadcrumbsProps {
  items: BreadcrumbItemType[]
  currentPage: string
  className?: string
  maxItems?: number
  showHome?: boolean
  homeLabel?: string
  homeHref?: string
}

/**
 * Standardized breadcrumb navigation component with uniform appearance
 * Provides consistent navigation hierarchy across all project pages with enhanced accessibility
 */
export const NavigationBreadcrumbs = React.forwardRef<HTMLElement, NavigationBreadcrumbsProps>(
  (
    {
      items,
      currentPage,
      className,
      maxItems = 5,
      showHome = true,
      homeLabel = 'Home',
      homeHref = '/',
      ...props
    },
    ref
  ) => {
    // Enhanced keyboard navigation for breadcrumb links
    const { handleKeyDown } = useKeyboardNavigation({
      onEnter: () => {
        // Let default link behavior work for breadcrumbs
      },
      preventDefault: false, // Let default link behavior work
    })

    // Prepare breadcrumb items with optional home item
    const breadcrumbItems = React.useMemo(() => {
      const allItems = showHome ? [{ label: homeLabel, href: homeHref }, ...items] : items

      // Truncate items if they exceed maxItems
      if (allItems.length > maxItems) {
        const firstItem = allItems[0]
        const lastItems = allItems.slice(-(maxItems - 1))
        return [firstItem, { label: '...', href: '#' }, ...lastItems]
      }

      return allItems
    }, [items, showHome, homeLabel, homeHref, maxItems])

    return (
      <Breadcrumb ref={ref} className={cn('w-fit', className)} data-testid="breadcrumbs" {...props}>
        <BreadcrumbList role="list">
          {breadcrumbItems.map((item, index) => {
            if (!item) return null
            return (
              <React.Fragment key={`${item.href}-${index}`}>
                <BreadcrumbItem role="listitem">
                  {item.label === '...' ? (
                    <span
                      className="text-muted-foreground px-2"
                      aria-label="More navigation items"
                      role="presentation"
                    >
                      ...
                    </span>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={item.href}
                        className="hover:text-foreground transition-colors duration-150 ease-out focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-1 rounded-sm"
                        onKeyDown={handleKeyDown}
                        aria-label={`Navigate to ${item.label}`}
                      >
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator aria-hidden="true" />}
              </React.Fragment>
            )
          })}
          <BreadcrumbSeparator aria-hidden="true" />
          <BreadcrumbItem role="listitem">
            <BreadcrumbPage aria-current="page" className="font-medium">
              {currentPage}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
  }
)

NavigationBreadcrumbs.displayName = 'NavigationBreadcrumbs'
