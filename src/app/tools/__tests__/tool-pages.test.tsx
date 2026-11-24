// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('@/components/layout/navbar', () => ({ Navbar: () => null }))

import CalculatorPage from '../pipeline-coverage-calculator/page'
import ScorecardPage from '../revops-maturity-scorecard/page'
import { getTool, toolTrail, trailJsonLdItems } from '@/data/tools'
import { SITE_ORIGIN } from '@/lib/absolute-url'

function decode(s: string): string {
  return s
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, '')
}

describe.each([
  ['pipeline-coverage-calculator', CalculatorPage],
  ['revops-maturity-scorecard', ScorecardPage],
])('%s page breadcrumb', (slug, Page) => {
  const tool = getTool(slug)
  const html = renderToStaticMarkup(<Page />)
  const nav = html.match(/<nav aria-label="Breadcrumb".*?<\/nav>/)?.[0] ?? ''
  const visible = [...nav.matchAll(/<li\b[^>]*>(.*?)<\/li>/g)].map((m) => decode(m[1] ?? ''))

  it('shows Home > Tools > tool with links to / and /tools', () => {
    expect(visible).toEqual(['Home', 'Tools', tool.name])
    const hrefs = [...nav.matchAll(/<a[^>]*href="([^"]+)"/g)].map((m) => m[1])
    expect(hrefs).toEqual(['/', '/tools'])
    expect(nav).toMatch(
      new RegExp(
        `<li aria-current="page"[^>]*>${decode(tool.name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</li>`
      )
    )
  })

  it('JSON-LD equals the visible trail', () => {
    const scripts = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/g)]
    const parsed = scripts
      .map((m) => JSON.parse(m[1] ?? '{}'))
      .find((j) => j['@type'] === 'BreadcrumbList')
    const list = parsed.itemListElement as Array<{ name: string; item: string }>
    expect(list).toHaveLength(3)
    expect(list.map((i) => i.name)).toEqual(visible)
    expect(list.map((i) => ({ name: i.name, url: i.item }))).toEqual(
      trailJsonLdItems(toolTrail(tool))
    )
    expect(list[1]).toMatchObject({ name: 'Tools', item: `${SITE_ORIGIN}/tools` })
  })

  it('has one h1 equal to the tool name and no old "/ name" crumb', () => {
    const h1s = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/g)]
    expect(h1s).toHaveLength(1)
    expect(decode(h1s[0]?.[1] ?? '')).toBe(tool.name)
    const header = html.match(/<header.*?<\/header>/)?.[0] ?? ''
    expect(decode(header)).not.toContain(`/ ${tool.name}`)
  })
})

describe.each([
  ['pipeline-coverage-calculator', CalculatorPage],
  ['revops-maturity-scorecard', ScorecardPage],
])('%s page layout and typography', (_slug, Page) => {
  const html = renderToStaticMarkup(<Page />)

  it('uses the shared max-w-5xl container (same left edge as the hub)', () => {
    const main = html.match(/<main[^>]*>/)?.[0] ?? ''
    expect(main).toContain('max-w-5xl')
  })

  it('renders the "Why" prose at the same text-base size as the FAQ answers', () => {
    const section = html.match(/<section class="mt-16[^"]*">.*?<\/section>/)?.[0] ?? ''
    const paragraphs = [...section.matchAll(/<p\b([^>]*)>/g)]
    expect(paragraphs.length).toBeGreaterThan(0)
    for (const p of paragraphs) expect(p[1]).toContain('text-base')
  })
})

describe('scorecard FAQ typography', () => {
  it('uses curly quotes, never straight ones, around "tools you can’t feed"', () => {
    const html = renderToStaticMarkup(<ScorecardPage />)
    expect(html).toContain('“tools you can’t feed”')
    expect(html).not.toMatch(/&quot;tools you can(&#x27;|')t feed&quot;/)
    expect(html).not.toContain('can&#x27;t feed')
  })
})
