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
  const visible = [...nav.matchAll(/<li>(.*?)<\/li>|<li aria-current="page">(.*?)<\/li>/g)].map(
    (m) => decode(m[1] ?? m[2] ?? '')
  )

  it('shows Home > Tools > tool with links to / and /tools', () => {
    expect(visible).toEqual(['Home', 'Tools', tool.name])
    const hrefs = [...nav.matchAll(/<a[^>]*href="([^"]+)"/g)].map((m) => m[1])
    expect(hrefs).toEqual(['/', '/tools'])
    expect(nav).toContain(`<li aria-current="page">${decode(tool.name)}</li>`)
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
