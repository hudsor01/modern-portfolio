'use client'

import React from 'react'
import { m as motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BlogPaginationProps {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  onPageChange: (page: number) => void
  showPages?: number
  className?: string
  variant?: 'default' | 'simple' | 'compact'
}

export function BlogPagination({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
  showPages = 7,
  className,
  variant = 'default'
}: BlogPaginationProps) {
  // Generate array of page numbers to display
  const generatePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    
    if (totalPages <= showPages) {
      // Show all pages if total is within showPages limit
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      // Determine start and end of middle pages
      let start = Math.max(2, currentPage - Math.floor((showPages - 4) / 2))
      let end = Math.min(totalPages - 1, currentPage + Math.floor((showPages - 4) / 2))
      
      // Adjust if we're near the beginning
      if (start <= 3) {
        end = Math.min(totalPages - 1, showPages - 2)
        start = 2
      }
      
      // Adjust if we're near the end
      if (end >= totalPages - 2) {
        start = Math.max(2, totalPages - showPages + 3)
        end = totalPages - 1
      }
      
      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('ellipsis')
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('ellipsis')
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, staggerChildren: 0.05 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  }

  if (variant === 'simple') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn('flex items-center justify-between', className)}
      >
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <span className="text-sm text-muted-foreground dark:text-muted-foreground">
          Page {currentPage} of {totalPages}
        </span>
        
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </motion.div>
    )
  }

  if (variant === 'compact') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn('flex items-center gap-2', className)}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrev}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <span className="px-3 py-1 text-sm glass rounded-lg">
          {currentPage}/{totalPages}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </motion.div>
    )
  }

  const pages = generatePageNumbers()

  return (
    <motion.nav
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn('flex items-center justify-center', className)}
      aria-label="Pagination navigation"
    >
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <motion.div variants={itemVariants}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrev}
            className="flex items-center gap-1 px-3"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
        </motion.div>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {pages.map((page, index) => (
            <motion.div key={`${page}-${index}`} variants={itemVariants}>
              {page === 'ellipsis' ? (
                <div className="px-3 py-2 flex items-center">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </div>
              ) : (
                <Button
                  variant={page === currentPage ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className={cn(
                    'min-w-[2.5rem] px-3',
                    page === currentPage && 'gradient-cta text-foreground hover:from-blue-600 hover:to-indigo-700'
                  )}
                  aria-current={page === currentPage ? 'page' : undefined}
                >
                  {page}
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Next Button */}
        <motion.div variants={itemVariants}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext}
            className="flex items-center gap-1 px-3"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      {/* Page Info */}
      <div className="hidden md:flex items-center ml-6 text-sm text-muted-foreground dark:text-muted-foreground">
        <span>
          Page {currentPage} of {totalPages} ({totalPages * 10} total results)
        </span>
      </div>
    </motion.nav>
  )
}

// Quick jump pagination component for admin interfaces
export function QuickJumpPagination({
  currentPage,
  totalPages,
  onPageChange,
  className
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}) {
  const [jumpPage, setJumpPage] = React.useState('')

  const handleJump = () => {
    const page = parseInt(jumpPage)
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
      setJumpPage('')
    }
  }

  return (
    <div className={cn('flex items-center gap-4', className)}>
      <BlogPagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasNext={currentPage < totalPages}
        hasPrev={currentPage > 1}
        onPageChange={onPageChange}
        variant="compact"
      />
      
      <div className="flex items-center gap-2 text-sm">
        <span>Jump to:</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleJump()}
          className="w-16 px-2 py-1 text-center border border-border dark:border-border rounded bg-white dark:bg-card"
          placeholder={currentPage.toString()}
        />
        <Button size="sm" onClick={handleJump} disabled={!jumpPage}>
          Go
        </Button>
      </div>
    </div>
  )
}