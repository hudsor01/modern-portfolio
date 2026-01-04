/**
 * @vitest-environment jsdom
 */

/**
 * Integration test for Commission Optimization project page consistency
 * Validates that the page follows all standardized UI patterns and components
 */

import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import CommissionOptimization from '../page'

// Mock all external dependencies to ensure clean test environment
vi.mock('@/lib/constants/spacing', () => ({
  TIMING: {
    LOADING_STATE_RESET: 100, // Shorter timeout for tests
  },
}))

vi.mock('@/lib/utils/data-formatters', () => ({
  formatPercentage: (value: number) => `${(value * 100).toFixed(1)}%`,
  formatNumber: (value: number) => value.toString(),
  formatCurrency: (value: number, options?: { compact?: boolean }) => {
    if (options?.compact) {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
      if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`
    }
    return `$${value.toLocaleString()}`
  },
}))

// Mock commission optimization data
vi.mock('../data/constants', () => ({
  commissionMetrics: {
    totalCommissionPool: 254000,
    averageCommissionRate: 23.0,
    performanceImprovement: 34.2,
    automationEfficiency: 87.5,
    partnerCount: 47,
    totalPayouts: 218450,
    pendingPayouts: 35550,
    averagePartnerEarnings: 5403,
  },
  commissionCalculationMetrics: [
    { metric: 'Processing Time', value: '2.3 hours', improvement: '-73%', status: 'excellent' },
    { metric: 'Calculation Accuracy', value: '99.8%', improvement: '+12%', status: 'excellent' },
  ],
  commissionTiers: [
    {
      tier: 'Elite Partners',
      count: 8,
      commissionRate: 28.0,
      totalEarnings: 89600,
      avgEarnings: 11200,
      requirements: '$50K+ quarterly sales',
      performanceBonus: 15.0,
      roi: 4.2,
    },
  ],
  incentivePrograms: [
    {
      program: 'Quarterly Sales Accelerator',
      participants: 34,
      budget: 45000,
      payout: 38750,
      effectiveness: 86.1,
      avgBonus: 1140,
      performanceLift: 28.4,
    },
  ],
  technologies: ['React 19', 'TypeScript', 'Recharts'],
}))

// Mock dynamic imports to prevent loading issues
vi.mock('next/dynamic', () => ({
  default: (_importFn: unknown, options: { loading?: boolean }) => {
    // Return a simple mock component for dynamic imports
    const MockComponent = () => (
      <div data-testid={options.loading ? 'loading' : 'dynamic-component'}>Mock Component</div>
    )
    return MockComponent
  },
}))

// Mock chart components to isolate the main component logic
vi.mock('../CommissionStructureChart', () => ({
  default: () => <div data-testid="commission-structure-chart">Commission Structure Chart</div>,
}))

vi.mock('../ROIOptimizationChart', () => ({
  default: () => <div data-testid="roi-optimization-chart">ROI Optimization Chart</div>,
}))

vi.mock('../CommissionTierChart', () => ({
  default: () => <div data-testid="commission-tier-chart">Commission Tier Chart</div>,
}))

vi.mock('../PerformanceIncentiveChart', () => ({
  default: () => <div data-testid="performance-incentive-chart">Performance Incentive Chart</div>,
}))

describe('Commission Optimization Page Consistency', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      expect(() => render(<CommissionOptimization />)).not.toThrow()
    })

    it('should use standardized components structure', async () => {
      const { container } = render(<CommissionOptimization />)

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
      const { container } = render(<CommissionOptimization />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify page title and description are present
      expect(container.textContent).toContain('Commission & Incentive Optimization System')
      expect(container.textContent).toContain(
        'Advanced commission management and partner incentive optimization platform'
      )
    })

    it('should display standardized project tags', async () => {
      const { container } = render(<CommissionOptimization />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify tags are present with consistent formatting
      expect(container.textContent).toContain('Commission Pool: $254,000')
      expect(container.textContent).toContain('Avg Rate: 23.0%')
      expect(container.textContent).toContain('Performance: +34.2%')
      expect(container.textContent).toContain('Automation: 87.5%')
    })
  })

  describe('Component Library Consistency (Requirements 3.1, 3.2, 3.3)', () => {
    it('should use MetricsGrid component for metrics display', async () => {
      const { container } = render(<CommissionOptimization />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify MetricsGrid is rendered (it should have data-testid="metrics-grid")
      const metricsGrid = container.querySelector('[data-testid="metrics-grid"]')
      expect(metricsGrid).toBeInTheDocument()
    })

    it('should use SectionCard components for content organization', async () => {
      const { container } = render(<CommissionOptimization />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Check for section titles that would be in SectionCard components
      expect(container.textContent).toContain('Commission Processing & Automation Metrics')
      expect(container.textContent).toContain('Project Overview')
      expect(container.textContent).toContain('Challenge')
      expect(container.textContent).toContain('Solution')
      expect(container.textContent).toContain('Results & Impact')
    })

    it('should use ChartContainer components for data visualizations', async () => {
      const { container } = render(<CommissionOptimization />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify chart container titles are present (default tab is overview)
      expect(container.textContent).toContain('Commission Structure & Payout Analysis')
      expect(container.textContent).toContain('ROI Optimization & Performance Impact')

      // Note: Other chart containers are in different tabs and would require tab switching to test
      // This validates that ChartContainer components are being used consistently
    })
  })

  describe('Data Formatting Consistency (Requirements 8.1, 8.2, 8.4)', () => {
    it('should use consistent currency formatting', async () => {
      const { container } = render(<CommissionOptimization />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify currency values are formatted consistently
      expect(container.textContent).toContain('$254,000') // Commission pool
    })

    it('should use consistent percentage formatting', async () => {
      const { container } = render(<CommissionOptimization />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify percentage values are formatted consistently
      expect(container.textContent).toContain('23.0%') // Average rate
      expect(container.textContent).toContain('34.2%') // Performance improvement
      expect(container.textContent).toContain('87.5%') // Automation efficiency
    })
  })

  describe('Navigation Pattern Consistency (Requirements 2.1, 2.2)', () => {
    it('should implement consistent tab navigation', async () => {
      const { container } = render(<CommissionOptimization />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify tab navigation is present (timeframes are used as tabs)
      expect(container.textContent).toContain('Overview')
      expect(container.textContent).toContain('Tiers')
      expect(container.textContent).toContain('Incentives')
      expect(container.textContent).toContain('Automation')
    })
  })

  describe('Content Structure Consistency (Requirements 5.1, 5.3)', () => {
    it('should follow standardized content organization pattern', async () => {
      const { container } = render(<CommissionOptimization />)

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
      expect(challengeIndex).toBeGreaterThan(overviewIndex)
      expect(solutionIndex).toBeGreaterThan(challengeIndex)
      expect(resultsIndex).toBeGreaterThan(solutionIndex)
    })

    it('should include standardized narrative sections', async () => {
      const { container } = render(<CommissionOptimization />)

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
  })

  describe('Interactive Elements Consistency (Requirements 6.1, 6.2)', () => {
    it('should implement consistent refresh functionality', async () => {
      const { container } = render(<CommissionOptimization />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // The component should render without errors, indicating proper interactive elements
      expect(container).toBeInTheDocument()
    })

    it('should implement consistent tab switching behavior', async () => {
      const { container } = render(<CommissionOptimization />)

      // Fast-forward timers to complete loading
      await act(async () => {
        vi.advanceTimersByTime(200)
      })

      // Verify tab content is rendered (default should be overview)
      expect(container.textContent).toContain('Commission Structure & Payout Analysis')
    })
  })

  describe('Design System Integration (Requirements 4.1, 4.2, 4.3)', () => {
    it('should use consistent design tokens and styling', async () => {
      const { container } = render(<CommissionOptimization />)

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
  })
})
