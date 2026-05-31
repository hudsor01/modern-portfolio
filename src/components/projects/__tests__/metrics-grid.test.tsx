// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { TrendingUp, BarChart3, DollarSign, Target } from 'lucide-react'
import { MetricsGrid } from '../metrics-grid'
import type { MetricConfig } from '@/types/design-system'

const sampleMetrics: MetricConfig[] = [
  { id: 'a', label: 'Revenue', value: '$4.8M', variant: 'primary', icon: TrendingUp },
  { id: 'b', label: 'Growth', value: '432%', variant: 'success', icon: BarChart3 },
  { id: 'c', label: 'Network', value: '2,217%', variant: 'secondary', icon: Target },
  { id: 'd', label: 'Years', value: '10+', variant: 'info', icon: DollarSign },
]

describe('MetricsGrid', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders one card per item in the metrics array', () => {
    render(<MetricsGrid metrics={sampleMetrics} />)
    // Each metric label is unique — count by label rendering
    expect(screen.getByText('Revenue')).toBeTruthy()
    expect(screen.getByText('Growth')).toBeTruthy()
    expect(screen.getByText('Network')).toBeTruthy()
    expect(screen.getByText('Years')).toBeTruthy()
  })

  it('renders nothing in the grid when metrics is empty (and not loading)', () => {
    render(<MetricsGrid metrics={[]} />)
    const grid = screen.getByTestId('metrics-grid')
    expect(grid.children.length).toBe(0)
  })

  it('applies the columns=2 grid class', () => {
    render(<MetricsGrid metrics={sampleMetrics} columns={2} />)
    const grid = screen.getByTestId('metrics-grid')
    expect(grid.className).toContain('grid-cols-1')
    expect(grid.className).toContain('md:grid-cols-2')
    expect(grid.className).not.toContain('lg:grid-cols-3')
  })

  it('applies the columns=3 grid class (default)', () => {
    render(<MetricsGrid metrics={sampleMetrics} />)
    const grid = screen.getByTestId('metrics-grid')
    expect(grid.className).toContain('lg:grid-cols-3')
  })

  it('applies the columns=4 grid class', () => {
    render(<MetricsGrid metrics={sampleMetrics} columns={4} />)
    const grid = screen.getByTestId('metrics-grid')
    expect(grid.className).toContain('xl:grid-cols-4')
  })

  it('renders skeleton cards in loading state — count = min(columns*2, 8)', () => {
    const { container } = render(<MetricsGrid metrics={sampleMetrics} columns={3} loading={true} />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(6)
  })

  it('caps loading skeletons at 8 even with columns=4 (4*2=8)', () => {
    const { container } = render(<MetricsGrid metrics={sampleMetrics} columns={4} loading={true} />)
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBe(8)
  })

  it('forwards a custom className to the grid root', () => {
    render(<MetricsGrid metrics={sampleMetrics} className="my-grid-custom" />)
    const grid = screen.getByTestId('metrics-grid')
    expect(grid.className).toContain('my-grid-custom')
  })
})
