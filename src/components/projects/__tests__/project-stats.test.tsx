// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ProjectStats } from '../project-stats'

describe('ProjectStats', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders the static stats and substitutes totalProjects into the last card', () => {
    render(<ProjectStats totalProjects={13} />)
    expect(screen.getByText('Revenue Optimized')).toBeTruthy()
    expect(screen.getByText('Average Growth')).toBeTruthy()
    expect(screen.getByText('Network Expansion')).toBeTruthy()
    expect(screen.getByText('Case Studies')).toBeTruthy()
    // The 4th value uses totalProjects+
    expect(screen.getByText('13+')).toBeTruthy()
  })

  it('renders 4 cards in non-loading state', () => {
    const { container } = render(<ProjectStats totalProjects={5} />)
    // Each card sits inside the outer grid div — assert by counting them
    const grid = container.querySelector('.grid')
    expect(grid).toBeTruthy()
    expect(grid?.children.length).toBe(4)
  })

  it('updates the case studies value when totalProjects changes', () => {
    const { rerender } = render(<ProjectStats totalProjects={11} />)
    expect(screen.getByText('11+')).toBeTruthy()
    rerender(<ProjectStats totalProjects={20} />)
    expect(screen.getByText('20+')).toBeTruthy()
  })
})
