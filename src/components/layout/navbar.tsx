'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { asRoute, getRouteKey } from '@/lib/route-utils'
import { navConfig } from '@/lib/site'

// Single source of truth: navConfig.mainNav. Also consumed by
// navigation-json-ld.tsx (SEO) — keeping one list prevents the two drifting.
const navItems = navConfig.mainNav

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navbarClasses =
    'fixed top-0 left-0 right-0 z-50 w-full bg-card/95 backdrop-blur-sm border-b border-border shadow-sm'

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
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={getRouteKey(item.href, index)}
                      href={asRoute(item.href)}
                      aria-current={isActive ? 'page' : undefined}
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
                href="/contact"
                className="hidden md:inline-flex items-center bg-primary text-primary-foreground text-sm px-4 py-2 rounded-lg transition-all duration-300 ease-out shadow-sm hover:bg-primary/95 hover:shadow-md"
              >
                Let's Talk
              </Link>
            )}
            {/* Mobile menu button */}
            <button
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
        <nav
          id="mobile-menu"
          aria-label="Main"
          hidden={!isMobileMenuOpen}
          className="md:hidden absolute top-16 left-0 right-0 bg-card/98 backdrop-blur-sm border-b border-border shadow-md"
        >
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={getRouteKey(item.href, index)}
                href={asRoute(item.href)}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={pathname === item.href ? 'page' : undefined}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ease-out text-base min-h-[44px] flex items-center ${
                  pathname === item.href
                    ? 'text-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.title}
              </Link>
            ))}
            {pathname !== '/contact' && (
              <Link
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
