import React from 'react'
import { cn } from '@/lib/utils'
import { typographyClasses } from '@/lib/typography'

interface TypographyProps {
  variant: keyof typeof typographyClasses
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function Typography({
  variant,
  children,
  className,
  as,
  ...props
}: TypographyProps & React.HTMLAttributes<HTMLElement>) {
  const Component = as || getDefaultElement(variant)

  return (
    <Component className={cn(typographyClasses[variant], className)} {...props}>
      {children}
    </Component>
  )
}

// Helper function to determine the default HTML element based on variant
function getDefaultElement(variant: string): React.ElementType {
  switch (variant) {
    case 'h1':
      return 'h1'
    case 'h2':
      return 'h2'
    case 'h3':
      return 'h3'
    case 'h4':
      return 'h4'
    case 'h5':
      return 'h5'
    case 'h6':
      return 'h6'
    case 'p':
      return 'p'
    case 'lead':
      return 'p'
    case 'large':
      return 'div'
    case 'small':
      return 'small'
    case 'muted':
      return 'p'
    case 'link':
      return 'a'
    default:
      return 'div'
  }
}
