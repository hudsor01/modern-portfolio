import React from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/toaster'
import { WebVitals } from '@/components/web-vitals'
import './globals.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Analytics } from '@vercel/analytics/react'
import { DefaultSeo } from 'next-seo'
import { Inter } from 'next/font/google'
// Note: If './metadata' is a separate file, keep this import
import './metadata'

const inter = Inter({ subsets: ['latin'] })

// Base website information
const SITE_NAME = 'Richard Hudson | Full Stack Developer'
const SITE_DESCRIPTION =
	'Portfolio showcasing my expertise in React, Next.js, TypeScript, and modern web technologies with examples of responsive, accessible, and performant applications.'
const SITE_URL = 'https://richardhudson.dev' // Your URL preserved

// SEO configuration
const DEFAULT_SEO_CONFIG = {
	title: SITE_NAME,
	description: SITE_DESCRIPTION,
	canonical: SITE_URL,
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: SITE_URL,
		siteName: SITE_NAME,
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
		images: [
			{
				url: `${SITE_URL}/images/og-image.jpg`, // Your image path preserved
				width: 1200,
				height: 630,
				alt: 'Richard Hudson - Revenue Operations Professional Portfolio',
				type: 'image/jpeg',
			},
			{
				url: `${SITE_URL}/images/og-image-square.jpg`, // Your image path preserved
				width: 600,
				height: 600,
				alt: 'Richard Hudson - Revenue Operations Professional',
				type: 'image/jpeg',
			},
		],
	},
}

// Advanced Next.js 13+ metadata configuration
export const metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,

	// Basic metadata
	applicationName: 'Richard Hudson Portfolio',
	authors: [{ name: 'Richard Hudson', url: SITE_URL }],
	generator: 'Next.js',
	keywords: [
		'data visualization',
		'data analytics',
		'data analysis',
		'data engineering',
		'marketing automation specialist',
		'marketing automation consultant',
		'marketing automation professional',
		'marketing automation manager',
		'marketing automation analyst',
		'partnerstack consultant',
		'partnerstack professional',
		'partnerstack manager',
		'partnerstack analyst',
		'partnerstack specialist',
		'partner channel analyst',
		'partner channel consultant',
		'partner channel professional',
		'partner channel manager',
		'partner channel specialist',
		'channel operations analyst',
		'channel operations consultant',
		'channel operations professional',
		'channel operations manager',
		'channel operations specialist',
		'channel operations',
		'revenue operations',
		'revenue operations consultant',
		'revenue operations professional',
		'revenue operations manager',
		'revenue operations analyst',
		'revenue operations specialist',
		'revenue operations director',
		'revenue operations lead',
		'revenue operations engineer',
		'revenue operations architect',
		'revenue operations developer',
		'revenue operations portfolio',
		'sales operations analyst',
		'sales operations consultant',
		'sales operations professional',
		'sales operations manager',
		'sales operations director',
		'sales operations lead',
		'sales operations engineer',
		'sales operations architect',
		'sales operations developer',
		'sales operations portfolio',
		'sales engineer',
		'portfolio',
	],
	referrer: 'origin',
	creator: 'Richard Hudson',
	publisher: 'Richard Hudson',

	// Robots control
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},

	// Icons
	icons: {
		icon: '/favicon.ico',
		shortcut: '/favicon-16x16.png',
		apple: '/apple-touch-icon.png',
		other: [
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '32x32',
				url: '/favicon-32x32.png',
			},
			{
				rel: 'icon',
				type: 'image/png',
				sizes: '16x16',
				url: '/favicon-16x16.png',
			},
			{
				rel: 'mask-icon',
				url: '/safari-pinned-tab.svg',
				color: '#5bbad5',
			},
		],
	},

	// Verification for search engines
	verification: {
		google: 'your-google-verification-code', // Your verification code preserved
		yandex: 'your-yandex-verification-code', // Your verification code preserved
		bing: 'your-bing-verification-code', // Your verification code preserved
	},

	// Alternative languages
	alternates: {
		canonical: SITE_URL,
		languages: {
			'en-US': SITE_URL,
			// Your language versions preserved
		},
	},

	// OpenGraph
	openGraph: {
		type: 'website',
		siteName: SITE_NAME,
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
		url: SITE_URL,
		locale: 'en_US',
		images: [
			{
				url: `${SITE_URL}/images/richard.jpg`, // Your image path preserved
				width: 1200,
				height: 630,
				alt: 'Richard Hudson - Revenue Operations Portfolio',
			},
		],
	},

	// App links
	appLinks: {
		ios: {
			url: SITE_URL,
			app_store_id: 'app-store-id',
		},
		android: {
			package: 'com.example.portfolio', // Your package name preserved
			app_name: 'Richard Hudson Portfolio',
		},
		web: {
			url: SITE_URL,
			should_fallback: true,
		},
	},

	// Archives and assets
	assets: [`${SITE_URL}/assets/`],
	category: 'technology',
}

// Separate viewport export as required by Next.js 13+
export const viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 5,
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#ffffff' },
		{ media: '(prefers-color-scheme: dark)', color: '#0f172a' },
	],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<DefaultSeo {...DEFAULT_SEO_CONFIG} />
				<link rel='manifest' href='/manifest.json' />
			</head>
			<body className={inter.className}>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
					<WebVitals />
					<Toaster />
					<div className='relative flex min-h-screen flex-col'>
						<Header />
						<main className='flex-1 pt-16'>{children}</main>
						<Footer />
					</div>
					<Analytics />
				</ThemeProvider>
			</body>
		</html>
	)
}
