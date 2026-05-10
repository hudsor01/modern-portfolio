// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { TrendingUp } from 'lucide-react'
import { ProjectPageLayout } from '../project-page-layout'
import type { ProjectPageLayoutProps } from '@/types/design-system'

vi.mock('next/navigation', () => ({
  usePathname: () => '/projects/foo',
}))

const baseProps: Pick<ProjectPageLayoutProps, 'title' | 'description' | 'tags' | 'children'> = {
  title: 'Foo Project',
  description: 'Foo description.',
  tags: [
    { label: 'Salesforce', variant: 'primary' },
    { label: 'HubSpot', variant: 'secondary' },
  ],
  children: <div data-testid="page-children">child content</div>,
}

describe('ProjectPageLayout', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders title, description, and children', () => {
    render(<ProjectPageLayout {...baseProps} />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Foo Project')
    expect(screen.getByTestId('project-description').textContent).toBe('Foo description.')
    expect(screen.getByTestId('page-children')).toBeTruthy()
  })

  it('renders all provided tags', () => {
    render(<ProjectPageLayout {...baseProps} />)
    const tagsContainer = screen.getByTestId('project-tags')
    expect(tagsContainer.textContent).toContain('Salesforce')
    expect(tagsContainer.textContent).toContain('HubSpot')
  })

  it('renders the back button with default href and label', () => {
    render(<ProjectPageLayout {...baseProps} />)
    const link = screen.getByRole('button', { name: /navigate back: back to projects/i })
    expect(link.getAttribute('href')).toBe('/projects')
    expect(link.textContent).toMatch(/back to projects/i)
  })

  it('respects a custom navigation.backUrl + navigation.backLabel', () => {
    render(
      <ProjectPageLayout
        {...baseProps}
        navigation={{
          backUrl: '/custom-back',
          backLabel: 'Go back home',
        }}
      />
    )
    const link = screen.getByRole('button', { name: /navigate back: go back home/i })
    expect(link.getAttribute('href')).toBe('/custom-back')
    expect(link.textContent).toMatch(/go back home/i)
  })

  it('renders NO timeframe pills when showTimeframes is omitted (default false)', () => {
    render(<ProjectPageLayout {...baseProps} />)
    expect(screen.queryByTestId('timeframe-selector')).toBeNull()
  })

  it('renders NO timeframe pills when showTimeframes=true but timeframes array is empty', () => {
    render(<ProjectPageLayout {...baseProps} showTimeframes={true} timeframes={[]} />)
    expect(screen.queryByTestId('timeframe-selector')).toBeNull()
  })

  it('renders timeframe pills when both showTimeframes=true AND timeframes are provided', () => {
    render(
      <ProjectPageLayout {...baseProps} showTimeframes={true} timeframes={['7d', '30d', '90d']} />
    )
    const selector = screen.getByTestId('timeframe-selector')
    expect(selector).toBeTruthy()
    expect(selector.textContent).toContain('7d')
    expect(selector.textContent).toContain('30d')
    expect(selector.textContent).toContain('90d')
  })

  it('renders the metrics section when metrics are provided', () => {
    render(
      <ProjectPageLayout
        {...baseProps}
        metrics={[
          { id: 'm1', label: 'Revenue', value: '$4.8M', variant: 'primary', icon: TrendingUp },
        ]}
      />
    )
    expect(screen.getByTestId('key-metrics-section')).toBeTruthy()
    expect(screen.getByText('$4.8M')).toBeTruthy()
    expect(screen.getByText('Revenue')).toBeTruthy()
  })

  it('does NOT render metrics section when metrics array is empty/undefined', () => {
    render(<ProjectPageLayout {...baseProps} />)
    expect(screen.queryByTestId('key-metrics-section')).toBeNull()
  })

  it('formats numeric metric values with toLocaleString', () => {
    render(
      <ProjectPageLayout
        {...baseProps}
        metrics={[
          { id: 'm1', label: 'Total', value: 1234567, variant: 'primary', icon: TrendingUp },
        ]}
      />
    )
    expect(screen.getByText(/1,234,567/)).toBeTruthy()
  })
})
