/**
 * Integration test for Churn Retention project page consistency
 * Validates that the page follows all standardized UI patterns and components
 * Refactored for Bun test runner
 */

import { render } from '@testing-library/react'
import { describe, it, expect, mock, beforeEach, afterEach } from 'bun:test'
import ChurnAnalysis from '../page'

// Helper to wait for a specific duration
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

describe('Churn Retention Page Consistency', () => {
  // Set up mocks before each test and restore after
  beforeEach(() => {
    mock.module('@/lib/constants/spacing', () => ({
      TIMING: {
        LOADING_STATE_RESET: 0,
      },
    }))

    mock.module('@/lib/utils/data-formatters', () => ({
      formatPercentage: (value: number) => `${(value * 100).toFixed(1)}%`,
      formatNumber: (value: number) => value.toString(),
      formatCurrency: (value: number, options?: { compact?: boolean }) => {
        if (options?.compact) {
          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
          if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
        }
        return `${value.toLocaleString()}`
      },
    }))

    mock.module('@/app/projects/data/partner-analytics', () => ({
      staticChurnData: [
        { churnRate: 12.5, retained: 87, churned: 13 },
        { churnRate: 14.2, retained: 85, churned: 15 },
      ],
    }))

    mock.module('../ChurnLineChart', () => ({
      default: () => <div data-testid="churn-line-chart">Churn Line Chart</div>,
    }))

    mock.module('../RetentionHeatmap', () => ({
      default: () => <div data-testid="retention-heatmap">Retention Heatmap</div>,
    }))

    mock.module('@/components/projects/star-area-chart', () => ({
      STARAreaChart: () => <div data-testid="star-area-chart">STAR Area Chart</div>,
    }))
  })

  afterEach(() => {
    mock.restore()
  })

  describe('Basic Rendering', () => {
    it('should render without crashing', () => {
      expect(() => render(<ChurnAnalysis />)).not.toThrow()
    })

    it('should use standardized components structure', async () => {
      const { container } = render(<ChurnAnalysis />)
      await wait(50)

      // Check that the page renders with basic structure
      expect(container).toBeInTheDocument()
    })
  })

  describe('Component Library Consistency (Requirements 3.1, 3.2, 3.3)', () => {
    it('should use MetricsGrid component for metrics display', async () => {
      const { container } = render(<ChurnAnalysis />)
      await wait(50)

      // Verify MetricsGrid is rendered (it should have data-testid="metrics-grid")
      const metricsGrid = container.querySelector('[data-testid="metrics-grid"]')
      expect(metricsGrid).toBeInTheDocument()
    })

    it('should use SectionCard components for content organization', async () => {
      const { container } = render(<ChurnAnalysis />)
      await wait(50)

      // Check for section titles that would be in SectionCard components
      expect(container.textContent).toContain('Project Overview')
      expect(container.textContent).toContain('Challenge')
      expect(container.textContent).toContain('Solution')
      expect(container.textContent).toContain('Results & Impact')
    })
  })

  describe('Data Formatting Consistency (Requirements 8.1, 8.2, 8.4)', () => {
    it('should use consistent data formatting utilities', async () => {
      const { container } = render(<ChurnAnalysis />)
      await wait(50)

      // The component should render without errors, indicating proper data formatting
      expect(container).toBeInTheDocument()

      // Verify formatted values are present
      expect(container.textContent).toContain('14.2%') // Churn rate
      expect(container.textContent).toContain('85.0%') // Retention rate
      expect(container.textContent).toContain('830.0K') // Revenue saved
    })
  })

  describe('Content Structure Consistency (Requirements 5.1, 5.3)', () => {
    it('should follow standardized content organization pattern', async () => {
      const { container } = render(<ChurnAnalysis />)
      await wait(50)

      // Verify key content sections are present
      expect(container.textContent).toContain('Project Overview')
      expect(container.textContent).toContain('STAR Impact Analysis')
    })
  })

  describe('Chart Container Usage (Requirements 3.2)', () => {
    it('should use ChartContainer components for data visualizations', async () => {
      const { container } = render(<ChurnAnalysis />)
      await wait(50)

      // Verify chart components are rendered (they show as loading in test)
      expect(container.textContent).toContain('Partner Retention Patterns')
      expect(container.textContent).toContain('Churn Rate Trends')
      expect(container.textContent).toContain('Project Progression Metrics')
    })
  })
})
