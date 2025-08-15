'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BlogFilters as BlogFiltersType, BlogCategory, BlogTag, BlogAuthor } from '@/types/blog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
// import { Separator } from '@/components/ui/separator' // Unused
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  Tag, 
  Folder, 
  User,
  SortAsc,
  RotateCcw,
  ChevronDown
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

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
      {/* Filter Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">Filter & Sort</h3>
          {hasActiveFilters && (
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 dark:text-blue-300">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <span className="hidden sm:inline">
              {isExpanded ? 'Collapse' : 'Expand'} Filters
            </span>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              isExpanded && "rotate-180"
            )} />
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <RotateCcw className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Categories */}
        {categories.slice(0, 5).map(category => (
          <Button
            key={category.id}
            variant={filters.category === category.slug ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(category.slug)}
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
          onClick={() => handleFilterChange({ featured: !filters.featured || undefined })}
          className={cn(
            "flex items-center gap-2",
            filters.featured && "bg-yellow-500 hover:bg-yellow-600"
          )}
          disabled={isLoading}
        >
          ⭐ Featured
        </Button>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Sort Options */}
            <motion.div variants={itemVariants} className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <SortAsc className="h-4 w-4" />
                Sort By
              </Label>
              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={handleSortChange}
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

            {/* All Categories */}
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
                      onCheckedChange={() => handleCategoryChange(category.slug)}
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

            {/* Tags */}
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
                      onCheckedChange={() => handleTagToggle(tag.slug)}
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

            {/* Authors */}
            {authors.length > 0 && (
              <motion.div variants={itemVariants} className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Authors
                </Label>
                <Select
                  value={filters.author || ""}
                  onValueChange={handleAuthorChange}
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
            )}

            {/* Date Range */}
            <motion.div variants={itemVariants} className="space-y-3 md:col-span-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Date Range
              </Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : "From date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => handleDateRangeChange({ ...dateRange, from: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? format(dateRange.to, "MMM dd, yyyy") : "To date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => handleDateRangeChange({ ...dateRange, to: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Active Filters:</Label>
          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {categories.find(c => c.slug === filters.category)?.name}
                <button
                  onClick={() => handleFilterChange({ category: undefined })}
                  className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
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
                    onClick={() => handleTagToggle(tagSlug)}
                    className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
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
                  onClick={() => handleFilterChange({ author: undefined })}
                  className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {filters.featured && (
              <Badge variant="secondary" className="flex items-center gap-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                Featured Posts
                <button
                  onClick={() => handleFilterChange({ featured: undefined })}
                  className="ml-1 hover:bg-yellow-200 dark:hover:bg-yellow-700 rounded-full p-0.5"
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
                  onClick={() => handleDateRangeChange({})}
                  className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            
            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{filters.search}"
                <button
                  onClick={() => handleFilterChange({ search: undefined })}
                  className="ml-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}