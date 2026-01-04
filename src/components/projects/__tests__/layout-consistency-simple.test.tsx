/**
 * Property-Based Tests for Layout Consistency
 *
 * Property 1: Layout Consistency
 * For any project page, the header structure should contain the same elements
 * in the same order: back navigation, title, description, and tags
 *
 * Validates: Requirements 1.1, 1.2
 */

import { describe, afterAll, test, expect, afterEach, vi, mock } from 'bun:test'
import { render } from '@testing-library/react'
import * as fc from 'fast-check'
import type { MockNextLinkProps } from '@/types/test-utils'

// Mock Next.js Link component - must be before imports
mock.module('next/link', () => ({
  default: ({ children, href, ...props }: MockNextLinkProps) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Import after mocks
import { ProjectPageLayout } from '../project-page-layout'

// Clear mocks after each test
afterEach(() => {
  vi.clearAllMocks()
})

// Clean up mocks after all tests
afterAll(() => {
  mock.restore()
})

describe('Layout Consistency - Property 1', () => {
  /**
   * Feature: project-ui-consistency, Property 1: Layout Consistency
   * Validates: Requirements 1.1, 1.2
   */

  test('header structure consistency across project pages', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9\s]{0,19}$/),
        fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9\s]{0,49}$/),
        (title, description) => {
          const props = {
            title,
            description,
            tags: [],
            children: <div data-testid="test-content">Test Content</div>,
          }

          const { container, unmount } = render(<ProjectPageLayout {...props} />)

          // Verify header exists
          const header = container.querySelector('[data-testid="project-header"]')
          expect(header).toBeInTheDocument()

          // Verify back button exists
          const backButton = container.querySelector('[data-testid="back-button"]')
          expect(backButton).toBeInTheDocument()

          // Verify title exists and has correct content
          const titleElement = container.querySelector('[data-testid="project-title"]')
          expect(titleElement).toBeInTheDocument()
          // Normalize whitespace for comparison since HTML collapses whitespace
          const normalizedTitle = title.replace(/\s+/g, ' ').trim()
          expect(titleElement).toHaveTextContent(normalizedTitle)

          // Verify description exists and has correct content
          const descriptionElement = container.querySelector('[data-testid="project-description"]')
          expect(descriptionElement).toBeInTheDocument()
          // Normalize whitespace for comparison since HTML collapses whitespace
          const normalizedDescription = description.replace(/\s+/g, ' ').trim()
          expect(descriptionElement).toHaveTextContent(normalizedDescription)

          // Verify tags container exists
          const tags = container.querySelector('[data-testid="project-tags"]')
          expect(tags).toBeInTheDocument()

          // Verify main content exists
          const mainContent = container.querySelector('#main-content')
          expect(mainContent).toBeInTheDocument()
          expect(mainContent).toHaveAttribute('role', 'main')

          // Clean up for property-based testing
          unmount()
        }
      ),
      { numRuns: 25 }
    )
  })
})
