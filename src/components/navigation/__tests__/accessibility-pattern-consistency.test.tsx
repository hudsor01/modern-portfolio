/**
 * Property-Based Tests for Accessibility Pattern Consistency
 *
 * **Property 9: Accessibility Pattern Consistency**
 * **Validates: Requirements 7.2, 7.3, 7.4**
 *
 * Feature: project-ui-consistency, Property 9: Accessibility Pattern Consistency
 */

import { render } from '@testing-library/react'
import * as fc from 'fast-check'
import { BackButton, NavigationBreadcrumbs, NavigationTabs } from '../index'
// Types imported but not used in current tests

// Generators for property-based testing with valid, HTML-safe data
const validStringGenerator = fc
  .string({ minLength: 1, maxLength: 50 })
  .filter((s) => s.trim().length > 0)
  .map((s) => s.replace(/[^a-zA-Z0-9\s\-_]/g, '')) // Only allow alphanumeric, spaces, dash, underscore
  .filter((s) => s.trim().length > 0)
  .map((s) => s.trim() || 'Default Label') // Fallback for empty strings

const validUrlGenerator = fc.webUrl()

const validIdGenerator = fc
  .string({ minLength: 1, maxLength: 20 })
  .map((s) => s.replace(/[^a-zA-Z0-9-_]/g, '')) // Only allow alphanumeric, dash, underscore
  .filter((s) => s.length > 0)
  .map((s) => s || 'default-id') // Fallback for empty strings
  .map((s) => `${s}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`) // Ensure uniqueness

const breadcrumbItemGenerator = fc.record({
  label: validStringGenerator,
  href: validUrlGenerator,
})

const navigationTabGenerator = fc.record({
  id: validIdGenerator,
  label: validStringGenerator,
  disabled: fc.boolean(),
  badge: fc.option(
    fc.oneof(
      validStringGenerator.filter((s) => s.length <= 10), // Shorter badge text
      fc.nat({ max: 999 }) // Reasonable badge numbers
    ),
    { nil: undefined }
  ),
})

const backButtonVariantGenerator = fc.constantFrom('ghost', 'outline', 'secondary')
const backButtonSizeGenerator = fc.constantFrom('sm', 'default', 'lg')

// Generator for unique navigation tabs (no duplicate IDs)
const uniqueNavigationTabsGenerator = (minLength: number, maxLength: number) =>
  fc.array(navigationTabGenerator, { minLength, maxLength }).map((tabs) => {
    // Ensure unique IDs by adding index suffix
    return tabs.map((tab, index) => ({
      ...tab,
      id: `${tab.id}-${index}`,
    }))
  })

