// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { DecorativeBlob } from '../decorative-blob'

describe('DecorativeBlob', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders top-right with the base contract', () => {
    const { container } = render(<DecorativeBlob position="top-right" />)
    const el = container.firstElementChild as HTMLElement
    expect(el.getAttribute('aria-hidden')).toBe('true')
    for (const c of [
      'pointer-events-none',
      'absolute',
      'rounded-full',
      'blur-3xl',
      'top-1/4',
      '-right-32',
      'w-64',
      'h-64',
      'bg-primary/5',
    ]) {
      expect(el.classList.contains(c)).toBe(true)
    }
  })

  it('renders bottom-left', () => {
    const { container } = render(<DecorativeBlob position="bottom-left" />)
    const el = container.firstElementChild as HTMLElement
    for (const c of ['bottom-1/3', '-left-32', 'bg-secondary/5', 'w-64', 'h-64']) {
      expect(el.classList.contains(c)).toBe(true)
    }
  })

  it('className overrides the vertical offset', () => {
    const { container } = render(<DecorativeBlob position="bottom-left" className="bottom-1/4" />)
    const el = container.firstElementChild as HTMLElement
    expect(el.classList.contains('bottom-1/4')).toBe(true)
    expect(el.classList.contains('bottom-1/3')).toBe(false)
  })

  it('size lg yields w-96 h-96', () => {
    const { container } = render(<DecorativeBlob position="top-right" size="lg" />)
    const el = container.firstElementChild as HTMLElement
    expect(el.classList.contains('w-96')).toBe(true)
    expect(el.classList.contains('h-96')).toBe(true)
    expect(el.classList.contains('w-64')).toBe(false)
    expect(el.classList.contains('h-64')).toBe(false)
  })
})
