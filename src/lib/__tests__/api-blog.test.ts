// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'

// db is referenced inside buildBlogWhereClause when filters.tagIds is provided
// (a non-correlated subquery against postTags). Stub out the chain to a sentinel
// since we only assert that the WHERE clause is built (a SQL object), not its
// execution. Other code paths don't touch db.
vi.mock('@/lib/db', () => ({
  db: {
    select: () => ({ from: () => ({ where: () => ({}) }) }),
  },
}))

import {
  generateSlug,
  createErrorResponse,
  transformToCategoryData,
  transformToTagData,
  transformToBlogPostData,
  buildBlogWhereClause,
  buildBlogOrderBy,
  type BlogPostWithRelations,
} from '@/lib/api-blog'

describe('generateSlug', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(generateSlug('Hello World')).toBe('hello-world')
  })

  it('strips punctuation and special chars', () => {
    expect(generateSlug('Hello, World! @2026')).toBe('hello-world-2026')
  })

  it('collapses repeated hyphens', () => {
    expect(generateSlug('a   b---c')).toBe('a-b-c')
  })

  it('strips leading/trailing hyphens', () => {
    expect(generateSlug('---title---')).toBe('title')
  })

  it('handles empty string', () => {
    expect(generateSlug('')).toBe('')
  })

  it('keeps a complete word boundary when the cut lands on a separator', () => {
    expect(generateSlug('alpha bravo charlie', 11)).toBe('alpha-bravo')
  })

  it('backs up to the last word boundary instead of splitting a word', () => {
    expect(generateSlug('one two three four five', 12)).toBe('one-two')
  })

  it('never returns a trailing hyphen after truncation', () => {
    expect(generateSlug('vanity metrics report', 14).endsWith('-')).toBe(false)
  })

  it('hard-caps a single token longer than maxLength', () => {
    expect(generateSlug('supercalifragilistic', 8)).toBe('supercal')
  })

  it('defaults to a 100-char ceiling that satisfies slugSchema', () => {
    const title = Array.from({ length: 40 }, (_, i) => `keyword${i}`).join(' ')
    const slug = generateSlug(title)
    expect(slug.length).toBeLessThanOrEqual(100)
    expect(slug.endsWith('-')).toBe(false)
    expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  })
})

describe('createErrorResponse', () => {
  it('returns success=false with the given message', () => {
    const r = createErrorResponse('boom')
    expect(r.success).toBe(false)
    expect(r.error).toBe('boom')
  })
})

describe('transformToCategoryData', () => {
  it('serializes Date to ISO string and converts nullables to undefined', () => {
    const r = transformToCategoryData({
      id: 'cat-1',
      name: 'Tech',
      slug: 'tech',
      description: null,
      color: null,
      icon: null,
      postCount: 5,
      totalViews: 100,
      createdAt: new Date('2026-01-01T00:00:00Z'),
    })
    expect(r.description).toBeUndefined()
    expect(r.color).toBeUndefined()
    expect(r.icon).toBeUndefined()
    expect(r.createdAt).toBe('2026-01-01T00:00:00.000Z')
  })

  it('preserves non-null optional fields', () => {
    const r = transformToCategoryData({
      id: 'cat-1',
      name: 'Tech',
      slug: 'tech',
      description: 'd',
      color: '#fff',
      icon: 'circle',
      postCount: 1,
      totalViews: 1,
      createdAt: new Date(),
    })
    expect(r.description).toBe('d')
    expect(r.color).toBe('#fff')
    expect(r.icon).toBe('circle')
  })
})

describe('transformToTagData', () => {
  it('mirrors category transform shape', () => {
    const r = transformToTagData({
      id: 'tag-1',
      name: 'react',
      slug: 'react',
      description: null,
      color: null,
      postCount: 3,
      totalViews: 50,
      createdAt: new Date('2026-01-01T00:00:00Z'),
    })
    expect(r.id).toBe('tag-1')
    expect(r.name).toBe('react')
    expect(r.color).toBeUndefined()
  })
})

