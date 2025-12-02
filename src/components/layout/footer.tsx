'use client'

import { usePathname } from 'next/navigation'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  
  // Only show footer on specific pages
  const showFooter = pathname === '/about' || 
                    pathname === '/contact' || 
                    pathname === '/projects' ||
                    pathname.startsWith('/projects/') ||
                    pathname === '/resume'

  if (!showFooter) return null

  return (
    <footer className="bg-[#0f172a] text-foreground border-t border-white/10 py-3">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© {currentYear} Richard Hudson. All rights reserved.</p>
          <a href="https://hudsondigitalsolutions.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            Built by Hudson Digital Solutions
          </a>
        </div>
      </div>
    </footer>
  )
}