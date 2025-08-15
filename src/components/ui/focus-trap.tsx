'use client'

import React, { useEffect, useRef } from 'react'

interface FocusTrapProps {
  children: React.ReactNode
  isActive: boolean
  initialFocus?: React.RefObject<HTMLElement>
  restoreFocus?: React.RefObject<HTMLElement>
}

export function FocusTrap({ 
  children, 
  isActive, 
  initialFocus, 
  restoreFocus 
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive) return

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement

    // Copy refs to local variables inside the effect
    const initialFocusElement = initialFocus?.current
    const restoreFocusElement = restoreFocus?.current
    const containerElement = containerRef.current

    // Set initial focus
    setTimeout(() => {
      if (initialFocusElement) {
        initialFocusElement.focus()
      } else if (containerElement) {
        const firstFocusable = getFocusableElements(containerElement)[0]
        if (firstFocusable) {
          firstFocusable.focus()
        }
      }
    }, 0)

    return () => {
      // Restore focus when trap is deactivated
      if (restoreFocusElement) {
        restoreFocusElement.focus()
      } else if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [isActive, initialFocus, restoreFocus])

  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const selector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    return Array.from(container.querySelectorAll(selector)) as HTMLElement[]
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isActive || event.key !== 'Tab' || !containerRef.current) return

    const focusableElements = getFocusableElements(containerRef.current)
    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]

    if (event.shiftKey) {
      // Shift + Tab (backward)
      if (document.activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable?.focus()
      }
    } else {
      // Tab (forward)
      if (document.activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable?.focus()
      }
    }
  }

  if (!isActive) {
    return <>{children}</>
  }

  return (
    <div ref={containerRef} onKeyDown={handleKeyDown}>
      {children}
    </div>
  )
}