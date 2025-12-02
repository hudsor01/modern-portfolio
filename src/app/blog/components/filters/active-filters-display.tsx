'use client'

import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { BlogFilters, BlogCategory, BlogTag, BlogAuthor } from '@/types/blog'
import { X } from 'lucide-react'
import { format } from 'date-fns'

interface ActiveFiltersDisplayProps {
  filters: BlogFilters
  categories: BlogCategory[]
  tags: BlogTag[]
  authors: BlogAuthor[]
  onFilterChange: (filters: Partial<BlogFilters>) => void
  onTagToggle: (tagSlug: string) => void
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void
}

export function ActiveFiltersDisplay({
  filters,
  categories,
  tags,
  authors,
  onFilterChange,
  onTagToggle,
  onDateRangeChange
}: ActiveFiltersDisplayProps) {
  const hasActiveFilters = !!(
    filters.category ||
    (filters.tags && filters.tags.length > 0) ||
    filters.author ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.search ||
    filters.featured
  )

  if (!hasActiveFilters) return null

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Active Filters:</Label>
      <div className="flex flex-wrap gap-2">
        {filters.category && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Category: {categories.find(c => c.slug === filters.category)?.name}
            <button
              onClick={() => onFilterChange({ category: undefined })}
              className="ml-1 hover:bg-muted dark:hover:bg-muted rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        
        {filters.tags?.map(tagSlug => {
          const tag = tags.find(t => t.slug === tagSlug)
          return tag ? (
            <Badge key={tagSlug} variant="secondary" className="flex items-center gap-1">
              {tag.name}
              <button
                onClick={() => onTagToggle(tagSlug)}
                className="ml-1 hover:bg-muted dark:hover:bg-muted rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ) : null
        })}
        
        {filters.author && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Author: {authors.find(a => a.id === filters.author)?.name}
            <button
              onClick={() => onFilterChange({ author: undefined })}
              className="ml-1 hover:bg-muted dark:hover:bg-muted rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        
        {filters.featured && (
          <Badge variant="secondary" className="flex items-center gap-1 bg-warning/20 text-warning dark:text-warning">
            Featured Posts
            <button
              onClick={() => onFilterChange({ featured: undefined })}
              className="ml-1 hover:bg-warning/20 dark:hover:bg-warning rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        
        {(filters.dateFrom || filters.dateTo) && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Date: {filters.dateFrom && format(filters.dateFrom, "MMM dd")}
            {filters.dateFrom && filters.dateTo && " - "}
            {filters.dateTo && format(filters.dateTo, "MMM dd, yyyy")}
            <button
              onClick={() => onDateRangeChange({})}
              className="ml-1 hover:bg-muted dark:hover:bg-muted rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        
        {filters.search && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Search: "{filters.search}"
            <button
              onClick={() => onFilterChange({ search: undefined })}
              className="ml-1 hover:bg-muted dark:hover:bg-muted rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>
    </div>
  )
}