// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ProjectCard } from '../project-card'
import type { Project } from '@/types/project'

const baseProject: Project = {
  id: 'p1',
  slug: 'foo-project',
  title: 'Foo Project',
  description: 'A short description.',
  image: '/images/foo.jpg',
  client: 'Partner channel · 47 partners',
  category: 'RevOps',
  tags: ['Salesforce', 'HubSpot', 'Python', 'SQL'],
  featured: false,
  results: [
    { metric: 'Forecast Accuracy', before: '82%', after: '94%', improvement: '15%' },
    { metric: 'Partner Satisfaction', before: '', after: '', improvement: '18%' },
  ],
  displayMetrics: [
    { label: 'Revenue', value: '$4.8M', iconName: 'trending-up' },
    { label: 'Growth', value: '432%', iconName: 'bar-chart' },
  ],
} as unknown as Project

describe('ProjectCard', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders the project title and description', () => {
    render(<ProjectCard project={baseProject} />)
    expect(screen.getByRole('heading', { name: 'Foo Project' })).toBeTruthy()
    expect(screen.getByText('A short description.')).toBeTruthy()
  })

  it('links to /projects/<slug>', () => {
    render(<ProjectCard project={baseProject} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/projects/foo-project')
  })

  it('falls back to /projects/<id> when slug is missing', () => {
    const noSlug = { ...baseProject, slug: undefined } as unknown as Project
    render(<ProjectCard project={noSlug} />)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/projects/p1')
  })

  it('renders the Featured badge when project.featured=true', () => {
    render(<ProjectCard project={{ ...baseProject, featured: true }} />)
    expect(screen.getByText('Featured')).toBeTruthy()
  })

  it('Featured badge uses white text on the copper fill', () => {
    render(<ProjectCard project={{ ...baseProject, featured: true }} />)
    const badge = screen.getByText('Featured')
    expect(badge.className).toContain('bg-accent')
    expect(badge.className).toContain('text-white')
    expect(badge.className).not.toContain('text-accent-foreground')
  })

  it('does NOT render the Featured badge when project.featured=false', () => {
    render(<ProjectCard project={{ ...baseProject, featured: false }} />)
    expect(screen.queryByText('Featured')).toBeNull()
  })

  it('renders the category label using project.client', () => {
    render(<ProjectCard project={baseProject} />)
    expect(screen.getByText('Partner channel · 47 partners')).toBeTruthy()
  })

  it('renders metric value/label pairs', () => {
    render(<ProjectCard project={baseProject} />)
    expect(screen.getByText('$4.8M')).toBeTruthy()
    expect(screen.getByText('Revenue')).toBeTruthy()
    expect(screen.getByText('432%')).toBeTruthy()
    expect(screen.getByText('Growth')).toBeTruthy()
  })

  it('renders up to 4 tag chips and a +N indicator for the rest', () => {
    const lots = {
      ...baseProject,
      tags: ['A', 'B', 'C', 'D', 'E', 'F'],
    } as unknown as Project
    render(<ProjectCard project={lots} />)
    expect(screen.getByText('A')).toBeTruthy()
    expect(screen.getByText('B')).toBeTruthy()
    expect(screen.getByText('C')).toBeTruthy()
    expect(screen.getByText('D')).toBeTruthy()
    // 6 - 4 = 2 hidden
    expect(screen.getByText('+2')).toBeTruthy()
  })

  it('does not render the +N indicator when there are 4 or fewer tags', () => {
    render(<ProjectCard project={baseProject} />)
    expect(screen.queryByText(/^\+\d+$/)).toBeNull()
  })

  it('renders a results chart preview and no img', () => {
    const { container } = render(<ProjectCard project={baseProject} />)
    const imgs = container.querySelectorAll('[role="img"]')
    expect(imgs.length).toBe(1)
    expect(imgs[0]?.getAttribute('aria-label')).toMatch(/^Results chart\./)
    expect(container.querySelector('img')).toBeNull()
  })

  it('falls back to key metrics when only numeric displayMetrics exist', () => {
    const p = { ...baseProject, results: null } as unknown as Project
    const { container } = render(<ProjectCard project={p} />)
    const imgs = container.querySelectorAll('[role="img"]')
    expect(imgs.length).toBe(1)
    expect(imgs[0]?.getAttribute('aria-label')).toMatch(/^Key metrics\./)
    expect(container.querySelector('img')).toBeNull()
  })

  it('does not repeat the key metrics below a key-metrics preview', () => {
    const p = { ...baseProject, results: [] } as unknown as Project
    const { container } = render(<ProjectCard project={p} />)
    // Each figure appears once: in the preview tiles, not again in a metrics row.
    expect(screen.getAllByText('$4.8M')).toHaveLength(1)
    expect(screen.getAllByText('432%')).toHaveLength(1)
    expect(container.querySelector('[data-slot="metrics-row"]')).toBeNull()
  })

  it('keeps the metrics row beside a results-chart preview', () => {
    const { container } = render(<ProjectCard project={baseProject} />)
    expect(container.querySelector('[data-slot="metrics-row"]')).not.toBeNull()
  })

  it('keeps stable geometry hooks', () => {
    const { container } = render(<ProjectCard project={{ ...baseProject, featured: true }} />)
    const media = container.querySelector('[data-slot="project-media"]')
    expect(media?.className).toContain('relative aspect-16/10 overflow-hidden bg-muted')
    const badge = container.querySelector('[data-slot="featured-badge"]')
    expect(badge?.className).toContain('top-3 left-3')
    expect(badge?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true')
    const chip = container.querySelector('[data-slot="client-chip"]')
    expect(chip?.className).toContain('max-w-full')
  })

  it('metric values use sans tabular type', () => {
    render(<ProjectCard project={baseProject} />)
    const cls = screen.getByText('$4.8M').className
    expect(cls).toContain('font-sans text-base font-semibold tabular-nums')
    expect(cls).not.toContain('font-mono')
  })
})
