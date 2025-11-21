'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Filter, RotateCcw, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterHeaderProps {
  hasActiveFilters: boolean
  activeFiltersCount: number
  isExpanded: boolean
  isLoading: boolean
  onToggleExpanded: () => void
  onClearFilters: () => void
}

export function FilterHeader({
  hasActiveFilters,
  activeFiltersCount,
  isExpanded,
  isLoading,
  onToggleExpanded,
  onClearFilters
}: FilterHeaderProps) {
  return (
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
          onClick={onToggleExpanded}
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
            onClick={onClearFilters}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RotateCcw className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}