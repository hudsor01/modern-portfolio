'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'

const routes = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Resume', path: '/resume' },
  { name: 'Contact', path: '/contact' },
]

export function HeaderDark() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      isScrolled 
        ? theme === 'dark' 
          ? 'bg-gray-900/90 backdrop-blur-md border-b border-gray-800' 
          : 'bg-white/90 backdrop-blur-md border-b border-gray-200'
        : theme === 'dark'
          ? 'bg-transparent'
          : 'bg-white'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className={`z-40 text-xl font-bold ${
            theme === 'dark' 
              ? 'text-white hover:text-[#0070f3]' 
              : 'text-gray-900 hover:text-[#0070f3]'
          } transition-colors`}>
            Richard Hudson
          </Link>
          
          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-1">
            <div className={`${
              theme === 'dark' 
                ? 'bg-[#1a1a1a]' 
                : 'bg-gray-100'
            } backdrop-blur-sm rounded-full px-1 py-1 flex items-center`}>
              {routes.map((route, index) => (
                <motion.div
                  key={route.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={route.path}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                      pathname === route.path 
                        ? theme === 'dark' ? 'text-white' : 'text-gray-900'
                        : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {pathname === route.path && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-[#0070f3] rounded-full -z-10"
                        transition={{ type: 'spring', duration: 0.6 }}
                      />
                    )}
                    {route.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className={`ml-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className={`mr-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className={theme === 'dark' ? 'text-white' : 'text-gray-900'}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className={theme === 'dark' ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-200'}
        >
          <nav className="flex flex-col space-y-3 p-4 md:hidden">
            {routes.map(route => (
              <Link
                key={route.path}
                href={route.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  pathname === route.path 
                    ? theme === 'dark'
                      ? 'bg-[#0070f3]/10 text-[#0070f3]'
                      : 'bg-[#0070f3]/10 text-[#0070f3]'
                    : theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {route.name}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  )
}