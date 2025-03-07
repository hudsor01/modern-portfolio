'use client'

import './globals.css'
import { usePathname } from 'next/navigation'
import { fontSans, fontSerif, fontMono } from './fonts'
import { Toaster } from 'react-hot-toast'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/layout/navbar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Determine if we're on the homepage
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  return (
    <html lang="en" className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`}>
      <body className="modern-portfolio relative min-h-screen overflow-auto">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* Only show Navbar on non-homepage routes */}
          {!isHomePage && <Navbar />}
          
          {children}
          
          {/* Toast notifications */}
          <Toaster position="bottom-right" />
          
          {/* Analytics */}
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}