describe('Accessibility Pattern Consistency', () => {
  describe('Property 9: Semantic HTML Structure Consistency', () => {
    test('back buttons maintain consistent semantic HTML structure', () => {
      fc.assert(
        fc.property(
          validUrlGenerator,
          validStringGenerator,
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

            // Verify semantic structure - the back button IS the link element
            const backButton = container.querySelector('[data-testid="back-button"]')
            expect(backButton).toBeInTheDocument()
            expect(backButton?.tagName).toBe('A')
            expect(backButton).toHaveAttribute('href', href)

            // Verify accessibility attributes
            expect(backButton).toHaveAttribute('aria-label', `Navigate back: ${label}`)
            expect(backButton).toHaveAttribute('role', 'button')

            // Verify icon has proper accessibility attributes if present
            if (showIcon) {
              const icon = container.querySelector('svg')
              expect(icon).toBeInTheDocument()
              expect(icon).toHaveAttribute('aria-hidden', 'true')
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    test('breadcrumb navigation maintains consistent semantic HTML structure', () => {
      fc.assert(
        fc.property(
          fc.array(breadcrumbItemGenerator, { minLength: 1, maxLength: 5 }),
          validStringGenerator,
          fc.boolean(),
          validStringGenerator,
          validUrlGenerator,
          (items, currentPage, showHome, homeLabel, homeHref) => {
            const { container } = render(
              <NavigationBreadcrumbs
                items={items}
                currentPage={currentPage}
                showHome={showHome}
                homeLabel={homeLabel}
                homeHref={homeHref}
              />
            )

            // Verify semantic structure
            const breadcrumb = container.querySelector('[data-testid="breadcrumbs"]')
            expect(breadcrumb).toBeInTheDocument()
            expect(breadcrumb).toHaveAttribute('aria-label', 'breadcrumb')

            // Verify list structure
            const breadcrumbList = breadcrumb?.querySelector('[role="list"]')
            expect(breadcrumbList).toBeInTheDocument()

            // Verify list items have proper roles
            const listItems = container.querySelectorAll('[role="listitem"]')
            expect(listItems.length).toBeGreaterThan(0)

            // Verify current page has proper aria-current
            const currentPageElement = container.querySelector('[aria-current="page"]')
            expect(currentPageElement).toBeInTheDocument()
            expect(currentPageElement?.textContent?.trim()).toBe(currentPage.trim())

            // Verify separators are hidden from screen readers
            const separators = container.querySelectorAll('[aria-hidden="true"]')
            expect(separators.length).toBeGreaterThan(0)
          }
        ),
        { numRuns: 100 }
      )
    })

    test('tab navigation maintains consistent semantic HTML structure', () => {
      fc.assert(
        fc.property(
          uniqueNavigationTabsGenerator(2, 6),
          fc.constantFrom('default', 'pills', 'underline'),
          fc.constantFrom('horizontal', 'vertical'),
          (tabs, variant, orientation) => {
            const { container } = render(
              <NavigationTabs tabs={tabs} variant={variant} orientation={orientation} />
            )

            // Verify semantic structure
            const tabsContainer = container.querySelector('[data-testid="navigation-tabs"]')
            expect(tabsContainer).toBeInTheDocument()

            // Verify tablist structure
            const tabsList = container.querySelector('[role="tablist"]')
            expect(tabsList).toBeInTheDocument()
            expect(tabsList).toHaveAttribute('aria-orientation', orientation)

            // Verify all tabs have proper roles and attributes
            const tabTriggers = container.querySelectorAll('[role="tab"]')
            expect(tabTriggers.length).toBe(tabs.length)

            tabTriggers.forEach((trigger, index) => {
              const tab = tabs[index]
              if (tab) {
                expect(trigger).toHaveAttribute('aria-selected')
                expect(trigger).toHaveAttribute('aria-controls', expect.stringContaining(tab.id))
                expect(trigger).toHaveAttribute('aria-label', expect.stringContaining(tab.label))
                expect(trigger).toHaveAttribute('tabindex')
              }
            })

            // Verify tab panels are properly associated
            tabs.forEach((tab) => {
              const tabTrigger = container.querySelector(`[data-testid="tab-trigger-${tab.id}"]`)
              if (tabTrigger) {
                expect(tabTrigger).toHaveAttribute('aria-label', expect.stringContaining(tab.label))
              }
            })
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Property 9: ARIA Labels and Attributes Consistency', () => {
    test('all navigation components have consistent ARIA label patterns', () => {
      fc.assert(
        fc.property(
          validUrlGenerator,
          validStringGenerator,
          fc.array(breadcrumbItemGenerator, { minLength: 1, maxLength: 3 }),
          uniqueNavigationTabsGenerator(2, 4),
          (backHref, backLabel, breadcrumbItems, tabItems) => {
            // Test BackButton ARIA labels
            const { container: backContainer } = render(
              <BackButton href={backHref} label={backLabel} />
            )

            const backButton = backContainer.querySelector('[data-testid="back-button"]')
            expect(backButton).toHaveAttribute('aria-label', `Navigate back: ${backLabel}`)

            // Test NavigationBreadcrumbs ARIA labels
            const { container: breadcrumbContainer } = render(
              <NavigationBreadcrumbs items={breadcrumbItems} currentPage="Current" />
            )

            const breadcrumbLinks = breadcrumbContainer.querySelectorAll('a')
            breadcrumbLinks.forEach((link, index) => {
              // Account for Home link if showHome is true (default)
              const expectedLabel = index === 0 ? 'Home' : breadcrumbItems[index - 1]?.label
              if (expectedLabel) {
                expect(link).toHaveAttribute('aria-label', `Navigate to ${expectedLabel}`)
              }
            })

            // Test NavigationTabs ARIA labels
            const { container: tabContainer } = render(<NavigationTabs tabs={tabItems} />)

            const tabTriggers = tabContainer.querySelectorAll('[role="tab"]')
            tabTriggers.forEach((trigger, index) => {
              const tab = tabItems[index]
              if (tab) {
                const expectedLabel = `Switch to ${tab.label} tab${tab.badge ? ` (${tab.badge} items)` : ''}`
                expect(trigger).toHaveAttribute('aria-label', expectedLabel)
              }
            })
          }
        ),
        { numRuns: 100 }
      )
    })

    test('interactive elements have consistent focus indicators', () => {
      fc.assert(
        fc.property(
          validUrlGenerator,
          validStringGenerator,
          uniqueNavigationTabsGenerator(2, 4),
          (href, label, tabs) => {
            // Test BackButton focus indicators
            const { container: backContainer } = render(<BackButton href={href} label={label} />)

            const backButton = backContainer.querySelector('[data-testid="back-button"]')
            expect(backButton).toHaveClass('focus-visible:ring-[3px]')

            // Test NavigationTabs focus indicators
            const { container: tabContainer } = render(<NavigationTabs tabs={tabs} />)

            const tabTriggers = tabContainer.querySelectorAll('[role="tab"]')
            tabTriggers.forEach((trigger) => {
              expect(trigger).toHaveClass('focus-visible:ring-[3px]')
              expect(trigger).toHaveClass('focus-visible:outline-1')
            })
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Property 9: Keyboard Navigation Pattern Consistency', () => {
    test('all navigation components support consistent keyboard interaction patterns', () => {
      fc.assert(
        fc.property(
          validUrlGenerator,
          validStringGenerator,
          fc.array(breadcrumbItemGenerator, { minLength: 1, maxLength: 3 }),
          uniqueNavigationTabsGenerator(2, 4),
          (backHref, backLabel, breadcrumbItems, tabItems) => {
            // Test BackButton keyboard support
            const { container: backContainer } = render(
              <BackButton href={backHref} label={backLabel} />
            )

            const backButton = backContainer.querySelector('[data-testid="back-button"]')
            expect(backButton).toBeInTheDocument()
            // Links are naturally keyboard accessible

            // Test NavigationBreadcrumbs keyboard support
            const { container: breadcrumbContainer } = render(
              <NavigationBreadcrumbs items={breadcrumbItems} currentPage="Current" />
            )

            const breadcrumbLinks = breadcrumbContainer.querySelectorAll('a')
            breadcrumbLinks.forEach((link) => {
              expect(link).toBeInTheDocument()
              expect(link).toHaveClass('focus-visible:ring-[3px]')
            })

            // Test NavigationTabs keyboard support
            const { container: tabContainer } = render(<NavigationTabs tabs={tabItems} />)

            const tabTriggers = tabContainer.querySelectorAll('[role="tab"]')
            tabTriggers.forEach((trigger) => {
              expect(trigger).toHaveAttribute('tabindex')
              expect(trigger).toHaveClass('focus-visible:ring-[3px]')
            })

            // Verify only one tab is in tab order (roving tabindex pattern)
            const tabbableTabs = Array.from(tabTriggers).filter(
              (trigger) => trigger.getAttribute('tabindex') === '0'
            )
            expect(tabbableTabs.length).toBe(1)
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Property 9: Screen Reader Support Consistency', () => {
    test('all navigation components provide consistent screen reader support', () => {
      fc.assert(
        fc.property(
          validUrlGenerator,
          validStringGenerator,
          fc.array(breadcrumbItemGenerator, { minLength: 1, maxLength: 3 }),
          uniqueNavigationTabsGenerator(2, 4),
          (backHref, backLabel, breadcrumbItems, tabItems) => {
            // Test BackButton screen reader support
            const { container: backContainer } = render(
              <BackButton href={backHref} label={backLabel} />
            )

            const backButton = backContainer.querySelector('[data-testid="back-button"]')
            expect(backButton).toHaveAttribute('aria-label')
            expect(backButton).toHaveAttribute('role', 'button')

            // Test NavigationBreadcrumbs screen reader support
            const { container: breadcrumbContainer } = render(
              <NavigationBreadcrumbs items={breadcrumbItems} currentPage="Current" />
            )

            const breadcrumb = breadcrumbContainer.querySelector('[data-testid="breadcrumbs"]')
            expect(breadcrumb).toHaveAttribute('aria-label', 'breadcrumb')

            const currentPageElement = breadcrumbContainer.querySelector('[aria-current="page"]')
            expect(currentPageElement).toBeInTheDocument()

            // Test NavigationTabs screen reader support
            const { container: tabContainer } = render(<NavigationTabs tabs={tabItems} />)

            const tabsList = tabContainer.querySelector('[role="tablist"]')
            expect(tabsList).toBeInTheDocument()

            const tabTriggers = tabContainer.querySelectorAll('[role="tab"]')
            tabTriggers.forEach((trigger, index) => {
              const tab = tabItems[index]
              if (tab) {
                expect(trigger).toHaveAttribute('aria-selected')
                expect(trigger).toHaveAttribute('aria-controls', `tab-content-${tab.id}`)
                const expectedLabel = `Switch to ${tab.label} tab${tab.badge ? ` (${tab.badge} items)` : ''}`
                expect(trigger).toHaveAttribute('aria-label', expectedLabel)
              }
            })
          }
        ),
        { numRuns: 100 }
      )
    })

    test('decorative elements are properly hidden from screen readers', () => {
      fc.assert(
        fc.property(
          validUrlGenerator,
          validStringGenerator,
          fc.array(breadcrumbItemGenerator, { minLength: 1, maxLength: 3 }),
          uniqueNavigationTabsGenerator(1, 3).filter((tabs) =>
            tabs.some((tab) => tab.badge !== undefined)
          ),
          (backHref, backLabel, breadcrumbItems, tabsWithBadges) => {
            // Test BackButton icon is hidden from screen readers
            const { container: backContainer } = render(
              <BackButton href={backHref} label={backLabel} showIcon={true} />
            )

            const icon = backContainer.querySelector('svg')
            if (icon) {
              expect(icon).toHaveAttribute('aria-hidden', 'true')
            }

            // Test NavigationBreadcrumbs separators are hidden from screen readers
            const { container: breadcrumbContainer } = render(
              <NavigationBreadcrumbs items={breadcrumbItems} currentPage="Current" />
            )

            const separators = breadcrumbContainer.querySelectorAll('[aria-hidden="true"]')
            expect(separators.length).toBeGreaterThan(0)

            // Test NavigationTabs badges are properly handled
            if (tabsWithBadges.length > 0) {
              const { container: tabContainer } = render(<NavigationTabs tabs={tabsWithBadges} />)

              // Badges should be visually present but their content included in aria-label
              tabsWithBadges.forEach((tab) => {
                if (tab.badge) {
                  const tabTrigger = tabContainer.querySelector(
                    `[data-testid="tab-trigger-${tab.id}"]`
                  )
                  if (tabTrigger) {
                    const expectedLabel = `Switch to ${tab.label} tab (${tab.badge} items)`
                    expect(tabTrigger).toHaveAttribute('aria-label', expectedLabel)
                  }
                }
              })
            }
          }
        ),
        { numRuns: 50 } // Reduced runs since we're filtering for tabs with badges
      )
    })
  })
})
