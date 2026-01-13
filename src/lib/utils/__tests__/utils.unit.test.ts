import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import {
  absoluteUrl,
  absoluteUrlTestable,
  cn,
  formatProjectName,
  delay,
  isServer,
  isClient,
  truncate,
  formatRelativeTime,
  getCurrentBreakpoint,
  getCurrentBreakpointTestable,
  generateId,
  slugify,
  parseParam,
  safeJsonParse,
  isInViewport,
  isInViewportTestable,
  createUrl,
  formatData,
} from '@/lib/utils'

// Store original window properties for restoration
// IMPORTANT: We modify properties on the existing window object instead of replacing it
// to avoid corrupting happy-dom's internal PropertySymbol.cache
let originalInnerWidth: number | undefined
let originalInnerHeight: number | undefined

describe('Utils', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Save original values if window exists (happy-dom environment)
    if (typeof window !== 'undefined') {
      originalInnerWidth = window.innerWidth
      originalInnerHeight = window.innerHeight
    }
  })

  afterEach(() => {
    vi.useRealTimers()
    // Restore original values - don't replace window object, just restore properties
    if (typeof window !== 'undefined') {
      if (originalInnerWidth !== undefined) {
        Object.defineProperty(window, 'innerWidth', {
          value: originalInnerWidth,
          writable: true,
          configurable: true,
        })
      }
      if (originalInnerHeight !== undefined) {
        Object.defineProperty(window, 'innerHeight', {
          value: originalInnerHeight,
          writable: true,
          configurable: true,
        })
      }
    }
  })

  describe('absoluteUrl', () => {
    it('should return correct URL for localhost', () => {
      // Mock window.location.origin on existing window (don't replace window object)
      if (typeof window !== 'undefined') {
        Object.defineProperty(window, 'location', {
          value: {
            origin: 'http://localhost:3000',
            host: 'localhost:3000',
            href: 'http://localhost:3000',
          },
          writable: true,
          configurable: true,
        })
      }

      const result = absoluteUrl('/test')
      expect(result).toBe('http://localhost:3000/test')
    })

    it('should return correct URL for production', () => {
      // Mock window.location.origin on existing window (don't replace window object)
      if (typeof window !== 'undefined') {
        Object.defineProperty(window, 'location', {
          value: {
            origin: 'https://example.com',
            host: 'example.com',
            href: 'https://example.com',
          },
          writable: true,
          configurable: true,
        })
      }

      const result = absoluteUrl('/test')
      expect(result).toBe('https://example.com/test')
    })

    // NOTE: Tests for server-side behavior now use testable versions
    it('should use env var when window is not available', () => {
      // Test server-side behavior by passing undefined window
      const result = absoluteUrlTestable('/test', undefined)
      expect(result).toBe('https://richardwhudsonjr.com/test')
    })

    it('should use default when window and env var are not available', () => {
      // Test with undefined window and no env vars
      const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
      const originalVercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL

      delete process.env.NEXT_PUBLIC_SITE_URL
      delete process.env.NEXT_PUBLIC_VERCEL_URL

      const result = absoluteUrlTestable('/test', undefined)
      expect(result).toBe('https://richardwhudsonjr.com/test')

      // Restore env vars
      process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl
      process.env.NEXT_PUBLIC_VERCEL_URL = originalVercelUrl
    })
  })

  describe('cn', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2', { class3: true, class4: false })
      expect(result).toContain('class1')
      expect(result).toContain('class2')
      expect(result).toContain('class3')
      expect(result).not.toContain('class4')
    })
  })

  describe('formatProjectName', () => {
    it('should format project name correctly', () => {
      const result = formatProjectName('my-awesome-project')
      expect(result).toBe('My Awesome Project')
    })

    it('should handle single word', () => {
      const result = formatProjectName('project')
      expect(result).toBe('Project')
    })
  })

  describe('delay', () => {
    it('should delay for specified time', async () => {
      // Use real timers for this test since delay() uses setTimeout
      vi.useRealTimers()

      const start = Date.now()
      await delay(100)
      const end = Date.now()

      expect(end - start).toBeGreaterThanOrEqual(95) // Allow for small timing variations

      // Restore fake timers for other tests
      vi.useFakeTimers()
    })
  })

  describe('isServer and isClient', () => {
    it('should correctly identify server/client environment', () => {
      // This is based on the runtime environment, so we just check they are opposites
      expect(isServer).toBe(!isClient)
    })
  })

  describe('truncate', () => {
    it('should not truncate if text is shorter than max length', () => {
      const result = truncate('short', 10)
      expect(result).toBe('short')
    })

    it('should truncate if text is longer than max length', () => {
      const result = truncate('this is a very long text', 10)
      expect(result).toBe('this is a ...')
    })
  })

  describe('formatRelativeTime', () => {
    it('should format relative time for seconds', () => {
      const pastDate = new Date(Date.now() - 30000) // 30 seconds ago
      const result = formatRelativeTime(pastDate)
      expect(result).toContain('seconds')
    })

    it('should format relative time for minutes', () => {
      const pastDate = new Date(Date.now() - 120000) // 2 minutes ago
      const result = formatRelativeTime(pastDate)
      expect(result).toContain('minutes')
    })

    it('should format relative time for hours', () => {
      const pastDate = new Date(Date.now() - 3600000) // 1 hour ago
      const result = formatRelativeTime(pastDate)
      expect(result).toContain('hour')
    })

    it('should format relative time for days', () => {
      const pastDate = new Date(Date.now() - 86400000) // 1 day ago
      const result = formatRelativeTime(pastDate)
      expect(result).toContain('day')
    })

    it('should format relative time for months', () => {
      const pastDate = new Date(Date.now() - 30 * 86400000) // 30 days ago
      const result = formatRelativeTime(pastDate)
      expect(result).toContain('month')
    })

    it('should format relative time for years', () => {
      const pastDate = new Date(Date.now() - 365 * 86400000) // 1 year ago
      const result = formatRelativeTime(pastDate)
      expect(result).toContain('year')
    })

    it('should handle string dates', () => {
      const result = formatRelativeTime('2023-01-01')
      expect(result).toContain('ago') // Should contain relative time text
    })
  })

  describe('getCurrentBreakpoint', () => {
    // NOTE: Server-side test now uses testable version
    it('should return md breakpoint on server', () => {
      const result = getCurrentBreakpointTestable(undefined)
      expect(result).toBe('md')
    })

    it('should return xs breakpoint for small screens', () => {
      // Mock window.innerWidth on existing window (don't replace window object)
      Object.defineProperty(window, 'innerWidth', {
        value: 300,
        writable: true,
        configurable: true,
      })

      const result = getCurrentBreakpoint()
      expect(result).toBe('xs')
    })

    it('should return sm breakpoint for small screens', () => {
      // Mock window.innerWidth on existing window (don't replace window object)
      Object.defineProperty(window, 'innerWidth', {
        value: 700,
        writable: true,
        configurable: true,
      })

      const result = getCurrentBreakpoint()
      expect(result).toBe('sm')
    })

    it('should return md breakpoint for medium screens', () => {
      // Mock window.innerWidth on existing window (don't replace window object)
      Object.defineProperty(window, 'innerWidth', {
        value: 900,
        writable: true,
        configurable: true,
      })

      const result = getCurrentBreakpoint()
      expect(result).toBe('md')
    })

    it('should return lg breakpoint for large screens', () => {
      // Mock window.innerWidth on existing window (don't replace window object)
      Object.defineProperty(window, 'innerWidth', {
        value: 1200,
        writable: true,
        configurable: true,
      })

      const result = getCurrentBreakpoint()
      expect(result).toBe('lg')
    })

    it('should return xl breakpoint for extra large screens', () => {
      // Mock window.innerWidth on existing window (don't replace window object)
      Object.defineProperty(window, 'innerWidth', {
        value: 1400,
        writable: true,
        configurable: true,
      })

      const result = getCurrentBreakpoint()
      expect(result).toBe('xl')
    })

    it('should return 2xl breakpoint for very large screens', () => {
      // Mock window.innerWidth on existing window (don't replace window object)
      Object.defineProperty(window, 'innerWidth', {
        value: 1600,
        writable: true,
        configurable: true,
      })

      const result = getCurrentBreakpoint()
      expect(result).toBe('2xl')
    })
  })

  describe('generateId', () => {
    it('should generate ID with default length', () => {
      const id = generateId()
      expect(id).toHaveLength(8)
      expect(typeof id).toBe('string')
    })

    it('should generate ID with specified length', () => {
      const id = generateId(5)
      expect(id).toHaveLength(5)
      expect(typeof id).toBe('string')
    })

    it('should generate random IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      // While there's a tiny chance they could be the same, it's extremely unlikely
      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(id1).not.toBe(id2)
    })
  })

  describe('slugify', () => {
    it('should convert text to slug format', () => {
      const result = slugify('My Awesome Project')
      expect(result).toBe('my-awesome-project')
    })

    it('should handle special characters', () => {
      const result = slugify('Hello, World!')
      expect(result).toBe('hello-world')
    })

    it('should handle ampersands', () => {
      const result = slugify('Company & Partners')
      expect(result).toBe('company-and-partners')
    })

    it('should handle multiple spaces', () => {
      const result = slugify('  multiple   spaces  ')
      expect(result).toBe('multiple-spaces')
    })
  })

  describe('parseParam', () => {
    it('should return default value when param is undefined', () => {
      const result = parseParam<string>(undefined, 'default')
      expect(result).toBe('default')
    })

    it('should parse number parameters', () => {
      const result = parseParam<number>('42', 0)
      expect(result).toBe(42)
    })

    it('should return default number when param is not a valid number', () => {
      const result = parseParam<number>('invalid', 10)
      expect(result).toBe(10)
    })

    it('should parse boolean parameters (true)', () => {
      const result = parseParam<boolean>('true', false)
      expect(result).toBe(true)
    })

    it('should parse boolean parameters (false)', () => {
      const result = parseParam<boolean>('false', true)
      expect(result).toBe(false)
    })

    it('should return default value for invalid boolean string', () => {
      // parseParam returns the default value when boolean string is invalid
      const result = parseParam<boolean>('maybe', true)
      expect(result).toBe(true)
    })

    it('should handle array parameters', () => {
      const result = parseParam<string>(['hello'], 'default')
      expect(result).toBe('hello')
    })

    it('should handle string parameters', () => {
      const result = parseParam<string>('hello', 'default')
      expect(result).toBe('hello')
    })
  })

  describe('safeJsonParse', () => {
    it('should parse valid JSON', () => {
      // Using proper Zod import and schema
      const { z } = require('zod')
      const schema = z.object({ test: z.string() })
      const fallback = { test: 'fallback' }
      const result = safeJsonParse('{"test": "value"}', schema, fallback)
      expect(result.test).toBe('value')
    })

    it('should return fallback for invalid JSON', () => {
      // Using proper Zod import and schema
      const { z } = require('zod')
      const schema = z.object({ test: z.string() })
      const fallback = { test: 'fallback' }
      const result = safeJsonParse('invalid json', schema, fallback)
      expect(result).toBe(fallback)
    })
  })

  describe('isInViewport', () => {
    // NOTE: Server-side test now uses testable version
    it('should return false on server', () => {
      const mockElement = document.createElement('div')
      const result = isInViewportTestable(mockElement, 0, undefined)
      expect(result).toBe(false)
    })

    it('should return true when element is in viewport', () => {
      // Mock window dimensions on existing window (don't replace window object)
      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
        writable: true,
        configurable: true,
      })
      Object.defineProperty(window, 'innerHeight', {
        value: 768,
        writable: true,
        configurable: true,
      })

      const mockElement = {
        getBoundingClientRect: () => ({
          top: 100,
          bottom: 200,
          left: 50,
          right: 150,
          width: 100,
          height: 100,
        }),
      } as unknown as HTMLElement

      const result = isInViewport(mockElement)
      expect(result).toBe(true)
    })

    it('should return false when element is not in viewport', () => {
      // Mock window dimensions on existing window (don't replace window object)
      Object.defineProperty(window, 'innerWidth', {
        value: 1024,
        writable: true,
        configurable: true,
      })
      Object.defineProperty(window, 'innerHeight', {
        value: 768,
        writable: true,
        configurable: true,
      })

      const mockElement = {
        getBoundingClientRect: () => ({
          top: 2000,
          bottom: 2100,
          left: 2000,
          right: 2100,
          width: 100,
          height: 100,
        }),
      } as unknown as HTMLElement

      const result = isInViewport(mockElement)
      expect(result).toBe(false)
    })
  })

  describe('createUrl', () => {
    it('should create URL with params', () => {
      const result = createUrl('/test', { param1: 'value1', param2: 'value2' })
      expect(result).toBe('/test?param1=value1&param2=value2')
    })

    it('should create URL with mixed param types', () => {
      const result = createUrl('/test', {
        str: 'string',
        num: 42,
        bool: true,
        undef: undefined,
      })
      expect(result).toBe('/test?str=string&num=42&bool=true')
    })

    it('should create URL without params when none provided', () => {
      const result = createUrl('/test', {})
      expect(result).toBe('/test')
    })

    it('should create URL without undefined params', () => {
      const result = createUrl('/test', { param1: 'value1', param2: undefined })
      expect(result).toBe('/test?param1=value1')
    })
  })

  describe('formatData', () => {
    it('should format data with timestamp', () => {
      const data = { test: 'value' }
      const result = formatData(data)

      expect(result.formatted).toEqual(data)
      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
    })
  })
})
