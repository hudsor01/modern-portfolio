// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

// Stub next/navigation before importing the component (transitive import).
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

import { Navbar } from '../navbar'

describe('Navbar', () => {
  beforeEach(() => {
    cleanup()
  })

  it('renders all main desktop nav links', () => {
    render(<Navbar />)
    // Each nav item appears twice (desktop + mobile menu); use getAllByRole
    const homeLinks = screen.getAllByRole('link', { name: 'Home' })
    expect(homeLinks.length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: 'About' }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: 'Projects' }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: 'Blog' }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: 'Resume' }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: 'Contact' }).length).toBeGreaterThanOrEqual(1)
  })

  it('renders the "Let\'s Talk" CTA pointing to /contact', () => {
    const { container } = render(<Navbar />)
    // The mobile menu CTA lives inside a `hidden` container, so accessible-name
    // role queries skip it. Inspect the DOM directly to find CTAs by text.
    const ctas = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[href="/contact"]')
    ).filter((a) => a.textContent?.toLowerCase().includes("let's talk"))
    expect(ctas.length).toBe(2)
    for (const cta of ctas) {
      expect(cta.getAttribute('href')).toBe('/contact')
    }
  })

  it('mobile menu button starts with aria-expanded=false and accessible name "Open menu"', () => {
    render(<Navbar />)
    const btn = screen.getByRole('button', { name: 'Open menu' })
    expect(btn.getAttribute('aria-expanded')).toBe('false')
    expect(btn.getAttribute('aria-controls')).toBe('mobile-menu')
  })

  it('clicking the mobile menu button flips aria-expanded and accessible name', () => {
    render(<Navbar />)
    const btn = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(btn)
    // After click, the button is now the "Close menu" button
    expect(btn.getAttribute('aria-expanded')).toBe('true')
    expect(btn.getAttribute('aria-label')).toBe('Close menu')
    fireEvent.click(btn)
    expect(btn.getAttribute('aria-expanded')).toBe('false')
    expect(btn.getAttribute('aria-label')).toBe('Open menu')
  })

  it('mobile menu container is hidden initially', () => {
    const { container } = render(<Navbar />)
    const menu = container.querySelector('#mobile-menu')
    expect(menu).toBeTruthy()
    // The `hidden` HTML attribute is present when collapsed
    expect(menu?.hasAttribute('hidden')).toBe(true)
  })

  it('mobile menu becomes visible when toggle is clicked', () => {
    const { container } = render(<Navbar />)
    const btn = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(btn)
    const menu = container.querySelector('#mobile-menu')
    expect(menu?.hasAttribute('hidden')).toBe(false)
  })
})
