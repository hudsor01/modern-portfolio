'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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

  const navbarClasses = 'fixed top-0 left-0 right-0 z-50 w-full bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/98 to-[#0f172a]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-blue-500/5'

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      'div',
      { className: navbarClasses },
      React.createElement(
        'div',
        { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
        React.createElement('div', { className: 'flex h-20 items-center justify-between' }, [
          // Empty left area for balanced layout
          React.createElement(
            'div',
            { className: 'flex items-center w-32', key: 'brand' }
          ),

          // Navigation items - centered with modern container
          React.createElement(
            'nav',
            {
              className: 'absolute left-1/2 -translate-x-1/2 flex items-center justify-center',
              key: 'nav',
            },
            React.createElement(
              'div',
              { className: 'bg-white/5 backdrop-blur border border-white/10 rounded-2xl px-3 py-3 shadow-lg' },
              React.createElement(
                'div',
                { className: 'flex items-center space-x-1' },
                navItems.map((item, index) =>
                  React.createElement(
                    'div',
                    { key: getRouteKey(item.href, index) },
                    React.createElement(
                      Link,
                      {
                        href: item.href,
                        className: `relative text-base font-medium transition-all duration-300 px-5 py-3 rounded-xl border ${
                          pathname === item.href
                            ? 'text-white bg-gradient-to-r from-blue-500/20 to-indigo-600/20 border-blue-400/30 shadow-lg shadow-blue-500/25'
                            : 'text-gray-300 hover:text-white hover:bg-white/10 border-transparent hover:border-white/20 hover:shadow-md'
                        }`,
                      },
                      [
                        item.label,
                        pathname === item.href &&
                          React.createElement('span', {
                            className:
                              'absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full',
                            key: 'indicator',
                          }),
                      ]
                    )
                  )
                )
              )
            )
          ),

          // Right side - contact button
          React.createElement(
            'div',
            { className: 'flex items-center w-32 justify-end', key: 'right-actions' },
            React.createElement(
              'button',
              {
                onClick: () => setIsModalOpen(true),
                className: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-base font-medium px-5 py-3 rounded-xl transition-all duration-300 border border-blue-400/20 shadow-lg shadow-blue-500/25'
              },
              "Let's Talk"
            )
          ),
        ])
      )
    ),
    React.createElement(ContactModal, {
      isOpen: isModalOpen,
      onClose: () => setIsModalOpen(false)
    })
  )
}
