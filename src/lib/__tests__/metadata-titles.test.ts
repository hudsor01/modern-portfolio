// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import type { Metadata } from 'next'
import {
  BRAND,
  baseMetadata,
  brandTitle,
  stripBrandSuffix,
  generateMetadata,
} from '@/app/shared-metadata'

function countBrand(s: string): number {
  return s.split(BRAND).length - 1
}

function resolveTitle(metadata: Metadata): string {
  const t = metadata.title
  if (t && typeof t === 'object' && 'absolute' in t && t.absolute) return t.absolute
  const template = (baseMetadata.title as { template: string }).template
  const raw =
    typeof t === 'string' ? t : ((t as { default?: string } | null | undefined)?.default ?? '')
  return template.replace('%s', raw)
}

describe('title builder', () => {
  it('brandTitle appends the brand once and is idempotent', () => {
    expect(brandTitle('Contact: Revenue Operations Consulting')).toBe(
      'Contact: Revenue Operations Consulting | Richard Hudson'
    )
    const home = 'Richard Hudson | RevOps Professional in Dallas-Fort Worth'
    expect(brandTitle(home)).toBe(home)
    expect(brandTitle(brandTitle('X'))).toBe(brandTitle('X'))
  })

  it('stripBrandSuffix removes trailing brand with any separator', () => {
    expect(stripBrandSuffix('Salesloft Basics | Richard Hudson')).toBe('Salesloft Basics')
    expect(stripBrandSuffix('Salesloft Basics – Richard Hudson')).toBe('Salesloft Basics')
    expect(stripBrandSuffix('Salesloft Basics — Richard Hudson')).toBe('Salesloft Basics')
    expect(stripBrandSuffix('Salesloft Basics - richard hudson  ')).toBe('Salesloft Basics')
    expect(stripBrandSuffix('  Plain Title ')).toBe('Plain Title')
    expect(stripBrandSuffix('Richard Hudson')).toBe('')
  })

  it('stripBrandSuffix is linear on pathological input', () => {
    const start = performance.now()
    stripBrandSuffix(' '.repeat(10_000))
    expect(performance.now() - start).toBeLessThan(50)
  })

  it('generateMetadata brands OG/Twitter once and keeps the page title bare', () => {
    const m = generateMetadata({ title: 'X', description: 'd', path: '/x' })
    expect(m.title).toBe('X')
    expect(m.openGraph?.title).toBe('X | Richard Hudson')
    expect(m.twitter?.title).toBe('X | Richard Hudson')
    const images = m.openGraph?.images as { alt?: string }[]
    expect(images[0]?.alt).toBe('X')
  })

  it('absoluteTitle bypasses the template', () => {
    const t = 'Richard Hudson | RevOps Professional in Dallas-Fort Worth'
    const m = generateMetadata({ title: t, description: 'd', path: '/', absoluteTitle: true })
    expect(m.title).toEqual({ absolute: t })
    expect(m.openGraph?.title).toBe(t)
    expect(m.twitter?.title).toBe(t)
    expect(resolveTitle(m)).toBe(t)
    expect(countBrand(resolveTitle(m))).toBe(1)
  })
})

const mocks = vi.hoisted(() => {
  const post = {
    id: 'p1',
    slug: 'mock-post',
    name: 'Mock Category',
    posts: [] as unknown[],
    title: 'Mock Post',
    contentType: 'MARKDOWN',
    status: 'PUBLISHED',
    deletedAt: null,
    scheduledAt: null,
    authorId: 'a1',
    author: null,
    categoryId: 'c1',
    viewCount: 0,
    likeCount: 0,
    shareCount: 0,
    commentCount: 0,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    image: null,
    metaTitle: 'Mock Post | Richard Hudson',
    metaDescription: 'desc',
    excerpt: 'excerpt',
    content: 'body',
    keywords: [],
    featuredImage: null,
    featuredImageAlt: null,
    publishedAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-02T00:00:00Z'),
    category: {
      id: 'c1',
      name: 'Mock Category',
      slug: 'mock-category',
      description: null,
      color: null,
      icon: null,
      postCount: 0,
      totalViews: 0,
      createdAt: new Date('2026-01-01T00:00:00Z'),
    },
    tags: [],
  }
  // Thenable chain that resolves to the supplied rows for any drizzle builder call.
  const chain = (rows: unknown[]): unknown =>
    new Proxy(() => undefined, {
      get: (_t, prop) => {
        if (prop === 'then') return (res: (v: unknown) => void) => res(rows)
        return () => chain(rows)
      },
      apply: () => chain(rows),
    })
  return { post, chain }
})

