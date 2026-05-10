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

import { searchBlogPosts, highlightSearchTerms, getSearchSuggestions } from '@/lib/search'

beforeEach(() => {
  executeMock.mockReset()
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

  it('falls back to fuzzy when full-text yields too few hits', async () => {
    const ftRows = [
      { id: '1', title: 't', slug: 's', excerpt: null, rank: 0.9, matchType: 'exact' as const },
    ]
    const fzRows = [
      { id: '2', title: 'fuzzy', slug: 'f', excerpt: null, rank: 0.4, matchType: 'fuzzy' as const },
    ]
    executeMock.mockResolvedValueOnce(ftRows).mockResolvedValueOnce(fzRows)
    const result = await searchBlogPosts('react')
    expect(result).toHaveLength(2)
    expect(executeMock).toHaveBeenCalledTimes(2)
  })

  it('returns full-text rows even if fuzzy fallback throws', async () => {
    const ftRows = [
      { id: '1', title: 't', slug: 's', excerpt: null, rank: 0.9, matchType: 'exact' as const },
    ]
    executeMock.mockResolvedValueOnce(ftRows).mockRejectedValueOnce(new Error('db down'))
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
