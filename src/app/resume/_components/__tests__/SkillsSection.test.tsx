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
    const grid = container.querySelector('h4')?.closest('.grid') as HTMLElement
    expect(grid.className).toContain('items-start')
    expect(grid.className).not.toContain('max-w-')
  })

  it('renders each group as a card with an h4 and pill list', () => {
    const { container } = render(<SkillsSection />)
    expect(container.querySelectorAll('h4')).toHaveLength(skills.length)
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
})
