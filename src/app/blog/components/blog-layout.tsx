'use client'

import React, { ReactNode, useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { Menu, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { BlogNavigation } from './blog-navigation'
import { BlogSidebar } from './blog-sidebar'
import { BlogBreadcrumbs } from './blog-breadcrumbs'
import { cn } from '@/lib/utils'
import type { BlogCategory, BlogTag, BlogAuthor } from '@/types/blog'

interface BlogLayoutProps {
  children: ReactNode
  categories: BlogCategory[]
  tags: BlogTag[]
  authors?: BlogAuthor[]
  showSidebar?: boolean
  showBreadcrumbs?: boolean
  currentPath?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  sidebarContent?: ReactNode
  className?: string
}

export function BlogLayout({
  children,
  categories,
  tags,
  authors = [],
  showSidebar = true,
  showBreadcrumbs = true,
  currentPath,
  searchValue = '',
  onSearchChange,
  sidebarContent,
  className
}: BlogLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className={cn('min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800', className)}>
      {/* Header with Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Blog
              </h1>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search posts..."
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="pl-10 bg-white/50 backdrop-blur-sm border-gray-300 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileMenu}
                className="p-2"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block mt-4">
            <BlogNavigation
              categories={categories}
              currentPath={currentPath}
            />
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search posts..."
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-10 bg-white/50 backdrop-blur-sm border-gray-300 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="container mx-auto px-4 py-4">
                <BlogNavigation
                  categories={categories}
                  currentPath={currentPath}
                  isMobile
                  onNavigate={() => setIsMobileMenuOpen(false)}
                />
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <m.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-8"
      >
        {/* Breadcrumbs */}
        {showBreadcrumbs && currentPath && (
          <m.div variants={itemVariants} className="mb-6">
            <BlogBreadcrumbs path={currentPath} />
          </m.div>
        )}

        <div className={cn(
          'grid gap-8',
          showSidebar ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'
        )}>
          {/* Main Content Area */}
          <m.div
            variants={itemVariants}
            className={cn(showSidebar ? 'lg:col-span-2' : 'col-span-1')}
          >
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl">
              <div className="p-6">
                {children}
              </div>
            </div>
          </m.div>

          {/* Sidebar */}
          {showSidebar && (
            <m.aside variants={itemVariants} className="space-y-6">
              {sidebarContent || (
                <BlogSidebar
                  categories={categories}
                  tags={tags}
                  authors={authors}
                />
              )}
            </m.aside>
          )}
        </div>
      </m.main>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 py-8">
          <Separator className="mb-6 opacity-20" />
          <div className="text-center text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Blog. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}