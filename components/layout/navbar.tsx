'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileDrawer } from '@/components/mobile-drawer';
import { ContactDialog } from '@/components/contact-dialog';
import type { Route } from 'next';
import type { NextLinkHref } from '@/types/next-types';
import { getRouteKey } from '@/lib/utils';

type NavItem = {
  label: string;
  href: NextLinkHref;
};

const navItems: NavItem[] = [
  { label: 'Home', href: '/' as Route<string> },
  { label: 'About', href: '/about' as Route<string> },
  { label: 'Projects', href: '/projects' as Route<string> },
  { label: 'Resume', href: '/resume' as Route<string> },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const pathname = usePathname();

  // Handle scroll events to add background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-slate-900/95 border-slate-200/40 dark:border-slate-700/40 border-b shadow-sm backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div
              className="flex"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={'/' as Route<string>}
                className="text-xl font-bold tracking-tight text-[rgb(var(--color-pewter-blue))] hover:text-[rgb(var(--color-pewter-blue))]-dark transition-colors"
              >
                Richard Hudson
              </Link>
            </motion.div>

            {/* Desktop Navigation - Centered with improved styling */}
            <nav className="hidden absolute left-1/2 -translate-x-1/2 md:flex items-center justify-center">
              <div className="flex items-center space-x-8">
                {navItems.map((item, index) => (
                  <motion.div
                    key={getRouteKey(item.href, index)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link
                      href={item.href}
                      className={`hover:text-[rgb(var(--color-pewter-blue))] relative text-sm font-medium transition-colors px-1 py-1 ${
                        pathname === item.href
                          ? 'text-[rgb(var(--color-pewter-blue))]'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-[rgb(var(--color-eggshell))]'
                      }`}
                    >
                      {item.label}
                      {pathname === item.href && (
                        <motion.span
                          className="absolute -bottom-1 left-0 h-0.5 w-full bg-[rgb(var(--color-pewter-blue))]"
                          layoutId="navbar-indicator"
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>

            {/* Contact Button with improved animation */}
            <motion.div
              className="hidden md:block"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="sm"
                className="bg-[rgb(var(--color-pewter-blue))] hover:bg-[rgb(var(--color-pewter-blue))]-dark text-[rgb(var(--color-eggshell))] gap-2 px-4 py-2 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                onClick={() => setContactDialogOpen(true)}
              >
                <Send className="h-4 w-4" />
                Contact
              </Button>
            </motion.div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <MobileDrawer />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Contact Dialog */}
      <ContactDialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)} />
    </>
  );
}
