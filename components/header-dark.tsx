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
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Return early to avoid hydration mismatch
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm dark:bg-slate-900/90 dark:border-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            <span className="z-40 text-xl font-bold">Richard Hudson</span>
            <nav className="hidden md:block"></nav>
            <div className="flex items-center md:hidden"></div>
          </div>
        </div>
      </header>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm dark:bg-slate-900/90 dark:border-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="z-40 text-xl font-bold text-gradient transition-all hover:opacity-80">
            Richard Hudson
          </Link>
          
          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-2">
            <div className="bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl px-2 py-2 flex items-center shadow-sm">
              {routes.map((route, index) => (
                <motion.div
                  key={route.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={route.path}
                    className={`relative px-4 py-2 text-sm font-medium transition-all rounded-lg ${
                      pathname === route.path 
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    {pathname === route.path && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-blue-600 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg -z-10"
                        transition={{ type: 'spring', duration: 0.5 }}
                      />
                    )}
                    {route.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="ml-2 rounded-lg border border-slate-200 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="mr-2 rounded-lg border border-slate-200 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="rounded-lg border border-slate-200 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
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
          className="bg-white/95 backdrop-blur-md border-t border-slate-200/50 shadow-sm dark:bg-slate-900/95 dark:border-slate-800/50"
        >
          <nav className="flex flex-col space-y-2 p-5 md:hidden">
            {routes.map((route, index) => (
              <motion.div
                key={route.path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link
                  href={route.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg flex items-center transition-all ${
                    pathname === route.path 
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 dark:bg-blue-600/20 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/50'
                  }`}
                >
                  {route.name}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  )
}