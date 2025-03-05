/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
		minimumCacheTTL: 31536000, // 1 year for optimal caching
		remotePatterns: [
			// Add any external domains you need to load images from
			// Example: { protocol: 'https', hostname: 'example.com' },
		],
	},
	poweredByHeader: false,
	experimental: {
		optimizePackageImports: [
			'lucide-react',
			'framer-motion',
			'react-hook-form',
			'@radix-ui/react-dialog',
			'@radix-ui/react-dropdown-menu',
			'@radix-ui/react-select',
			'@radix-ui/react-toast',
		],
	},
	// Optimize for Vercel deployment
	output: 'standalone',
}

export default nextConfig
