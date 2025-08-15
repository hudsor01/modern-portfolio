'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/lib/config/site'
import { Github, Linkedin, Mail, Menu } from 'lucide-react'
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

export function MobileDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close drawer when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return React.createElement(React.Fragment, null, [
    // Menu button
    React.createElement(
      Button,
      {
        variant: 'ghost',
        size: 'icon',
        'aria-label': 'Menu',
        onClick: () => setIsOpen(true),
        className:
          'md:hidden hover:bg-[rgb(var(--color-pewter-blue))]/10 dark:hover:bg-slate-800/50 text-[rgb(var(--color-pewter-blue))]',
        key: 'menu-button',
      },
      React.createElement(Menu, { className: 'h-6 w-6' })
    ),

    // Drawer
    React.createElement(
      Drawer,
      {
        open: isOpen,
        onOpenChange: setIsOpen,
        key: 'drawer',
      },
      React.createElement(
        DrawerContent,
        {
          className: 'rounded-t-xl border-t-4 border-[rgb(var(--color-pewter-blue))]',
        },
        [
          // Header
          React.createElement(
            DrawerHeader,
            {
              className: 'border-b border-slate-100 dark:border-slate-800',
              key: 'drawer-header',
            },
            React.createElement(
              DrawerTitle,
              {
                className: 'text-[rgb(var(--color-pewter-blue))] font-bold text-xl',
              },
              'Richard Hudson'
            )
          ),

          // Navigation
          React.createElement(
            'div',
            {
              className: 'flex flex-col p-6 pt-4',
              key: 'drawer-body',
            },
            React.createElement(
              'nav',
              {
                className: 'grid gap-3',
              },
              navItems.map((item, index) =>
                React.createElement(
                  'div',
                  {
                    key: getRouteKey(item.href, index),
                  },
                  React.createElement(
                    Link,
                    {
                      href: item.href,
                      className: `flex items-center rounded-lg px-4 py-3 text-lg transition-colors relative overflow-hidden ${
                        pathname === item.href
                          ? 'bg-[rgb(var(--color-pewter-blue))]/10 text-[rgb(var(--color-pewter-blue))] font-medium'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                      }`,
                    },
                    [
                      item.label,
                      pathname === item.href &&
                        React.createElement('span', {
                          className:
                            'bg-[rgb(var(--color-pewter-blue))] absolute left-0 h-full w-1 rounded-r-md',
                          key: 'indicator',
                        }),
                    ]
                  )
                )
              )
            )
          ),

          // Footer
          React.createElement(
            DrawerFooter,
            {
              className: 'border-t border-slate-100 dark:border-slate-800 pt-4 pb-8',
              key: 'drawer-footer',
            },
            [
              React.createElement(
                'div',
                {
                  className: 'flex justify-center space-x-6',
                  key: 'social-links',
                },
                [
                  React.createElement(
                    'a',
                    {
                      href: siteConfig.links.github,
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      className:
                        'text-slate-600 dark:text-slate-400 hover:text-[rgb(var(--color-pewter-blue))] transition-colors',
                      'aria-label': 'GitHub',
                      key: 'github',
                    },
                    React.createElement(Github, { className: 'h-5 w-5' })
                  ),
                  React.createElement(
                    'a',
                    {
                      href: siteConfig.links.linkedin,
                      target: '_blank',
                      rel: 'noopener noreferrer',
                      className:
                        'text-slate-600 dark:text-slate-400 hover:text-[rgb(var(--color-pewter-blue))] transition-colors',
                      'aria-label': 'LinkedIn',
                      key: 'linkedin',
                    },
                    React.createElement(Linkedin, { className: 'h-5 w-5' })
                  ),
                  React.createElement(
                    'a',
                    {
                      href: `mailto:${siteConfig.author.email}`,
                      className:
                        'text-slate-600 dark:text-slate-400 hover:text-[rgb(var(--color-pewter-blue))] transition-colors',
                      'aria-label': 'Email',
                      key: 'email',
                    },
                    React.createElement(Mail, { className: 'h-5 w-5' })
                  ),
                ]
              ),
              React.createElement(
                'p',
                {
                  className: 'text-slate-500 dark:text-slate-400 mt-6 text-center text-sm',
                  key: 'copyright',
                },
                `© ${new Date().getFullYear()} Richard Hudson`
              ),
            ]
          ),
        ]
      )
    ),
  ])
}
