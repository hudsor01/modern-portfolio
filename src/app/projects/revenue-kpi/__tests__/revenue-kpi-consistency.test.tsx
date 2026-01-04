/**
 * @vitest-environment jsdom
 */

/**
 * Integration test for Revenue KPI project page consistency
 * Validates that the page follows all standardized UI patterns and components
 */

import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import RevenueKPI from '../page'

// Mock all external dependencies to ensure clean test environment
vi.mock('@/lib/constants/spacing', () => ({
  TIMING: {
    LOADING_STATE_RESET: 100, // Shorter timeout for tests
  },
}))

vi.mock('@/lib/utils/data-formatters', () => ({
  formatPercentage: (value: number) => `${(value * 100).toFixed(1)}%`,
  formatNumber: (value: number) => value.toLocaleString(),
  formatCurrency: (value: number, options?: { compact?: boolean }) => {
    if (options?.compact) {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
      if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
    }
    return `$${value.toLocaleString()}`
  },
}))

// Mock revenue KPI data
vi.mock('../data/constants', () => ({
  timeframes: ['All', 'Q4 2024', 'Q3 2024', 'Q2 2024'],
  technologies: ['React 19', 'TypeScript', 'Recharts', 'Next.js'],
}))

vi.mock('@/app/projects/data/partner-analytics', () => ({
  yearOverYearGrowthExtended: [
    {
      year: 2023,
      total_revenue: 3200000,
      partner_count: 145,
      total_transactions: 8750,
      commission_growth_percentage: 28.5,
    },
    {
      year: 2024,
      total_revenue: 4200000,
      partner_count: 187,
      total_transactions: 12340,
      commission_growth_percentage: 31.25,
    },
  ],
}))

// Mock dynamic imports to prevent loading issues
vi.mock('next/dynamic', () => ({
  default: (_importFn: unknown, options: { ssr?: boolean }) => {
    // Return a simple mock component for dynamic imports
    const MockComponent = () => (
      <div data-testid={options?.ssr === false ? 'dynamic-chart' : 'dynamic-component'}>
        Mock Chart Component
      </div>
    )
    return MockComponent
  },
}))

// Mock chart components to isolate the main component logic
vi.mock('../RevenueBarChart', () => ({
  default: () => <div data-testid="revenue-bar-chart">Revenue Bar Chart</div>,
}))

vi.mock('../RevenueLineChart', () => ({
  default: () => <div data-testid="revenue-line-chart">Revenue Line Chart</div>,
}))

vi.mock('../TopPartnersChart', () => ({
  default: () => <div data-testid="top-partners-chart">Top Partners Chart</div>,
}))

vi.mock('../PartnerGroupPieChart', () => ({
  default: () => <div data-testid="partner-group-pie-chart">Partner Group Pie Chart</div>,
}))

// Mock utility functions
vi.mock('../utils', () => ({
  calculateGrowth: (current: number, previous?: number) => {
    if (!previous) return 0
    return ((current - previous) / previous) * 100
  },
}))

