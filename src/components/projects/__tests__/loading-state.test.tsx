import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoadingState } from '../loading-state'

describe('LoadingState', () => {
  it('should render loading spinner', () => {
    render(<LoadingState />)

    // Verify the component is visible
    const loadingElement = screen.getByRole('status')
    expect(loadingElement).toBeInTheDocument()
  })

  it('should have accessible label', () => {
    render(<LoadingState />)

    const loadingElement = screen.getByRole('status')
    expect(loadingElement).toHaveAttribute('aria-label', 'Loading')
  })

  it('should render spinner with correct structure', () => {
    const { container } = render(<LoadingState />)

    // Verify outer container has flex centering
    const outerContainer = container.firstChild as HTMLElement
    expect(outerContainer).toHaveClass('flex', 'items-center', 'justify-center', 'h-64')

    // Verify spinner structure exists
    const spinner = container.querySelector('.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('should use primary color theme', () => {
    const { container } = render(<LoadingState />)

    // Verify primary color is used in the spinner
    const staticCircle = container.querySelector('.border-primary\\/20')
    const animatedCircle = container.querySelector('.border-primary')

    expect(staticCircle).toBeInTheDocument()
    expect(animatedCircle).toBeInTheDocument()
  })

  it('should have transparent border on top for animation effect', () => {
    const { container } = render(<LoadingState />)

    const animatedCircle = container.querySelector('.animate-spin')
    expect(animatedCircle).toHaveClass('border-t-transparent')
  })

  it('should match expected dimensions', () => {
    const { container } = render(<LoadingState />)

    // Static circle should be 16x16 (w-16 h-16)
    const staticCircle = container.querySelector('.w-16')
    expect(staticCircle).toHaveClass('h-16')

    // Animated circle should also be 16x16
    const animatedCircle = container.querySelector('.animate-spin')
    expect(animatedCircle).toHaveClass('w-16', 'h-16')
  })
})
