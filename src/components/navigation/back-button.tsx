'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useKeyboardNavigation } from './keyboard-navigation'

export interface BackButtonProps {
  href: string
  label?: string
  className?: string
  variant?: 'ghost' | 'outline' | 'secondary'
  size?: 'sm' | 'default' | 'lg'
  showIcon?: boolean
  disabled?: boolean
  style?: React.CSSProperties
}

/**
 * Standardized back button component with consistent styling and behavior
 * Used across all project pages for navigation consistency with enhanced accessibility
 */
export const BackButton = React.forwardRef<HTMLAnchorElement, BackButtonProps>(
  (
    {
      href,
      label = 'Back',
      className,
      variant = 'ghost',
      size = 'sm',
      showIcon = true,
      disabled = false,
      style,
      ...props
    },
    ref
  ) => {
    const linkRef = React.useRef<HTMLAnchorElement>(null)

    // Enhanced keyboard navigation
    const { handleKeyDown } = useKeyboardNavigation({
      onEnter: () => {
        if (!disabled && linkRef.current) {
          linkRef.current.click()
        }
      },
      preventDefault: false, // Let default link behavior work
    })

    const baseStyles = cn(
      'w-fit transition-all duration-150 ease-out',
      'hover:translate-x-[-2px]', // Subtle hover animation
      'focus-visible:translate-x-[-2px]',
      'focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-offset-2',
      className
    )

    return (
      <Button
        variant={variant}
        size={size}
        asChild
        disabled={disabled}
        className={baseStyles}
        data-testid="back-button"
      >
        <Link
          href={href}
          ref={(node) => {
            linkRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
          className="flex items-center gap-2"
          style={style}
          onKeyDown={handleKeyDown}
          aria-label={`Navigate back: ${label}`}
          role="button"
          {...props}
        >
          {showIcon && <ArrowLeft className="size-4" aria-hidden="true" />}
          <span>{label}</span>
        </Link>
      </Button>
    )
  }
)

BackButton.displayName = 'BackButton'
