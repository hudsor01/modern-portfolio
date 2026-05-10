// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { FeaturedProjects } from '../featured-projects'

describe('FeaturedProjects', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders the "Featured Work" heading', () => {
    render(<FeaturedProjects />)
    expect(screen.getByText('Featured Work')).toBeTruthy()
  })

  it('renders all 3 hardcoded projects with their hrefs', () => {
    render(<FeaturedProjects />)
    expect(
      screen.getByRole('link', { name: /revenue operations center/i }).getAttribute('href')
    ).toBe('/projects/revenue-operations-center')
    expect(
      screen.getByRole('link', { name: /lead attribution system/i }).getAttribute('href')
    ).toBe('/projects/lead-attribution')
    expect(
      screen.getByRole('link', { name: /commission optimization/i }).getAttribute('href')
    ).toBe('/projects/commission-optimization')
  })

  it('forwards className to root', () => {
    const { container } = render(<FeaturedProjects className="my-fp" />)
    const root = container.firstChild as HTMLElement
    expect(root.className).toContain('my-fp')
  })

  it('renders project descriptions', () => {
    render(<FeaturedProjects />)
    expect(screen.getByText(/96\.8% forecast accuracy/i)).toBeTruthy()
    expect(screen.getByText(/multi-touch attribution/i)).toBeTruthy()
    expect(screen.getByText(/\$240k savings/i)).toBeTruthy()
  })
})
