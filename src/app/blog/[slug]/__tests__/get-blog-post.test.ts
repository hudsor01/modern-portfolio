// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({ findFirst: vi.fn() }))

vi.mock('@/lib/db', () => ({ db: { query: { blogPosts: { findFirst: mocks.findFirst } } } }))
vi.mock('next/navigation', () => ({
  notFound: () => {
    throw new Error('NEXT_NOT_FOUND')
  },
}))
vi.mock('@/lib/logger', () => ({
  createContextLogger: () => ({ info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }),
}))
vi.mock('@/components/layout/navbar', () => ({ Navbar: () => null }))
vi.mock('@/components/blog/related-posts', () => ({ RelatedPosts: () => null }))
vi.mock('@/components/seo/blog-json-ld', () => ({ BlogPostJsonLd: vi.fn(() => null) }))
vi.mock('@/components/seo/json-ld/breadcrumb-json-ld', () => ({
  BreadcrumbListJsonLd: () => null,
}))
vi.mock('../../_components/blog-post-layout', () => ({ BlogPostLayout: () => null }))

import { BlogPostJsonLd } from '@/components/seo/blog-json-ld'
import BlogPostPage, { generateMetadata } from '../page'

const BOILERPLATE =
  'I spent six years in the Texas Army National Guard learning leadership and discipline that shaped my career.'
const PARAGRAPH =
  'Forecast accuracy collapses when pipeline stages are defined by sellers instead of buyer evidence.'

function row(
  excerpt: string,
  overrides: { metaDescription?: string | null; content?: string } = {}
) {
  return {
    id: 'p1',
    slug: 'p1',
    title: 'A Post',
    content: overrides.content ?? `# Heading\n\n${PARAGRAPH}\n\nMore text here.`,
    excerpt,
    status: 'PUBLISHED',
    deletedAt: null,
    metaDescription: overrides.metaDescription ?? null,
    metaTitle: null,
    contentType: 'MARKDOWN',
    author: null,
    category: null,
    tags: [],
    keywords: [],
    featuredImage: null,
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-02T00:00:00Z'),
    publishedAt: new Date('2026-01-01T00:00:00Z'),
  }
}

describe('getBlogPost excerpt resolution (via generateMetadata)', () => {
  beforeEach(() => mocks.findFirst.mockReset())

  it('replaces boilerplate with the body-derived excerpt', async () => {
    mocks.findFirst.mockResolvedValue(row(BOILERPLATE))
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'boiler' }) })
    expect(meta.description).toContain('Forecast accuracy collapses')
    expect(meta.description).not.toContain('National Guard')
  })

  it('keeps a normal excerpt unchanged', async () => {
    mocks.findFirst.mockResolvedValue(row('A perfectly good summary of the post.'))
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'normal' }) })
    expect(meta.description).toBe('A perfectly good summary of the post.')
  })
})

const F1_EXCERPT =
  'I spent six years in the Texas Army National Guard as an Information Technology Specialist, including a deployment to Iraq. I learned quickly that when equipment fails in the field, you don’t ignore it. You fix it, or you replace it. You do not leave it to rust.'
const F1_META =
  'I spent six years in the Texas Army National Guard as an Information Technology Specialist, including a deployment to Iraq. I learned quickly that when equ...'
const F1_PARA =
  'I see too many sales organizations treat "closed-lost" deals as final. They archive them in Salesforce, mark them as history, and move on. This is a waste of resources.'
const F1_BODY = [
  '# Re-engagement campaigns',
  F1_EXCERPT,
  'Sales pipelines are no different.',
  F1_PARA,
].join('\n\n')

const F2_EXCERPT =
  'I spent six years in the Texas Army National Guard as an Information Technology Specialist. That service included a deployment to Iraq. In the military, ambiguity gets people hurt. If your orders aren’t clear, your radio isn’t working, or your data is wrong, the mission fails. I carry that mindset i'
const F2_META =
  'I spent six years in the Texas Army National Guard as an Information Technology Specialist. That service included a deployment to Iraq. In the military, am...'
const F2_BODY = [
  '# Salesloft admin basics',
  `${F2_EXCERPT}nto every system I manage.`,
  'Salesloft is one of the most powerful sales engagement platforms available. But I see it configured poorly more often than I care to admit. I’ve held roles ranging from Business Systems Specialist to Revenue Operations Consultant.',
].join('\n\n')

const F3_EXCERPT =
  'I spent six years as an IT Specialist in the Texas Army National Guard, including a deployment to Iraq. Soldiers don’t have the luxury of guessing. If your gear is dirty, it jams. If your intel is wrong, you get hurt. The same logic applies to revenue operations. I’ve spent the last nine years fixin'
