import React from 'react'
// Metadata is imported from './metadata.ts'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/toaster'
import { WebVitals } from '@/components/web-vitals'
import './globals.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Import metadata from separate file
import './metadata'

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange>
					<WebVitals />
					<Toaster />
					<div className='relative flex min-h-screen flex-col'>
						<Header />
						<main className='flex-1 pt-16'>{children}</main>
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	)
}
