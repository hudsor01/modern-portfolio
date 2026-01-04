/**
 * Browser API Mocks - Must run BEFORE any other setup
 *
 * This file provides proper class constructor mocks for browser APIs
 * that happy-dom doesn't include but Next.js requires.
 *
 * IMPORTANT: This file must be listed FIRST in vitest.config.ts setupFiles
 */

import { vi } from 'vitest'

// =============================================================================
// IntersectionObserver Mock (required for Next.js Image, Link, etc.)
// =============================================================================

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []

  constructor(
    _callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit
  ) {}

  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [] as IntersectionObserverEntry[])
}

// =============================================================================
// ResizeObserver Mock (required for many UI components)
// =============================================================================

class MockResizeObserver implements ResizeObserver {
  constructor(_callback: ResizeObserverCallback) {}

  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

// =============================================================================
// Assign to globalThis IMMEDIATELY
// =============================================================================

// Use Object.defineProperty for better compatibility with different environments
Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})

Object.defineProperty(globalThis, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
})

// Also set on window if it exists (for happy-dom compatibility)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  })
  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    configurable: true,
    value: MockResizeObserver,
  })
}
