// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
  },
}))

const { executeMock } = vi.hoisted(() => ({ executeMock: vi.fn() }))
vi.mock('@/lib/db', () => ({
  db: { execute: executeMock },
}))

import {
  searchBlogPosts,
  highlightSearchTerms,
  getSearchSuggestions,
  __resetPgTrgmCache,
} from '@/lib/search'

// Probe result rows for the pg_trgm capability check (hasPgTrgm): a non-empty
// array means the extension is present (trigram path), [] means absent (ILIKE
// fallback path).
const TRGM_PRESENT = [{ '?column?': 1 }]
const TRGM_ABSENT: unknown[] = []

beforeEach(() => {
  executeMock.mockReset()
  __resetPgTrgmCache()
})

describe('searchBlogPosts', () => {
  it('returns [] for empty/whitespace queries (skips DB call)', async () => {
    expect(await searchBlogPosts('')).toEqual([])
    expect(await searchBlogPosts('   ')).toEqual([])
    expect(executeMock).not.toHaveBeenCalled()
  })

  it('strips dangerous tsquery operators from input before parsing', async () => {
    executeMock.mockResolvedValue([
      { id: '1', title: 'Hello', slug: 'hello', excerpt: null, rank: 0.5, matchType: 'exact' },
    ])
    await searchBlogPosts('hello & world')
    expect(executeMock).toHaveBeenCalled()
  })

  it('returns full-text rows when threshold met', async () => {
    const rows = Array.from({ length: 10 }, (_, i) => ({
      id: String(i),
      title: `t${i}`,
      slug: `s${i}`,
      excerpt: null,
      rank: 1 - i / 10,
      matchType: 'exact' as const,
    }))
    executeMock.mockResolvedValueOnce(rows)
    const result = await searchBlogPosts('react')
    expect(result).toHaveLength(10)
    expect(executeMock).toHaveBeenCalledTimes(1) // skipped fuzzy
  })

  it('falls back to fuzzy (trigram) when full-text yields too few hits', async () => {
    const ftRows = [
      { id: '1', title: 't', slug: 's', excerpt: null, rank: 0.9, matchType: 'exact' as const },
    ]
    const fzRows = [
      { id: '2', title: 'fuzzy', slug: 'f', excerpt: null, rank: 0.4, matchType: 'fuzzy' as const },
    ]
    // ft query → pg_trgm probe (present) → trigram fuzzy query
    executeMock
      .mockResolvedValueOnce(ftRows)
      .mockResolvedValueOnce(TRGM_PRESENT)
      .mockResolvedValueOnce(fzRows)
    const result = await searchBlogPosts('react')
    expect(result).toHaveLength(2)
    expect(executeMock).toHaveBeenCalledTimes(3)
  })

  it('falls back to ILIKE fuzzy search when pg_trgm is unavailable', async () => {
    const ftRows = [
      { id: '1', title: 't', slug: 's', excerpt: null, rank: 0.9, matchType: 'exact' as const },
    ]
    const fzRows = [
      { id: '2', title: 'fuzzy', slug: 'f', excerpt: null, rank: 0.6, matchType: 'fuzzy' as const },
    ]
    // ft query → pg_trgm probe (ABSENT) → ILIKE fuzzy query
    executeMock
      .mockResolvedValueOnce(ftRows)
      .mockResolvedValueOnce(TRGM_ABSENT)
      .mockResolvedValueOnce(fzRows)
    const result = await searchBlogPosts('react')
    expect(result).toHaveLength(2)
    expect(executeMock).toHaveBeenCalledTimes(3)
    // The ILIKE branch must not reference the `%` similarity operator.
    const fuzzySql = JSON.stringify(executeMock.mock.calls[2])
    expect(fuzzySql).toContain('ILIKE')
    expect(fuzzySql).not.toContain('similarity(')
  })

  it('caches the pg_trgm probe across calls (probes once)', async () => {
    const ftRows = [
      { id: '1', title: 't', slug: 's', excerpt: null, rank: 0.9, matchType: 'exact' as const },
    ]
    executeMock.mockResolvedValue(ftRows) // ft hits < 5 → always tries fuzzy
    executeMock.mockResolvedValueOnce(ftRows).mockResolvedValueOnce(TRGM_PRESENT)
    await searchBlogPosts('react') // ft + probe + fuzzy
    const callsAfterFirst = executeMock.mock.calls.length
    await searchBlogPosts('react') // ft + fuzzy (no second probe)
    expect(executeMock.mock.calls.length).toBe(callsAfterFirst + 2)
  })

  it('returns full-text rows even if fuzzy fallback throws', async () => {
    const ftRows = [
      { id: '1', title: 't', slug: 's', excerpt: null, rank: 0.9, matchType: 'exact' as const },
    ]
    // ft query → pg_trgm probe (present) → fuzzy query rejects
    executeMock
      .mockResolvedValueOnce(ftRows)
      .mockResolvedValueOnce(TRGM_PRESENT)
      .mockRejectedValueOnce(new Error('db down'))
    const result = await searchBlogPosts('react')
    expect(result).toEqual(ftRows)
  })
})

describe('highlightSearchTerms', () => {
  it('wraps matching terms in <mark>', () => {
    expect(highlightSearchTerms('react is great', 'react')).toContain('<mark>react</mark>')
  })

  it('is case-insensitive', () => {
    expect(highlightSearchTerms('React is great', 'react')).toContain('<mark>React</mark>')
  })

  it('skips short query terms (<= 2 chars)', () => {
    expect(highlightSearchTerms('a very short query', 'a v')).not.toContain('<mark>')
  })

  it('escapes regex metacharacters in query terms (no SyntaxError)', () => {
    expect(() => highlightSearchTerms('hello (world)', '(world)')).not.toThrow()
  })
})

describe('getSearchSuggestions', () => {
  it('returns [] when prefix is shorter than 2 chars', async () => {
    expect(await getSearchSuggestions('r')).toEqual([])
    expect(executeMock).not.toHaveBeenCalled()
  })

  it('returns keyword strings on success', async () => {
    executeMock.mockResolvedValueOnce([{ keyword: 'react' }, { keyword: 'redux' }])
    expect(await getSearchSuggestions('re')).toEqual(['react', 'redux'])
  })

  it('returns [] on db error', async () => {
    executeMock.mockRejectedValueOnce(new Error('boom'))
    expect(await getSearchSuggestions('re')).toEqual([])
  })
})
