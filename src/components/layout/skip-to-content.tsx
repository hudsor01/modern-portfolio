'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SkipToContentProps {
  targetId?: string
  className?: string
}

export function SkipToContent({ 
  targetId = 'main-content', 
  className 
}: SkipToContentProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.focus()
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={cn(
        // Visually hidden by default
        'absolute -top-96 left-4 z-[9999] px-4 py-2 bg-primary-hover text-foreground rounded-md font-medium text-sm',
        // Show on focus
        'focus:top-4 transition-all duration-200',
        // High contrast support
        'focus:outline-hidden focus:ring-2 focus:ring-blue-400 focus:ring-offset-2',
        className
      )}
    >
      Skip to main content
    </a>
  )
}