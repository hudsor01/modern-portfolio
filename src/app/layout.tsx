import React from 'react'
import './globals.css'
import '@/styles/animations.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ClientComponentsProvider } from '@/components/providers/client-components-provider'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { EnhancedReadingProgress } from '@/components/ui/enhanced-reading-progress'
import { ScrollToTop } from '@/components/ui/scroll-to-top'
import { baseMetadata } from './shared-metadata'
import { PersonJsonLd, WebsiteJsonLd, LocalBusinessJsonLd } from '@/components/seo/json-ld'
import { PreloadManager } from '@/components/performance/preload-manager'

// Use single font family for better performance
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = baseMetadata

const RootLayout = React.memo(function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <PersonJsonLd />
        <WebsiteJsonLd />
        <LocalBusinessJsonLd />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientComponentsProvider>
            <PreloadManager />
            <EnhancedReadingProgress 
              height={3}
              showThreshold={1}
              hideThreshold={99}
              contentPagesOnly={true}
            />
            {children}
            <ScrollToTop />
            <Toaster position="bottom-right" closeButton richColors />
            <Analytics />
          </ClientComponentsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
})

export default RootLayout
