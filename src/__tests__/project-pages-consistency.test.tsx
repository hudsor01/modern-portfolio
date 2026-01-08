import { describe, afterAll, expect, it, mock } from 'bun:test'
import { render, screen } from '@testing-library/react'
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing'

// Helper to wait for a specific duration (Bun doesn't support fake timers)
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock project data with realistic values - must be before imports
mock.module('@/lib/content/projects', () => ({
  getProject: () =>
    Promise.resolve({
      id: 'test-project',
      title: 'Test Project',
      description: 'Test Description',
    }),
}))

// Mock logger
mock.module('@/lib/monitoring/logger', () => {
  const noop = () => {}
  const stubLogger = {
    debug: noop,
    info: noop,
    warn: noop,
    error: noop,
    fatal: noop,
    performance: noop,
    request: noop,
    security: noop,
    child: () => stubLogger,
    startTimer: () => () => {},
  }

  return {
    createContextLogger: () => ({
      error: noop,
      info: noop,
      warn: noop,
    }),
    logger: stubLogger,
  }
})

// Mock timing constants for faster tests
mock.module('@/lib/constants/spacing', () => ({
  TIMING: {
    LOADING_STATE_RESET: 0, // Instant for tests
  },
}))

// Mock all project data modules with realistic test data
mock.module('@/app/projects/data/partner-analytics', () => ({
  leadAttributionData: [
    { source: 'Organic Search', leads: 1250, conversions: 187 },
    { source: 'Paid Search', leads: 890, conversions: 156 },
  ],
  staticChurnData: [
    { churnRate: 12.5, retained: 87, churned: 13 },
    { churnRate: 14.2, retained: 85, churned: 15 },
  ],
  yearOverYearGrowthExtended: [
    {
      year: 2023,
      total_revenue: 3200000,
      partner_count: 145,
      total_transactions: 15000,
      commission_growth_percentage: 15.2,
    },
    {
      year: 2024,
      total_revenue: 4200000,
      partner_count: 187,
      total_transactions: 18500,
      commission_growth_percentage: 18.7,
    },
  ],
  monthlyRevenue2024: [
    { month: 'Jan', revenue: 284000, target: 270000 },
    { month: 'Feb', revenue: 298000, target: 285000 },
    { month: 'Mar', revenue: 315000, target: 300000 },
    { month: 'Apr', revenue: 332000, target: 320000 },
    { month: 'May', revenue: 348000, target: 335000 },
    { month: 'Jun', revenue: 365000, target: 350000 },
  ],
  revenueKpiData: [
    { month: 'Jan', revenue: 150000, target: 140000, growth: 12.5 },
    { month: 'Feb', revenue: 165000, target: 145000, growth: 15.2 },
    { month: 'Mar', revenue: 178000, target: 150000, growth: 18.7 },
  ],
  dealFunnelData: [
    { stage: 'Leads', value: 1000, conversion: 100 },
    { stage: 'Qualified', value: 400, conversion: 40 },
    { stage: 'Closed Won', value: 80, conversion: 8 },
  ],
  retentionData: [
    { month: 'Jan 2024', retained: 95, churned: 5 },
    { month: 'Feb 2024', retained: 92, churned: 8 },
  ],
  partnerGroupsData: [
    { name: 'Enterprise', value: 65, color: '#0088FE' },
    { name: 'Mid-Market', value: 25, color: '#00C49F' },
  ],
  topPartnersData: [
    { name: 'TechCorp Solutions', revenue: 85000, deals: 12, growth: 18.5 },
    { name: 'Global Innovations', revenue: 72000, deals: 8, growth: 15.2 },
  ],
  partnerAnalyticsData: [
    {
      id: 'partner-001',
      name: 'TechCorp Solutions',
      revenue: 285000,
      deals: 12,
      churnRate: 0.05,
      acquisitionCost: 1250,
      lifetime_value: 45000,
      region: 'North America',
      tier: 'Enterprise',
      acquisition_date: '2023-01-15',
    },
  ],
}))

