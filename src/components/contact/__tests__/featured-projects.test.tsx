// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { FeaturedProjects, type FeaturedProject } from '../featured-projects'

const projects: FeaturedProject[] = [
  {
    slug: 'alpha-project',
    title: 'Alpha Project',
    description: 'Alpha description text',
    results: [{ metric: 'Cycle time', before: '40 days', after: '20 days', improvement: '50%' }],
    displayMetrics: [],
  },
  {
    slug: 'beta-project',
    title: 'Beta Project',
    description: 'Beta description text',
    results: [{ metric: 'Accuracy', before: 'n/a', after: 'n/a', improvement: '30%' }],
    displayMetrics: [],
  },
  {
    slug: 'gamma-project',
    title: 'Gamma Project',
    description: 'Gamma description text',
    results: [],
    displayMetrics: [{ label: 'Revenue', value: '$1M' }],
  },
] as unknown as FeaturedProject[]

describe('FeaturedProjects', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders the "Featured Work" heading', () => {
    render(<FeaturedProjects projects={projects} />)
    expect(screen.getByText('Featured Work')).toBeTruthy()
  })

  it('renders a link per project with catalog hrefs', () => {
    render(<FeaturedProjects projects={projects} />)
    for (const p of projects) {
      const link = screen.getByRole('link', { name: new RegExp(p.title, 'i') })
      expect(link.getAttribute('href')).toBe(`/projects/${p.slug}`)
    }
    expect(screen.getAllByRole('link')).toHaveLength(3)
  })

  it('uses decorative generated thumbnails, no photos', () => {
    const { container } = render(<FeaturedProjects projects={projects} />)
    expect(container.querySelector('img')).toBeNull()
    const previews = container.querySelectorAll('[data-slot="project-preview"]')
    expect(previews.length).toBeGreaterThan(0)
    for (const el of previews) expect(el.getAttribute('aria-hidden')).toBe('true')
    const metricsRow = screen.getByRole('link', { name: /gamma project/i })
    expect(metricsRow.querySelector('svg')).not.toBeNull()
  })

  it('renders descriptions and forwards className', () => {
    const { container } = render(<FeaturedProjects className="my-fp" projects={projects} />)
    expect(screen.getByText('Alpha description text')).toBeTruthy()
    expect((container.firstChild as HTMLElement).className).toContain('my-fp')
  })

  it('title span is text-base font-semibold; source is a server component without photos', () => {
    render(<FeaturedProjects projects={projects} />)
    expect(screen.getByText('Alpha Project').className).toContain('text-base font-semibold')
    const src = readFileSync(join(__dirname, '../featured-projects.tsx'), 'utf8')
    expect(src).not.toMatch(/use client|next\/image|font-medium/)
  })
})
