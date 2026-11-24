// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { Footer } from '../footer'

describe('Footer headings', () => {
  beforeEach(() => {
    cleanup()
  })

  afterEach(async () => {
    cleanup()
    // Let queued React scheduler tasks drain before the environment is torn down.
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  it('renders three labelled navs with quiet uppercase sans headings', () => {
    const { container } = render(<Footer />)
    const navs = Array.from(container.querySelectorAll('nav[aria-label]'))
    expect(navs.map((n) => n.getAttribute('aria-label'))).toEqual([
      'Explore',
      'Revenue Operations',
      'Popular guides',
    ])
    for (const nav of navs) {
      const headings = nav.querySelectorAll('h2')
      expect(headings.length).toBe(1)
      const h = headings[0]
      expect(h?.textContent).toBe(nav.getAttribute('aria-label'))
      for (const c of [
        'text-xs',
        'font-semibold',
        'uppercase',
        'tracking-wider',
        'text-muted-foreground',
        'whitespace-nowrap',
      ]) {
        expect(h?.classList.contains(c)).toBe(true)
      }
      expect(h?.classList.contains('text-foreground')).toBe(false)
      // font-sans = theme token --font-sans (Spline first); without it the base heading rule applies Playfair.
      expect(h?.classList.contains('font-sans')).toBe(true)
    }
  })

  it('Explore lists About, Projects, Tools, Resume, Contact; Revenue Operations keeps both tools', () => {
    const { container } = render(<Footer />)
    const pairs = (label: string) =>
      Array.from(container.querySelectorAll(`nav[aria-label="${label}"] a`)).map((a) => [
        a.textContent,
        a.getAttribute('href'),
      ])
    expect(pairs('Explore')).toEqual([
      ['About', '/about'],
      ['Projects', '/projects'],
      ['Tools', '/tools'],
      ['Resume', '/resume'],
      ['Contact', '/contact'],
    ])
    const revops = pairs('Revenue Operations').map(([, href]) => href)
    expect(revops).toContain('/tools/pipeline-coverage-calculator')
    expect(revops).toContain('/tools/revops-maturity-scorecard')
  })
})