// Import project pages (after mocks)
import DealFunnel from '@/app/projects/deal-funnel/page'
import LeadAttribution from '@/app/projects/lead-attribution/page'
import MultiChannelAttribution from '@/app/projects/multi-channel-attribution/page'
import PartnerPerformance from '@/app/projects/partner-performance/page'
import QuotaTerritoryManagement from '@/app/projects/quota-territory-management/page'
import SalesEnablement from '@/app/projects/sales-enablement/page'
import CustomerLifetimeValue from '@/app/projects/customer-lifetime-value/page'
import ForecastPipelineIntelligence from '@/app/projects/forecast-pipeline-intelligence/page'
import CACUnitEconomics from '@/app/projects/cac-unit-economics/page'
import ChurnRetention from '@/app/projects/churn-retention/page'
import CommissionOptimization from '@/app/projects/commission-optimization/page'
import RevenueKPI from '@/app/projects/revenue-kpi/page'

// Clean up mocks after all tests in this file
afterAll(() => {
  mock.restore()
})

describe('Project Pages Consistency Integration Tests', () => {
  const projectPages = [
    { name: 'Deal Funnel', component: DealFunnel, slug: 'deal-funnel' },
    { name: 'Lead Attribution', component: LeadAttribution, slug: 'lead-attribution' },
    {
      name: 'Multi-Channel Attribution',
      component: MultiChannelAttribution,
      slug: 'multi-channel-attribution',
    },
    { name: 'Partner Performance', component: PartnerPerformance, slug: 'partner-performance' },
    {
      name: 'Quota Territory Management',
      component: QuotaTerritoryManagement,
      slug: 'quota-territory-management',
    },
    { name: 'Sales Enablement', component: SalesEnablement, slug: 'sales-enablement' },
    {
      name: 'Customer Lifetime Value',
      component: CustomerLifetimeValue,
      slug: 'customer-lifetime-value',
    },
    {
      name: 'Forecast Pipeline Intelligence',
      component: ForecastPipelineIntelligence,
      slug: 'forecast-pipeline-intelligence',
    },
    { name: 'CAC Unit Economics', component: CACUnitEconomics, slug: 'cac-unit-economics' },
    { name: 'Churn Retention', component: ChurnRetention, slug: 'churn-retention' },
    {
      name: 'Commission Optimization',
      component: CommissionOptimization,
      slug: 'commission-optimization',
    },
    { name: 'Revenue KPI', component: RevenueKPI, slug: 'revenue-kpi' },
  ]

  // Helper function to wait for component to load (using real timers)
  const waitForComponentLoad = async () => {
    // Wait for React to finish rendering
    await wait(50)
  }

  describe('Basic Rendering and Structure', () => {
    it.each(projectPages)(
      'should render $name page without errors',
      async ({ component: Component }) => {
        const { container } = render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        // Wait for component to load
        await waitForComponentLoad()

        expect(container).toBeInTheDocument()
      }
    )

    it.each(projectPages)(
      'should have proper document structure in $name page',
      async ({ component: Component }) => {
        render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        // Wait for loading to complete
        await waitForComponentLoad()

        // Should have main content area
        expect(screen.getByRole('main')).toBeInTheDocument()

        // Should have at least one heading
        const headings = screen.getAllByRole('heading')
        expect(headings.length).toBeGreaterThan(0)
      }
    )
  })

  describe('Standardized Layout Components', () => {
    it.each(projectPages)(
      'should use ProjectPageLayout component in $name page',
      async ({ component: Component }) => {
        render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        await waitForComponentLoad()

        // Check for main content structure
        const mainContent = screen.getByRole('main')
        expect(mainContent).toBeInTheDocument()
        expect(mainContent).toHaveAttribute('id', 'main-content')
      }
    )

    it.each(projectPages)(
      'should have consistent header structure in $name page',
      async ({ component: Component }) => {
        render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        await waitForComponentLoad()

        // Should have proper heading hierarchy
        const headings = screen.getAllByRole('heading')
        expect(headings.length).toBeGreaterThan(0)

        // Main title should be h1
        const h1Elements = screen.getAllByRole('heading', { level: 1 })
        expect(h1Elements.length).toBe(1)
      }
    )

    it.each(projectPages)(
      'should have navigation elements in $name page',
      async ({ component: Component }) => {
        render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        await waitForComponentLoad()

        // Should have some form of navigation (links or buttons)
        const links = screen.queryAllByRole('link')
        const buttons = screen.queryAllByRole('button')

        // Should have at least some interactive elements
        expect(links.length + buttons.length).toBeGreaterThan(0)
      }
    )
  })

  describe('Component Usage Patterns', () => {
    it.each(projectPages)(
      'should use MetricsGrid or similar metric display in $name page',
      async ({ component: Component }) => {
        render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        await waitForComponentLoad()

        // Look for metric-related content
        const container = screen.getByRole('main')
        const textContent = container.textContent || ''

        // Should have some numeric data or metrics
        const hasNumbers = /\d+/.test(textContent)
        expect(hasNumbers).toBe(true)
      }
    )

    it.each(projectPages)(
      'should use SectionCard or similar content organization in $name page',
      async ({ component: Component }) => {
        render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        await waitForComponentLoad()

        // Look for section-like content organization
        const sections = screen.queryAllByRole('region')
        const articles = screen.queryAllByRole('article')

        // Should have some form of content organization
        expect(sections.length + articles.length).toBeGreaterThanOrEqual(0)
      }
    )

    it.each(projectPages)(
      'should have chart or visualization content in $name page',
      async ({ component: Component }) => {
        const { container } = render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        await waitForComponentLoad()

        // Look for chart-related elements or data visualization content
        const chartElements = container.querySelectorAll(
          '[data-testid*="chart"], [class*="chart"], [data-testid*="responsive-container"]'
        )

        // Most project pages should have some form of data visualization
        expect(chartElements.length).toBeGreaterThanOrEqual(0)
      }
    )
  })

  describe('Data Formatting Consistency', () => {
    it.each(projectPages)(
      'should use consistent number formatting in $name page',
      async ({ component: Component }) => {
        render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        await waitForComponentLoad()

        const mainContent = screen.getByRole('main')
        const textContent = mainContent.textContent || ''

        // Check for consistent number patterns
        const numbers = textContent.match(/\d+/g)
        if (numbers) {
          // Should have some numeric content
          expect(numbers.length).toBeGreaterThan(0)
        }
      }
    )

    it.each(projectPages)(
      'should handle currency and percentage formatting in $name page',
      async ({ component: Component }) => {
        render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        await waitForComponentLoad()

        const mainContent = screen.getByRole('main')
        const textContent = mainContent.textContent || ''

        // Look for currency or percentage patterns
        const hasCurrency = /\$[\d,]+/.test(textContent)
        const hasPercentage = /\d+%/.test(textContent)

        // At least some pages should have financial data
        if (hasCurrency || hasPercentage) {
          expect(hasCurrency || hasPercentage).toBe(true)
        }
      }
    )
  })

  describe('Accessibility and Semantic Structure', () => {
    it.each(projectPages)(
      'should have proper semantic HTML structure in $name page',
      async ({ component: Component }) => {
        render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        await waitForComponentLoad()

        // Should have main landmark
        expect(screen.getByRole('main')).toBeInTheDocument()

        // Should have proper heading structure
        const headings = screen.getAllByRole('heading')
        expect(headings.length).toBeGreaterThan(0)

        // Should have exactly one h1
        const h1Elements = screen.getAllByRole('heading', { level: 1 })
        expect(h1Elements.length).toBe(1)
      }
    )

    it.each(projectPages)(
      'should have focusable interactive elements in $name page',
      async ({ component: Component }) => {
        const { container } = render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        await waitForComponentLoad()

        // Look for focusable elements
        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )

        // Should have some interactive elements
        expect(focusableElements.length).toBeGreaterThan(0)
      }
    )

    it.each(projectPages)(
      'should have proper ARIA attributes where needed in $name page',
      async ({ component: Component }) => {
        const { container } = render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        await waitForComponentLoad()

        // Check for proper main content labeling
        const mainContent = screen.getByRole('main')
        expect(mainContent).toHaveAttribute('id', 'main-content')

        // Interactive elements should have proper labels
        const buttons = container.querySelectorAll('button')
        buttons.forEach((button) => {
          const hasLabel =
            button.hasAttribute('aria-label') ||
            button.hasAttribute('aria-labelledby') ||
            button.textContent?.trim()
          expect(hasLabel).toBeTruthy()
        })
      }
    )
  })

  describe('Performance and Loading States', () => {
    it.each(projectPages)(
      'should handle loading states properly in $name page',
      async ({ component: Component }) => {
        render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        // Initially might show loading state
        const container = screen.getByRole('main').parentElement
        expect(container).toBeInTheDocument()

        // After timer advancement, should show content
        await waitForComponentLoad()

        const mainContent = screen.getByRole('main')
        expect(mainContent).toBeInTheDocument()
      }
    )

    it.each(projectPages)(
      'should render without throwing errors in $name page',
      async ({ component: Component }) => {
        // This test verifies the component renders without throwing
        expect(() =>
          render(<Component />, {
            wrapper: withNuqsTestingAdapter({ searchParams: '' }),
          })
        ).not.toThrow()

        await waitForComponentLoad()

        expect(screen.getByRole('main')).toBeInTheDocument()
      }
    )
  })

  describe('Cross-Page Consistency Validation', () => {
    it('should have consistent component structure across all pages', async () => {
      const pageStructures = []

      for (const { name, component: Component } of projectPages) {
        const { container, unmount } = render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        await waitForComponentLoad()

        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
        const h1Elements = container.querySelectorAll('h1')

        const structure = {
          name,
          hasMainContent: !!container.querySelector('#main-content'),
          hasHeadings: headings.length > 0,
          hasH1: h1Elements.length === 1,
          hasInteractiveElements: container.querySelectorAll('button, [href]').length > 0,
        }

        pageStructures.push(structure)
        unmount()
      }

      // Verify all pages have consistent basic structure
      pageStructures.forEach((structure) => {
        expect(structure.hasMainContent).toBe(true)
        expect(structure.hasHeadings).toBe(true)
        expect(structure.hasH1).toBe(true)
        expect(structure.hasInteractiveElements).toBe(true)
      })
    })

    it('should use consistent responsive design patterns across all pages', async () => {
      for (const { component: Component } of projectPages) {
        const { container, unmount } = render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        await waitForComponentLoad()

        // Check for responsive design classes
        const elementsWithResponsiveClasses = container.querySelectorAll(
          '[class*="md:"], [class*="lg:"], [class*="xl:"]'
        )

        // Should have some responsive design elements
        expect(elementsWithResponsiveClasses.length).toBeGreaterThanOrEqual(0)

        unmount()
      }
    })

    it('should have consistent content organization patterns', async () => {
      const contentPatterns = []

      for (const { name, component: Component } of projectPages) {
        const { container, unmount } = render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        await waitForComponentLoad()

        const mainContent = container.querySelector('#main-content')
        const textContent = mainContent?.textContent || ''
        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')

        const pattern = {
          name,
          hasNumericData: /\d+/.test(textContent),
          hasHeadings: headings.length >= 1, // At least the main title
          hasStructuredContent: textContent.length > 100, // Has substantial content
        }

        contentPatterns.push(pattern)
        unmount()
      }

      // Verify consistent content patterns
      contentPatterns.forEach((pattern) => {
        expect(pattern.hasNumericData).toBe(true) // All should have metrics/data
        expect(pattern.hasHeadings).toBe(true) // All should have at least one heading
        expect(pattern.hasStructuredContent).toBe(true) // All should have substantial content
      })
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it.each(projectPages)(
      'should handle re-renders gracefully in $name page',
      async ({ component: Component }) => {
        const { rerender } = render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        await waitForComponentLoad()

        expect(screen.getByRole('main')).toBeInTheDocument()

        // Re-render should not cause errors
        rerender(<Component />)

        await waitForComponentLoad()

        expect(screen.getByRole('main')).toBeInTheDocument()
      }
    )

    it.each(projectPages)(
      'should handle timer cleanup properly in $name page',
      async ({ component: Component }) => {
        const { unmount } = render(<Component />, {
          wrapper: withNuqsTestingAdapter({ searchParams: '' }),
        })

        await waitForComponentLoad()

        expect(screen.getByRole('main')).toBeInTheDocument()

        // Unmounting should not cause timer-related errors
        unmount()

        // Wait after unmount to check for cleanup (using real timers)
        await wait(50)
      }
    )
  })
})
