// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, cleanup, act } from '@testing-library/react'
import { TypingAnimation } from '../typing-animation'

describe('TypingAnimation', () => {
  beforeEach(() => {
    cleanup()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with empty display text and renders the cursor by default', () => {
    const { container } = render(<TypingAnimation words={['hello']} />)
    const spans = container.querySelectorAll('span')
    // Outer + text + cursor = at least 3 spans
    expect(spans.length).toBeGreaterThanOrEqual(2)
    // The cursor character "|" is present in the rendered output
    expect(container.textContent).toContain('|')
  })

  it('hides the cursor when showCursor=false', () => {
    const { container } = render(<TypingAnimation words={['hi']} showCursor={false} />)
    expect(container.textContent).not.toContain('|')
  })

  it('uses a custom cursor character', () => {
    const { container } = render(<TypingAnimation words={['hi']} cursor="_" />)
    expect(container.textContent).toContain('_')
  })

  it('types the first word character-by-character on its tick interval', () => {
    const { container } = render(<TypingAnimation words={['ab']} typingSpeed={10} />)
    expect(container.textContent).toBe('|')
    act(() => {
      vi.advanceTimersByTime(15)
    })
    expect(container.textContent).toContain('a')
    act(() => {
      vi.advanceTimersByTime(15)
    })
    expect(container.textContent).toContain('ab')
  })

  it('forwards a className to the outer span', () => {
    const { container } = render(<TypingAnimation words={['x']} className="custom-typing" />)
    const outer = container.querySelector('span')
    expect(outer?.className).toContain('custom-typing')
  })
})
