/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		formats: ['image/avif', 'image/webp'],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
		minimumCacheTTL: 60,
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
}

export default nextConfig
