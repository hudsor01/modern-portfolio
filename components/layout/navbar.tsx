'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import type { NextLinkHref } from '@/types/next-types';
import { getRouteKey } from '@/lib/utils';

type NavItem = {
  label: string;
  href: NextLinkHref;
};

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll events to add background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarClasses = `sticky top-0 z-50 w-full transition-all duration-300 ${
    isScrolled
      ? 'bg-white/95 dark:bg-slate-900/95 border-slate-200/40 dark:border-slate-700/40 border-b shadow-sm backdrop-blur-md'
      : 'bg-transparent'
  }`;

  return React.createElement(
    'div', 
    { className: navbarClasses },
    React.createElement(
      'div', 
      { className: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' },
      React.createElement(
        'div', 
        { className: 'flex h-20 items-center justify-between' },
        [
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
              key: 'nav'
            },
            React.createElement(
              'div', 
              { className: 'flex items-center space-x-6 md:space-x-12' },
              navItems.map((item, index) => (
                React.createElement(
                  'div', 
                  { key: getRouteKey(item.href, index) },
                  React.createElement(
                    Link, 
                    { 
                      href: item.href,
                      className: `hover:text-blue-500 relative text-lg md:text-xl font-medium transition-colors px-3 py-3 ${
                        pathname === item.href
                          ? 'text-blue-500'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-[rgb(var(--color-eggshell))]'
                      }`
                    },
                    [
                      item.label,
                      pathname === item.href && React.createElement(
                        'span',
                        {
                          className: 'absolute -bottom-2 left-0 h-1.5 w-full bg-blue-600 rounded-full',
                          key: 'indicator'
                        }
                      )
                    ]
                  )
                )
              ))
            )
          ),

          // Right spacer
          React.createElement(
            'div', 
            { className: 'hidden md:block w-4', key: 'right-spacer' }
          ),

          // Hidden spacer (replacing mobile menu)
          React.createElement(
            'div', 
            { className: 'w-4', key: 'right-mobile-spacer' }
          )
        ]
      )
    )
  );
}
