// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  BLOG_PAGE_SIZE,
  blogIndexHref,
  pageCount,
  pageSlice,
  paginationItems,
  parseCategoryParam,
  parsePageParam,
} from '@/lib/blog-pagination'

describe('parsePageParam', () => {
  it('reads a positive integer', () => {
    expect(parsePageParam('3')).toBe(3)
    expect(parsePageParam(' 2 ')).toBe(2)
  })

  it('takes the first value of a repeated param', () => {
    expect(parsePageParam(['4', '9'])).toBe(4)
  })

  it.each([undefined, '', 'abc', '0', '-1', '1.5', '2e3', '01', '9999999'])(
    'treats %p as page 1',
    (raw) => {
      expect(parsePageParam(raw)).toBe(1)
    }
  )
})

describe('parseCategoryParam', () => {
  it('defaults to All', () => {
    expect(parseCategoryParam(undefined)).toBe('All')
    expect(parseCategoryParam('  ')).toBe('All')
  })

  it('trims and takes the first value', () => {
    expect(parseCategoryParam([' Revenue Operations ', 'x'])).toBe('Revenue Operations')
  })
})

describe('pageCount / pageSlice', () => {
  it('never reports fewer than one page', () => {
    expect(pageCount(0)).toBe(1)
  })

  it('rounds up a partial last page', () => {
    expect(pageCount(83)).toBe(Math.ceil(83 / BLOG_PAGE_SIZE))
    expect(pageCount(BLOG_PAGE_SIZE)).toBe(1)
    expect(pageCount(BLOG_PAGE_SIZE + 1)).toBe(2)
  })

  it('every item lands on exactly one page', () => {
    const items = Array.from({ length: 83 }, (_, i) => i)
    const seen = Array.from({ length: pageCount(items.length) }, (_, i) =>
      pageSlice(items, i + 1)
    ).flat()
    expect(seen).toEqual(items)
  })
})

describe('blogIndexHref', () => {
  it('page 1 of the unfiltered index is the bare canonical /blog', () => {
    expect(blogIndexHref({})).toBe('/blog')
    expect(blogIndexHref({ page: 1, category: 'All' })).toBe('/blog')
  })

  it('carries page, query and category', () => {
    expect(blogIndexHref({ page: 2 })).toBe('/blog?page=2')
    expect(blogIndexHref({ page: 3, query: 'lead scoring', category: 'Revenue Operations' })).toBe(
      '/blog?q=lead+scoring&category=Revenue+Operations&page=3'
    )
  })
})

describe('paginationItems', () => {
  it('lists every page when there are few', () => {
    expect(paginationItems(1, 4)).toEqual([1, 2, 3, 4])
    expect(paginationItems(1, 1)).toEqual([1])
  })

  it('elides long runs but keeps first, last and neighbours', () => {
    expect(paginationItems(6, 10)).toEqual([1, 'gap', 5, 6, 7, 'gap', 10])
    expect(paginationItems(1, 10)).toEqual([1, 2, 'gap', 10])
  })

  it('shows a single skipped page instead of a gap', () => {
    expect(paginationItems(4, 10)).toEqual([1, 2, 3, 4, 5, 'gap', 10])
  })
})
