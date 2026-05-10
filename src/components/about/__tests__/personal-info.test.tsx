// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { PersonalInfo } from '../personal-info'

const fixture = {
  name: 'Richard Hudson',
  title: 'Revenue Operations Professional',
  location: 'Dallas, TX',
  email: 'contact@richardwhudsonjr.com',
  bio: 'First paragraph.\n\nSecond paragraph.',
}

describe('PersonalInfo', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders the name as an h1 and title as h2', () => {
    render(<PersonalInfo personalInfo={fixture} />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(fixture.name)
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(fixture.title)
  })

  it('renders contact location and email link', () => {
    render(<PersonalInfo personalInfo={fixture} />)
    expect(screen.getByText(fixture.location)).toBeTruthy()
    const emailLink = screen.getByRole('link', { name: fixture.email })
    expect(emailLink.getAttribute('href')).toBe(`mailto:${fixture.email}`)
  })

  it('renders the resume button text as "View Resume" (regression: audit fix #2)', () => {
    render(<PersonalInfo personalInfo={fixture} />)
    // The resume CTA must be "View Resume" — NOT "Download Resume"
    const link = screen.getByRole('link', { name: /view resume/i })
    expect(link.getAttribute('href')).toBe('/resume')
    expect(link.textContent).toMatch(/view resume/i)
    expect(link.textContent?.toLowerCase()).not.toContain('download')
  })

  it('renders the "View Case Studies" CTA pointing to /projects', () => {
    render(<PersonalInfo personalInfo={fixture} />)
    const link = screen.getByRole('link', { name: /view case studies/i })
    expect(link.getAttribute('href')).toBe('/projects')
  })

  it('splits bio on double-newline into separate paragraphs', () => {
    const { container } = render(<PersonalInfo personalInfo={fixture} />)
    const proseDiv = container.querySelector('.prose')
    expect(proseDiv).toBeTruthy()
    const paragraphs = proseDiv!.querySelectorAll('p')
    expect(paragraphs.length).toBe(2)
    expect(paragraphs[0]?.textContent).toBe('First paragraph.')
    expect(paragraphs[1]?.textContent).toBe('Second paragraph.')
  })

  it('applies a custom className when provided', () => {
    const { container } = render(<PersonalInfo personalInfo={fixture} className="my-custom" />)
    const section = container.querySelector('section')
    expect(section?.className).toContain('my-custom')
  })
})
