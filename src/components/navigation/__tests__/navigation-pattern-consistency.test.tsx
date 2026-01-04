/**
 * Property-Based Tests for Navigation Pattern Consistency
 *
 * **Property 3: Navigation Pattern Consistency**
 * **Validates: Requirements 2.1, 2.2**
 *
 * Feature: project-ui-consistency, Property 3: Navigation Pattern Consistency
 */

import { describe, test, expect, afterEach } from 'bun:test'
import { render, cleanup } from '@testing-library/react'
import * as fc from 'fast-check'
import { BackButton, NavigationBreadcrumbs, NavigationTabs } from '../index'

// Note: Don't manually clear document.body.innerHTML - this breaks happy-dom's cache
// The cleanup() function from RTL handles DOM cleanup properly

afterEach(() => {
  cleanup()
})
// Types imported but not used in current tests

// Generators for property-based testing
// Generators for property-based testing
const commonWords = [
  'Home',
  'About',
  'Contact',
  'Projects',
  'Services',
  'Blog',
  'Portfolio',
  'Team',
  'Company',
  'Products',
  'Solutions',
  'Support',
  'Documentation',
  'Getting Started',
  'Overview',
  'Features',
  'Pricing',
  'Resources',
  'News',
  'Events',
  'Dashboard',
  'Settings',
  'Profile',
  'Account',
  'Analytics',
  'Reports',
  'Data',
  'Management',
  'Administration',
  'Configuration',
]

const meaningfulStringGenerator = (minLength: number, maxLength: number) =>
  fc
    .oneof(
      // Use common words
      fc.constantFrom(...commonWords),
      // Or combine words
      fc
        .tuple(
          fc.constantFrom(...commonWords.slice(0, 15)),
          fc.constantFrom(...commonWords.slice(15))
        )
        .map(([word1, word2]) => `${word1} ${word2}`),
      // Or single words with numbers
      fc
        .tuple(fc.constantFrom(...commonWords.slice(0, 10)), fc.nat({ max: 99 }))
        .map(([word, num]) => `${word} ${num}`)
    )
    .filter((s) => s.length >= minLength && s.length <= maxLength)

const breadcrumbItemGenerator = fc.record({
  label: meaningfulStringGenerator(2, 50),
  href: fc.webUrl(),
})

const navigationTabGenerator = fc.record({
  id: fc.constantFrom(
    'overview',
    'details',
    'metrics',
    'analytics',
    'settings',
    'configuration',
    'dashboard',
    'reports',
    'data',
    'management',
    'admin',
    'profile'
  ),
  label: meaningfulStringGenerator(2, 50),
  disabled: fc.boolean(),
  badge: fc.option(fc.oneof(fc.constantFrom('New', 'Updated', 'Beta'), fc.nat({ max: 99 })), {
    nil: undefined,
  }),
})

// Generator for unique tab arrays to prevent duplicate IDs
const uniqueTabsGenerator = (minLength: number, maxLength: number) =>
  fc.array(navigationTabGenerator, { minLength, maxLength }).map((tabs) => {
    // Ensure unique IDs by appending index if needed
    const seenIds = new Set<string>()
    return tabs.map((tab) => {
      let uniqueId: string = tab.id
      let counter = 0
      while (seenIds.has(uniqueId)) {
        uniqueId = `${tab.id}-${counter}`
        counter++
      }
      seenIds.add(uniqueId)
      return { ...tab, id: uniqueId as typeof tab.id }
    })
  })

const backButtonVariantGenerator = fc.constantFrom('ghost', 'outline', 'secondary')
const backButtonSizeGenerator = fc.constantFrom('sm', 'default', 'lg')

