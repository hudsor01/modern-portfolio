'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { m as motion, AnimatePresence } from 'framer-motion'
import { Loader2, Grid, List, SortAsc, SortDesc } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BlogCard } from './blog-card'
import { BlogPagination } from './blog-pagination'
import { BlogFilters } from './blog-filters'
import { BlogPostSkeleton } from './blog-post-skeleton'
import { cn } from '@/lib/utils'
import type { BlogPostSummary, BlogCategory, BlogTag, BlogAuthor, BlogFilters as BlogFiltersType } from '@/types/blog'

interface BlogPostListProps {
  posts: BlogPostSummary[]
  categories: BlogCategory[]
  tags: BlogTag[]
  authors?: BlogAuthor[]
  totalCount: number
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  isLoading?: boolean
  filters?: BlogFiltersType
  onPageChange: (page: number) => void
  onFiltersChange: (filters: BlogFiltersType) => void
  onPostClick: (post: BlogPostSummary) => void
  onPostEdit?: (post: BlogPostSummary) => void
  onPostDelete?: (post: BlogPostSummary) => void
  showFilters?: boolean
  showPagination?: boolean
  showActions?: boolean
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
  className?: string
  emptyStateMessage?: string
  emptyStateAction?: React.ReactNode
}

export function BlogPostList({
  posts,
  categories,
  tags,
  authors = [],
  totalCount,
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  isLoading = false,
  filters = {},
  onPageChange,
  onFiltersChange,
  onPostClick,
  onPostEdit,
  onPostDelete,
  showFilters = true,
  showPagination = true,
  showActions = false,
  viewMode = 'grid',
  onViewModeChange,
  className,
  emptyStateMessage = 'No blog posts found.',
  emptyStateAction
}: BlogPostListProps) {
  const [localViewMode, setLocalViewMode] = useState<'grid' | 'list'>(viewMode)

  useEffect(() => {
    setLocalViewMode(viewMode)
  }, [viewMode])

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setLocalViewMode(mode)
    onViewModeChange?.(mode)
  }, [onViewModeChange])

  const animationVariants = useMemo(() => ({
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.4, staggerChildren: 0.1 }
      }
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    },
    listItem: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 }
    }
  }), [])

  // Create callbacks before any conditional returns
  const handleSortChange = useCallback((value: string) => {
    const [sortBy, sortOrder] = value.split('-') as ['publishedAt' | 'title' | 'viewCount' | 'commentCount', 'asc' | 'desc']
    onFiltersChange({ ...filters, sortBy, sortOrder })
  }, [filters, onFiltersChange])

  const skeletonArray = useMemo(() => Array.from({ length: 6 }).map((_, index) => index), [])

  // Empty state
  if (!isLoading && posts.length === 0) {
    return (
      <div className={cn('space-y-8', className)}>
        {showFilters && (
          <BlogFilters
            categories={categories}
            tags={tags}
            authors={authors}
            filters={filters}
            onFiltersChange={onFiltersChange}
            isLoading={isLoading}
          />
        )}
        
        <div className="text-center py-16">
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-12">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <List className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Posts Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {emptyStateMessage}
              </p>
              {emptyStateAction}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <BlogFilters
            categories={categories}
            tags={tags}
            authors={authors}
            filters={filters}
            onFiltersChange={onFiltersChange}
            isLoading={isLoading}
          />
        </motion.div>
      )}

      {/* Header with View Controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {totalCount === 1 ? '1 Post' : `${totalCount.toLocaleString()} Posts`}
          </h2>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Options */}
          <Select
            value={`${filters.sortBy || 'publishedAt'}-${filters.sortOrder || 'desc'}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="publishedAt-desc">
                <div className="flex items-center gap-2">
                  <SortDesc className="w-4 h-4" />
                  Latest First
                </div>
              </SelectItem>
              <SelectItem value="publishedAt-asc">
                <div className="flex items-center gap-2">
                  <SortAsc className="w-4 h-4" />
                  Oldest First
                </div>
              </SelectItem>
              <SelectItem value="title-asc">Title A-Z</SelectItem>
              <SelectItem value="title-desc">Title Z-A</SelectItem>
              <SelectItem value="viewCount-desc">Most Viewed</SelectItem>
              <SelectItem value="commentCount-desc">Most Discussed</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <Button
              variant={localViewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('grid')}
              className={cn(
                'rounded-none border-0',
                localViewMode === 'grid' && 'bg-gradient-to-r from-blue-500 to-indigo-600'
              )}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={localViewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleViewModeChange('list')}
              className={cn(
                'rounded-none border-0',
                localViewMode === 'list' && 'bg-gradient-to-r from-blue-500 to-indigo-600'
              )}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Posts Grid/List */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              'grid gap-6',
              localViewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            )}
          >
            {skeletonArray.map((index) => (
              <BlogPostSkeleton key={index} variant={localViewMode} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={`${localViewMode}-${currentPage}`}
            variants={animationVariants.container}
            initial="hidden"
            animate="visible"
            className={cn(
              'grid gap-6',
              localViewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            )}
          >
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                variants={localViewMode === 'grid' ? animationVariants.item : animationVariants.listItem}
                transition={{ delay: index * 0.1 }}
              >
                <BlogCard
                  post={post}
                  onClick={onPostClick}
                  onEdit={onPostEdit}
                  onDelete={onPostDelete}
                  showActions={showActions}
                  variant={localViewMode === 'list' ? 'compact' : 'default'}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {showPagination && !isLoading && posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex justify-center"
        >
          <BlogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            hasNext={hasNext}
            hasPrev={hasPrev}
            onPageChange={onPageChange}
          />
        </motion.div>
      )}

      {/* Load More Button (Alternative to Pagination) */}
      {hasNext && !showPagination && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex justify-center"
        >
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Posts'
            )}
          </Button>
        </motion.div>
      )}
    </div>
  )
}