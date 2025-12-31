'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import type { NextLinkHref } from '@/types/next-types'
import { getRouteKey } from '@/lib/utils'

type NavItem = {
  label: string
  href: NextLinkHref
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navbarClasses = 'fixed top-0 left-0 right-0 z-50 w-full bg-card/95 backdrop-blur-sm border-b border-border shadow-sm'

  return (
    <>
      <div className={navbarClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Empty left area for balanced layout on desktop */}
            <div className="flex items-center w-32 md:block hidden" />

            {/* Desktop Navigation - centered */}
            <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
              <div className="bg-card rounded-xl px-2 py-2 shadow-sm border border-border">
                <div className="flex items-center space-x-1">
                  {navItems.map((item, index) => (
                    <Link
                      key={getRouteKey(item.href, index)}
                      href={item.href}
                      className={`relative text-base font-medium transition-all duration-300 px-4 py-2 rounded-lg ${
                        pathname === item.href
                          ? 'text-primary bg-primary/5'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <div className="relative">
                        {item.label}
                        {pathname === item.href && (
                          <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-5 bg-primary rounded-full" />
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            {/* Desktop CTA button */}
            <div className="hidden md:flex items-center w-32 justify-end">
              <Link
                href="/contact"
                className="bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:bg-primary/95 hover:shadow-md"
              >
                Let's Talk
              </Link>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-card/98 backdrop-blur-sm border-b border-border shadow-md">
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item, index) => (
                  <Link
                    key={getRouteKey(item.href, index)}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-300 text-base font-medium min-h-[44px] flex items-center ${
                      pathname === item.href
                        ? 'text-primary bg-primary/5'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full bg-primary text-primary-foreground text-base font-medium px-4 py-3 rounded-lg transition-all duration-300 shadow-sm hover:bg-primary/95 min-h-[44px] flex items-center justify-center"
                >
                  Let's Talk
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
