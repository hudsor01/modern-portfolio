// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { Footer } from '../footer'

describe('Footer headings', () => {
  beforeEach(() => {
    cleanup()
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
      // font-sans resolves to the system stack here; headings inherit Spline Sans from body.
      expect(h?.classList.contains('font-sans')).toBe(false)
    }
  })
})
