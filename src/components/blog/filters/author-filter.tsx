'use client'

import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BlogAuthor, BlogFilters } from '@/types/blog'
import { MotionVariant } from '@/types/ui'
import { User } from 'lucide-react'

interface AuthorFilterProps {
  authors: BlogAuthor[]
  filters: BlogFilters
  isLoading: boolean
  onAuthorChange: (authorId: string) => void
  itemVariants: MotionVariant
}

export function AuthorFilter({
  authors,
  filters,
  isLoading,
  onAuthorChange,
  itemVariants
}: AuthorFilterProps) {
  if (authors.length === 0) return null

  return (
    <motion.div variants={itemVariants} className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <User className="h-4 w-4" />
        Authors
      </Label>
      <Select
        value={filters.author || ""}
        onValueChange={onAuthorChange}
        disabled={isLoading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select author" />
        </SelectTrigger>
        <SelectContent>
          {authors.map(author => (
            <SelectItem key={author.id} value={author.id}>
              {author.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  )
}