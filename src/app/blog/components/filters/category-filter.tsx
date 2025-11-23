'use client'

import { m as motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { BlogCategory, BlogFilters } from '@/types/blog'
import { MotionVariant } from '@/types/ui'
import { Folder } from 'lucide-react'

interface CategoryFilterProps {
  categories: BlogCategory[]
  filters: BlogFilters
  isLoading: boolean
  onCategoryChange: (categorySlug: string) => void
  itemVariants: MotionVariant
}

export function CategoryFilter({
  categories,
  filters,
  isLoading,
  onCategoryChange,
  itemVariants
}: CategoryFilterProps) {
  return (
    <motion.div variants={itemVariants} className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Folder className="h-4 w-4" />
        Categories
      </Label>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {categories.map(category => (
          <div key={category.id} className="flex items-center space-x-2">
            <Checkbox
              id={category.id}
              checked={filters.category === category.slug}
              onCheckedChange={() => onCategoryChange(category.slug)}
              disabled={isLoading}
            />
            <Label
              htmlFor={category.id}
              className="flex-1 text-sm font-normal cursor-pointer"
            >
              {category.name}
              {category.postCount && (
                <span className="text-xs text-gray-500 ml-1">
                  ({category.postCount})
                </span>
              )}
            </Label>
          </div>
        ))}
      </div>
    </motion.div>
  )
}