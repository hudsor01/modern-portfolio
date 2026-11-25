// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import type { Project } from '@/types/project'

vi.mock('@/components/layout/navbar', () => ({ Navbar: () => null }))

import ProjectDetailClientBoundary from '../project-detail-client-boundary'

const project = {
  id: 'p1',
  slug: 'foo',
  title: 'Foo Project',
  description: 'Desc.',
  image: '',
  category: 'RevOps',
  client: 'Revenue reporting · 5 systems',
  tags: ['SQL'],
  featured: true,
  displayMetrics: null,
  results: [
    { metric: 'Forecast Accuracy', before: '82%', after: '94%', improvement: '15%' },
    { metric: 'Partner Satisfaction', before: '', after: '', improvement: '18%' },
  ],
} as unknown as Project

describe('ProjectDetailClientBoundary', () => {
  beforeEach(() => cleanup())

  it('renders the hero preview and caption legend, no img', () => {
    const { container } = render(
      <ProjectDetailClientBoundary slug="foo" initialProject={project} />
    )
    const imgs = container.querySelectorAll('[role="img"]')
    expect(imgs.length).toBe(1)
    expect(imgs[0]?.getAttribute('aria-label')).toMatch(/^Results chart\./)
    expect(container.querySelector('img')).toBeNull()
    const legend = container.querySelector('[data-slot="preview-legend"]')
    expect(legend?.getAttribute('aria-hidden')).toBe('true')
    expect(legend?.textContent).toContain('Before')
    expect(legend?.textContent).toContain('After')
  })

  it('labels the descriptor Context, not Client', () => {
    render(<ProjectDetailClientBoundary slug="foo" initialProject={project} />)
    expect(screen.getByText('Context:')).toBeTruthy()
    expect(screen.getByText(/Revenue reporting · 5 systems/)).toBeTruthy()
    expect(screen.queryByText('Client:')).toBeNull()
  })

  it('prints paired and improvement-only results', () => {
    render(<ProjectDetailClientBoundary slug="foo" initialProject={project} />)
    expect(screen.getByText('Forecast Accuracy: 82% → 94% (15%)')).toBeTruthy()
    expect(screen.getByText('Partner Satisfaction: 18%')).toBeTruthy()
  })

  it('hides the Featured badge when not featured', () => {
    render(
      <ProjectDetailClientBoundary
        slug="foo"
        initialProject={{ ...project, featured: false } as Project}
      />
    )
    expect(screen.queryByText('Featured')).toBeNull()
  })
})
