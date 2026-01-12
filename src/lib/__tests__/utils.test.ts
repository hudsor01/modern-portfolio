/**
 * Unit tests for core utility functions
 */
import { describe, it, expect } from 'vitest'
import {
  cn,
  formatProjectName,
  delay,
  truncate,
  formatRelativeTime,
  slugify,
  parseParam,
  safeJsonParse,
  generateId,
  createUrl,
  formatData,
  getCurrentBreakpointTestable,
  absoluteUrlTestable,
} from '../utils'
import { z } from 'zod'

describe('cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
    expect(cn('foo', { bar: true })).toBe('foo bar')
    expect(cn('foo', { bar: false })).toBe('foo')
    expect(cn('foo', null, undefined, 'bar')).toBe('foo bar')
  })

  it('should handle tailwind merge conflicts', () => {
    expect(cn('p-4 p-6')).toBe('p-6')
    expect(cn('text-red-500 text-blue-500')).toBe('text-blue-500')
  })
})

describe('formatProjectName', () => {
  it('should convert kebab-case to Title Case', () => {
    expect(formatProjectName('my-project')).toBe('My Project')
    expect(formatProjectName('hello-world-test')).toBe('Hello World Test')
  })

  it('should handle single word', () => {
    expect(formatProjectName('project')).toBe('Project')
  })

  it('should handle already title case', () => {
    expect(formatProjectName('My Project')).toBe('My Project')
  })
})

describe('delay', () => {
  it('should resolve after specified milliseconds', async () => {
    const start = Date.now()
    await delay(50)
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(40)
    expect(elapsed).toBeLessThan(100)
  })
})

describe('truncate', () => {
  it('should return original string if shorter than max length', () => {
    expect(truncate('hello', 10)).toBe('hello')
    expect(truncate('', 5)).toBe('')
  })

  it('should truncate and add ellipsis if longer than max length', () => {
    const result = truncate('hello world', 8)
    expect(result.length).toBe(11) // 'hello...' = 8 chars
    expect(result.endsWith('...')).toBe(true)
    expect(result.startsWith('hello')).toBe(true)
  })

  it('should handle exact max length', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })
})

describe('formatRelativeTime', () => {
  it('should format seconds ago', () => {
    const now = Date.now()
    const past = new Date(now - 30 * 1000) // 30 seconds ago
    expect(formatRelativeTime(past)).toMatch(/30 seconds/)
  })

  it('should format minutes ago', () => {
    const now = Date.now()
    const past = new Date(now - 2 * 60 * 1000) // 2 minutes ago
    expect(formatRelativeTime(past)).toMatch(/2 minutes/)
  })

  it('should format hours ago', () => {
    const now = Date.now()
    const past = new Date(now - 4 * 60 * 60 * 1000) // 4 hours ago
    expect(formatRelativeTime(past)).toMatch(/4 hours/)
  })

  it('should format days ago', () => {
    const now = Date.now()
    const past = new Date(now - 4 * 24 * 60 * 60 * 1000) // 4 days ago
    expect(formatRelativeTime(past)).toMatch(/4 days/)
  })
})

describe('slugify', () => {
  it('should convert text to URL-friendly slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
    expect(slugify('Test & Development')).toBe('test-and-development')
    expect(slugify('  multiple   spaces  ')).toBe('multiple-spaces')
  })

  it('should remove special characters', () => {
    expect(slugify('Hello@#$%World')).toBe('helloworld')
    expect(slugify('Test...')).toBe('test')
  })

  it('should handle consecutive dashes', () => {
    expect(slugify('hello---world')).toBe('hello-world')
  })
})

describe('parseParam', () => {
  it('should return default value for undefined', () => {
    expect(parseParam(undefined, 'default')).toBe('default')
    expect(parseParam(undefined, 42)).toBe(42)
    expect(parseParam(undefined, true)).toBe(true)
  })

  it('should parse string array to single value', () => {
    expect(parseParam(['a', 'b'], 'default')).toBe('a')
  })

  it('should parse number values', () => {
    expect(parseParam('123', 0)).toBe(123)
    expect(parseParam('abc', 0)).toBe(0)
    expect(parseParam('', 0)).toBe(0)
  })

  it('should parse boolean values', () => {
    expect(parseParam('true', false)).toBe(true)
    expect(parseParam('false', false)).toBe(false)
    expect(parseParam('invalid', false)).toBe(false)
  })
})

describe('safeJsonParse', () => {
  const schema = z.object({
    name: z.string(),
    age: z.number(),
  })

  it('should parse valid JSON that matches schema', () => {
    const result = safeJsonParse('{"name":"John","age":30}', schema, { name: '', age: 0 })
    expect(result).toEqual({ name: 'John', age: 30 })
  })

  it('should return fallback for invalid JSON', () => {
    const result = safeJsonParse('invalid json', schema, { name: 'fallback', age: 0 })
    expect(result).toEqual({ name: 'fallback', age: 0 })
  })

  it('should return fallback for JSON not matching schema', () => {
    const result = safeJsonParse('{"name":"John"}', schema, { name: 'fallback', age: 0 })
    expect(result).toEqual({ name: 'fallback', age: 0 })
  })
})

describe('generateId', () => {
  it('should generate id of default length', () => {
    const id = generateId()
    expect(id).toHaveLength(8)
    expect(/^[a-z0-9]+$/.test(id)).toBe(true)
  })

  it('should generate id of specified length', () => {
    const id = generateId(16)
    expect(id).toHaveLength(16)
  })
})

describe('createUrl', () => {
  it('should create URL with params', () => {
    expect(createUrl('/test', { foo: 'bar' })).toBe('/test?foo=bar')
    expect(createUrl('/test', { page: 1, limit: 10 })).toBe('/test?page=1&limit=10')
  })

  it('should omit undefined values', () => {
    expect(createUrl('/test', { foo: 'bar', baz: undefined })).toBe('/test?foo=bar')
  })

  it('should handle boolean values', () => {
    expect(createUrl('/test', { active: true })).toBe('/test?active=true')
  })

  it('should return pathname only when no params', () => {
    expect(createUrl('/test', {})).toBe('/test')
  })
})

describe('formatData', () => {
  it('should format data with timestamp', () => {
    const result = formatData({ name: 'test' })
    expect(result.formatted).toEqual({ name: 'test' })
    expect(typeof result.timestamp).toBe('string')
  })
})

describe('getCurrentBreakpointTestable', () => {
  it('should return md for server-side', () => {
    expect(getCurrentBreakpointTestable()).toBe('md')
  })

  it('should detect breakpoints based on window width', () => {
    expect(getCurrentBreakpointTestable({ innerWidth: 500 } as typeof window)).toBe('xs')
    expect(getCurrentBreakpointTestable({ innerWidth: 700 } as typeof window)).toBe('sm')
    expect(getCurrentBreakpointTestable({ innerWidth: 900 } as typeof window)).toBe('md')
    expect(getCurrentBreakpointTestable({ innerWidth: 1200 } as typeof window)).toBe('lg')
    expect(getCurrentBreakpointTestable({ innerWidth: 1400 } as typeof window)).toBe('xl')
    expect(getCurrentBreakpointTestable({ innerWidth: 2000 } as typeof window)).toBe('2xl')
  })
})

describe('absoluteUrlTestable', () => {
  it('should use window origin when provided', () => {
    expect(absoluteUrlTestable('/path', { location: { origin: 'http://localhost:3000' } } as typeof window))
      .toBe('http://localhost:3000/path')
  })
})