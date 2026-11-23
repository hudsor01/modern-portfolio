// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { ChartContainer } from '../chart-container'

describe('ChartContainer heading', () => {
  beforeEach(() => cleanup())

  it('renders an h3 chart-title by default', () => {
    const { container } = render(
      <ChartContainer title="T">
        <div />
      </ChartContainer>
    )
    const h = container.querySelector('h3')
    expect(h?.textContent).toBe('T')
    expect(h?.getAttribute('data-slot')).toBe('chart-title')
    for (const c of ['text-lg', 'font-semibold', 'leading-none', 'tracking-tight']) {
      expect(h?.className).toContain(c)
    }
  })

  it('renders an h2 with headingLevel 2 and does not spread the prop onto the div', () => {
    const { container } = render(
      <ChartContainer title="T" headingLevel={2}>
        <div />
      </ChartContainer>
    )
    expect(container.querySelector('h3')).toBeNull()
    expect(container.querySelector('h2')?.getAttribute('data-slot')).toBe('chart-title')
    expect((container.firstElementChild as HTMLElement).hasAttribute('headinglevel')).toBe(false)
  })

  it('honours headingLevel in the error branch', () => {
    const { container } = render(
      <ChartContainer title="T" error="boom" headingLevel={2}>
        <div />
      </ChartContainer>
    )
    expect(container.querySelector('h2')?.textContent).toBe('T')
    expect(container.querySelector('h3')).toBeNull()
  })
})
