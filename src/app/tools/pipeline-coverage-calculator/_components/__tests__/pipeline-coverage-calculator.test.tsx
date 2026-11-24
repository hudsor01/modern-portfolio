// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { act, render, screen, cleanup, fireEvent } from '@testing-library/react'
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

  it('flags a negative amount instead of silently turning it positive', () => {
    render(<PipelineCoverageCalculator />)
    const target = screen.getByLabelText('Revenue target (this period)') as HTMLInputElement
    fireEvent.change(target, { target: { value: '-5' } })
    expect(target.value).toBe('-5')
    expect(target.getAttribute('aria-invalid')).toBe('true')
    const alert = screen.getByRole('alert')
    expect(alert.textContent).toMatch(/negative/i)
    expect(target.getAttribute('aria-describedby')).toBe(alert.id)
    expect(screen.getByText('Fix the highlighted amount to see your coverage.')).toBeTruthy()
  })

  it('flags exponent notation and letter suffixes, then recovers when corrected', () => {
    render(<PipelineCoverageCalculator />)
    const target = screen.getByLabelText('Revenue target (this period)') as HTMLInputElement
    fireEvent.change(target, { target: { value: '1e6' } })
    expect(target.value).toBe('1e6')
    expect(screen.getByRole('alert').textContent).toMatch(/exponent/i)
    fireEvent.change(target, { target: { value: '1.5M' } })
    expect(target.value).toBe('1.5M')
    expect(screen.getByRole('alert').textContent).toMatch(/digits only/i)
    fireEvent.change(target, { target: { value: '1500000' } })
    expect(target.value).toBe('1,500,000')
    expect(screen.queryByRole('alert')).toBeNull()
    expect(target.getAttribute('aria-invalid')).toBe('false')
  })

  it('keeps the caret on the same digit when a comma is inserted mid-string', () => {
    render(<PipelineCoverageCalculator />)
    const target = screen.getByLabelText('Revenue target (this period)') as HTMLInputElement
    target.focus()
    // Field shows "1,000,000"; the user types a 0 after the first digit: "10,000,000"
    // reads as "1,0000,000" mid-edit with the caret at 3, which re-groups to "10,000,000"
    // and must keep the caret after the second digit.
    // Native setter + input event, so React sees a real edit with the caret where the user left it.
    const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
    act(() => {
      setValue?.call(target, '1,0000,000')
      target.setSelectionRange(3, 3)
      target.dispatchEvent(new Event('input', { bubbles: true }))
    })
    expect(target.value).toBe('10,000,000')
    expect(target.selectionStart).toBe(2)
  })
})
