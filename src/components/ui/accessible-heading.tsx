'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AccessibleHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
  className?: string
  id?: string
  visualLevel?: 1 | 2 | 3 | 4 | 5 | 6
}

const headingStyles = {
  1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
  2: 'text-3xl md:text-4xl font-bold',
  3: 'text-2xl md:text-3xl font-semibold',
  4: 'text-xl md:text-2xl font-semibold',
  5: 'text-lg md:text-xl font-medium',
  6: 'text-base md:text-lg font-medium'
}

export function AccessibleHeading({ 
  level, 
  children, 
  className, 
  id,
  visualLevel 
}: AccessibleHeadingProps) {
  const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  const styleLevel = visualLevel || level
  
  return React.createElement(
    HeadingTag,
    {
      id,
      className: cn(
        headingStyles[styleLevel],
        'scroll-mt-20', // Offset for fixed header
        className
      )
    },
    children
  )
}