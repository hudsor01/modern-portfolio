import '@/app/globals.css'
import type { Metadata, Viewport } from 'next'
import { Roboto } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'react-hot-toast'
import { HeaderDark } from '@/components/header-dark'
import { Footer } from '@/components/layout/footer'
import PageTransition from '@/components/page-transition'
import ScrollToTop from '@/components/scroll-to-top'

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400', '500', '700', '900']
})

export const metadata: Metadata = {
  title: {
    default: 'Richard Hudson | Revenue Operations Professional',
    template: '%s | Richard Hudson'
  },
  description: 'Revenue Operations Professional with expertise in data-driven forecasting, process optimization, and cross-functional collaboration.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0c0c1f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans min-h-screen flex flex-col overflow-x-hidden`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <HeaderDark />
          <main className="flex-grow">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
          <Footer />
          <Toaster position="bottom-right" />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
