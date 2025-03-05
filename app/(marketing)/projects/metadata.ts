import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config/site'

export const metadata: Metadata = {
	title: 'Projects | Richard Hudson',
	description:
		"Explore Richard Hudson's portfolio of revenue operations and data analysis projects showcasing expertise in business growth strategies.",
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: `${siteConfig.url}/projects`,
		title: 'Projects | Richard Hudson - Revenue Operations Professional',
		description:
			"Explore Richard Hudson's portfolio of revenue operations and data analysis projects showcasing expertise in business growth strategies.",
		siteName: siteConfig.name,
		images: [
			{
				url: `${siteConfig.url}/og/projects.jpg`,
				width: 1200,
				height: 630,
				alt: "Richard Hudson's Portfolio Projects",
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Projects | Richard Hudson - Revenue Operations Professional',
		description:
			"Explore Richard Hudson's portfolio of revenue operations and data analysis projects showcasing expertise in business growth strategies.",
		images: [`${siteConfig.url}/og/projects.jpg`],
	},
}
