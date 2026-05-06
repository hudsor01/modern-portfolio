import type React from 'react'
import './globals.css'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { Playfair_Display, Spline_Sans, Roboto_Mono } from 'next/font/google'
import { ClientComponentsProvider } from '@/components/providers/client-components-provider'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from '@/components/ui/toaster'
import { ScrollToTop } from '@/components/layout/scroll-to-top'
import { Footer } from '@/components/layout/footer'
import { baseMetadata } from './shared-metadata'
import { PersonJsonLd } from '@/components/seo/json-ld/person-json-ld'
import { WebsiteJsonLd } from '@/components/seo/json-ld/website-json-ld'
import { NavigationJsonLd } from '@/components/seo/json-ld/navigation-json-ld'
import { ReadingProgressBar } from './reading-progress'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

// Luxury Minimalist Typography System
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
})

const splineSans = Spline_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-spline',
  weight: ['300', '400', '500', '600', '700'],
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
  weight: ['400', '500'],
})

export const metadata: Metadata = baseMetadata

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get('x-nonce')

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${splineSans.variable} ${robotoMono.variable}`}
    >
      <head>
        {/* viewport / themeColor / colorScheme set via Next.js viewport API in src/app/viewport.ts */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Feed discovery */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Richard Hudson — Revenue Operations Blog"
          href="/api/blog/rss"
        />

        {/* Preconnect hints for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://api.vercel.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-analytics.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />

        {/* Structured Data */}
        <PersonJsonLd nonce={nonce} />
        <WebsiteJsonLd nonce={nonce} />
        <NavigationJsonLd nonce={nonce} />
      </head>
      <body className="antialiased bg-background text-foreground">
        {/* Skip to main content link for keyboard navigation accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
        >
          Skip to content
        </a>
        <NuqsAdapter>
          <ClientComponentsProvider>
            <ReadingProgressBar />
            {children}
            <Footer />
            <ScrollToTop />
            <Toaster position="bottom-right" closeButton richColors />
            <Analytics />
            <SpeedInsights />
          </ClientComponentsProvider>
        </NuqsAdapter>
      </body>
    </html>
  )
}
