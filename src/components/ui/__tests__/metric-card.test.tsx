// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { DollarSign } from 'lucide-react'
import { MetricCard } from '../metric-card'

type Dir = 'up' | 'down' | 'neutral'

function renderCard(direction: Dir, invert?: boolean, extra: Record<string, unknown> = {}) {
  return render(
    <MetricCard
      icon={DollarSign}
      label="Revenue"
      value="$4.2M"
      variant="primary"
      trend={{ direction, value: '12.3%', label: 'vs last year', invert }}
      {...extra}
    />
  ).container
}

describe('MetricCard', () => {
  beforeEach(() => cleanup())

  afterEach(async () => {
    cleanup()
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  it('makes the value dominant over the label', () => {
    const c = renderCard('up')
    const value = c.querySelector('[data-slot="metric-value"]')
    const label = c.querySelector('[data-slot="metric-label"]')
    for (const cls of [
      'text-3xl',
      'font-semibold',
      'leading-tight',
      'tracking-tight',
      'tabular-nums',
      'text-foreground',
    ]) {
      expect(value?.className).toContain(cls)
    }
    expect(label?.className).toContain('text-xs')
    expect(label?.className).toContain('font-semibold')
    expect(c.innerHTML).not.toContain('font-medium')
  })

  it('expresses the change once with icon and sr-only direction', () => {
    const c = renderCard('up')
    expect((c.textContent ?? '').split('12.3%').length - 1).toBe(1)
    expect(c.querySelectorAll('svg').length).toBe(2)
    const trend = c.querySelector('[data-slot="metric-trend"]')
    for (const cls of ['text-base', 'font-semibold', 'text-success']) {
      expect(trend?.className).toContain(cls)
    }
    expect(trend?.querySelector('.sr-only')?.textContent).toBe('Increase')
  })

  it('handles down and neutral directions', () => {
    let c = renderCard('down')
    let trend = c.querySelector('[data-slot="metric-trend"]')
    expect(trend?.querySelector('.sr-only')?.textContent).toBe('Decrease')
    expect(trend?.className).toContain('text-destructive')
    cleanup()
    c = renderCard('neutral')
    trend = c.querySelector('[data-slot="metric-trend"]')
    expect(trend?.querySelector('.sr-only')?.textContent).toBe('No change')
    expect(trend?.className).toContain('text-muted-foreground')
  })

  it('swaps colours but not text when invert is set', () => {
    let c = renderCard('up', true)
    let trend = c.querySelector('[data-slot="metric-trend"]')
    expect(trend?.className).toContain('text-destructive')
    expect(trend?.querySelector('.sr-only')?.textContent).toBe('Increase')
    cleanup()
    c = renderCard('down', true)
    trend = c.querySelector('[data-slot="metric-trend"]')
    expect(trend?.className).toContain('text-success')
    expect(trend?.querySelector('.sr-only')?.textContent).toBe('Decrease')
  })

  it('renders subtitle as base muted text and a larger skeleton when loading', () => {
    const c = renderCard('up', false, { subtitle: 'Commission Growth' })
    const p = Array.from(c.querySelectorAll('p')).find((e) => e.textContent === 'Commission Growth')
    expect(p?.className).toContain('text-base')
    expect(p?.className).toContain('text-muted-foreground')
    cleanup()
    const l = renderCard('up', false, { loading: true })
    expect(l.querySelector('.h-9.w-28')).not.toBeNull()
  })
})
