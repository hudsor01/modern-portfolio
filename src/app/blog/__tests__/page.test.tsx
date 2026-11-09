// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ReactElement, ReactNode } from 'react'
import { PgDialect } from 'drizzle-orm/pg-core'
import type { SQL } from 'drizzle-orm'

const mocks = vi.hoisted(() => ({
  postsFindMany: vi.fn(),
  categoriesFindMany: vi.fn(),
  groupBy: vi.fn(),
  search: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

vi.mock('@/lib/db', () => ({
  db: {
    query: {
      blogPosts: { findMany: mocks.postsFindMany },
      categories: { findMany: mocks.categoriesFindMany },
    },
    select: () => ({ from: () => ({ where: () => ({ groupBy: mocks.groupBy }) }) }),
  },
}))
vi.mock('@/lib/search', () => ({ searchBlogPosts: mocks.search }))
vi.mock('next/headers', () => ({ headers: async () => new Headers() }))
vi.mock('next/navigation', () => ({ notFound: mocks.notFound }))
vi.mock('@/lib/logger', () => ({
  createContextLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}))
// Rendered output is inspected as an element tree, so the client list is a stub.
vi.mock('../_components/blog-list', () => ({ BlogList: () => null }))
vi.mock('@/components/layout/navbar', () => ({ Navbar: () => null }))

import BlogHomePage from '../page'
import { BlogList } from '../_components/blog-list'

const CATEGORIES = [
  {
    id: 'cat-revops',
    name: 'Revenue Operations',
    slug: 'revenue-operations',
    description: null,
    color: null,
    icon: null,
    postCount: 0,
    totalViews: 0,
    createdAt: new Date('2026-01-01T00:00:00Z'),
  },
]

function cardRow(n: number) {
  return {
    id: `post-${n}`,
    slug: `post-${n}`,
    title: `Post ${n}`,
    excerpt: 'Summary',
    featuredImage: null,
    publishedAt: new Date('2026-06-01T00:00:00Z'),
    category: { name: 'Revenue Operations' },
    tags: [{ tag: { id: 't1', name: 'Forecasting' } }],
  }
}

type BlogListProps = Parameters<typeof BlogList>[0]

/** Find the BlogList element in the page's returned tree and return its props. */
function blogListProps(node: ReactNode): BlogListProps {
  const stack: ReactNode[] = [node]
  while (stack.length > 0) {
    const current = stack.pop()
    if (!current || typeof current !== 'object') continue
    if (Array.isArray(current)) {
      stack.push(...current)
      continue
    }
    const element = current as ReactElement<{ children?: ReactNode }>
    if (element.type === BlogList) return element.props as unknown as BlogListProps
    stack.push(element.props?.children)
  }
  throw new Error('BlogList not rendered')
}

async function renderPage(params: Record<string, string> = {}) {
  return blogListProps(await BlogHomePage({ searchParams: Promise.resolve(params) }))
}

const dialect = new PgDialect()
const whereSql = (where: SQL) => dialect.sqlToQuery(where)

describe('/blog index', () => {
  beforeEach(() => {
    mocks.categoriesFindMany.mockResolvedValue(CATEGORIES)
    // 83 published posts, all in one category.
    mocks.groupBy.mockResolvedValue([{ categoryId: 'cat-revops', posts: 83 }])
    mocks.postsFindMany.mockResolvedValue(Array.from({ length: 24 }, (_, i) => cardRow(i)))
  })

  it('selects only card columns: no post body, no author (and so no author email)', async () => {
    const props = await renderPage()
    const query = mocks.postsFindMany.mock.calls[0]?.[0]
    expect(Object.keys(query.columns).sort()).toEqual(
      ['excerpt', 'featuredImage', 'id', 'publishedAt', 'slug', 'title'].sort()
    )
    expect(query.columns).not.toHaveProperty('content')
    expect(Object.keys(query.with).sort()).toEqual(['category', 'tags'])

    const payload = JSON.stringify(props.posts)
    expect(payload).not.toMatch(/content|author|email/i)
    expect(props.posts[0]).toEqual({
      id: 'post-0',
      slug: 'post-0',
      title: 'Post 0',
      excerpt: 'Summary',
      featuredImage: null,
      publishedAt: '2026-06-01T00:00:00.000Z',
      categoryName: 'Revenue Operations',
      tags: [{ id: 't1', name: 'Forecasting' }],
    })
  })

  it('pages in Postgres and reports totals for every published post', async () => {
    const first = await renderPage()
    expect(mocks.postsFindMany.mock.calls[0]?.[0]).toMatchObject({ limit: 24, offset: 0 })
    expect(first).toMatchObject({ page: 1, total: 83, totalPages: 4 })
    expect(first.categoryCounts).toEqual({ All: 83, 'Revenue Operations': 83 })

    const last = await renderPage({ page: '4' })
    expect(mocks.postsFindMany.mock.calls[1]?.[0]).toMatchObject({ limit: 24, offset: 72 })
    expect(last).toMatchObject({ page: 4, totalPages: 4 })
  })

  it('only lists PUBLISHED, non-deleted posts', async () => {
    await renderPage()
    const { sql } = whereSql(mocks.postsFindMany.mock.calls[0]?.[0].where)
    expect(sql).toContain('"status" = $1')
    expect(sql).toContain('"deletedAt" is null')
  })

  it('404s past the last page instead of rendering an empty 200', async () => {
    await expect(renderPage({ page: '5' })).rejects.toThrow('NEXT_NOT_FOUND')
  })

  it('does not 404 an empty listing (database down must not cache a 404)', async () => {
    mocks.groupBy.mockRejectedValue(new Error('neon down'))
    const props = await renderPage({ page: '2' })
    expect(props).toMatchObject({ total: 0, posts: [] })
    expect(mocks.notFound).not.toHaveBeenCalled()
  })

  it('treats a junk page param as page 1', async () => {
    const props = await renderPage({ page: 'abc' })
    expect(props.page).toBe(1)
    expect(mocks.postsFindMany.mock.calls[0]?.[0]).toMatchObject({ offset: 0 })
  })

  it('filters by category in the query', async () => {
    const props = await renderPage({ category: 'Revenue Operations' })
    const { sql, params } = whereSql(mocks.postsFindMany.mock.calls[0]?.[0].where)
    expect(sql).toContain('"categoryId" = ')
    expect(params).toContain('cat-revops')
    expect(props).toMatchObject({ selectedCategory: 'Revenue Operations', total: 83 })
  })

  it('an unknown category matches nothing without querying posts', async () => {
    const props = await renderPage({ category: 'Nope' })
    expect(props).toMatchObject({ total: 0, posts: [] })
    expect(mocks.postsFindMany).not.toHaveBeenCalled()
  })

  it('pages search results in relevance order', async () => {
    const hits = Array.from({ length: 30 }, (_, i) => ({ id: `post-${i}` }))
    mocks.search.mockResolvedValue(hits)
    // Postgres returns the re-fetch in arbitrary order.
    mocks.postsFindMany.mockResolvedValue(Array.from({ length: 30 }, (_, i) => cardRow(29 - i)))

    const page1 = await renderPage({ q: 'forecast' })
    expect(page1).toMatchObject({ total: 30, totalPages: 2, query: 'forecast' })
    expect(page1.posts.map((p) => p.id).slice(0, 2)).toEqual(['post-0', 'post-1'])
    expect(page1.posts).toHaveLength(24)

    const page2 = await renderPage({ q: 'forecast', page: '2' })
    expect(page2.posts.map((p) => p.id)).toEqual(
      Array.from({ length: 6 }, (_, i) => `post-${24 + i}`)
    )
  })
})
