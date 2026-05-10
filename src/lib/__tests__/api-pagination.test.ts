// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { parsePaginationParams, createPaginationMeta } from '@/lib/api-pagination'

describe('parsePaginationParams', () => {
  it('returns defaults when search params are empty', () => {
    expect(parsePaginationParams(new URLSearchParams())).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
    })
  })

  it('uses provided defaults', () => {
    expect(parsePaginationParams(new URLSearchParams(), { page: 2, limit: 25 })).toEqual({
      page: 2,
      limit: 25,
      skip: 25,
    })
  })

  it('parses page + limit from search params', () => {
    const sp = new URLSearchParams({ page: '3', limit: '20' })
    expect(parsePaginationParams(sp)).toEqual({ page: 3, limit: 20, skip: 40 })
  })

  it('clamps limit to maxLimit (default 100)', () => {
    const sp = new URLSearchParams({ limit: '999' })
    expect(parsePaginationParams(sp).limit).toBe(100)
  })

  it('respects custom maxLimit', () => {
    const sp = new URLSearchParams({ limit: '50' })
    expect(parsePaginationParams(sp, { maxLimit: 25 }).limit).toBe(25)
  })

  it('clamps page to maxPage (default 10_000) to prevent OFFSET overflow', () => {
    const sp = new URLSearchParams({ page: '999999999' })
    const r = parsePaginationParams(sp)
    expect(r.page).toBe(10_000)
    // Confirm skip stays within Postgres int4 bounds.
    expect(r.skip).toBeLessThan(2 ** 31)
  })

  it('respects custom maxPage', () => {
    const sp = new URLSearchParams({ page: '500' })
    expect(parsePaginationParams(sp, { maxPage: 100 }).page).toBe(100)
  })

  it('skip stays under int4 max even at maxPage * maxLimit', () => {
    const sp = new URLSearchParams({ page: '999999999', limit: '999999999' })
    const r = parsePaginationParams(sp)
    // Default maxPage=10_000, maxLimit=100 → max skip = 9_999 * 100 = 999_900
    expect(r.skip).toBe(999_900)
    expect(r.skip).toBeLessThan(2 ** 31)
  })

  it('coerces page < 1 to 1', () => {
    const sp = new URLSearchParams({ page: '0' })
    expect(parsePaginationParams(sp).page).toBe(1)
  })

  it('coerces limit < 1 to 1', () => {
    const sp = new URLSearchParams({ limit: '0' })
    expect(parsePaginationParams(sp).limit).toBe(1)
  })

  it('falls back to defaults on NaN', () => {
    const sp = new URLSearchParams({ page: 'abc', limit: 'xyz' })
    const r = parsePaginationParams(sp)
    expect(r.page).toBe(1)
    expect(r.limit).toBe(10)
    expect(r.skip).toBe(0)
  })

  it('uses provided defaults on NaN', () => {
    const sp = new URLSearchParams({ page: 'abc', limit: 'xyz' })
    const r = parsePaginationParams(sp, { page: 3, limit: 25 })
    expect(r.page).toBe(3)
    expect(r.limit).toBe(25)
  })

  it('skip math works for arbitrary page+limit', () => {
    const sp = new URLSearchParams({ page: '5', limit: '15' })
    expect(parsePaginationParams(sp).skip).toBe(60)
  })

  it('clamps negative page to 1', () => {
    const sp = new URLSearchParams({ page: '-5' })
    expect(parsePaginationParams(sp).page).toBe(1)
  })

  it('clamps negative limit to 1', () => {
    const sp = new URLSearchParams({ limit: '-5' })
    expect(parsePaginationParams(sp).limit).toBe(1)
  })

  it('rejects partial-parse strings (5abc) and falls back to default', () => {
    const sp = new URLSearchParams({ page: '5abc', limit: '20xyz' })
    const r = parsePaginationParams(sp)
    expect(r.page).toBe(1)
    expect(r.limit).toBe(10)
  })

  it('rejects decimals (5.5) and falls back to default', () => {
    const sp = new URLSearchParams({ page: '5.5', limit: '20.7' })
    const r = parsePaginationParams(sp)
    expect(r.page).toBe(1)
    expect(r.limit).toBe(10)
  })

  it('rejects whitespace-only inputs and falls back to default', () => {
    const sp = new URLSearchParams({ page: '   ', limit: '   ' })
    const r = parsePaginationParams(sp)
    expect(r.page).toBe(1)
    expect(r.limit).toBe(10)
  })

  it('trims surrounding whitespace before parsing', () => {
    const sp = new URLSearchParams({ page: ' 3 ', limit: ' 20 ' })
    const r = parsePaginationParams(sp)
    expect(r.page).toBe(3)
    expect(r.limit).toBe(20)
  })
})

describe('createPaginationMeta', () => {
  it('computes totalPages with ceil', () => {
    expect(createPaginationMeta(1, 10, 25)).toEqual({
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3,
      hasNext: true,
      hasPrev: false,
    })
  })

  it('hasNext=false on last page', () => {
    expect(createPaginationMeta(3, 10, 25).hasNext).toBe(false)
  })

  it('hasPrev=true after first page', () => {
    expect(createPaginationMeta(2, 10, 100).hasPrev).toBe(true)
  })

  it('total=0 → totalPages=0, no next/prev', () => {
    const r = createPaginationMeta(1, 10, 0)
    expect(r.totalPages).toBe(0)
    expect(r.hasNext).toBe(false)
    expect(r.hasPrev).toBe(false)
  })
})
