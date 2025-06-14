'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { NextLinkHref } from '@/types/next-types'
import { getRouteKey } from '@/lib/utils'

type NavItem = {
  label: string
  href: NextLinkHref
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()

  const navbarClasses = 'relative z-50 w-full bg-white/5 backdrop-blur-md border-b border-white/10 shadow-lg'

  return React.createElement(
    'div',
    { className: navbarClasses },
    React.createElement(
      'div',
      { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      React.createElement('div', { className: 'flex h-20 items-center justify-between' }, [
        // Left spacer
        React.createElement(
          'div',
          { className: 'flex', key: 'left-spacer' },
          React.createElement('div', { className: 'w-4' })
        ),

        // Navigation items
        React.createElement(
          'nav',
          {
            className: 'absolute left-1/2 -translate-x-1/2 flex items-center justify-center',
            key: 'nav',
          },
          React.createElement(
            'div',
            { className: 'flex items-center space-x-6 md:space-x-12' },
            navItems.map((item, index) =>
              React.createElement(
                'div',
                { key: getRouteKey(item.href, index) },
                React.createElement(
                  Link,
                  {
                    href: item.href,
                    className: `relative text-lg md:text-xl font-medium transition-all duration-300 px-4 py-3 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/20 ${
                      pathname === item.href
                        ? 'text-blue-400 bg-white/10 border-white/20 shadow-lg'
                        : 'text-white hover:text-blue-300'
                    }`,
                  },
                  [
                    item.label,
                    pathname === item.href &&
                      React.createElement('span', {
                        className:
                          'absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-lg shadow-blue-400/50',
                        key: 'indicator',
                      }),
                  ]
                )
              )
            )
          )
        ),

        // Right spacer
        React.createElement('div', { className: 'hidden md:block w-4', key: 'right-spacer' }),

        // Hidden spacer (replacing mobile menu)
        React.createElement('div', { className: 'w-4', key: 'right-mobile-spacer' }),
      ])
    )
  )
}
