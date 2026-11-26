// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react'

// Stub next/navigation before importing the component (transitive import).
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

import { Navbar } from '../navbar'
import { navConfig } from '@/lib/site'

// globals:false means RTL registers no auto-cleanup. Unmount every render and let
// queued React scheduler tasks drain before the jsdom environment is torn down;
// otherwise a late task throws "window is not defined" (flaky "Errors 1 error").
// doUnmock lives here so a failed assertion cannot leak a pathname mock.
type MediaListener = (event: { matches: boolean }) => void
const media = {
  queries: [] as string[],
  listeners: new Set<MediaListener>(),
  fire(matches: boolean) {
    for (const listener of [...media.listeners]) listener({ matches })
  },
}

beforeEach(() => {
  media.queries = []
  media.listeners = new Set()
  vi.stubGlobal('matchMedia', (query: string) => {
    media.queries.push(query)
    return {
      matches: false,
      media: query,
      addEventListener: (_type: string, listener: MediaListener) => media.listeners.add(listener),
      removeEventListener: (_type: string, listener: MediaListener) =>
        media.listeners.delete(listener),
    }
  })
})

afterEach(async () => {
  cleanup()
  vi.unstubAllGlobals()
  document.documentElement.style.overflow = ''
  vi.doUnmock('next/navigation')
  vi.resetModules()
  await new Promise((resolve) => setTimeout(resolve, 0))
})

describe('Navbar — CTA hidden on /contact', () => {
  it('does not render the "Let\'s Talk" CTA on the /contact page', async () => {
    vi.resetModules()
    vi.doMock('next/navigation', () => ({ usePathname: () => '/contact' }))
    const { Navbar: ContactNavbar } = await import('../navbar')
    const { container } = render(<ContactNavbar />)
    const ctas = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('a[href="/contact"]')
    ).filter((a) => a.textContent?.toLowerCase().includes("let's talk"))
    expect(ctas.length).toBe(0)
  })
})