vi.mock('server-only', () => ({}))
vi.mock('@/lib/projects', () => ({
  getProjects: async () => [],
  getProject: async () => ({
    slug: 'mock-project',
    title: 'Mock Project',
    description: 'Mock project description',
    image: null,
  }),
}))
vi.mock('next/headers', () => ({
  headers: async () => new Headers(),
  cookies: async () => ({ get: () => undefined }),
}))
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND')
  },
  redirect: () => {
    throw new Error('NEXT_REDIRECT')
  },
  usePathname: () => '/',
  useRouter: () => ({}),
  useSearchParams: () => new URLSearchParams(),
}))
vi.mock('@/lib/logger', () => {
  const l = { debug() {}, info() {}, warn() {}, error() {}, fatal() {} }
  return { logger: l, createContextLogger: () => l }
})
vi.mock('@/lib/db', () => ({
  db: {
    select: () => mocks.chain([mocks.post]),
    execute: async () => ({ rows: [] }),
    query: new Proxy(
      {},
      {
        get: () => ({
          findFirst: async () => mocks.post,
          findMany: async () => [mocks.post],
        }),
      }
    ),
  },
}))
vi.mock('@/db', () => ({
  db: {
    select: () => mocks.chain([mocks.post]),
    execute: async () => ({ rows: [] }),
    query: new Proxy(
      {},
      {
        get: () => ({
          findFirst: async () => mocks.post,
          findMany: async () => [mocks.post],
        }),
      }
    ),
  },
}))

interface RouteModule {
  metadata?: Metadata
  generateMetadata?: (props: unknown) => Promise<Metadata> | Metadata
}

function textOf(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'absolute' in value) {
    return (value as { absolute: string }).absolute
  }
  return undefined
}

describe('every route', () => {
  const modules = import.meta.glob<RouteModule>([
    '/src/app/**/page.tsx',
    '/src/app/**/not-found.tsx',
  ])
  const keys = Object.keys(modules).sort()

  it('discovers every page and not-found module', () => {
    expect(keys.length).toBeGreaterThanOrEqual(31)
  })

  it('brands every title exactly once with a single separator', async () => {
    const failures: string[] = []
    for (const key of keys) {
      const mod = await modules[key]?.()
      let meta: Metadata | undefined = mod?.metadata
      if (!meta && mod?.generateMetadata) {
        meta = await mod.generateMetadata({
          params: Promise.resolve({ slug: 'mock-post' }),
          searchParams: Promise.resolve({}),
        })
      }
      if (!meta) {
        failures.push(`${key}: no metadata`)
        continue
      }
      const title = resolveTitle(meta)
      const is404 = key.endsWith('not-found.tsx')
      if (is404) {
        if (!title.startsWith('404'))
          failures.push(`${key}: 404 title must start with 404 (${title})`)
        continue
      }
      if (countBrand(title) !== 1) failures.push(`${key}: brand count in "${title}"`)
      if (title.split(' | ').length !== 2) failures.push(`${key}: separators in "${title}"`)
      if (title.includes(' — ') || title.includes(' - '))
        failures.push(`${key}: dash joiner in "${title}"`)
      for (const [name, t] of [
        ['openGraph', textOf(meta.openGraph?.title)],
        ['twitter', textOf(meta.twitter?.title)],
      ] as const) {
        if (t !== undefined && countBrand(t) !== 1) failures.push(`${key}: ${name} title "${t}"`)
      }
    }
    expect(failures).toEqual([])
  })

  it('does not double the brand for a DB metaTitle that already carries it', async () => {
    const mod = await modules['/src/app/blog/[slug]/page.tsx']?.()
    const meta = await mod?.generateMetadata?.({
      params: Promise.resolve({ slug: 'mock-post' }),
      searchParams: Promise.resolve({}),
    })
    expect(meta && resolveTitle(meta)).toBe('Mock Post | Richard Hudson')
  })

  it('home title is absolute and exact', async () => {
    const mod = await modules['/src/app/page.tsx']?.()
    expect(mod?.metadata && resolveTitle(mod.metadata)).toBe(
      'Richard Hudson | RevOps Professional in Dallas-Fort Worth'
    )
  })
})
