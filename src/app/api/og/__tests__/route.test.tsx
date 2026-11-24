// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock next/og's ImageResponse — the real one boots a satori font pipeline
// that's unsuitable for unit tests. We capture the constructor args so we
// can assert on the input that the route prepared (truncation, defaults).
// The route invokes `new ImageResponse(...)`, so the mock must be constructable
// (regular Response). Returning a plain function from vi.fn() doesn't satisfy
// the `new` operator — we hand back an actual class wrapping a Response.
const imageResponseCtor = vi.fn()
vi.mock('next/og', () => ({
  ImageResponse: class MockImageResponse extends Response {
    constructor(element: unknown, opts: { headers?: Record<string, string> } = {}) {
      super('PNG_BYTES', {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          ...(opts.headers ?? {}),
        },
      })
      imageResponseCtor(element, opts)
    }
  },
}))

import { GET } from '@/app/api/og/route'
import { showcaseProjects } from '@/data/projects'

function req(query = '') {
  return new NextRequest(`http://localhost:3000/api/og${query}`)
}

describe('GET /api/og', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 image/png with default cache headers', async () => {
    const res = await GET(req())
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('image/png')
    expect(res.headers.get('Cache-Control')).toBe(
      'public, s-maxage=60, stale-while-revalidate=86400'
    )
  })

  it('truncates oversized title/subtitle/category (DoS mitigation T-06-03)', async () => {
    const longTitle = 'A'.repeat(500)
    const longSubtitle = 'B'.repeat(500)
    const longCategory = 'C'.repeat(500)
    const res = await GET(
      req(
        `?title=${encodeURIComponent(longTitle)}&subtitle=${encodeURIComponent(longSubtitle)}&category=${encodeURIComponent(longCategory)}`
      )
    )
    expect(res.status).toBe(200)

    // Reach into the captured ImageResponse element tree to verify truncation.
    expect(imageResponseCtor).toHaveBeenCalledOnce()
    const firstCall = imageResponseCtor.mock.calls[0]
    expect(firstCall).toBeDefined()
    const tree = JSON.stringify(firstCall![0])
    // Title truncated at 120, subtitle at 80, category at 40.
    expect(tree).toContain('A'.repeat(120))
    expect(tree).not.toContain('A'.repeat(121))
    expect(tree).toContain('B'.repeat(80))
    expect(tree).not.toContain('B'.repeat(81))
    expect(tree).toContain('C'.repeat(40))
    expect(tree).not.toContain('C'.repeat(41))
  })

  it('applies sensible defaults when no query params are supplied', async () => {
    await GET(req())
    expect(imageResponseCtor).toHaveBeenCalled()
    const firstCall = imageResponseCtor.mock.calls[0]
    expect(firstCall).toBeDefined()
    const tree = JSON.stringify(firstCall![0])
    expect(tree).toContain('Richard Hudson')
  })

  it('passes 1200x630 dimensions to ImageResponse', async () => {
    await GET(req())
    expect(imageResponseCtor).toHaveBeenCalled()
    const firstCall = imageResponseCtor.mock.calls[0]
    expect(firstCall).toBeDefined()
    expect(firstCall![1]).toMatchObject({ width: 1200, height: 630 })
  })

  describe('project branch', () => {
    const tree = async (q: string) => {
      imageResponseCtor.mockClear()
      const res = await GET(req(q))
      expect(res.status).toBe(200)
      expect(res.headers.get('Cache-Control')).toBe(
        'public, s-maxage=60, stale-while-revalidate=86400'
      )
      return imageResponseCtor.mock.calls[0]![0]
    }
    const bySlug = (slug: string) => showcaseProjects.find((p) => p.slug === slug)!

    function walk(node: unknown, visit: (n: any) => void) {
      if (Array.isArray(node)) {
        for (const c of node) walk(c, visit)
        return
      }
      if (node && typeof node === 'object') {
        visit(node)
        walk((node as any).props?.children, visit)
      }
    }

    it('draws client, title, legend, paired values and improvement', async () => {
      const el = await tree('?project=revenue-kpi&title=T')
      const t = JSON.stringify(el)
      expect(t).toContain(bySlug('revenue-kpi').client)
      expect(t).toContain('"T"')
      expect(t).toContain('Before')
      expect(t).toContain('After')
      expect(t).toContain('82% → 94%')
      expect(t).toContain('Richard Hudson')
      expect(t).toContain('richardwhudsonjr.com')
    })

    it('renders improvement-only rows without legend, catalog title by default', async () => {
      const el = await tree('?project=partner-performance')
      const t = JSON.stringify(el)
      expect(t).toContain('63% improvement')
      expect(t).toContain('22% improvement')
      expect(t).not.toContain('Before')
      expect(t).toContain(bySlug('partner-performance').title)
    })

    it('renders metric tiles', async () => {
      const t = JSON.stringify(await tree('?project=partnership-program-implementation'))
      expect(t).toContain('90%+')
      expect(t).toContain('35%')
      expect(t).not.toContain('→')
    })

    it.each(['nope', '../x', 'REVENUE-KPI', 'a'.repeat(101), ''])(
      'falls through silently for %s',
      async (slug) => {
        const base = JSON.stringify(await tree(''))
        const t = JSON.stringify(await tree(`?project=${slug}`))
        expect(t).toBe(base)
        if (slug) expect(t).not.toContain(slug)
      }
    )

    it.each(showcaseProjects.map((p) => p.slug))('satori-safe tree for %s', async (slug) => {
      const el = await tree(`?project=${slug}`)
      const bad: string[] = []
      walk(el, (n) => {
        const kids = ([] as unknown[])
          .concat(n.props?.children ?? [])
          .flat(Infinity)
          .filter((c) => c !== null && c !== false && c !== undefined)
        if (n.type === 'div' && kids.length > 1 && n.props.style?.display !== 'flex')
          bad.push('multi')
        const st = JSON.stringify(n.props?.style ?? {})
        if (/-webkit-box|WebkitLineClamp|grid|calc\(|var\(/.test(st)) bad.push(st)
      })
      expect(bad).toEqual([])
    })
  })
})
