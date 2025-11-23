'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { m as motion } from 'framer-motion'
import { Home, Folder, Tag, TrendingUp, Star, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { BlogCategory } from '@/types/blog'

interface BlogNavigationProps {
  categories: BlogCategory[]
  currentPath?: string
  isMobile?: boolean
  onNavigate?: () => void
  maxCategories?: number
}

export function BlogNavigation({
  categories,
  currentPath,
  isMobile = false,
  onNavigate,
  maxCategories = 6
}: BlogNavigationProps) {
  const pathname = usePathname()
  
  const navigationItems = [
    {
      label: 'Home',
      href: '/blog',
      icon: Home,
      isActive: pathname === '/blog'
    },
    {
      label: 'Featured',
      href: '/blog/featured',
      icon: Star,
      isActive: pathname === '/blog/featured'
    },
    {
      label: 'Popular',
      href: '/blog/popular',
      icon: TrendingUp,
      isActive: pathname === '/blog/popular'
    },
    {
      label: 'Archive',
      href: '/blog/archive',
      icon: Calendar,
      isActive: pathname === '/blog/archive'
    }
  ]

  const displayCategories = categories.slice(0, maxCategories)
  const hasMoreCategories = categories.length > maxCategories

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  const handleNavClick = () => {
    onNavigate?.()
  }

  return (
    <nav
      className={cn(
        'flex gap-2',
        isMobile ? 'flex-col space-y-2' : 'flex-wrap items-center'
      )}
      aria-label="Blog navigation"
    >
      {/* Main Navigation Items */}
      <div className={cn(
        'flex gap-2',
        isMobile ? 'flex-col space-y-2' : 'flex-wrap'
      )}>
        {navigationItems.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.href}
              variants={itemVariants}
              initial={isMobile ? "hidden" : false}
              animate={isMobile ? "visible" : false}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                asChild
                variant={item.isActive ? 'default' : 'ghost'}
                size={isMobile ? 'default' : 'sm'}
                className={cn(
                  'flex items-center gap-2',
                  item.isActive && 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white',
                  isMobile && 'w-full justify-start'
                )}
                onClick={handleNavClick}
              >
                <Link href={item.href} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            </motion.div>
          )
        })}
      </div>

      {/* Separator */}
      {!isMobile && (
        <div className="hidden md:block w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
      )}

      {/* Categories */}
      <div className={cn(
        'flex gap-2',
        isMobile ? 'flex-col space-y-2 mt-4' : 'flex-wrap'
      )}>
        {isMobile && (
          <div className="flex items-center gap-2 mb-2">
            <Folder className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Categories
            </span>
          </div>
        )}
        
        {displayCategories.map((category, index) => {
          const isActive = currentPath === `/blog/category/${category.slug}` || 
                          pathname === `/blog/category/${category.slug}`
          
          return (
            <motion.div
              key={category.id}
              variants={itemVariants}
              initial={isMobile ? "hidden" : false}
              animate={isMobile ? "visible" : false}
              transition={{ delay: (navigationItems.length + index) * 0.1 }}
            >
              <Button
                asChild
                variant={isActive ? 'default' : 'outline'}
                size={isMobile ? 'default' : 'sm'}
                className={cn(
                  'flex items-center gap-2',
                  isActive && 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-500',
                  isMobile && 'w-full justify-start pl-6',
                  !isMobile && 'h-8'
                )}
                onClick={handleNavClick}
              >
                <Link href={`/blog/category/${category.slug}`} className="flex items-center gap-2">
                  {!isMobile && <Folder className="h-3 w-3" />}
                  <span className="truncate">{category.name}</span>
                  {category.postCount > 0 && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        'ml-1 text-xs',
                        isActive && 'bg-white/20 text-white'
                      )}
                    >
                      {category.postCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            </motion.div>
          )
        })}

        {/* More Categories Link */}
        {hasMoreCategories && (
          <motion.div
            variants={itemVariants}
            initial={isMobile ? "hidden" : false}
            animate={isMobile ? "visible" : false}
            transition={{ delay: (navigationItems.length + displayCategories.length) * 0.1 }}
          >
            <Button
              asChild
              variant="ghost"
              size={isMobile ? 'default' : 'sm'}
              className={cn(
                'flex items-center gap-2 text-gray-600 dark:text-gray-400',
                isMobile && 'w-full justify-start pl-6'
              )}
              onClick={handleNavClick}
            >
              <Link href="/blog/categories" className="flex items-center gap-2">
                <Tag className="h-3 w-3" />
                <span>+{categories.length - maxCategories} more</span>
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </nav>
  )
}