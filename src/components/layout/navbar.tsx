'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import type { NextLinkHref } from '@/types/next-types'
import { getRouteKey } from '@/lib/utils'
import { ContactModal } from '@/components/ui/contact-modal'

type NavItem = {
  label: string
  href: NextLinkHref
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navbarClasses = 'fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/98 to-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-blue-500/5'

  return (
    <>
      <div className={navbarClasses}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Empty left area for balanced layout on desktop */}
            <div className="flex items-center w-32 md:block hidden" />

            {/* Desktop Navigation - centered */}
            <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl px-3 py-3 shadow-lg">
                <div className="flex items-center space-x-1">
                  {navItems.map((item, index) => (
                    <Link
                      key={getRouteKey(item.href, index)}
                      href={item.href}
                      className={`relative text-base font-medium transition-all duration-300 px-5 py-3 rounded-xl border ${
                        pathname === item.href
                          ? 'text-white bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border-blue-400/30 shadow-lg shadow-blue-500/25'
                          : 'text-gray-300 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20 hover:shadow-md'
                      }`}
                    >
                      {item.label}
                      {pathname === item.href && (
                        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full" />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Desktop CTA button */}
            <div className="hidden md:flex items-center w-32 justify-end">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-base font-medium px-5 py-3 rounded-xl transition-all duration-300 border border-blue-400/20 shadow-lg shadow-blue-500/25"
              >
                Let's Talk
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-20 left-0 right-0 bg-[#0f172a]/98 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-blue-500/5">
              <div className="px-4 py-6 space-y-4">
                {navItems.map((item, index) => (
                  <Link
                    key={getRouteKey(item.href, index)}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block w-full text-left px-4 py-3 rounded-xl border transition-all duration-300 ${
                      pathname === item.href
                        ? 'text-white bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border-blue-400/30 shadow-lg shadow-blue-500/25'
                        : 'text-gray-300 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20'
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
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-base font-medium px-4 py-3 rounded-xl transition-all duration-300 border border-blue-400/20 shadow-lg shadow-blue-500/25"
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
