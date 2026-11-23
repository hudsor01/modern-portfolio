// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'

vi.mock('../animated-counter', () => ({
  AnimatedCounter: ({ value }: { value: string }) => <span>{value}</span>,
}))

import { ExperienceStats } from '../experience-stats'
import { STAT_LABELS, STAT_VALUES, type StatKey } from '@/lib/stats'

const order: StatKey[] = ['revenue', 'transaction-growth', 'network-growth', 'years']
const stats = order.map((k) => ({
  statKey: k,
  label: STAT_LABELS[k],
  value: STAT_VALUES[k],
  icon: 'star',
}))

afterEach(cleanup)

describe('ExperienceStats', () => {
  it('renders canonical labels in order, one data-stat per key', () => {
    const { container } = render(<ExperienceStats stats={stats} />)
    const labels = [...container.querySelectorAll('[data-stat-label]')].map((e) => e.textContent)
    expect(labels).toEqual([
      'Revenue Impact',
      'Transaction Growth',
      'Network Growth',
      'Years Experience',
    ])
    for (const k of order) {
      expect(container.querySelectorAll(`[data-stat="${k}"]`).length).toBe(1)
      expect(container.querySelector(`[data-stat-label="${k}"]`)?.textContent).toBe(STAT_LABELS[k])
    }
  })

  it('uses the stat value and label typography', () => {
    const { container } = render(<ExperienceStats stats={stats} />)
    const v = container.querySelector('[data-stat="revenue"]')!
    for (const c of [
      'font-sans',
      'text-3xl',
      'font-semibold',
      'tabular-nums',
      'tracking-tight',
      'text-foreground',
    ])
      expect(v.classList.contains(c)).toBe(true)
    expect(v.classList.contains('font-display')).toBe(false)
    expect(v.classList.contains('font-bold')).toBe(false)
    const l = container.querySelector('p[data-stat-label="revenue"]')!
    for (const c of [
      'text-xs',
      'font-semibold',
      'uppercase',
      'tracking-wider',
      'text-muted-foreground',
    ])
      expect(l.classList.contains(c)).toBe(true)
  })

  it('omits data-stat attributes without a statKey', () => {
    const { container } = render(
      <ExperienceStats stats={[{ label: 'X', value: '1', icon: 'star' }]} />
    )
    expect(container.querySelector('[data-stat]')).toBeNull()
    expect(container.querySelector('[data-stat-label]')).toBeNull()
  })
})
