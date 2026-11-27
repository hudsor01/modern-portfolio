// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ReactElement, ReactNode } from 'react'
import { PgDialect } from 'drizzle-orm/pg-core'
import type { SQL } from 'drizzle-orm'
import { buildOgCoverUrl } from '@/lib/blog-list'

const mocks = vi.hoisted(() => ({
  postsFindMany: vi.fn(),
  categoriesFindMany: vi.fn(),
  groupBy: vi.fn(),
  search: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
  permanentRedirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT;${url}`)
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
vi.mock('next/navigation', () => ({
  notFound: mocks.notFound,
  permanentRedirect: mocks.permanentRedirect,
}))
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

async function renderPage(params: Record<string, string | string[]> = {}) {
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

  it.each(['abc', '0', '-1', '1'])('308s page=%s to /blog before any data read', async (page) => {
    await expect(renderPage({ page })).rejects.toThrow('NEXT_REDIRECT;/blog')
    expect(mocks.postsFindMany).not.toHaveBeenCalled()
    expect(mocks.categoriesFindMany).not.toHaveBeenCalled()
    expect(mocks.search).not.toHaveBeenCalled()
  })

  it('keeps every other param when redirecting', async () => {
    await expect(
      renderPage({ page: 'abc', q: 'x', category: 'Revenue Operations' })
    ).rejects.toThrow('NEXT_REDIRECT;/blog?q=x&category=Revenue+Operations')
  })

  it('does not redirect a canonical page', async () => {
    const props = await renderPage({ page: '2' })
    expect(props.page).toBe(2)
    expect(mocks.permanentRedirect).not.toHaveBeenCalled()
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

  it('reads only a bounded body prefix via extras', async () => {
    await renderPage()
    const query = mocks.postsFindMany.mock.calls[0]?.[0]
    expect(Object.keys(query.extras)).toEqual(['contentHead'])
    const { sql } = dialect.sqlToQuery(query.extras.contentHead.getSQL())
    expect(sql).toContain('left(')
    expect(sql).toContain('4000')
  })

  it('replaces a bio-boilerplate excerpt with a body-derived one, keeping bodies off the payload', async () => {
    mocks.postsFindMany.mockResolvedValue([
      {
        ...cardRow(0),
        excerpt:
          'I spent six years in the Texas Army National Guard before moving into revenue work.',
        contentHead:
          '# Heading\n\nPipeline coverage explains most forecast misses in B2B teams.\n\nMore.',
      },
    ])
    const props = await renderPage()
    expect(props.posts[0]?.excerpt).toBe(
      'Pipeline coverage explains most forecast misses in B2B teams.'
    )
    expect(JSON.stringify(props.posts)).not.toMatch(/content|author|email/i)
  })

  it('lists a post title without a stored brand suffix', async () => {
    mocks.postsFindMany.mockResolvedValue([
      { ...cardRow(0), title: 'Pipeline Velocity | Richard Hudson' },
    ])
    const props = await renderPage()
    expect(props.posts[0]?.title).toBe('Pipeline Velocity')
  })

  it('gives later posts with a duplicate cover a generated og cover', async () => {
    const img = 'https://images.unsplash.com/photo-x'
    mocks.postsFindMany.mockResolvedValue([
      { ...cardRow(0), featuredImage: img },
      { ...cardRow(1), featuredImage: img },
    ])
    const props = await renderPage()
    expect(props.posts[0]?.featuredImage).toBe(img)
    expect(props.posts[1]?.featuredImage).toBe(buildOgCoverUrl('Post 1', 'Revenue Operations'))
  })

  it('de-duplicates covers on the relevance-sorted search slice', async () => {
    const img = 'https://images.unsplash.com/photo-x'
    mocks.search.mockResolvedValue([{ id: 'post-1' }, { id: 'post-0' }])
    mocks.postsFindMany.mockResolvedValue([
      { ...cardRow(0), featuredImage: img },
      { ...cardRow(1), featuredImage: img },
    ])
    const props = await renderPage({ q: 'forecast' })
    expect(props.posts.map((p) => p.id)).toEqual(['post-1', 'post-0'])
    expect(props.posts[0]?.featuredImage).toBe(img)
    expect(props.posts[1]?.featuredImage).toBe(buildOgCoverUrl('Post 0', 'Revenue Operations'))
  })
})

describe('blog index canonical', () => {
  beforeEach(() => {
    mocks.categoriesFindMany.mockReset()
    mocks.categoriesFindMany.mockResolvedValue(CATEGORIES)
  })

  async function titleFor(params: Record<string, string>) {
    const { generateMetadata } = await import('../page')
    const meta = await generateMetadata({ searchParams: Promise.resolve(params) })
    return String(meta.title)
  }

  it('titles pages 2+ with (Page N) and leaves page 1 bare', async () => {
    expect(await titleFor({ page: '2' })).toContain('(Page 2)')
    expect(await titleFor({})).not.toContain('(Page')
  })

  async function canonicalFor(params: Record<string, string>) {
    const { generateMetadata } = await import('../page')
    const meta = await generateMetadata({ searchParams: Promise.resolve(params) })
    return meta.alternates?.canonical
  }

  it('points a category filter at that category page, not /blog', async () => {
    expect(await canonicalFor({ category: 'Revenue Operations' })).toBe(
      'https://richardwhudsonjr.com/blog/category/revenue-operations'
    )
    expect(await canonicalFor({ category: 'Revenue Operations', page: '2' })).toBe(
      'https://richardwhudsonjr.com/blog/category/revenue-operations'
    )
  })

  it('keeps pages self-canonical and search and unknown categories on /blog', async () => {
    expect(await canonicalFor({})).toBe('https://richardwhudsonjr.com/blog')
    expect(await canonicalFor({ page: '2' })).toBe('https://richardwhudsonjr.com/blog?page=2')
    expect(await canonicalFor({ q: 'forecast', category: 'Revenue Operations' })).toBe(
      'https://richardwhudsonjr.com/blog'
    )
    expect(await canonicalFor({ category: 'Nope' })).toBe('https://richardwhudsonjr.com/blog')
  })
})
