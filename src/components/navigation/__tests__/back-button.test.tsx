// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { BackButton } from '../back-button'

describe('BackButton', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders with default label "Back"', () => {
    render(<BackButton href="/foo" />)
    expect(screen.getByText('Back')).toBeTruthy()
  })

  it('forwards href to the underlying anchor', () => {
    render(<BackButton href="/projects" label="Back to Projects" />)
    const link = screen.getByRole('button', { name: /navigate back: back to projects/i })
    expect(link.getAttribute('href')).toBe('/projects')
  })

  it('shows the ArrowLeft icon by default', () => {
    const { container } = render(<BackButton href="/foo" />)
    // lucide icons render as <svg>
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('hides the icon when showIcon=false', () => {
    const { container } = render(<BackButton href="/foo" showIcon={false} />)
    expect(container.querySelector('svg')).toBeNull()
  })

  it('builds an aria-label of "Navigate back: <label>"', () => {
    render(<BackButton href="/foo" label="Home" />)
    const link = screen.getByRole('button', { name: 'Navigate back: Home' })
    expect(link.getAttribute('aria-label')).toBe('Navigate back: Home')
  })

  it('forwards a custom className', () => {
    const { container } = render(<BackButton href="/foo" className="my-back" />)
    const back = container.querySelector('[data-testid="back-button"]')
    expect(back?.className).toContain('my-back')
  })

  it('exposes data-testid="back-button"', () => {
    render(<BackButton href="/foo" />)
    expect(screen.getByTestId('back-button')).toBeTruthy()
  })
})
