'use client'

import * as React from 'react'

/**
 * Keyboard Navigation Hook
 *
 * Provides consistent keyboard navigation support across all interactive elements
 * Implements standardized focus management and visual focus indicators
 */

export interface NavigationKeyboardOptions {
  onEnter?: () => void
  onSpace?: () => void
  onEscape?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onArrowLeft?: () => void
  onArrowRight?: () => void
  onTab?: () => void
  onShiftTab?: () => void
  preventDefault?: boolean
  stopPropagation?: boolean
}

export function useKeyboardNavigation(options: NavigationKeyboardOptions = {}) {
  const {
    onEnter,
    onSpace,
    onEscape,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    onShiftTab,
    preventDefault = true,
    stopPropagation = false,
  } = options

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (stopPropagation) {
        event.stopPropagation()
      }

      switch (event.key) {
        case 'Enter':
          if (onEnter) {
            if (preventDefault) event.preventDefault()
            onEnter()
          }
          break
        case ' ':
        case 'Space':
          if (onSpace) {
            if (preventDefault) event.preventDefault()
            onSpace()
          }
          break
        case 'Escape':
          if (onEscape) {
            if (preventDefault) event.preventDefault()
            onEscape()
          }
          break
        case 'ArrowUp':
          if (onArrowUp) {
            if (preventDefault) event.preventDefault()
            onArrowUp()
          }
          break
        case 'ArrowDown':
          if (onArrowDown) {
            if (preventDefault) event.preventDefault()
            onArrowDown()
          }
          break
        case 'ArrowLeft':
          if (onArrowLeft) {
            if (preventDefault) event.preventDefault()
            onArrowLeft()
          }
          break
        case 'ArrowRight':
          if (onArrowRight) {
            if (preventDefault) event.preventDefault()
            onArrowRight()
          }
          break
        case 'Tab':
          if (event.shiftKey && onShiftTab) {
            if (preventDefault) event.preventDefault()
            onShiftTab()
          } else if (!event.shiftKey && onTab) {
            if (preventDefault) event.preventDefault()
            onTab()
          }
          break
      }
    },
    [
      onEnter,
      onSpace,
      onEscape,
      onArrowUp,
      onArrowDown,
      onArrowLeft,
      onArrowRight,
      onTab,
      onShiftTab,
      preventDefault,
      stopPropagation,
    ]
  )

  return { handleKeyDown }
}

/**
 * Focus Management Hook
 *
 * Provides consistent focus management and visual focus indicators
 */

export interface FocusManagementOptions {
  autoFocus?: boolean
  restoreFocus?: boolean
  trapFocus?: boolean
  focusableSelector?: string
}

export function useFocusManagement(options: FocusManagementOptions = {}) {
  const {
    autoFocus = false,
    restoreFocus = false,
    trapFocus = false,
    focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  } = options

  const containerRef = React.useRef<HTMLElement>(null)
  const previousActiveElement = React.useRef<Element | null>(null)

  // Store the previously focused element when component mounts
  React.useEffect(() => {
    if (restoreFocus) {
      previousActiveElement.current = document.activeElement
    }
  }, [restoreFocus])

  // Auto focus on mount
  React.useEffect(() => {
    if (autoFocus && containerRef.current) {
      const firstFocusable = containerRef.current.querySelector(focusableSelector) as HTMLElement
      if (firstFocusable) {
        firstFocusable.focus()
      }
    }
  }, [autoFocus, focusableSelector])

  // Restore focus on unmount
  React.useEffect(() => {
    return () => {
      if (restoreFocus && previousActiveElement.current) {
        ;(previousActiveElement.current as HTMLElement).focus?.()
      }
    }
  }, [restoreFocus])

  // Focus trap implementation
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!trapFocus || event.key !== 'Tab' || !containerRef.current) {
        return
      }

      const focusableElements = Array.from(
        containerRef.current.querySelectorAll(focusableSelector)
      ) as HTMLElement[]

      if (focusableElements.length === 0) {
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    },
    [trapFocus, focusableSelector]
  )

  const focusFirst = React.useCallback(() => {
    if (containerRef.current) {
      const firstFocusable = containerRef.current.querySelector(focusableSelector) as HTMLElement
      if (firstFocusable) {
        firstFocusable.focus()
      }
    }
  }, [focusableSelector])

  const focusLast = React.useCallback(() => {
    if (containerRef.current) {
      const focusableElements = Array.from(
        containerRef.current.querySelectorAll(focusableSelector)
      ) as HTMLElement[]
      const lastFocusable = focusableElements[focusableElements.length - 1]
      if (lastFocusable) {
        lastFocusable.focus()
      }
    }
  }, [focusableSelector])

  return {
    containerRef,
    handleKeyDown,
    focusFirst,
    focusLast,
  }
}

