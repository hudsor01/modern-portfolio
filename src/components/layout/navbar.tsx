'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import type { NextLinkHref } from '@/types/next-types'
import { getRouteKey } from '@/lib/utils'
import { ContactModal } from '@/components/layout/contact-modal'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navbarClasses = 'fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/98 to-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-primary/5'

  return (
    <>
      <div className={navbarClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Empty left area for balanced layout on desktop */}
            <div className="flex items-center w-32 md:block hidden" />

            {/* Desktop Navigation - centered */}
            <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
              <div className="glass rounded-2xl px-3 py-3 shadow-lg">
                <div className="flex items-center space-x-1">
                  {navItems.map((item, index) => (
                    <Link
                      key={getRouteKey(item.href, index)}
                      href={item.href}
                      className={`relative text-base font-medium transition-all duration-300 px-5 py-3 rounded-xl border ${
                        pathname === item.href
                          ? 'text-white bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-primary/30 shadow-lg shadow-cyan-500/25'
                          : 'text-muted-foreground hover:text-white hover:bg-white/10 border-transparent hover:border-white/20 hover:shadow-md'
                      }`}
                    >
                      <div className="relative">
                        {item.label}
                        {pathname === item.href && (
                          <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
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
                className="p-3 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>

            {/* Desktop CTA button */}
            <div className="hidden md:flex items-center w-32 justify-end">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black text-base font-medium px-5 py-3 rounded-xl transition-all duration-300 border border-primary/20 shadow-lg shadow-cyan-500/25"
              >
                Let's Talk
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-20 left-0 right-0 bg-[#0f172a]/98 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-primary/5">
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item, index) => (
                  <Link
                    key={getRouteKey(item.href, index)}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-left px-4 py-4 rounded-xl border transition-all duration-300 text-base font-medium min-h-[44px] flex items-center ${
                      pathname === item.href
                        ? 'text-white bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-primary/30 shadow-lg shadow-cyan-500/25'
                        : 'text-muted-foreground hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    setIsModalOpen(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black text-base font-medium px-4 py-4 rounded-xl transition-all duration-300 border border-primary/20 shadow-lg shadow-cyan-500/25 min-h-[44px] flex items-center justify-center"
                >
                  Let's Talk
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
