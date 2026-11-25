// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest'
import { act, render, screen, cleanup, fireEvent } from '@testing-library/react'
import { PipelineCoverageCalculator } from '../pipeline-coverage-calculator'

afterEach(async () => {
  cleanup()
  await new Promise((resolve) => setTimeout(resolve, 0))
})

const NEG = 'Negative amounts are not allowed. Enter a positive number.'

/** jsdom never sets validity.badInput, so stub it before firing the change event. */
function setBadInput(input: HTMLInputElement, bad: boolean) {
  Object.defineProperty(input, 'validity', { value: { badInput: bad }, configurable: true })
}
const getTarget = () => screen.getByLabelText('Revenue target (this period)') as HTMLInputElement
const panelText = () => document.querySelector('[aria-live="polite"]')?.textContent ?? ''

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
    const target = getTarget()
    fireEvent.change(target, { target: { value: '-5' } })
    expect(target.value).toBe('-5')
    expect(target.getAttribute('aria-invalid')).toBe('true')
    const alert = screen.getByRole('alert')
    expect(alert.textContent).toBe(NEG)
    expect(target.getAttribute('aria-describedby')).toBe(alert.id)
    expect(panelText()).toBe('Fix “Revenue target” to see your coverage.')
  })

  it('gives letters, exponents and suffixes one message, then recovers when corrected', () => {
    render(<PipelineCoverageCalculator />)
    const target = getTarget()
    for (const typed of ['abc-12,5e3x', '1e6', '1.5M']) {
      fireEvent.change(target, { target: { value: typed } })
      expect(target.value).toBe(typed)
      expect(screen.getByRole('alert').textContent).toBe('Enter numbers only')
    }
    fireEvent.change(target, { target: { value: '1500000' } })
    expect(target.value).toBe('1,500,000')
    expect(screen.queryByRole('alert')).toBeNull()
    expect(target.getAttribute('aria-invalid')).toBe('false')
  })

  it('caps the target at $10B but accepts exactly $10B', () => {
    render(<PipelineCoverageCalculator />)
    const target = getTarget()
    fireEvent.change(target, { target: { value: '10000000001' } })
    expect(target.value).toBe('10000000001')
    expect(screen.getByRole('alert').textContent).toBe('Enter a target up to $10B')
    expect(panelText()).toBe('Fix “Revenue target” to see your coverage.')
    fireEvent.change(target, { target: { value: '10000000000' } })
    expect(target.value).toBe('10,000,000,000')
    expect(screen.queryByRole('alert')).toBeNull()
    expect(panelText()).toContain('Required coverage')
  })

  it('caps average deal size at $10B and names it in the panel', () => {
    render(<PipelineCoverageCalculator />)
    const deal = screen.getByLabelText('Average deal size (optional)') as HTMLInputElement
    fireEvent.change(deal, { target: { value: '10000000001' } })
    expect(screen.getByRole('alert').textContent).toBe('Enter an amount up to $10B')
    expect(panelText()).toBe('Fix “Average deal size” to see your coverage.')
  })

  it('flags malformed text in Win rate via validity.badInput, then recovers', () => {
    render(<PipelineCoverageCalculator />)
    const win = screen.getByLabelText('Win rate') as HTMLInputElement
    setBadInput(win, true)
    fireEvent.change(win, { target: { value: '' } })
    const alert = screen.getByRole('alert')
    expect(alert.textContent).toBe('Enter numbers only')
    expect(win.getAttribute('aria-invalid')).toBe('true')
    expect(win.getAttribute('aria-describedby')).toBe(alert.id)
    expect(win.className).toContain('border-destructive!')
    expect(panelText()).toBe('Fix “Win rate” to see your coverage.')
    setBadInput(win, false)
    fireEvent.change(win, { target: { value: '30' } })
    expect(screen.queryByRole('alert')).toBeNull()
    expect(win.getAttribute('aria-invalid')).toBe('false')
    expect(panelText()).toContain('Required coverage')
  })

  it('flags negative and out-of-range percent values per field', () => {
    render(<PipelineCoverageCalculator />)
    const win = screen.getByLabelText('Win rate') as HTMLInputElement
    const qual = screen.getByLabelText('% truly qualified') as HTMLInputElement
    const safety = screen.getByLabelText('Safety margin') as HTMLInputElement
    fireEvent.change(win, { target: { value: '-5' } })
    expect(screen.getByRole('alert').textContent).toBe(NEG)
    fireEvent.change(win, { target: { value: '150' } })
    expect(screen.getByRole('alert').textContent).toBe('Win rate can’t exceed 100%.')
    fireEvent.change(win, { target: { value: '25' } })
    fireEvent.change(qual, { target: { value: '150' } })
    expect(screen.getByRole('alert').textContent).toBe('Enter a percentage up to 100%.')
    expect(panelText()).toBe('Fix “% truly qualified” to see your coverage.')
    fireEvent.change(qual, { target: { value: '100' } })
    fireEvent.change(safety, { target: { value: '-1' } })
    expect(screen.getByRole('alert').textContent).toBe(NEG)
    fireEvent.change(safety, { target: { value: '1001' } })
    expect(screen.getByRole('alert').textContent).toBe('Enter a margin up to 1,000%.')
  })

  it('names the first failing field in DOM order when several are invalid', () => {
    render(<PipelineCoverageCalculator />)
    fireEvent.change(getTarget(), { target: { value: 'abc' } })
    fireEvent.change(screen.getByLabelText('Win rate'), { target: { value: '150' } })
    expect(screen.getAllByRole('alert')).toHaveLength(2)
    expect(panelText()).toBe('Fix “Revenue target” to see your coverage.')
  })

  it('moves focus to the failing field from the panel button', () => {
    render(<PipelineCoverageCalculator />)
    const win = screen.getByLabelText('Win rate') as HTMLInputElement
    fireEvent.change(win, { target: { value: '150' } })
    fireEvent.click(screen.getByRole('button', { name: 'Win rate' }))
    expect(document.activeElement).toBe(win)
  })

  it('bounds extreme output instead of printing absurd figures', () => {
    const { container } = render(<PipelineCoverageCalculator />)
    fireEvent.change(getTarget(), { target: { value: '10000000000' } })
    fireEvent.change(screen.getByLabelText('Win rate'), { target: { value: '0.0001' } })
    const text = container.querySelector('[aria-live="polite"]')?.textContent ?? ''
    expect(text).toContain('$1T+')
    expect(text).toContain('1,000×+')
    expect(text).not.toMatch(/[\d,]{5,}T/)
  })

  it('a preset clears a malformed win rate', () => {
    render(<PipelineCoverageCalculator />)
    const win = screen.getByLabelText('Win rate') as HTMLInputElement
    setBadInput(win, true)
    fireEvent.change(win, { target: { value: '' } })
    expect(screen.getByRole('alert')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Mid-market (25%)' }))
    expect(screen.queryByRole('alert')).toBeNull()
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