describe('Navbar — header landmark and semantics', () => {
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

  it('has distinctly named navs; desktop "Main" holds the link row, mobile is "Main menu"', () => {
    const { container } = render(<Navbar />)
    const desktop = container.querySelectorAll('nav[aria-label="Main"]')
    expect(desktop.length).toBe(1)
    const list = desktop[0]?.querySelector('[data-testid="main-nav-list"]')
    expect(list).toBeTruthy()
    expect(list?.querySelectorAll('a').length).toBe(navConfig.mainNav.length)
    const mobile = container.querySelectorAll('nav[aria-label="Main menu"]')
    expect(mobile.length).toBe(1)
    expect(mobile[0]?.id).toBe('mobile-menu')
  })

  it('marks only the current page with aria-current and hides the indicator', async () => {
    vi.resetModules()
    vi.doMock('next/navigation', () => ({ usePathname: () => '/about' }))
    const { Navbar: AboutNavbar } = await import('../navbar')
    const { container } = render(<AboutNavbar />)
    const aboutLinks = container.querySelectorAll('nav a[href="/about"]')
    expect(aboutLinks.length).toBe(2)
    for (const a of aboutLinks) expect(a.getAttribute('aria-current')).toBe('page')
    const homeLinks = container.querySelectorAll('nav a[href="/"]')
    expect(homeLinks.length).toBeGreaterThan(0)
    for (const a of homeLinks) expect(a.hasAttribute('aria-current')).toBe(false)
    const indicator = container.querySelector('[data-testid="main-nav-list"] a[href="/about"] span')
    expect(indicator?.getAttribute('aria-hidden')).toBe('true')
  })

  it.each([
    ['/blog/some-post', 'Blog'],
    ['/projects/revenue-kpi', 'Projects'],
    ['/tools/pipeline-coverage-calculator', 'Tools'],
    ['/tools/revops-maturity-scorecard', 'Tools'],
  ])('marks the parent section with aria-current="true" on %s', async (route, title) => {
    vi.resetModules()
    vi.doMock('next/navigation', () => ({ usePathname: () => route }))
    const { Navbar: DetailNavbar } = await import('../navbar')
    const { container } = render(<DetailNavbar />)
    const href = navConfig.mainNav.find((i) => i.title === title)?.href
    expect(href).toBeTruthy()
    const links = container.querySelectorAll(`a[href="${href}"]`)
    expect(links.length).toBe(2)
    for (const a of links) expect(a.getAttribute('aria-current')).toBe('true')
    for (const a of container.querySelectorAll('a[href="/"]')) {
      expect(a.hasAttribute('aria-current')).toBe(false)
    }
  })

  it('marks Tools aria-current="page" on /tools', async () => {
    vi.resetModules()
    vi.doMock('next/navigation', () => ({ usePathname: () => '/tools' }))
    const { Navbar: ToolsNavbar } = await import('../navbar')
    const { container } = render(<ToolsNavbar />)
    const links = container.querySelectorAll('a[href="/tools"]')
    expect(links.length).toBe(2)
    for (const a of links) expect(a.getAttribute('aria-current')).toBe('page')
    for (const a of container.querySelectorAll('a[href="/"]')) {
      expect(a.hasAttribute('aria-current')).toBe(false)
    }
  })

  it('does not mark Tools current on /toolsx', async () => {
    vi.resetModules()
    vi.doMock('next/navigation', () => ({ usePathname: () => '/toolsx' }))
    const { Navbar: OtherNavbar } = await import('../navbar')
    const { container } = render(<OtherNavbar />)
    const links = container.querySelectorAll('a[href="/tools"]')
    expect(links.length).toBe(2)
    for (const a of links) expect(a.hasAttribute('aria-current')).toBe(false)
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
  it('renders all main desktop nav links', () => {
    render(<Navbar />)
    // Each nav item appears twice (desktop + mobile menu); use getAllByRole
    const homeLinks = screen.getAllByRole('link', { name: 'Home' })
    expect(homeLinks.length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: 'About' }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: 'Projects' }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: 'Blog' }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: 'Tools' }).length).toBeGreaterThanOrEqual(1)
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

  it('shows a scrim behind the open mobile menu that closes it (A-13)', () => {
    const { container } = render(<Navbar />)
    expect(container.querySelector('[data-testid="mobile-menu-scrim"]')).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    const scrim = container.querySelector('[data-testid="mobile-menu-scrim"]')
    expect(scrim).toBeTruthy()
    fireEvent.click(scrim as Element)
    expect(container.querySelector('#mobile-menu')?.hasAttribute('hidden')).toBe(true)
    expect(container.querySelector('[data-testid="mobile-menu-scrim"]')).toBeNull()
  })

  it('mobile menu becomes visible when toggle is clicked', () => {
    const { container } = render(<Navbar />)
    const btn = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(btn)
    const menu = container.querySelector('#mobile-menu')
    expect(menu?.hasAttribute('hidden')).toBe(false)
  })

  it('mobile menu panel is opaque: bg-card, no alpha, no backdrop blur', () => {
    const { container } = render(<Navbar />)
    const cls = container.querySelector('#mobile-menu')?.className ?? ''
    expect(cls).toMatch(/(^|\s)bg-card(\s|$)/)
    expect(cls).not.toContain('bg-card/')
    expect(cls).not.toContain('backdrop-blur')
  })
})

describe('Navbar — mobile menu dismissal', () => {
  const open = () => {
    const { container } = render(<Navbar />)
    const toggle = screen.getByRole('button', { name: 'Open menu' })
    fireEvent.click(toggle)
    return { container, toggle }
  }

  it('keeps the disclosure semantics while opening and closing', () => {
    const { container, toggle } = open()
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(toggle.getAttribute('aria-controls')).toBe('mobile-menu')
    expect(container.querySelector('#mobile-menu')?.hasAttribute('hidden')).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(container.querySelector('#mobile-menu')?.hasAttribute('hidden')).toBe(true)
  })

  it('closes on Escape and returns focus to the toggle', () => {
    const { container, toggle } = open()
    const firstLink = container.querySelector<HTMLAnchorElement>('#mobile-menu a')
    firstLink?.focus()
    expect(document.activeElement).toBe(firstLink)
    fireEvent.keyDown(document.activeElement ?? document, { key: 'Escape' })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(container.querySelector('#mobile-menu')?.hasAttribute('hidden')).toBe(true)
    expect(document.activeElement).toBe(toggle)
  })

  it('ignores other keys and Escape while the menu is closed', () => {
    const { container, toggle } = open()
    fireEvent.keyDown(document, { key: 'Enter' })
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    toggle.blur()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.activeElement).not.toBe(toggle)
    expect(container.querySelector('[data-testid="mobile-menu-scrim"]')).toBeNull()
  })

  it('closes when the scrim is clicked and removes it', () => {
    const { container, toggle } = open()
    const scrim = screen.getByTestId('mobile-menu-scrim')
    expect(scrim.getAttribute('aria-hidden')).toBe('true')
    fireEvent.click(scrim)
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(container.querySelector('[data-testid="mobile-menu-scrim"]')).toBeNull()
  })
})

