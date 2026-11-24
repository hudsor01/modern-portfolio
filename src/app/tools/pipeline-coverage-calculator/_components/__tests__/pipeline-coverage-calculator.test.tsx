// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { PipelineCoverageCalculator } from '../pipeline-coverage-calculator'

afterEach(async () => {
  cleanup()
  await new Promise((resolve) => setTimeout(resolve, 0))
})

describe('PipelineCoverageCalculator', () => {
  it('shows the revenue target with grouped digits and keeps grouping while typing', () => {
    render(<PipelineCoverageCalculator />)
    const target = screen.getByLabelText('Revenue target (this period)') as HTMLInputElement
    expect(target.value).toBe('1,000,000')
    fireEvent.change(target, { target: { value: '2500000' } })
    expect(target.value).toBe('2,500,000')
    fireEvent.change(target, { target: { value: '2,500,0000' } })
    expect(target.value).toBe('25,000,000')
  })

  it('formats optional money fields like the target', () => {
    render(<PipelineCoverageCalculator />)
    const deal = screen.getByLabelText('Average deal size (optional)') as HTMLInputElement
    fireEvent.change(deal, { target: { value: '50000' } })
    expect(deal.value).toBe('50,000')
  })

  it('renders the headline coverage as a display figure', () => {
    render(<PipelineCoverageCalculator />)
    const headline = screen.getByText('4.0×')
    expect(headline.className).toContain('text-5xl')
    expect(headline.className).toContain('font-bold')
  })

  it('does not stretch the result card to the input card height at lg', () => {
    const { container } = render(<PipelineCoverageCalculator />)
    const results = container.querySelector('[aria-live="polite"]')
    expect(results?.className).toContain('lg:self-start')
  })
})
