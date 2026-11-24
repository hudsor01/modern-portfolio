// @vitest-environment jsdom
import { describe, it, expect, beforeAll, afterEach } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import DealFunnel from '../DealFunnelPageContent'

beforeAll(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
})

describe('DealFunnel first render', () => {
  afterEach(cleanup)

  it('shows metrics synchronously with no loading state', () => {
    render(<DealFunnel />)
    for (const label of [
      'Total Opportunities',
      'Closed Won Deals',
      'Deal Size',
      'Avg. of Tier Median Days to Close',
    ]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0)
    }
    expect(screen.queryByRole('status')).toBeNull()
    expect(screen.queryByLabelText('Loading')).toBeNull()
  })

  it('labels the cycle figure as an average of tier medians, never a bare median', () => {
    const { container } = render(<DealFunnel />)
    const text = container.textContent ?? ''
    expect(text).toContain('Avg. of Tier Median Days to Close')
    expect(text).toContain('Avg. Tier Median Cycle:')
    expect(text).not.toMatch(/(?<!Tier )Median Cycle/)
    expect(text).not.toMatch(/(?<!Tier )Median Days to Close/)
  })

  it('reports Closed Won (not Closed Lost) as the won figure, with one win rate', () => {
    const { container } = render(<DealFunnel />)
    const text = container.textContent ?? ''
    // 470 won, 90 lost, 1,140 working: 470 / (470 + 90) = 83.9% of closed deals.
    expect(text).toContain('1,700')
    expect(text).toContain('83.9%')
    expect(text.match(/83\.9%/g)?.length).toBe(1)
    expect(text).not.toContain('7.9%')
    expect(text).not.toContain('$317')
    expect(screen.getAllByText('Closed Won').length).toBeGreaterThan(0)
  })

  it('has one chart title per card (no nested duplicate headers)', () => {
    render(<DealFunnel />)
    for (const title of [
      'Sales Pipeline Funnel',
      'Stage Conversion Rates',
      'Sales Velocity by Partner Tier',
    ]) {
      expect(screen.getAllByRole('heading', { name: title }).length).toBe(1)
    }
    expect(screen.queryByRole('heading', { name: 'Deal Stage Funnel' })).toBeNull()
    expect(screen.queryByRole('heading', { name: 'Sales Velocity by Partner' })).toBeNull()
  })

  it('server-renders the content', () => {
    const html = renderToString(<DealFunnel />)
    expect(html).toContain('Total Opportunities')
    expect(html).not.toContain('aria-label="Loading"')
  })
})
