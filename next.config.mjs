/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		formats: ['image/avif', 'image/webp'],
	},
	experimental: {
		optimizePackageImports: ['lucide-react', 'framer-motion'],
	},
}

export default nextConfig
