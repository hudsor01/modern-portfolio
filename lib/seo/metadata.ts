import { Metadata } from 'next'
import { siteConfig } from '@/lib/config/site'

/**
 * Generate metadata for a page
 */
export function generateMetadata({
	title,
	description,
	image,
	path = '',
}: {
	title?: string
	description?: string
	image?: string
	path?: string
}): Metadata {
	// Create full title with site name
	const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name

	// Use provided description or site default
	const metaDescription = description || siteConfig.description

	// Use provided image or site default
	const ogImage = image || siteConfig.ogImage

	// Create canonical URL
	const url = `${siteConfig.url}${path}`

	return {
		title: fullTitle,
		description: metaDescription,
		openGraph: {
			title: fullTitle,
			description: metaDescription,
			url,
			siteName: siteConfig.name,
			images: [
				{
					url: ogImage,
					width: 1200,
					height: 630,
					alt: siteConfig.name,
				},
			],
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title: fullTitle,
			description: metaDescription,
			images: [ogImage],
		},
		metadataBase: new URL(siteConfig.url),
	}
}
