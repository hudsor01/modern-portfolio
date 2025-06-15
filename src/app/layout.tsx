import './globals.css'
import '@/styles/animations.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ClientComponentsProvider } from '@/components/providers/client-components-provider'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { ScrollProgress } from '@/components/ui/scroll-progress'
import { ScrollToTop } from '@/components/ui/scroll-to-top'
import { baseMetadata } from './shared-metadata'
import { PersonJsonLd, WebsiteJsonLd } from '@/components/seo/json-ld'
import Script from 'next/script'

// Use single font family for better performance
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = baseMetadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1a1a1a" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* Google Analytics tag */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-GDQKSTQVJF" />
        <Script id="gtag-init">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GDQKSTQVJF');
          `}
        </Script>
        <PersonJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ClientComponentsProvider>
            <ScrollProgress />
            {children}
            <ScrollToTop />
            <Toaster position="bottom-right" closeButton richColors />
            <SpeedInsights />
            <Analytics />
          </ClientComponentsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
