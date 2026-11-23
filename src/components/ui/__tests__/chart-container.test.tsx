// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { ChartContainer, ChartHeader } from '../chart-container'

describe('ChartContainer heading', () => {
  beforeEach(() => cleanup())

  afterEach(async () => {
    cleanup()
    // Let queued React scheduler tasks drain before the environment is torn down.
    await new Promise((resolve) => setTimeout(resolve, 0))
  })

  it('renders an h3 chart-title by default', () => {
    const { container } = render(
      <ChartContainer title="T">
        <div />
      </ChartContainer>
    )
    const h = container.querySelector('h3')
    expect(h?.textContent).toBe('T')
    expect(h?.getAttribute('data-slot')).toBe('chart-title')
    for (const c of ['font-sans', 'text-lg', 'font-semibold', 'leading-snug', 'text-foreground']) {
      expect(h?.className).toContain(c)
    }
    expect(h?.className).not.toContain('leading-none')
    expect(h?.className).not.toContain('tracking-tight')
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

  it('renders no heading or empty header without a title', () => {
    const { container } = render(
      <ChartContainer>
        <div />
      </ChartContainer>
    )
    expect(container.querySelector('h2, h3')).toBeNull()
    expect(container.querySelector('[class*="justify-between"]')).toBeNull()
  })

  it('renders the caption as the card root last child', () => {
    const { container } = render(
      <ChartContainer title="T" caption="Foo">
        <div />
      </ChartContainer>
    )
    const root = container.firstElementChild as HTMLElement
    const p = root.lastElementChild as HTMLElement
    expect(p.tagName).toBe('P')
    expect(p.textContent).toBe('Foo')
    for (const c of ['text-base', 'text-muted-foreground', 'mt-4']) {
      expect(p.className).toContain(c)
    }
    expect(root.hasAttribute('caption')).toBe(false)
  })

  it('renders description and merges className in a standalone ChartHeader', () => {
    const { container } = render(<ChartHeader title="T" description="D" className="extra" />)
    const root = container.firstElementChild as HTMLElement
    expect(root.className).toContain('flex items-start justify-between gap-4')
    expect(root.className).toContain('extra')
    const p = root.querySelector('p') as HTMLElement
    expect(p.className).toContain('mt-1')
  })

  it('uses h-5 w-40 for the loading header skeleton', () => {
    const { container } = render(
      <ChartContainer title="T" loading>
        <div />
      </ChartContainer>
    )
    expect(container.querySelector('.h-5.w-40')).not.toBeNull()
  })

  it('loading without title/description/actions reserves no header row', () => {
    const { container } = render(
      <ChartContainer loading>
        <div />
      </ChartContainer>
    )
    expect(container.querySelector('.h-5.w-40')).toBeNull()
    expect(container.querySelector('[class*="justify-between"]')).toBeNull()
  })

  it('loading marks the card aria-busy', () => {
    const { container } = render(
      <ChartContainer title="T" loading>
        <div />
      </ChartContainer>
    )
    expect((container.firstElementChild as HTMLElement).getAttribute('aria-busy')).toBe('true')
  })

  it('loading reserves the caption row below the box', () => {
    const { container } = render(
      <ChartContainer title="T" caption="Foo" loading>
        <div />
      </ChartContainer>
    )
    const root = container.firstElementChild as HTMLElement
    const last = root.lastElementChild as HTMLElement
    expect(last.className).toContain('mt-4')
    expect(last.className).toContain('h-6')
  })

  it('error state renders the caption as the root last child', () => {
    const { container } = render(
      <ChartContainer title="T" caption="Foo" error="boom">
        <div />
      </ChartContainer>
    )
    const p = (container.firstElementChild as HTMLElement).lastElementChild as HTMLElement
    expect(p.tagName).toBe('P')
    expect(p.textContent).toBe('Foo')
  })
})
