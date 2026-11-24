// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, it, expect, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

vi.mock('@/components/layout/navbar', () => ({ Navbar: () => null }))

import ToolsPage, { metadata } from '../page'
import { brandTitle } from '@/app/shared-metadata'
import { SITE_ORIGIN } from '@/lib/absolute-url'
import { tools } from '@/data/tools'

function decode(s: string): string {
  return s
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, '')
}

const html = renderToStaticMarkup(<ToolsPage />)

describe('/tools hub render', () => {
  it('has one main#main-content[tabindex=-1] and one h1 "Tools"', () => {
    expect(html.match(/<main[\s>]/g)).toHaveLength(1)
    const main = html.match(/<main[^>]*>/)?.[0] ?? ''
    expect(main).toContain('id="main-content"')
    expect(main).toContain('tabindex="-1"')
    const h1s = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/g)]
    expect(h1s).toHaveLength(1)
    expect(decode(h1s[0]?.[1] ?? '')).toBe('Tools')
  })

  it('lists every tool as an h2 in order inside one ul', () => {
    const h2s = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((m) => decode(m[1] ?? ''))
    expect(h2s).toEqual(tools.map((t) => t.name))
    const lists = html.match(/<ul[\s>]/g) ?? []
    expect(lists).toHaveLength(1)
    expect(html.match(/<li[\s>]/g)?.length).toBe(
      tools.length + /* breadcrumb items: Home, sep, Tools */ 3
    )
  })

  it('has an Open tool link per tool', () => {
    for (const tool of tools) {
      const re = new RegExp(`<a[^>]*href="${tool.href}"[^>]*>(.*?)</a>`)
      const m = html.match(re)
      expect(m).toBeTruthy()
      expect(decode(m?.[1] ?? '')).toBe(`Open tool: ${tool.name}`)
    }
  })

  it('states the intro and the tool count it names', () => {
    expect(tools.length).toBe(2)
    expect(decode(html)).toContain(
      'Two free revenue operations tools. Each runs in your browser and asks for no email.'
    )
  })
})

describe('no-email / in-browser claim grounding', () => {
  const files = [
    'src/app/tools/pipeline-coverage-calculator/_components/pipeline-coverage-calculator.tsx',
    'src/app/tools/revops-maturity-scorecard/_components/revops-maturity-scorecard.tsx',
    'src/lib/pipeline-coverage.ts',
    'src/lib/revops-maturity.ts',
  ]

  it('components import only react and their own lib', () => {
    for (const f of files.slice(0, 2)) {
      const src = readFileSync(join(process.cwd(), f), 'utf8')
      const specs = [...src.matchAll(/from\s+'([^']+)'/g)].map((m) => m[1])
      for (const spec of specs) {
        expect(['react', '@/lib/pipeline-coverage', '@/lib/revops-maturity']).toContain(spec)
      }
    }
  })

  it.each(files)('%s has no network, form, server action or email field', (f) => {
    const src = readFileSync(join(process.cwd(), f), 'utf8')
    for (const banned of [
      'fetch(',
      'sendBeacon',
      'XMLHttpRequest',
      "'use server'",
      '<form',
      'type="email"',
    ]) {
      expect(src).not.toContain(banned)
    }
  })
})

describe('/tools breadcrumb', () => {
  it('shows Home > Tools with Tools as current page, not a link', () => {
    const nav = html.match(/<nav aria-label="Breadcrumb".*?<\/nav>/)?.[0] ?? ''
    expect(decode(nav.replace(/<\/li>/g, '|'))).toBe('Home|›|Tools|')
    expect(nav).toContain('<li aria-current="page">Tools</li>')
    expect(nav.match(/<a[\s>]/g)).toHaveLength(1)
  })

  it('JSON-LD lists Home and Tools', () => {
    const scripts = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/g)]
    const parsed = scripts
      .map((m) => JSON.parse(m[1] ?? '{}'))
      .find((j) => j['@type'] === 'BreadcrumbList')
    expect(parsed.itemListElement.map((i: { name: string }) => i.name)).toEqual(['Home', 'Tools'])
    expect(parsed.itemListElement.map((i: { item: string }) => i.item)).toEqual([
      SITE_ORIGIN,
      `${SITE_ORIGIN}/tools`,
    ])
  })
})

describe('/tools metadata', () => {
  it('pins title, description and canonical', () => {
    expect(metadata.title).toBe('RevOps Tools: Pipeline Coverage & Maturity')
    expect(brandTitle(String(metadata.title)).length).toBeLessThanOrEqual(60)
    expect(String(metadata.description).length).toBeLessThan(160)
    expect(String(metadata.description)).not.toContain('Richard Hudson')
    expect(metadata.alternates?.canonical).toBe(`${SITE_ORIGIN}/tools`)
    const ogTitle = String(metadata.openGraph?.title)
    expect(ogTitle.split('Richard Hudson')).toHaveLength(2)
  })
})
