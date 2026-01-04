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

describe('Debug Failing Case 2', () => {
  test('should render with exclamation mark props', () => {
    const props = {
      title: '!',
      description: '!',
      tags: [],
      children: <div data-testid="test-content">Test Content</div>,
    }

    const { container } = render(<ProjectPageLayout {...props} />)

    // Debug: log the actual HTML structure
    console.log('Rendered HTML:', container.innerHTML)

    // Check what elements exist
    const header = container.querySelector('[data-testid="project-header"]')
    console.log('Header found:', !!header)

    const backButton = container.querySelector('[data-testid="back-button"]')
    console.log('Back button found:', !!backButton)

    const titleSection = container.querySelector('[data-testid="project-title-section"]')
    console.log('Title section found:', !!titleSection)

    const title = container.querySelector('[data-testid="project-title"]')
    console.log('Title found:', !!title, title?.textContent)

    const description = container.querySelector('[data-testid="project-description"]')
    console.log('Description found:', !!description, description?.textContent)

    const tags = container.querySelector('[data-testid="project-tags"]')
    console.log('Tags found:', !!tags)

    const mainContent = container.querySelector('#main-content')
    console.log('Main content found:', !!mainContent)

    // Basic existence check
    expect(container.firstChild).toBeTruthy()
  })
})
