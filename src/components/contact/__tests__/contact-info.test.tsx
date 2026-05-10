// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { ContactInfo } from '../contact-info'

describe('ContactInfo', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders the section heading', () => {
    render(<ContactInfo />)
    expect(screen.getByText(/connect socially/i)).toBeTruthy()
  })

  it('renders LinkedIn link with correct href + label', () => {
    render(<ContactInfo />)
    const link = screen.getByRole('link', { name: /linkedin/i })
    expect(link.getAttribute('href')).toBe('https://www.linkedin.com/in/hudsor01')
  })

  it('renders GitHub link with correct href + label', () => {
    render(<ContactInfo />)
    const link = screen.getByRole('link', { name: /github/i })
    expect(link.getAttribute('href')).toBe('https://github.com/hudsor01')
  })

  it('opens external links in a new tab with rel="noopener noreferrer"', () => {
    render(<ContactInfo />)
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(2)
    for (const link of links) {
      expect(link.getAttribute('target')).toBe('_blank')
      expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    }
  })
})
