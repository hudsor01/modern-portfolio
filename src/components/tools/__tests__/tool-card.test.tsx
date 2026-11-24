// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { ToolCard } from '../tool-card'
import { tools } from '@/data/tools'

function decode(s: string): string {
  return s
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function classOf(tag: string): string {
  return /class="([^"]*)"/.exec(tag)?.[1] ?? ''
}

describe.each(tools.map((t) => [t.name, t] as const))('ToolCard %s', (_n, tool) => {
  const html = renderToStaticMarkup(<ToolCard tool={tool} />)

  it('has one article and one link covering the card', () => {
    expect(html.match(/<article[\s>]/g)).toHaveLength(1)
    const anchors = html.match(/<a[\s>]/g) ?? []
    expect(anchors).toHaveLength(1)
    const a = /<a\b[^>]*>(.*?)<\/a>/s.exec(html)
    expect(a).not.toBeNull()
    const tag = /<a\b[^>]*>/.exec(html)![0]
    expect(tag).toContain(`href="${tool.href}"`)
    expect(decode(a![1]!)).toBe(`Open tool: ${tool.name}`)
    const cls = classOf(tag)
    for (const c of [
      'after:absolute',
      'after:inset-0',
      'bg-primary',
      'text-primary-foreground',
      'min-h-[44px]',
      'mt-auto',
    ]) {
      expect(cls).toContain(c)
    }
    expect(cls).not.toContain('focus:outline-none')
  })

  it('renders the title as an h2 with explicit size and weight', () => {
    const h2 = /<h2([^>]*)>(.*?)<\/h2>/.exec(html)!
    expect(decode(h2[2]!)).toBe(tool.name)
    expect(classOf(h2[1]!)).toContain('text-lg')
    expect(classOf(h2[1]!)).toContain('font-semibold')
  })

  it('keeps the icon tile above the link overlay and hides decorative svgs', () => {
    const tile = /<div([^>]*data-slot="tool-icon"[^>]*)>/.exec(html)
    expect(tile).not.toBeNull()
    const classes = classOf(tile![1]!).split(/\s+/)
    for (const c of ['relative', 'z-10', 'bg-primary/8', 'size-10', 'rounded-xl', 'text-primary']) {
      expect(classes).toContain(c)
    }
    const svgs = html.match(/<svg[^>]*>/g) ?? []
    expect(svgs).toHaveLength(2)
    for (const s of svgs) expect(s).toContain('aria-hidden="true"')
  })

  it('lists outcome and effort in a dl and the summary in a paragraph', () => {
    const dts = [...html.matchAll(/<dt[^>]*>(.*?)<\/dt>/g)].map((m) => decode(m[1]!))
    const dds = [...html.matchAll(/<dd[^>]*>(.*?)<\/dd>/g)].map((m) => decode(m[1]!))
    expect(dts).toEqual(['You get', 'Takes'])
    expect(dds).toEqual([tool.outcome, tool.effort])
    const ps = [...html.matchAll(/<p(?:\s[^>]*)?>(.*?)<\/p>/g)].map((m) => decode(m[1]!))
    expect(ps).toEqual([tool.summary])
  })

  it('uses only the allowed type set and no images', () => {
    expect(html).not.toContain('text-[')
    expect(html).not.toContain('font-medium')
    expect(html).not.toContain('font-bold')
    expect(html).not.toContain('<img')
  })
})

describe('tools components are Server Components', () => {
  it.each(['tool-card.tsx', 'tool-breadcrumb.tsx'])('%s has no client directive', (f) => {
    const src = readFileSync(join(process.cwd(), 'src/components/tools', f), 'utf8')
    expect(src).not.toMatch(/['"]use client['"]/)
  })
})
