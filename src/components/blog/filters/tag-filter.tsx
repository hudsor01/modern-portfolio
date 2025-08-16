'use client'

import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { BlogTag } from '@/types/blog'
import { Tag } from 'lucide-react'
import { MotionVariant } from '@/types/ui'

interface TagFilterProps {
  tags: BlogTag[]
  selectedTags: string[]
  isLoading: boolean
  onTagToggle: (tagSlug: string) => void
  itemVariants: MotionVariant
}

export function TagFilter({
  tags,
  selectedTags,
  isLoading,
  onTagToggle,
  itemVariants
}: TagFilterProps) {
  return (
    <motion.div variants={itemVariants} className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Tag className="h-4 w-4" />
        Tags
      </Label>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {tags.slice(0, 20).map(tag => (
          <div key={tag.id} className="flex items-center space-x-2">
            <Checkbox
              id={tag.id}
              checked={selectedTags.includes(tag.slug)}
              onCheckedChange={() => onTagToggle(tag.slug)}
              disabled={isLoading}
            />
            <Label
              htmlFor={tag.id}
              className="flex-1 text-sm font-normal cursor-pointer"
            >
              {tag.name}
              {tag.postCount && (
                <span className="text-xs text-gray-500 ml-1">
                  ({tag.postCount})
                </span>
              )}
            </Label>
          </div>
        ))}
      </div>
    </motion.div>
  )
}