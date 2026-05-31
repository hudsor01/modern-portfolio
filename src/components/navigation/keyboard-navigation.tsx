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
