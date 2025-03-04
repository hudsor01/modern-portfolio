import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Richard Hudson | Revenue Operations Professional',
		short_name: 'Richard Hudson',
		description:
			'Revenue Operations Professional specializing in process optimization, data analysis, and web development',
		start_url: '/',
		display: 'standalone',
		background_color: '#ffffff',
		theme_color: '#0f766e',
		icons: [
			{
				src: '/favicon.ico',
				sizes: 'any',
				type: 'image/x-icon',
			},
			{
				src: '/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: '/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
			{
				src: '/apple-touch-icon.png',
				sizes: '180x180',
				type: 'image/png',
				purpose: 'any',
			},
		],
	}
}
