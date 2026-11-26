'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { asRoute, getRouteKey } from '@/lib/route-utils'
import { navConfig } from '@/lib/site'
import { useScrollLock } from '@/hooks/use-scroll-lock'

// Single source of truth: navConfig.mainNav. Also consumed by
// navigation-json-ld.tsx (SEO) — keeping one list prevents the two drifting.
const navItems = navConfig.mainNav

// 'page' for the exact route, 'true' for a parent section of the current route
// (/blog/<slug> -> Blog, /projects/<slug> -> Projects). Home only matches exactly.
function currentState(pathname: string | null, href: string): 'page' | 'true' | undefined {
  if (pathname === href) return 'page'
  if (pathname && href !== '/' && pathname.startsWith(`${href}/`)) return 'true'
  return undefined
}

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // A route change (link, browser back/forward) closes the menu. Adjusting state
  // during render, keyed on the previous pathname, so navigating away and back
  // never reopens it and no effect has to set state.
  const [lastPathname, setLastPathname] = useState(pathname)
  if (lastPathname !== pathname) {
    setLastPathname(pathname)
    setIsMobileMenuOpen(false)
  }

  // Escape closes the open menu and hands focus back to the toggle that opened it.
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsMobileMenuOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isMobileMenuOpen])

  // Widening to the desktop layout hides the mobile panel, so the menu must close
  // and release the scroll lock. 48rem is Tailwind's md; rem in media queries uses
  // the 16px initial font size, so this is 768px despite the 0.875rem html size.
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const mq = window.matchMedia('(min-width: 48rem)')
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsMobileMenuOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [isMobileMenuOpen])

  useScrollLock(isMobileMenuOpen)

  const navbarClasses =
    'fixed top-0 left-0 right-0 z-50 w-full bg-card/95 backdrop-blur-sm border-b border-border shadow-sm print:hidden'

  return (
    <header className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          {/* Wordmark */}
          <Link
            href="/"
            className="justify-self-start whitespace-nowrap font-display text-xl font-semibold text-foreground hover:text-primary"
          >
            Richard Hudson
          </Link>

          {/* Desktop Navigation - centred */}
          <nav aria-label="Main" className="hidden md:flex justify-self-center items-center">
            <div className="bg-card rounded-xl px-2 py-2 shadow-sm border border-border">
              <div data-testid="main-nav-list" className="flex items-center space-x-1">
                {navItems.map((item, index) => {
                  const current = currentState(pathname, item.href)
                  const isActive = current !== undefined
                  return (
                    <Link
                      key={getRouteKey(item.href, index)}
                      href={asRoute(item.href)}
                      aria-current={current}
                      className={`relative text-sm px-2 lg:text-base lg:px-4 transition-all duration-300 ease-out py-2 rounded-lg ${
                        isActive
                          ? 'text-primary bg-primary/5'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="relative">
                        {item.title}
                        {isActive && (
                          <span
                            aria-hidden="true"
                            className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-5 bg-primary rounded-full"
                          />
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </nav>

          <div className="flex items-center justify-end justify-self-end">
            {/* Desktop CTA button — hidden on /contact (already there) */}
            {pathname !== '/contact' && (
              <Link
                data-track="CTA Click"
                data-track-location="nav"
                href="/contact"
                className="hidden md:inline-flex items-center bg-primary text-primary-foreground text-sm px-4 py-2 rounded-lg transition-all duration-300 ease-out shadow-sm hover:bg-primary/95 hover:shadow-md"
              >
                Let's Talk
              </Link>
            )}
            {/* Mobile menu button */}
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="md:hidden p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu — always rendered so the hamburger
            button's `aria-controls="mobile-menu"` always references a
            valid IDREF (WAI-ARIA disclosure pattern). The native `hidden`
            attribute removes it from layout, the a11y tree, and tab
            order when collapsed. */}
        {isMobileMenuOpen && (
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            data-testid="mobile-menu-scrim"
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden absolute inset-x-0 top-16 h-dvh -z-10 cursor-default bg-foreground/40"
          />
        )}
        <nav
          id="mobile-menu"
          aria-label="Main menu"
          hidden={!isMobileMenuOpen}
          className="md:hidden absolute top-16 left-0 right-0 bg-card border-b border-border shadow-lg max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain"
        >
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item, index) => {
              const current = currentState(pathname, item.href)
              return (
                <Link
                  key={getRouteKey(item.href, index)}
                  href={asRoute(item.href)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-current={current}
                  className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ease-out text-base min-h-[44px] flex items-center ${
                    current
                      ? 'text-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.title}
                </Link>
              )
            })}
            {pathname !== '/contact' && (
              <Link
                data-track="CTA Click"
                data-track-location="nav-mobile"
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full bg-primary text-primary-foreground text-base px-4 py-3 rounded-lg transition-all duration-300 ease-out shadow-sm hover:bg-primary/95 min-h-[44px] flex items-center justify-center"
              >
                Let's Talk
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
