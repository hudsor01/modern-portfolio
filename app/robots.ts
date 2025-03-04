import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://richardwhudsonjr.com'

	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/admin', '/api/*', '/login', '/_next/*'],
		},
		sitemap: `${baseUrl}/sitemap.xml`,
		host: baseUrl,
	}
}
