// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ToolBreadcrumb } from '../tool-breadcrumb'
import { tools, toolTrail, trailJsonLdItems } from '@/data/tools'
import { SITE_ORIGIN } from '@/lib/absolute-url'

function decode(s: string): string {
  return s
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, '')
    .trim()
}

function parse(html: string) {
  const items = [...html.matchAll(/<li([^>]*)>(.*?)<\/li>/g)].map((m) => ({
    attrs: m[1] ?? '',
    inner: m[2] ?? '',
  }))
  const sep = items.filter((i) => i.attrs.includes('aria-hidden="true"'))
  const visible = items.filter((i) => !i.attrs.includes('aria-hidden="true"'))
  return { items, sep, visible }
}

describe('ToolBreadcrumb', () => {
  it.each(tools.map((t) => [t.name, t] as const))('renders Home > Tools > %s', (_n, tool) => {
    const html = renderToStaticMarkup(<ToolBreadcrumb trail={toolTrail(tool)} />)
    expect(html.match(/<nav[^>]*>/g)).toHaveLength(1)
    expect(html).toContain('aria-label="Breadcrumb"')
    expect(html.match(/<nav[^>]*class="[^"]*\bmb-3\b/g)).toHaveLength(1)
    expect(html.match(/<ol[\s>]/g)).toHaveLength(1)
    const { sep, visible } = parse(html)
    expect(visible.map((v) => decode(v.inner))).toEqual(['Home', 'Tools', tool.name])
    expect([...html.matchAll(/<a[^>]*href="([^"]*)"/g)].map((m) => m[1])).toEqual(['/', '/tools'])
    const last = visible[2]
    expect(last?.attrs).toContain('aria-current="page"')
    expect(last?.inner).not.toContain('<a')
    expect(sep).toHaveLength(2)
    for (const s of sep) expect(decode(s.inner)).toBe('›')
  })

  it('renders the hub trail with Tools as the current page', () => {
    const html = renderToStaticMarkup(<ToolBreadcrumb trail={toolTrail()} />)
    const { sep, visible } = parse(html)
    expect(visible.map((v) => decode(v.inner))).toEqual(['Home', 'Tools'])
    expect([...html.matchAll(/<a[^>]*href="([^"]*)"/g)].map((m) => m[1])).toEqual(['/'])
    expect(visible[1]?.attrs).toContain('aria-current="page"')
    expect(sep).toHaveLength(1)
  })

  it('keeps JSON-LD items in step with the visible trail', () => {
    for (const trail of [toolTrail(), ...tools.map((t) => toolTrail(t))]) {
      const html = renderToStaticMarkup(<ToolBreadcrumb trail={trail} />)
      const names = parse(html).visible.map((v) => decode(v.inner))
      const items = trailJsonLdItems(trail)
      expect(items.map((i) => i.name)).toEqual(names)
      expect(items[0]?.url).toBe(SITE_ORIGIN)
      expect(items[1]?.url).toBe(`${SITE_ORIGIN}/tools`)
    }
    const t = tools[0]!
    expect(trailJsonLdItems(toolTrail(t))).toEqual([
      { name: 'Home', url: SITE_ORIGIN },
      { name: 'Tools', url: `${SITE_ORIGIN}/tools` },
      { name: t.name, url: `${SITE_ORIGIN}${t.href}` },
    ])
  })
})