/**
 * Accessibility Announcer Hook
 *
 * Provides consistent screen reader announcements
 */

export interface AccessibilityAnnouncerOptions {
  politeness?: 'polite' | 'assertive'
  atomic?: boolean
}

export function useAccessibilityAnnouncer(options: AccessibilityAnnouncerOptions = {}) {
  const { politeness = 'polite', atomic = true } = options
  const announcerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    // Create live region if it doesn't exist
    if (!announcerRef.current) {
      const announcer = document.createElement('div')
      announcer.setAttribute('aria-live', politeness)
      announcer.setAttribute('aria-atomic', atomic.toString())
      announcer.setAttribute('class', 'sr-only')
      announcer.style.position = 'absolute'
      announcer.style.left = '-10000px'
      announcer.style.width = '1px'
      announcer.style.height = '1px'
      announcer.style.overflow = 'hidden'
      document.body.appendChild(announcer)
      announcerRef.current = announcer
    }

    return () => {
      if (announcerRef.current && document.body.contains(announcerRef.current)) {
        document.body.removeChild(announcerRef.current)
      }
    }
  }, [politeness, atomic])

  const announce = React.useCallback((message: string) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = message
    }
  }, [])

  return { announce }
}

/**
 * Roving Tabindex Hook
 *
 * Implements roving tabindex pattern for keyboard navigation in lists/grids
 */

export interface RovingTabindexOptions {
  orientation?: 'horizontal' | 'vertical' | 'both'
  loop?: boolean
  defaultIndex?: number
}

export function useRovingTabindex(options: RovingTabindexOptions = {}) {
  const { orientation = 'horizontal', loop = true, defaultIndex = 0 } = options
  const [activeIndex, setActiveIndex] = React.useState(defaultIndex)
  const itemsRef = React.useRef<HTMLElement[]>([])

  const registerItem = React.useCallback(
    (element: HTMLElement | null, index: number) => {
      if (element) {
        itemsRef.current[index] = element
        element.setAttribute('tabindex', index === activeIndex ? '0' : '-1')
      }
    },
    [activeIndex]
  )

  const moveToIndex = React.useCallback(
    (newIndex: number) => {
      const items = itemsRef.current.filter(Boolean)
      if (items.length === 0) return

      let targetIndex = newIndex

      if (loop) {
        if (targetIndex < 0) {
          targetIndex = items.length - 1
        } else if (targetIndex >= items.length) {
          targetIndex = 0
        }
      } else {
        targetIndex = Math.max(0, Math.min(targetIndex, items.length - 1))
      }

      setActiveIndex(targetIndex)
      items[targetIndex]?.focus()
    },
    [loop]
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent, currentIndex: number) => {
      const items = itemsRef.current.filter(Boolean)
      if (items.length === 0) return

      switch (event.key) {
        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'both') {
            event.preventDefault()
            moveToIndex(currentIndex + 1)
          }
          break
        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'both') {
            event.preventDefault()
            moveToIndex(currentIndex - 1)
          }
          break
        case 'ArrowDown':
          if (orientation === 'vertical' || orientation === 'both') {
            event.preventDefault()
            moveToIndex(currentIndex + 1)
          }
          break
        case 'ArrowUp':
          if (orientation === 'vertical' || orientation === 'both') {
            event.preventDefault()
            moveToIndex(currentIndex - 1)
          }
          break
        case 'Home':
          event.preventDefault()
          moveToIndex(0)
          break
        case 'End':
          event.preventDefault()
          moveToIndex(items.length - 1)
          break
      }
    },
    [orientation, moveToIndex]
  )

  React.useEffect(() => {
    // Update tabindex attributes when active index changes
    itemsRef.current.forEach((item, index) => {
      if (item) {
        item.setAttribute('tabindex', index === activeIndex ? '0' : '-1')
      }
    })
  }, [activeIndex])

  return {
    activeIndex,
    registerItem,
    handleKeyDown,
    moveToIndex,
  }
}
