// @vitest-environment jsdom
import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

vi.mock('@/components/layout/navbar', () => ({ Navbar: () => null }))
vi.mock('../../resume-viewer', () => ({ ResumeViewer: () => null }))
vi.mock('@/hooks/use-in-view', () => ({ useInView: () => true }))

import ResumePageContent from '../resume-page-content'

describe('resume heading outline', () => {
  it('is H1 name, then H2 sections, with job titles and sub-items as H3s and no skipped level', () => {
    const { container } = render(<ResumePageContent />)
    const headings = [...container.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    const levels = headings.map((h) => Number(h.tagName[1]))
    expect(levels[0]).toBe(1)
    for (let i = 1; i < levels.length; i++) {
      expect(levels[i]! - levels[i - 1]!).toBeLessThanOrEqual(1)
    }
    const h2 = headings.filter((h) => h.tagName === 'H2').map((h) => h.textContent?.trim())
    expect(h2).toEqual(['About', 'Experience', 'Education', 'Certifications', 'Skills by area'])
    expect(container.querySelector('h4')).toBeNull()
  })
})