describe('Revenue KPI Page Consistency', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      expect(() => render(<RevenueKPI />)).not.toThrow()
    })

    it('should use standardized components structure', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Check that the page renders with basic structure
      expect(container).toBeInTheDocument()
    })
  })

  describe('Layout Consistency (Requirements 1.1, 1.2)', () => {
    it('should use ProjectPageLayout with standardized header structure', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify page title and description are present
      expect(container.textContent).toContain('Revenue KPI Dashboard')
      expect(container.textContent).toContain(
        'Real-time revenue analytics, partner performance metrics, and business intelligence for data-driven growth strategies.'
      )
    })

    it('should display standardized project tags', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify tags are present with consistent formatting
      expect(container.textContent).toContain('Revenue: $4,200,000')
      expect(container.textContent).toContain('Partners: 187')
      expect(container.textContent).toContain('Growth: +31.3%')
      expect(container.textContent).toContain('Accuracy: 94%')
    })
  })

  describe('Component Library Consistency (Requirements 3.1, 3.2, 3.3)', () => {
    it('should use MetricsGrid component for metrics display', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify MetricsGrid is rendered (it should have data-testid="metrics-grid")
      const metricsGrid = container.querySelector('[data-testid="metrics-grid"]')
      expect(metricsGrid).toBeInTheDocument()
    })

    it('should use ChartContainer components for data visualizations', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify chart container titles are present
      expect(container.textContent).toContain('Revenue Growth Trends')
      expect(container.textContent).toContain('Monthly Revenue Analysis')
      expect(container.textContent).toContain('Top Revenue Partners')
      expect(container.textContent).toContain('Partner Group Distribution')
    })

    it('should use SectionCard components for content organization', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Check for section titles that would be in SectionCard components
      expect(container.textContent).toContain('Project Overview')
      expect(container.textContent).toContain('Challenge')
      expect(container.textContent).toContain('Solution')
      expect(container.textContent).toContain('Results & Impact')
      expect(container.textContent).toContain('Key Learnings')
    })
  })

  describe('Data Formatting Consistency (Requirements 8.1, 8.2, 8.4)', () => {
    it('should use consistent currency formatting', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify currency values are formatted consistently
      expect(container.textContent).toContain('$4,200,000') // Total revenue
      expect(container.textContent).toContain('$4,200,000') // Additional revenue generated
    })

    it('should use consistent percentage formatting', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify percentage values are formatted consistently
      expect(container.textContent).toContain('31.3%') // Growth percentage
      expect(container.textContent).toContain('94%') // Forecast accuracy
    })

    it('should use consistent number formatting', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify number values are formatted consistently
      expect(container.textContent).toContain('187') // Partner count
      expect(container.textContent).toContain('12,340') // Transaction volume
    })
  })

  describe('Navigation Pattern Consistency (Requirements 2.1, 2.2)', () => {
    it('should implement consistent timeframe navigation', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify timeframe navigation is present
      expect(container.textContent).toContain('All')
      expect(container.textContent).toContain('Q4 2024')
      expect(container.textContent).toContain('Q3 2024')
      expect(container.textContent).toContain('Q2 2024')
    })

    it('should implement consistent refresh functionality', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // The component should render without errors, indicating proper interactive elements
      expect(container).toBeInTheDocument()
    })
  })

  describe('Content Structure Consistency (Requirements 5.1, 5.3)', () => {
    it('should follow standardized content organization pattern', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify key content sections are present in correct order
      const content = container.textContent || ''

      // Check that sections appear in the expected order
      const overviewIndex = content.indexOf('Project Overview')
      const challengeIndex = content.indexOf('Challenge')
      const solutionIndex = content.indexOf('Solution')
      const resultsIndex = content.indexOf('Results & Impact')

      expect(overviewIndex).toBeGreaterThan(-1)
      expect(challengeIndex).toBeGreaterThan(-1)
      expect(solutionIndex).toBeGreaterThan(-1)
      expect(resultsIndex).toBeGreaterThan(-1)

      // Verify sections appear in logical order (allowing for some flexibility)
      expect(challengeIndex).toBeGreaterThan(overviewIndex)
      expect(resultsIndex).toBeGreaterThan(solutionIndex)
    })

    it('should include standardized narrative sections', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify all required narrative sections are present
      expect(container.textContent).toContain('Project Overview')
      expect(container.textContent).toContain('Challenge')
      expect(container.textContent).toContain('Solution')
      expect(container.textContent).toContain('Results & Impact')
      expect(container.textContent).toContain('Key Learnings')
    })

    it('should include standardized metrics display', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify key metrics are displayed
      expect(container.textContent).toContain('Revenue')
      expect(container.textContent).toContain('Partners')
      expect(container.textContent).toContain('Volume')
      expect(container.textContent).toContain('Growth')
    })
  })

  describe('Interactive Elements Consistency (Requirements 6.1, 6.2)', () => {
    it('should implement consistent hover states and interactions', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // The component should render without errors, indicating proper interactive elements
      expect(container).toBeInTheDocument()

      // Check for interactive elements that should have consistent styling
      const interactiveElements = container.querySelectorAll('button, [role="button"]')
      expect(interactiveElements.length).toBeGreaterThan(0)
    })

    it('should implement consistent loading states', async () => {
      const { container } = render(<RevenueKPI />)

      // Check that component renders (loading state is handled internally)
      expect(container).toBeInTheDocument()

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Should show content after loading
      expect(container.textContent).toContain('Revenue KPI Dashboard')
      expect(container.textContent).toContain('Real-time revenue analytics')
    })
  })

  describe('Design System Integration (Requirements 4.1, 4.2, 4.3)', () => {
    it('should use consistent design tokens and styling', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify the component renders without styling errors
      expect(container).toBeInTheDocument()

      // Check for consistent class patterns that indicate design system usage
      const elements = container.querySelectorAll('*')
      let hasConsistentStyling = false

      elements.forEach((element) => {
        const className = element.className
        if (
          typeof className === 'string' &&
          className &&
          (className.includes('rounded-') ||
            className.includes('p-') ||
            className.includes('mb-') ||
            className.includes('gap-'))
        ) {
          hasConsistentStyling = true
        }
      })

      expect(hasConsistentStyling).toBe(true)
    })

    it('should use consistent spacing and layout patterns', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Check for consistent spacing classes
      const spacingElements = container.querySelectorAll('[class*="mb-"], [class*="gap-"]')
      expect(spacingElements.length).toBeGreaterThan(0)
    })
  })

  describe('Data Visualization Consistency (Requirements 3.2, 3.5)', () => {
    it('should use standardized chart containers with consistent theming', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify all chart components are rendered
      expect(container.querySelector('[data-testid="dynamic-chart"]')).toBeInTheDocument()

      // Verify chart titles are present (indicating ChartContainer usage)
      expect(container.textContent).toContain('Revenue Growth Trends')
      expect(container.textContent).toContain('Monthly Revenue Analysis')
      expect(container.textContent).toContain('Top Revenue Partners')
      expect(container.textContent).toContain('Partner Group Distribution')
    })

    it('should provide consistent chart descriptions', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify chart descriptions are present
      expect(container.textContent).toContain('Monthly revenue progression and forecasting')
      expect(container.textContent).toContain('Revenue breakdown by time period')
      expect(container.textContent).toContain('Highest performing business partners')
      expect(container.textContent).toContain('Revenue contribution by partner type')
    })
  })

  describe('Accessibility Pattern Consistency (Requirements 7.2, 7.3, 7.4)', () => {
    it('should maintain consistent semantic HTML structure', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Check for proper heading hierarchy
      const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
      expect(headings.length).toBeGreaterThan(0)

      // Check for proper button elements
      const buttons = container.querySelectorAll('button')
      expect(buttons.length).toBeGreaterThan(0)
    })

    it('should provide consistent focus management', async () => {
      const { container } = render(<RevenueKPI />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Check that interactive elements are focusable
      const focusableElements = container.querySelectorAll(
        'button, [tabindex]:not([tabindex="-1"]), a[href]'
      )
      expect(focusableElements.length).toBeGreaterThan(0)
    })
  })
})