describe('transformToBlogPostData', () => {
  const post: BlogPostWithRelations = {
    id: 'p1',
    title: 'Hello',
    slug: 'hello',
    excerpt: null,
    content: 'body',
    contentType: 'MARKDOWN' as const,
    status: 'PUBLISHED' as const,
    metaTitle: null,
    metaDescription: null,
    keywords: [],
    canonicalUrl: null,
    featuredImage: null,
    featuredImageAlt: null,
    readingTime: null,
    wordCount: null,
    publishedAt: new Date('2026-01-01T00:00:00Z'),
    scheduledAt: null,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-02T00:00:00Z'),
    authorId: 'a1',
    categoryId: null,
    viewCount: 0,
    likeCount: 0,
    shareCount: 0,
    commentCount: 0,
    deletedAt: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    twitterTitle: null,
    twitterDescription: null,
    twitterImage: null,
    author: null,
    category: null,
    tags: [],
  } as unknown as BlogPostWithRelations

  it('serializes timestamps to ISO strings', () => {
    const r = transformToBlogPostData(post)
    expect(r.createdAt).toBe('2026-01-01T00:00:00.000Z')
    expect(r.updatedAt).toBe('2026-01-02T00:00:00.000Z')
    expect(r.publishedAt).toBe('2026-01-01T00:00:00.000Z')
  })

  it('omits author/category/tags when relations are null', () => {
    const r = transformToBlogPostData(post)
    expect(r.author).toBeUndefined()
    expect(r.category).toBeUndefined()
    expect(r.tags).toEqual([])
  })

  it('maps nested author when present', () => {
    const withAuthor: BlogPostWithRelations = {
      ...post,
      author: {
        id: 'a1',
        name: 'Jane',
        email: 'j@x.com',
        slug: 'jane',
        bio: null,
        avatar: null,
        website: null,
        totalPosts: 1,
        totalViews: 5,
        createdAt: new Date('2026-01-01T00:00:00Z'),
      },
    } as unknown as BlogPostWithRelations
    const r = transformToBlogPostData(withAuthor)
    expect(r.author?.name).toBe('Jane')
    expect(r.author?.email).toBe('j@x.com')
  })

  it('maps nested tags via post.tags[].tag', () => {
    const withTag: BlogPostWithRelations = {
      ...post,
      tags: [
        {
          tag: {
            id: 't1',
            name: 'react',
            slug: 'react',
            description: null,
            color: null,
            postCount: 1,
            totalViews: 1,
            createdAt: new Date(),
          },
        },
      ],
    } as unknown as BlogPostWithRelations
    const r = transformToBlogPostData(withTag)
    expect(r.tags).toHaveLength(1)
    expect(r.tags?.[0]?.slug).toBe('react')
  })
})

describe('buildBlogWhereClause', () => {
  it('returns undefined when filters object is missing', () => {
    expect(buildBlogWhereClause()).toBeUndefined()
  })

  it('returns undefined when no filter conditions match', () => {
    expect(buildBlogWhereClause({})).toBeUndefined()
  })

  it('returns a SQL clause for status filter (string)', () => {
    expect(buildBlogWhereClause({ status: 'PUBLISHED' })).toBeDefined()
  })

  it('returns a SQL clause for status filter (array)', () => {
    expect(buildBlogWhereClause({ status: ['DRAFT', 'PUBLISHED'] })).toBeDefined()
  })

  it('returns a SQL clause for authorId / categoryId', () => {
    expect(buildBlogWhereClause({ authorId: 'cuid' })).toBeDefined()
    expect(buildBlogWhereClause({ categoryId: 'cuid' })).toBeDefined()
  })

  it('returns a SQL clause for search term', () => {
    expect(buildBlogWhereClause({ search: 'react' })).toBeDefined()
  })

  it('returns a SQL clause for date range', () => {
    expect(
      buildBlogWhereClause({
        dateRange: { from: new Date(), to: new Date() } as unknown as {
          from: string
          to: string
        },
      })
    ).toBeDefined()
  })

  it('returns a SQL clause for published=true (PUBLISHED + not deleted)', () => {
    expect(buildBlogWhereClause({ published: true })).toBeDefined()
  })

  it('returns a SQL clause for published=false (not PUBLISHED)', () => {
    expect(buildBlogWhereClause({ published: false })).toBeDefined()
  })
})

describe('buildBlogOrderBy', () => {
  it('defaults to publishedAt desc when no sort given', () => {
    expect(buildBlogOrderBy()).toBeDefined()
  })

  it('handles every supported field', () => {
    for (const field of [
      'title',
      'createdAt',
      'updatedAt',
      'publishedAt',
      'viewCount',
      'likeCount',
    ] as const) {
      expect(buildBlogOrderBy({ field, order: 'asc' })).toBeDefined()
      expect(buildBlogOrderBy({ field, order: 'desc' })).toBeDefined()
    }
  })

  it('falls through to default for unknown sort field', () => {
    expect(buildBlogOrderBy({ field: 'wat' as 'title', order: 'asc' })).toBeDefined()
  })
})