// Note: Property-based tests were previously skipped due to happy-dom test isolation issues.
// The fix was to ensure all tests properly restore window/document modifications in afterEach.
// See: src/lib/utils/__tests__/reading-progress-utils.test.ts for the pattern.
describe('Navigation Pattern Consistency', () => {
  describe('Property 3: Back Button Consistency', () => {
    test('back buttons have consistent styling and behavior across all variants', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          meaningfulStringGenerator(2, 100),
          backButtonVariantGenerator,
          backButtonSizeGenerator,
          fc.boolean(),
          (href, label, variant, size, showIcon) => {
            const { container } = render(
              <BackButton
                href={href}
                label={label}
                variant={variant}
                size={size}
                showIcon={showIcon}
              />
            )

            // Verify back button structure
            const backButton = container.querySelector('[data-testid="back-button"]')
            expect(backButton).toBeInTheDocument()

            // Verify consistent elements - the back button IS the link
            expect(backButton).toHaveAttribute('href', href)

            // Verify label is present - use container.textContent instead of screen.getByText
            expect(container.textContent).toContain(label)

            // Verify icon presence based on showIcon prop
            const icon = container.querySelector('svg')
            if (showIcon) {
              expect(icon).toBeInTheDocument()
            } else {
              expect(icon).not.toBeInTheDocument()
            }

            // Verify accessibility attributes
            expect(backButton).toHaveAttribute('aria-label', expect.stringContaining(label))

            // Verify consistent CSS classes for styling
            expect(backButton).toHaveClass('w-fit', 'transition-all', 'duration-150', 'ease-out')
          }
        ),
        { numRuns: 100 }
      )
    })

    test('back button hover and focus states are consistent', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          meaningfulStringGenerator(2, 100),
          backButtonVariantGenerator,
          (href, label, variant) => {
            const { container } = render(<BackButton href={href} label={label} variant={variant} />)

            const backButton = container.querySelector('[data-testid="back-button"]')
            expect(backButton).toBeInTheDocument()

            // Verify consistent hover animation classes
            expect(backButton).toHaveClass('hover:translate-x-[-2px]')
            expect(backButton).toHaveClass('focus-visible:translate-x-[-2px]')
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Property 3: Breadcrumb Navigation Consistency', () => {
    test('breadcrumb navigation has uniform appearance across all configurations', () => {
      fc.assert(
        fc.property(
          fc.array(breadcrumbItemGenerator, { minLength: 1, maxLength: 5 }),
          meaningfulStringGenerator(2, 50),
          fc.boolean(),
          meaningfulStringGenerator(2, 20),
          fc.webUrl(),
          (items, currentPage, showHome, homeLabel, homeHref) => {
            const maxItems = 5 // Default maxItems from NavigationBreadcrumbs component
            const { container } = render(
              <NavigationBreadcrumbs
                items={items}
                currentPage={currentPage}
                showHome={showHome}
                homeLabel={homeLabel}
                homeHref={homeHref}
              />
            )

            // Verify breadcrumb structure
            const breadcrumb = container.querySelector('[data-testid="breadcrumbs"]')
            expect(breadcrumb).toBeInTheDocument()

            // Verify consistent navigation structure
            expect(breadcrumb).toHaveAttribute('aria-label', 'breadcrumb')

            // Verify current page is displayed - use container.textContent
            expect(container.textContent).toContain(currentPage)

            // Verify breadcrumb list structure
            const breadcrumbList = breadcrumb?.querySelector('[data-slot="breadcrumb-list"]')
            expect(breadcrumbList).toBeInTheDocument()

            // Verify consistent styling classes
            expect(breadcrumbList).toHaveClass(
              'text-muted-foreground',
              'flex',
              'flex-wrap',
              'items-center'
            )

            // If showHome is true, verify home link is present
            if (showHome) {
              expect(container.textContent).toContain(homeLabel)
            }

            // Verify all provided items are rendered (accounting for truncation)
            if (items.length <= maxItems - (showHome ? 1 : 0)) {
              // All items should be visible
              items.forEach((item) => {
                expect(container.textContent).toContain(item.label)
              })
            } else {
              // Items are truncated, check that at least some are visible
              const visibleItems = items.slice(-(maxItems - (showHome ? 2 : 1))) // Last few items
              visibleItems.forEach((item) => {
                expect(container.textContent).toContain(item.label)
              })
              // Check for truncation indicator
              expect(container.textContent).toContain('...')
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    test('breadcrumb links have consistent hover behavior', () => {
      fc.assert(
        fc.property(
          fc.array(breadcrumbItemGenerator, { minLength: 1, maxLength: 3 }),
          meaningfulStringGenerator(2, 50),
          (items, currentPage) => {
            const { container } = render(
              <NavigationBreadcrumbs items={items} currentPage={currentPage} />
            )

            // Verify all breadcrumb links have consistent hover classes
            const breadcrumbLinks = container.querySelectorAll('[data-slot="breadcrumb-item"] a')
            breadcrumbLinks.forEach((link) => {
              expect(link).toHaveClass('hover:text-foreground', 'transition-colors')
            })
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Property 3: Tab Navigation Consistency', () => {
    test('tab navigation has consistent interaction patterns across all configurations', () => {
      fc.assert(
        fc.property(
          uniqueTabsGenerator(2, 6),
          fc.constantFrom('default', 'pills', 'underline'),
          fc.constantFrom('sm', 'default', 'lg'),
          fc.boolean(),
          (tabs, variant, size, fullWidth) => {
            const { container } = render(
              <NavigationTabs tabs={tabs} variant={variant} size={size} fullWidth={fullWidth} />
            )

            // Verify tab navigation structure
            const tabsContainer = container.querySelector('[data-testid="navigation-tabs"]')
            expect(tabsContainer).toBeInTheDocument()

            // Verify tabs list structure
            const tabsList = container.querySelector('[data-testid="tabs-list"]')
            expect(tabsList).toBeInTheDocument()

            // Verify all tabs are rendered
            tabs.forEach((tab) => {
              const tabTrigger = container.querySelector(`[data-testid="tab-trigger-${tab.id}"]`)
              expect(tabTrigger).toBeInTheDocument()
              expect(container.textContent).toContain(tab.label)

              // Verify disabled state if applicable
              if (tab.disabled) {
                expect(tabTrigger).toHaveAttribute('disabled')
              }

              // Verify badge if present
              if (tab.badge) {
                expect(container.textContent).toContain(tab.badge.toString())
              }

              // Verify accessibility attributes
              expect(tabTrigger).toHaveAttribute('aria-label', expect.stringContaining(tab.label))
            })

            // Verify consistent styling classes based on variant
            const tabTriggers = container.querySelectorAll('[data-slot="tabs-trigger"]')
            tabTriggers.forEach((trigger) => {
              expect(trigger).toHaveClass('transition-all', 'duration-150', 'ease-out')
              expect(trigger).toHaveClass('focus-visible:ring-[3px]')
              expect(trigger).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
            })
          }
        ),
        { numRuns: 100 }
      )
    })

    test('tab triggers have consistent focus and hover states', () => {
      fc.assert(
        fc.property(
          uniqueTabsGenerator(2, 4),
          fc.constantFrom('default', 'pills', 'underline'),
          (tabs, variant) => {
            const { container } = render(<NavigationTabs tabs={tabs} variant={variant} />)

            // Verify all tab triggers have consistent focus and hover classes
            const tabTriggers = container.querySelectorAll('[data-slot="tabs-trigger"]')
            tabTriggers.forEach((trigger) => {
              expect(trigger).toHaveClass('focus-visible:border-ring')
              expect(trigger).toHaveClass('focus-visible:ring-ring/50')
              expect(trigger).toHaveClass('hover:bg-background/50')
              expect(trigger).toHaveClass('hover:text-foreground')
            })
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Property 3: Cross-Component Navigation Consistency', () => {
    test('all navigation components use consistent design tokens and styling patterns', () => {
      fc.assert(
        fc.property(
          fc.webUrl(),
          meaningfulStringGenerator(2, 50),
          fc.array(breadcrumbItemGenerator, { minLength: 1, maxLength: 3 }),
          uniqueTabsGenerator(2, 4),
          (backHref, backLabel, breadcrumbItems, tabItems) => {
            const { container: backContainer } = render(
              <BackButton href={backHref} label={backLabel} />
            )

            const { container: breadcrumbContainer } = render(
              <NavigationBreadcrumbs items={breadcrumbItems} currentPage="Current" />
            )

            const { container: tabContainer } = render(<NavigationTabs tabs={tabItems} />)

            // Verify consistent transition classes across all components
            const backButton = backContainer.querySelector('[data-testid="back-button"]')
            const breadcrumbLinks = breadcrumbContainer.querySelectorAll(
              '[data-slot="breadcrumb-item"] a'
            )
            const tabTriggers = tabContainer.querySelectorAll('[data-slot="tabs-trigger"]')

            // Back button should have transition classes
            expect(backButton).toHaveClass('transition-all')

            // Breadcrumb links should have transition classes
            breadcrumbLinks.forEach((link) => {
              expect(link).toHaveClass('transition-colors')
            })

            // Tab triggers should have transition classes
            tabTriggers.forEach((trigger) => {
              expect(trigger).toHaveClass('transition-all')
            })

            // Verify consistent focus management patterns
            expect(backButton).toHaveAttribute('data-testid', 'back-button')
            expect(
              breadcrumbContainer.querySelector('[data-testid="breadcrumbs"]')
            ).toBeInTheDocument()
            expect(
              tabContainer.querySelector('[data-testid="navigation-tabs"]')
            ).toBeInTheDocument()
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
