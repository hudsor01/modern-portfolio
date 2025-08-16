'use client'

import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BlogFilters } from '@/types/blog'
import { SortAsc } from 'lucide-react'
import { MotionVariant } from '@/types/ui'

interface SortControlsProps {
  filters: BlogFilters
  isLoading: boolean
  onSortChange: (value: string) => void
  itemVariants: MotionVariant
}

export function SortControls({
  filters,
  isLoading,
  onSortChange,
  itemVariants
}: SortControlsProps) {
  return (
    <motion.div variants={itemVariants} className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <SortAsc className="h-4 w-4" />
        Sort By
      </Label>
      <Select
        value={`${filters.sortBy}-${filters.sortOrder}`}
        onValueChange={onSortChange}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="publishedAt-desc">Latest First</SelectItem>
          <SelectItem value="publishedAt-asc">Oldest First</SelectItem>
          <SelectItem value="title-asc">Title A-Z</SelectItem>
          <SelectItem value="title-desc">Title Z-A</SelectItem>
          <SelectItem value="viewCount-desc">Most Viewed</SelectItem>
          <SelectItem value="commentCount-desc">Most Discussed</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  )
}