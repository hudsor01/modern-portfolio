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

// `db.execute()` resolves to a pg-style RESULT OBJECT, not an array — the
// neon-http driver calls with `fullResults: true`, yielding
// `{ rows, fields, command, rowCount, ... }`. These mocks previously returned
// bare arrays, which is why the production bug (reading `.length` off the
// result object, always `undefined`) passed CI for its entire life: the tests
// asserted against a shape the driver never produces.
//
// Every mock now goes through pgResult() so the suite exercises the real
// contract. rowsOf() in src/lib/search.ts still tolerates a bare array, and
// there is an explicit test below pinning both shapes.
function pgResult<T>(rows: T[]) {
  return { rows, fields: [], command: 'SELECT', rowCount: rows.length, rowAsArray: false }
}

// Probe result for the pg_trgm capability check (hasPgTrgm): a non-empty row
// set means the extension is present (trigram path), empty means absent (ILIKE
// fallback path).
const TRGM_PRESENT = pgResult([{ '?column?': 1 }])
const TRGM_ABSENT = pgResult([])

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
    executeMock.mockResolvedValue(
      pgResult([
        { id: '1', title: 'Hello', slug: 'hello', excerpt: null, rank: 0.5, matchType: 'exact' },
      ])
    )
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
    executeMock.mockResolvedValueOnce(pgResult(rows))
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
      .mockResolvedValueOnce(pgResult(ftRows))
      .mockResolvedValueOnce(TRGM_PRESENT)
      .mockResolvedValueOnce(pgResult(fzRows))
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
      .mockResolvedValueOnce(pgResult(ftRows))
      .mockResolvedValueOnce(TRGM_ABSENT)
      .mockResolvedValueOnce(pgResult(fzRows))
    const result = await searchBlogPosts('react')
    expect(result).toHaveLength(2)
    expect(executeMock).toHaveBeenCalledTimes(3)
    // The ILIKE branch must not reference the `%` similarity operator.
    const fuzzySql = JSON.stringify(executeMock.mock.calls[2])
    expect(fuzzySql).toContain('ILIKE')
    expect(fuzzySql).not.toContain('word_similarity(')
  })

  it('caches the pg_trgm probe across calls (probes once)', async () => {
    const ftRows = [
      { id: '1', title: 't', slug: 's', excerpt: null, rank: 0.9, matchType: 'exact' as const },
    ]
    executeMock.mockResolvedValue(pgResult(ftRows)) // ft hits < 5 → always tries fuzzy
    executeMock.mockResolvedValueOnce(pgResult(ftRows)).mockResolvedValueOnce(TRGM_PRESENT)
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
      .mockResolvedValueOnce(pgResult(ftRows))
      .mockResolvedValueOnce(TRGM_PRESENT)
      .mockRejectedValueOnce(new Error('db down'))
    const result = await searchBlogPosts('react')
    expect(result).toEqual(ftRows)
  })

  // Regression pins for the bug that made this module silently return nothing.
  //
  // `db.execute()` resolves to `{ rows, ... }`, but every call site cast it to
  // an array and read `.length`. On an object that is `undefined`, so
  // `undefined >= 5` and `undefined < 5` are both false: the full-text branch
  // fell through, the pg_trgm probe reported "absent", and the caller got [].
  // The `as unknown as` casts hid all of it from tsc, and the old array-shaped
  // mocks hid it from the suite.
  it('reads rows from the driver result OBJECT, not a bare array', async () => {
    const rows = Array.from({ length: 10 }, (_, i) => ({
      id: String(i),
      title: `t${i}`,
      slug: `s${i}`,
      excerpt: null,
      rank: 1 - i / 10,
      matchType: 'exact' as const,
    }))
    executeMock.mockResolvedValueOnce(pgResult(rows))

    const result = await searchBlogPosts('react')

    // Pre-fix this was [] and the fuzzy path ran anyway (2 extra queries).
    expect(result).toHaveLength(10)
    expect(executeMock).toHaveBeenCalledTimes(1)
  })

  it('still accepts a bare array, so a driver swap cannot reintroduce the bug', async () => {
    const rows = Array.from({ length: 10 }, (_, i) => ({
      id: String(i),
      title: `t${i}`,
      slug: `s${i}`,
      excerpt: null,
      rank: 1 - i / 10,
      matchType: 'exact' as const,
    }))
    executeMock.mockResolvedValueOnce(rows)

    expect(await searchBlogPosts('react')).toHaveLength(10)
  })

  it('detects pg_trgm from an object-shaped probe result', async () => {
    const ftRows = [
      { id: '1', title: 't', slug: 's', excerpt: null, rank: 0.9, matchType: 'exact' as const },
    ]
    executeMock
      .mockResolvedValueOnce(pgResult(ftRows))
      .mockResolvedValueOnce(TRGM_PRESENT)
      .mockResolvedValueOnce(pgResult([]))

    await searchBlogPosts('react')

    // Third call is the fuzzy query. Pre-fix the probe read `undefined > 0` as
    // false and this took the ILIKE branch even though pg_trgm was present.
    const fuzzySql = JSON.stringify(executeMock.mock.calls[2])
    expect(fuzzySql).toContain('word_similarity(')
    expect(fuzzySql).not.toContain('ILIKE')
  })

  it('binds a status filter as an enum ARRAY, not a single array param', async () => {
    executeMock.mockResolvedValue(pgResult([]))

    await searchBlogPosts('react', { statusFilter: ['PUBLISHED', 'DRAFT'] })

    // `ANY(($1)::"PostStatus"[])` — one bound array — throws 22P02 against
    // Postgres, which the outer catch swallows into an empty result. It has to
    // expand to one placeholder per value.
    const ftSql = JSON.stringify(executeMock.mock.calls[0])
    expect(ftSql).toContain('PostStatus')
    expect(ftSql).toMatch(/ANY\(ARRAY\[/)
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
    executeMock.mockResolvedValueOnce(pgResult([{ keyword: 'react' }, { keyword: 'redux' }]))
    expect(await getSearchSuggestions('re')).toEqual(['react', 'redux'])
  })

  it('returns [] on db error', async () => {
    executeMock.mockRejectedValueOnce(new Error('boom'))
    expect(await getSearchSuggestions('re')).toEqual([])
  })
})
