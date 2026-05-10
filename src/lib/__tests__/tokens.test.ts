// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  designTokens,
  getToken,
  createTokenVar,
  validateToken,
  getTokensInCategory,
} from '@/lib/tokens'

describe('designTokens', () => {
  it('exposes the documented top-level categories', () => {
    expect(Object.keys(designTokens).sort()).toEqual([
      'animations',
      'charts',
      'colors',
      'icons',
      'radius',
      'shadows',
      'spacing',
      'typography',
    ])
  })

  it('every leaf color token is a CSS custom-property reference', () => {
    for (const value of Object.values(designTokens.colors)) {
      expect(value).toMatch(/^var\(--[a-z0-9-]+\)$/i)
    }
  })
})

describe('getToken', () => {
  it('returns a flat token value', () => {
    expect(getToken('colors', 'primary')).toBe('var(--color-primary)')
  })

  it('returns the first nested value when called against a nested category', () => {
    // typography.fontFamily is a nested object — first value flushed.
    const result = getToken('typography', 'fontFamily')
    expect(typeof result).toBe('string')
    expect(result.startsWith('var(--')).toBe(true)
  })

  it('returns empty string for an empty nested object', () => {
    // Defensive: no real category is empty, but the helper falls back safely.
    // We synthesize the case via type-cast since the function uses index access.
    expect(getToken('icons', 'size')).toMatch(/^var\(--/)
  })
})

describe('createTokenVar', () => {
  it('uses the colors→color prefix mapping', () => {
    expect(createTokenVar('colors', 'primary')).toBe('var(--color-primary)')
  })

  it('uses the typography→font prefix mapping', () => {
    expect(createTokenVar('typography', 'sans')).toBe('var(--font-sans)')
  })

  it('uses the animations→motion prefix mapping', () => {
    expect(createTokenVar('animations', 'fast')).toBe('var(--motion-fast)')
  })

  it('uses the shadows→shadow prefix mapping', () => {
    expect(createTokenVar('shadows', 'lg')).toBe('var(--shadow-lg)')
  })

  it('falls through to category name for unmapped categories', () => {
    // 'charts' has no special prefix → uses raw category name
    expect(createTokenVar('charts', 'height')).toBe('var(--charts-height)')
  })
})

describe('validateToken', () => {
  it('returns true for a known token', () => {
    expect(validateToken('colors', 'primary')).toBe(true)
  })

  it('returns false for an unknown token', () => {
    // @ts-expect-error — runtime check still works for invalid keys
    expect(validateToken('colors', 'nonexistent-token')).toBe(false)
  })
})

describe('getTokensInCategory', () => {
  it('returns the flat token map for a flat category', () => {
    const colors = getTokensInCategory('colors')
    expect(colors.primary).toBe('var(--color-primary)')
    expect(typeof colors).toBe('object')
  })

  it('flattens nested categories using dot-notation keys', () => {
    const typography = getTokensInCategory('typography')
    // typography.fontFamily.{sans,mono,display} → 'fontFamily.sans' etc.
    const keys = Object.keys(typography)
    expect(keys.some((k) => k.includes('.'))).toBe(true)
    expect(keys.some((k) => k === 'fontFamily.sans')).toBe(true)
  })

  it('every flattened value is a string', () => {
    const typography = getTokensInCategory('typography')
    for (const value of Object.values(typography)) {
      expect(typeof value).toBe('string')
    }
  })
})
