import React from 'react'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/toaster'
import { siteConfig } from '@/lib/config/site'
import './globals.css'

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: {
		icon: '/favicon.ico',
	},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange>
					<Toaster />
					<div className='relative flex min-h-screen flex-col'>
						<Navbar />
						<main className='flex-1 pt-16'>{children}</main>
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	)
}
