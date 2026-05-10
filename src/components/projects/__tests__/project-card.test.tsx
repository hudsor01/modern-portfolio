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
  client: 'Acme Co',
  category: 'RevOps',
  tags: ['Salesforce', 'HubSpot', 'Python', 'SQL'],
  featured: false,
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

  it('does NOT render the Featured badge when project.featured=false', () => {
    render(<ProjectCard project={{ ...baseProject, featured: false }} />)
    expect(screen.queryByText('Featured')).toBeNull()
  })

  it('renders the category label using project.client', () => {
    render(<ProjectCard project={baseProject} />)
    expect(screen.getByText('Acme Co')).toBeTruthy()
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
})
