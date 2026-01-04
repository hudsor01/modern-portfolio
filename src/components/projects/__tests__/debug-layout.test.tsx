import { describe, test, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { ProjectPageLayout } from '../project-page-layout'
import type { MockNextLinkProps } from '@/types/test-utils'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: MockNextLinkProps) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

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
