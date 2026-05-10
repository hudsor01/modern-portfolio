// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ExpertiseNarrative } from '../expertise-narrative'

describe('ExpertiseNarrative', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders the opening headline', () => {
    render(<ExpertiseNarrative />)
    expect(screen.getByText(/i don't just use tools/i)).toBeTruthy()
    expect(screen.getByText(/i build systems/i)).toBeTruthy()
  })

  it('renders all 3 subsection headings', () => {
    render(<ExpertiseNarrative />)
    expect(screen.getByText(/everything starts with getting the data right/i)).toBeTruthy()
    expect(screen.getByText(/making systems talk to each other/i)).toBeTruthy()
    expect(screen.getByText(/turning data into decisions/i)).toBeTruthy()
  })

  it('renders all 3 eyebrow labels', () => {
    render(<ExpertiseNarrative />)
    expect(screen.getByText('The Foundation')).toBeTruthy()
    expect(screen.getByText('The Connective Tissue')).toBeTruthy()
    expect(screen.getByText('The Outcome')).toBeTruthy()
  })

  it('renders unique tag badges across subsections', () => {
    render(<ExpertiseNarrative />)
    // Pick a few unique tags that should be present
    expect(screen.getByText('SQL')).toBeTruthy()
    expect(screen.getByText('Python')).toBeTruthy()
    expect(screen.getByText('Salesforce')).toBeTruthy()
    expect(screen.getByText('HubSpot')).toBeTruthy()
    expect(screen.getByText('Revenue Operations')).toBeTruthy()
  })

  it('renders the closing pull quote', () => {
    render(<ExpertiseNarrative />)
    expect(screen.getByText(/every company says they're data-driven/i)).toBeTruthy()
  })

  it('forwards a custom className to the section root', () => {
    const { container } = render(<ExpertiseNarrative className="my-narrative" />)
    expect((container.firstChild as HTMLElement).className).toContain('my-narrative')
  })
})
