// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ProjectCTASection } from '../project-cta-section'

describe('ProjectCTASection', () => {
  it('renders no stats bar', () => {
    const { container } = render(<ProjectCTASection />)
    const text = container.textContent ?? ''
    expect(text).not.toContain('$4.8M+')
    expect(text).not.toContain('432%')
    expect(text).not.toContain('Case Studies')
    expect(container.querySelector('[data-stat]')).toBeNull()
  })

  it('uses mt-16 spacing', () => {
    const { container } = render(<ProjectCTASection />)
    const section = container.querySelector('section')
    expect(section?.className).toContain('mt-16')
    expect(section?.className).not.toContain('mt-32')
  })
})
