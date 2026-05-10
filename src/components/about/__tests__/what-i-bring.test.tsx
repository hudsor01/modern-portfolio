// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { WhatIBring } from '../what-i-bring'

describe('WhatIBring', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders the section heading and lede', () => {
    render(<WhatIBring />)
    expect(screen.getByText('What I Bring to Your Team')).toBeTruthy()
    expect(screen.getByText(/the mindset and approach that drives results/i)).toBeTruthy()
  })

  it('renders all 6 trait titles', () => {
    render(<WhatIBring />)
    expect(screen.getByText('Systems Thinking')).toBeTruthy()
    expect(screen.getByText('Data Fluency')).toBeTruthy()
    expect(screen.getByText('Bias for Action')).toBeTruthy()
    expect(screen.getByText('Bridge Builder')).toBeTruthy()
    expect(screen.getByText('Strategic Simplifier')).toBeTruthy()
    expect(screen.getByText('Growth Catalyst')).toBeTruthy()
  })

  it('renders descriptions paired with their titles', () => {
    render(<WhatIBring />)
    expect(screen.getByText(/redesign workflows that prevent issues/i)).toBeTruthy()
    expect(screen.getByText(/translate sql queries into executive narratives/i)).toBeTruthy()
  })

  it('forwards a custom className to the section root', () => {
    const { container } = render(<WhatIBring className="my-wib" />)
    expect((container.firstChild as HTMLElement).className).toContain('my-wib')
  })

  it('renders 6 cards in the grid', () => {
    const { container } = render(<WhatIBring />)
    const grid = container.querySelector('.grid')
    expect(grid?.children.length).toBe(6)
  })
})
