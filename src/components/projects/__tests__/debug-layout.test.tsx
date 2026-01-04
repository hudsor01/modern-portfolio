import { describe, afterAll, test, expect, mock } from 'bun:test'
import { render } from '@testing-library/react'
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

// Clean up mocks after all tests
afterAll(() => {
  mock.restore()
})

describe('Debug Layout Rendering', () => {
  test('should render basic layout structure', () => {
    const props = {
      title: 'Test Title',
      description: 'Test Description',
      tags: [],
      children: <div data-testid="test-content">Test Content</div>,
    }

    const { container } = render(<ProjectPageLayout {...props} />)

    // Debug: log the actual HTML structure
    console.log('Rendered HTML:', container.innerHTML)

    // Check what elements exist
    const allElements = container.querySelectorAll('*')
    console.log(
      'All elements:',
      Array.from(allElements).map(
        (el) =>
          el.tagName + (el.getAttribute('data-testid') ? `[${el.getAttribute('data-testid')}]` : '')
      )
    )

    // Basic existence check
    expect(container.firstChild).toBeTruthy()
  })
})
