'use client'

import { Button } from '@/components/ui/button'
import { BlogCategory, BlogFilters } from '@/types/blog'
import { Folder } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickFiltersProps {
  categories: BlogCategory[]
  filters: BlogFilters
  isLoading: boolean
  onCategoryChange: (categorySlug: string) => void
  onFeaturedToggle: () => void
}

export function QuickFilters({
  categories,
  filters,
  isLoading,
  onCategoryChange,
  onFeaturedToggle
}: QuickFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Categories */}
      {categories.slice(0, 5).map(category => (
        <Button
          key={category.id}
          variant={filters.category === category.slug ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.slug)}
          className={cn(
            "flex items-center gap-2",
            filters.category === category.slug && "bg-gradient-to-r from-blue-500 to-indigo-600"
          )}
          disabled={isLoading}
        >
          <Folder className="h-3 w-3" />
          {category.name}
          {category.postCount && (
            <span className="text-xs opacity-70">({category.postCount})</span>
          )}
        </Button>
      ))}
      
      {/* Featured Toggle */}
      <Button
        variant={filters.featured ? "default" : "outline"}
        size="sm"
        onClick={onFeaturedToggle}
        className={cn(
          "flex items-center gap-2",
          filters.featured && "bg-yellow-500 hover:bg-yellow-600"
        )}
        disabled={isLoading}
      >
        ⭐ Featured
      </Button>
    </div>
  )
}