describe('Navbar — mobile menu scroll lock (F-20)', () => {
  const rootOverflow = () => document.documentElement.style.overflow
  const open = () => {
    const utils = render(<Navbar />)
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    return utils
  }

  it('locks html overflow while open and not before', () => {
    render(<Navbar />)
    expect(rootOverflow()).toBe('')
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(rootOverflow()).toBe('hidden')
  })

  it('releases on the Close toggle', () => {
    open()
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(rootOverflow()).toBe('')
  })

  it('releases on Escape', () => {
    open()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(rootOverflow()).toBe('')
  })

  it('releases on scrim click', () => {
    open()
    fireEvent.click(screen.getByTestId('mobile-menu-scrim'))
    expect(rootOverflow()).toBe('')
  })

  it('releases on a mobile link click', () => {
    const { container } = open()
    const link = container.querySelector<HTMLAnchorElement>('#mobile-menu a')
    link?.addEventListener('click', (e) => e.preventDefault())
    fireEvent.click(link as HTMLAnchorElement)
    expect(rootOverflow()).toBe('')
  })

  it('releases on unmount while open', () => {
    const { unmount } = open()
    expect(rootOverflow()).toBe('hidden')
    unmount()
    expect(rootOverflow()).toBe('')
  })

  it('closes and releases on a route change', async () => {
    const nav = { pathname: '/blog' }
    vi.resetModules()
    vi.doMock('next/navigation', () => ({ usePathname: () => nav.pathname }))
    const { Navbar: RouteNavbar } = await import('../navbar')
    const { container, rerender } = render(<RouteNavbar />)
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(rootOverflow()).toBe('hidden')
    nav.pathname = '/about'
    rerender(<RouteNavbar />)
    expect(rootOverflow()).toBe('')
    expect(screen.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded')).toBe(
      'false'
    )
    expect(container.querySelector('#mobile-menu')?.hasAttribute('hidden')).toBe(true)
  })

  it('closes and releases when the viewport widens to md', () => {
    const { container } = open()
    expect(media.queries).toEqual(['(min-width: 48rem)'])
    act(() => media.fire(true))
    expect(rootOverflow()).toBe('')
    expect(container.querySelector('#mobile-menu')?.hasAttribute('hidden')).toBe(true)
  })

  it('stays open and locked when the media query stops matching', () => {
    const { container } = open()
    act(() => media.fire(false))
    expect(rootOverflow()).toBe('hidden')
    expect(container.querySelector('#mobile-menu')?.hasAttribute('hidden')).toBe(false)
  })

  it('only listens to the media query while open', () => {
    render(<Navbar />)
    expect(media.queries).toEqual([])
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(media.listeners.size).toBe(1)
    fireEvent.click(screen.getByRole('button', { name: 'Close menu' }))
    expect(media.listeners.size).toBe(0)
  })

  it('panel scrolls internally with contained overscroll', () => {
    const { container } = render(<Navbar />)
    const cls = container.querySelector('#mobile-menu')?.className ?? ''
    expect(cls).toContain('max-h-[calc(100dvh-4rem)]')
    expect(cls).toContain('overflow-y-auto')
    expect(cls).toContain('overscroll-contain')
    expect(cls).toMatch(/(^|\s)bg-card(\s|$)/)
    expect(cls).not.toContain('bg-card/')
    expect(cls).not.toContain('backdrop-blur')
  })
})
