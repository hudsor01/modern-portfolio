'use client'

import { useEffect, useCallback, useRef } from 'react'

interface KeyboardNavigationOptions {
  onEscape?: () => void
  onEnter?: () => void
  onSpace?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onTab?: (event: KeyboardEvent) => void
  onHome?: () => void
  onEnd?: () => void
  enabled?: boolean
  preventDefault?: boolean
}

export function useKeyboardNavigation({
  onEscape,
  onEnter,
  onSpace,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  onTab,
  onHome,
  onEnd,
  enabled = true,
  preventDefault = true
}: KeyboardNavigationOptions) {
  const handlerRef = useRef<KeyboardNavigationOptions>({})

  // Update handler ref with latest callbacks (no useEffect needed for refs)
  handlerRef.current = {
    onEscape,
    onEnter,
    onSpace,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    onHome,
    onEnd
  }

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    const handlers = handlerRef.current
    let handled = false

    switch (event.key) {
      case 'Escape':
        if (handlers.onEscape) {
          handlers.onEscape()
          handled = true
        }
        break
      case 'Enter':
        if (handlers.onEnter) {
          handlers.onEnter()
          handled = true
        }
        break
      case ' ':
        if (handlers.onSpace) {
          handlers.onSpace()
          handled = true
        }
        break
      case 'ArrowUp':
        if (handlers.onArrowUp) {
          handlers.onArrowUp()
          handled = true
        }
        break
      case 'ArrowDown':
        if (handlers.onArrowDown) {
          handlers.onArrowDown()
          handled = true
        }
        break
      case 'ArrowLeft':
        if (handlers.onArrowLeft) {
          handlers.onArrowLeft()
          handled = true
        }
        break
      case 'ArrowRight':
        if (handlers.onArrowRight) {
          handlers.onArrowRight()
          handled = true
        }
        break
      case 'Tab':
        if (handlers.onTab) {
          handlers.onTab(event)
          handled = true
        }
        break
      case 'Home':
        if (handlers.onHome) {
          handlers.onHome()
          handled = true
        }
        break
      case 'End':
        if (handlers.onEnd) {
          handlers.onEnd()
          handled = true
        }
        break
    }

    if (handled && preventDefault) {
      event.preventDefault()
    }
  }, [enabled, preventDefault])

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown)
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enabled, handleKeyDown])

  return { handleKeyDown }
}

// Hook for managing focus within a container
export function useFocusManagement(containerRef: React.RefObject<HTMLElement>) {
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return []
    
    const selector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    return Array.from(containerRef.current.querySelectorAll(selector)) as HTMLElement[]
  }, [containerRef])

  const focusFirst = useCallback(() => {
    const elements = getFocusableElements()
    if (elements.length > 0) {
      elements[0]?.focus()
    }
  }, [getFocusableElements])

  const focusLast = useCallback(() => {
    const elements = getFocusableElements()
    if (elements.length > 0) {
      elements[elements.length - 1]?.focus()
    }
  }, [getFocusableElements])

  const focusNext = useCallback(() => {
    const elements = getFocusableElements()
    const currentIndex = elements.indexOf(document.activeElement as HTMLElement)
    
    if (currentIndex >= 0 && currentIndex < elements.length - 1) {
      elements[currentIndex + 1]?.focus()
    } else {
      elements[0]?.focus() // Wrap to first
    }
  }, [getFocusableElements])

  const focusPrevious = useCallback(() => {
    const elements = getFocusableElements()
    const currentIndex = elements.indexOf(document.activeElement as HTMLElement)
    
    if (currentIndex > 0) {
      elements[currentIndex - 1]?.focus()
    } else {
      elements[elements.length - 1]?.focus() // Wrap to last
    }
  }, [getFocusableElements])

  return {
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    getFocusableElements
  }
}