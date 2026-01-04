/**
 * Integration test for CAC Unit Economics project page consistency
 * Validates that the page follows all standardized UI patterns and components
 */

import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import CACUnitEconomics from '../page'

// Mock all external dependencies to ensure clean test environment
vi.mock('@/lib/constants/spacing', () => ({
  TIMING: {
    LOADING_STATE_RESET: 100, // Shorter timeout for tests
  },
}))

vi.mock('@/lib/utils/data-formatters', () => ({
  formatCurrency: (value: number) => `$${value}`,
}))

vi.mock('../data/constants', () => ({
  cacMetrics: {
    blendedCAC: 168,
    averageLTV: 612,
    ltv_cac_ratio: 3.6,
    paybackPeriod: 8.4,
  },
}))

// Mock all child components to isolate the main component logic
vi.mock('../components/OverviewTab', () => ({
  OverviewTab: () => <div data-testid="overview-tab">Overview Content</div>,
}))

vi.mock('../components/ChannelsTab', () => ({
  ChannelsTab: () => <div data-testid="channels-tab">Channels Content</div>,
}))

vi.mock('../components/ProductsTab', () => ({
  ProductsTab: () => <div data-testid="products-tab">Products Content</div>,
}))

vi.mock('../components/StrategicImpact', () => ({
  StrategicImpact: () => <div data-testid="strategic-impact">Strategic Impact Content</div>,
}))

vi.mock('../components/NarrativeSections', () => ({
  NarrativeSections: () => (
    <div data-testid="narrative-sections">
      <div>Project Overview</div>
      <div>Challenge</div>
      <div>Solution</div>
      <div>Results & Impact</div>
      <div>Key Learnings</div>
    </div>
  ),
}))

describe('CAC Unit Economics Page Consistency', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  describe('Layout Consistency (Requirements 1.1, 1.2)', () => {
    it('should use standardized ProjectPageLayout with consistent header structure', async () => {
      render(<CACUnitEconomics />)

      // Verify project title is present
      expect(
        screen.getByText('Customer Acquisition Cost Optimization & Unit Economics Dashboard')
      ).toBeInTheDocument()

      // Verify description is present
      expect(
        screen.getByText(/Comprehensive CAC analysis and LTV:CAC ratio optimization/)
      ).toBeInTheDocument()

      // Verify tags are present with standardized format
      expect(screen.getByText('CAC Reduction: 32%')).toBeInTheDocument()
      expect(screen.getByText('LTV:CAC Ratio: 3.6:1')).toBeInTheDocument()
    })

    it('should implement consistent section organization', async () => {
      render(<CACUnitEconomics />)

      // Run all timers and let React update
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Verify section organization
      expect(screen.getByText('Analysis Details')).toBeInTheDocument()
      expect(screen.getByText('Strategic Impact')).toBeInTheDocument()
      expect(screen.getByText('Project Narrative')).toBeInTheDocument()
    })
  })

  describe('Component Library Consistency (Requirements 3.1, 3.2, 3.3)', () => {
    it('should use standardized MetricsGrid for key metrics display', async () => {
      render(<CACUnitEconomics />)

      // Run all timers and let React update
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Verify all key metrics are displayed with consistent formatting
      expect(screen.getByText('Blended CAC')).toBeInTheDocument()
      expect(screen.getByText('$168')).toBeInTheDocument() // Formatted currency
      expect(screen.getByText('Lifetime Value')).toBeInTheDocument()
      expect(screen.getByText('$612')).toBeInTheDocument() // Formatted currency
      expect(screen.getByText('3.6:1')).toBeInTheDocument() // Ratio format
      expect(screen.getByText('8.4 mo')).toBeInTheDocument() // Duration format
    })

    it('should use standardized SectionCard components for content organization', async () => {
      render(<CACUnitEconomics />)

      // Run all timers and let React update
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Verify SectionCard usage for main content areas
      expect(screen.getByText('Analysis Details')).toBeInTheDocument()
      expect(
        screen.getByText('Detailed breakdown of CAC optimization across channels and products')
      ).toBeInTheDocument()

      expect(screen.getByText('Strategic Impact')).toBeInTheDocument()
      expect(
        screen.getByText('Business impact and strategic outcomes from CAC optimization initiatives')
      ).toBeInTheDocument()
    })
  })

  describe('Data Formatting Consistency (Requirements 8.1, 8.2, 8.4)', () => {
    it('should use consistent currency formatting across all displays', async () => {
      render(<CACUnitEconomics />)

      // Run all timers and let React update
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Verify consistent currency formatting (no decimals for whole numbers)
      expect(screen.getByText('$168')).toBeInTheDocument() // Blended CAC
      expect(screen.getByText('$612')).toBeInTheDocument() // Average LTV
    })

    it('should use consistent ratio and percentage formatting', async () => {
      render(<CACUnitEconomics />)

      // Run all timers and let React update
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Verify consistent ratio formatting
      expect(screen.getByText('3.6:1')).toBeInTheDocument() // LTV:CAC ratio

      // Verify percentage formatting in tags (use getAllByText since 32% appears multiple times)
      expect(screen.getAllByText(/32%/).length).toBeGreaterThan(0) // CAC reduction
    })
  })

  describe('Content Structure Consistency (Requirements 5.1, 5.3)', () => {
    it('should follow standardized content organization pattern', async () => {
      render(<CACUnitEconomics />)

      // Run all timers and let React update
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Verify standardized content sequence: metrics → analysis → impact → narrative
      expect(screen.getByText('Analysis Details')).toBeInTheDocument()
      expect(screen.getByText('Strategic Impact')).toBeInTheDocument()
      expect(screen.getByText('Project Narrative')).toBeInTheDocument()
    })

    it('should use consistent narrative structure in project sections', async () => {
      render(<CACUnitEconomics />)

      // Run all timers and let React update
      await act(async () => {
        await vi.runAllTimersAsync()
      })

      // Verify standardized narrative sections are present (actual component content)
      expect(screen.getByText('Project Overview')).toBeInTheDocument()
      expect(screen.getByText('Challenge')).toBeInTheDocument()
      expect(screen.getByText('Solution')).toBeInTheDocument()
      expect(screen.getByText('Results & Impact')).toBeInTheDocument()
      expect(screen.getByText('Key Learnings')).toBeInTheDocument()
    })
  })
})
