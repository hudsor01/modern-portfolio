// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

const path = vi.hoisted(() => ({ value: '/projects/revenue-kpi' }))
vi.mock('next/navigation', () => ({ usePathname: () => path.value }))

import { CaseStudyFooter, relatedCaseStudies } from '../case-study-footer'
import { showcaseProjects } from '@/data/projects'

describe('relatedCaseStudies', () => {
  it('returns three others, same category first, never the current one', () => {
    const current = showcaseProjects.find((p) => p.slug === 'revenue-kpi')!
    const related = relatedCaseStudies('revenue-kpi')
    expect(related).toHaveLength(3)
    expect(related.map((p) => p.slug)).not.toContain('revenue-kpi')
    expect(related[0]?.category).toBe(current.category)
  })

  it('is deterministic', () => {
    expect(relatedCaseStudies('deal-funnel')).toEqual(relatedCaseStudies('deal-funnel'))
  })
})

describe('CaseStudyFooter', () => {
  it('links three related case studies and the contact CTA, all tracked', () => {
    path.value = '/projects/revenue-kpi'
    const { container } = render(<CaseStudyFooter />)
    expect(screen.getByRole('heading', { level: 2, name: 'More case studies' })).toBeTruthy()
    const related = container.querySelectorAll('a[data-track-location="case-study-related"]')
    expect(related).toHaveLength(3)
    for (const a of related) expect(a.getAttribute('href')).not.toBe('/projects/revenue-kpi')
    const cta = container.querySelectorAll('a[data-track-location="case-study-cta"]')
    expect([...cta].map((a) => a.getAttribute('href'))).toEqual(['/contact', '/projects'])
  })
})
