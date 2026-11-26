import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { skills } from '../../data/constants'
import { SkillsSection } from '../SkillsSection'

describe('SkillsSection', () => {
  afterEach(cleanup)

  it('is headed "Skills by area" with honest copy', () => {
    const { container } = render(<SkillsSection />)
    expect(screen.getByRole('heading', { name: 'Skills by area' })).toBeTruthy()
    expect(screen.getByText('Tools and methods grouped by focus area.')).toBeTruthy()
    expect(container.textContent).not.toMatch(/interactive skill matrix/i)
  })

  it('sits on the page grid with content-height cards (B-16)', () => {
    const { container } = render(<SkillsSection />)
    const grid = container.querySelector('h3')?.closest('.grid') as HTMLElement
    expect(grid.className).toContain('items-start')
    expect(grid.className).not.toContain('max-w-')
  })

  it('renders each group as a card with an h3 (h4 look) and pill list', () => {
    const { container } = render(<SkillsSection />)
    expect(container.querySelector('h2')?.textContent).toBe('Skills by area')
    const groups = container.querySelectorAll('h3')
    expect(groups).toHaveLength(skills.length)
    for (const h of groups) expect(h.className).toContain('look-h4')
    const lis = container.querySelectorAll('ul > li')
    expect(lis.length).toBe(skills.reduce((n, g) => n + g.items.length, 0))
    for (const li of lis) {
      expect(li.className).toContain('text-base')
      expect(li.className).toContain('font-normal')
      expect(li.className).not.toContain('text-sm')
      expect(li.className).not.toContain('font-medium')
    }
    expect(container.innerHTML).not.toContain('bg-muted/50')
  })

  it('carries no utility that an important (!) twin already overrides', () => {
    const { container } = render(<SkillsSection />)
    for (const el of container.querySelectorAll('[class]')) {
      const classes = new Set(el.getAttribute('class')?.split(/\s+/))
      const dead = [...classes].filter((c) => !c.endsWith('!') && classes.has(`${c}!`))
      expect(dead, el.tagName).toEqual([])
    }
  })
})
