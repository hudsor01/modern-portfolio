// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

// Stub next/navigation before importing the component (transitive import).
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

import { Navbar } from '../navbar'
import { navConfig } from '@/lib/site'

describe('Navbar — CTA hidden on /contact', () => {
  beforeEach(() => {
    cleanup()
    vi.resetModules()
  })

  it('does not render the "Let\'s Talk" CTA on the /contact page', async () => {
    vi.doMock('next/navigation', () => ({ usePathname: () => '/contact' }))
    const { Navbar: ContactNavbar } = await import('../navbar')
    const { container } = render(<ContactNavbar />)
    const ctas = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[href="/contact"]')
    ).filter((a) => a.textContent?.toLowerCase().includes("let's talk"))
    expect(ctas.length).toBe(0)
    vi.doUnmock('next/navigation')
  })
})

describe('Navbar — header landmark and semantics', () => {
  beforeEach(() => {
    cleanup()
    vi.resetModules()
  })

  it('root element is a header', () => {
    const { container } = render(<Navbar />)
    expect(container.firstElementChild?.tagName).toBe('HEADER')
  })

  it('renders the Richard Hudson wordmark linking to /', () => {
    render(<Navbar />)
    const link = screen.getByRole('link', { name: 'Richard Hudson' })
    expect(link.getAttribute('href')).toBe('/')
    expect(link.hasAttribute('aria-current')).toBe(false)
    for (const c of ['font-display', 'text-xl', 'font-semibold', 'whitespace-nowrap']) {
      expect(link.classList.contains(c)).toBe(true)
    }
  })

  it('has two Main navs; desktop one holds the link row', () => {
    const { container } = render(<Navbar />)
    const navs = container.querySelectorAll('nav[aria-label="Main"]')
    expect(navs.length).toBe(2)
    const list = navs[0].querySelector('[data-testid="main-nav-list"]')
    expect(list).toBeTruthy()
    expect(list?.querySelectorAll('a').length).toBe(navConfig.mainNav.length)
    expect(navs[1].id).toBe('mobile-menu')
  })

  it('marks only the current page with aria-current and hides the indicator', async () => {
    vi.doMock('next/navigation', () => ({ usePathname: () => '/about' }))
    const { Navbar: AboutNavbar } = await import('../navbar')
    const { container } = render(<AboutNavbar />)
    const aboutLinks = container.querySelectorAll('nav[aria-label="Main"] a[href="/about"]')
    expect(aboutLinks.length).toBe(2)
    for (const a of aboutLinks) expect(a.getAttribute('aria-current')).toBe('page')
    const homeLinks = container.querySelectorAll('nav[aria-label="Main"] a[href="/"]')
    expect(homeLinks.length).toBeGreaterThan(0)
    for (const a of homeLinks) expect(a.hasAttribute('aria-current')).toBe(false)
    const indicator = container.querySelector('[data-testid="main-nav-list"] a[href="/about"] span')
    expect(indicator?.getAttribute('aria-hidden')).toBe('true')
    vi.doUnmock('next/navigation')
  })

  it('desktop links use md/lg sizing and no weight class; no w-32 or absolute centring', () => {
    const { container } = render(<Navbar />)
    const links = container.querySelectorAll('[data-testid="main-nav-list"] a')
    for (const a of links) {
      for (const c of ['text-sm', 'px-2', 'lg:text-base', 'lg:px-4']) {
        expect(a.classList.contains(c)).toBe(true)
      }
      expect(a.className).not.toMatch(/font-(medium|semibold|bold|normal)/)
    }
    expect(container.querySelector('.w-32')).toBeNull()
    const desktopNav = container.querySelector('nav[aria-label="Main"]')
    expect(desktopNav?.classList.contains('absolute')).toBe(false)
    expect(desktopNav?.classList.contains('left-1/2')).toBe(false)
  })
})

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
