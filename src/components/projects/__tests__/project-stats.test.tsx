// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { STAT_LABELS, type StatKey } from '@/lib/stats'
import { ProjectStats } from '../project-stats'

describe('ProjectStats', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders the static stats and substitutes totalProjects into the last card', () => {
    render(<ProjectStats totalProjects={13} />)
    expect(screen.getByText('Revenue Impact')).toBeTruthy()
    expect(screen.getByText('Transaction Growth')).toBeTruthy()
    expect(screen.getByText('Network Growth')).toBeTruthy()
    expect(screen.getByText('Case Studies')).toBeTruthy()
    // The 4th value uses totalProjects+
    expect(screen.getByText('13+')).toBeTruthy()
  })

  it('renders 4 cards in non-loading state', () => {
    const { container } = render(<ProjectStats totalProjects={5} />)
    // Each card sits inside the outer grid div — assert by counting them
    const grid = container.querySelector('.grid')
    expect(grid).toBeTruthy()
    expect(grid?.children.length).toBe(4)
  })

  it('updates the case studies value when totalProjects changes', () => {
    const { rerender } = render(<ProjectStats totalProjects={11} />)
    expect(screen.getByText('11+')).toBeTruthy()
    rerender(<ProjectStats totalProjects={20} />)
    expect(screen.getByText('20+')).toBeTruthy()
  })

  it('tags each headline stat once with its canonical label', () => {
    const { container } = render(<ProjectStats totalProjects={13} />)
    const keys: StatKey[] = ['revenue', 'transaction-growth', 'network-growth']
    for (const key of keys) {
      expect(container.querySelectorAll(`[data-stat="${key}"]`).length).toBe(1)
      expect(container.querySelector(`[data-stat-label="${key}"]`)?.textContent).toBe(
        STAT_LABELS[key]
      )
    }
    expect(container.querySelectorAll('[data-stat]').length).toBe(3)
  })

  it('uses the sans semibold tabular value style', () => {
    const { container } = render(<ProjectStats totalProjects={13} />)
    const el = container.querySelector('[data-stat="revenue"]')
    expect(el?.className).toContain('font-sans')
    expect(el?.className).toContain('font-semibold')
    expect(el?.className).toContain('tabular-nums')
    expect(el?.className).not.toContain('font-mono')
    expect(el?.className).not.toContain('font-bold')
  })
})