const F3_META =
  'I spent six years as an IT Specialist in the Texas Army National Guard, including a deployment to Iraq. Soldiers don’t have the luxury of guessing. If your...'
const F3_BODY = [
  'I spent six years as an IT Specialist in the Texas Army National Guard, including a deployment to Iraq. Soldiers don’t have the luxury of guessing. The same logic applies to revenue operations. I’ve spent the last nine years fixing broken systems.',
  'When I look at a pipeline, I don’t just see opportunities. I see noise, duplicates and stages that mean different things to different reps.',
].join('\n\n')

const C_EXCERPT =
  'A pipeline can show healthy coverage and green dashboards and still miss badly, because the CRM records what reps say instead of what buyers do. Here are the seven ways pipeline data goes wrong, how to detect each one, and how to keep it accurate.'
const C_META =
  'Seven ways CRM pipeline data drifts from reality, the reports that catch each one, and the systems, metrics and weekly inspection that keep pipeline accurate.'

async function metaFor(r: ReturnType<typeof row>) {
  mocks.findFirst.mockResolvedValue(r)
  const meta = await generateMetadata({ params: Promise.resolve({ slug: 'x' }) })
  return [
    meta.description,
    meta.openGraph?.description,
    (meta.twitter as { description?: string } | null | undefined)?.description,
  ]
}

async function jsonLdDescription(r: ReturnType<typeof row>) {
  mocks.findFirst.mockResolvedValue(r)
  vi.mocked(BlogPostJsonLd).mockClear()
  const tree = (await BlogPostPage({ params: Promise.resolve({ slug: 'x' }) })) as {
    props: { children: Array<{ type: unknown; props: { post: never } }> }
  }
  const el = tree.props.children.find((c) => c.type === BlogPostJsonLd)
  expect(el).toBeDefined()
  const actual = await vi.importActual<typeof import('@/components/seo/blog-json-ld')>(
    '@/components/seo/blog-json-ld'
  )
  const script = actual.BlogPostJsonLd({ post: el?.props.post as never }) as {
    props: { json: { description?: string } }
  }
  return script.props.json.description
}

describe('post meta, OG, Twitter and JSON-LD are bio-free (SEO-03)', () => {
  beforeEach(() => mocks.findFirst.mockReset())

  it('F1 resolves all three descriptions to the two-sentence body opening', async () => {
    const expected =
      'I see too many sales organizations treat "closed-lost" deals as final. They archive them in Salesforce, mark them as history, and move on.'
    const descriptions = await metaFor(
      row(F1_EXCERPT, { metaDescription: F1_META, content: F1_BODY })
    )
    for (const d of descriptions) {
      expect(d).toBe(expected)
      expect(d).not.toContain('National Guard')
      expect(d).not.toContain('...')
    }
  })

  it.each([
    ['F2', F2_EXCERPT, F2_META, F2_BODY, 'Salesloft is one of the most powerful'],
    ['F3', F3_EXCERPT, F3_META, F3_BODY, 'When I look at a pipeline'],
  ])(
    '%s starts with its first real paragraph and stays within 160',
    async (_n, ex, meta, body, start) => {
      const descriptions = await metaFor(row(ex, { metaDescription: meta, content: body }))
      for (const d of descriptions) {
        expect(d?.startsWith(start)).toBe(true)
        expect(d?.length).toBeLessThanOrEqual(160)
      }
    }
  )

  it('control C keeps its stored meta and its whole 247-char lede', async () => {
    const r = row(C_EXCERPT, { metaDescription: C_META })
    for (const d of await metaFor(r)) expect(d).toBe(C_META)
    mocks.findFirst.mockResolvedValue(r)
    const tree = (await BlogPostPage({ params: Promise.resolve({ slug: 'x' }) })) as {
      props: { children: Array<{ type: unknown; props: { post: { excerpt?: string } } }> }
    }
    const el = tree.props.children.find((c) => c.type === BlogPostJsonLd)
    expect(el?.props.post.excerpt).toBe(C_EXCERPT)
    expect(C_EXCERPT).toHaveLength(247)
  })

  it.each([
    ['F1', F1_EXCERPT, F1_META, F1_BODY],
    ['F2', F2_EXCERPT, F2_META, F2_BODY],
    ['F3', F3_EXCERPT, F3_META, F3_BODY],
  ])('%s JSON-LD description has no bio', async (_n, ex, meta, body) => {
    const description = await jsonLdDescription(row(ex, { metaDescription: meta, content: body }))
    expect(description).toBeTruthy()
    expect(description).not.toContain('National Guard')
  })
})
