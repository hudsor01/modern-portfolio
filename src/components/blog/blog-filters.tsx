'use client'

import { useState, useCallback } from 'react'
import { m as motion, AnimatePresence } from 'framer-motion'
import { BlogFilters as BlogFiltersType, BlogCategory, BlogTag, BlogAuthor } from '@/types/blog'

// Filter components
import { FilterHeader } from './filters/filter-header'
import { QuickFilters } from './filters/quick-filters'
import { SortControls } from './filters/sort-controls'
import { CategoryFilter } from './filters/category-filter'
import { TagFilter } from './filters/tag-filter'
import { AuthorFilter } from './filters/author-filter'
import { DateRangeFilter } from './filters/date-range-filter'
import { ActiveFiltersDisplay } from './filters/active-filters-display'

interface BlogFiltersProps {
  categories: BlogCategory[]
  tags: BlogTag[]
  authors?: BlogAuthor[]
  filters: BlogFiltersType
  onFiltersChange: (filters: BlogFiltersType) => void
  isLoading?: boolean
}

export function BlogFilters({
  categories,
  tags,
  authors = [],
  filters,
  onFiltersChange,
  isLoading = false
}: BlogFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags || [])
  const [dateRange, setDateRange] = useState<{
    from?: Date
    to?: Date
  }>({
    from: filters.dateFrom,
    to: filters.dateTo
  })

  const handleFilterChange = useCallback((newFilters: Partial<BlogFiltersType>) => {
    onFiltersChange({ ...filters, ...newFilters })
  }, [filters, onFiltersChange])

  const handleCategoryChange = (categorySlug: string) => {
    handleFilterChange({ category: categorySlug === filters.category ? undefined : categorySlug })
  }

  const handleTagToggle = (tagSlug: string) => {
    const newTags = selectedTags.includes(tagSlug)
      ? selectedTags.filter(t => t !== tagSlug)
      : [...selectedTags, tagSlug]
    
    setSelectedTags(newTags)
    handleFilterChange({ tags: newTags.length > 0 ? newTags : undefined })
  }

  const handleAuthorChange = (authorId: string) => {
    handleFilterChange({ author: authorId === filters.author ? undefined : authorId })
  }

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range)
    handleFilterChange({
      dateFrom: range.from,
      dateTo: range.to
    })
  }

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-') as [
      'title' | 'publishedAt' | 'viewCount' | 'commentCount',
      'asc' | 'desc'
    ]
    handleFilterChange({ sortBy, sortOrder })
  }

  const handleClearFilters = () => {
    setSelectedTags([])
    setDateRange({})
    handleFilterChange({
      category: undefined,
      tags: undefined,
      author: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      search: undefined,
      featured: undefined
    })
  }

  const handleFeaturedToggle = () => {
    handleFilterChange({ featured: !filters.featured || undefined })
  }

  const hasActiveFilters = !!(
    filters.category ||
    (filters.tags && filters.tags.length > 0) ||
    filters.author ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.search ||
    filters.featured
  )

  const activeFiltersCount = [
    filters.category,
    filters.tags?.length,
    filters.author,
    filters.dateFrom || filters.dateTo,
    filters.search,
    filters.featured
  ].filter(Boolean).length

  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3, staggerChildren: 0.05 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <div className="space-y-6">
      <FilterHeader
        hasActiveFilters={hasActiveFilters}
        activeFiltersCount={activeFiltersCount}
        isExpanded={isExpanded}
        isLoading={isLoading}
        onToggleExpanded={() => setIsExpanded(!isExpanded)}
        onClearFilters={handleClearFilters}
      />

      <QuickFilters
        categories={categories}
        filters={filters}
        isLoading={isLoading}
        onCategoryChange={handleCategoryChange}
        onFeaturedToggle={handleFeaturedToggle}
      />

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <SortControls
              filters={filters}
              isLoading={isLoading}
              onSortChange={handleSortChange}
              itemVariants={itemVariants}
            />

            <CategoryFilter
              categories={categories}
              filters={filters}
              isLoading={isLoading}
              onCategoryChange={handleCategoryChange}
              itemVariants={itemVariants}
            />

            <TagFilter
              tags={tags}
              selectedTags={selectedTags}
              isLoading={isLoading}
              onTagToggle={handleTagToggle}
              itemVariants={itemVariants}
            />

            <AuthorFilter
              authors={authors}
              filters={filters}
              isLoading={isLoading}
              onAuthorChange={handleAuthorChange}
              itemVariants={itemVariants}
            />

            <DateRangeFilter
              dateRange={dateRange}
              isLoading={isLoading}
              onDateRangeChange={handleDateRangeChange}
              itemVariants={itemVariants}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ActiveFiltersDisplay
        filters={filters}
        categories={categories}
        tags={tags}
        authors={authors}
        onFilterChange={handleFilterChange}
        onTagToggle={handleTagToggle}
        onDateRangeChange={handleDateRangeChange}
      />
    </div>
  )
}