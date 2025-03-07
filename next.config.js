/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  
  serverExternalPackages: [],
  

  images: {
    domains: ['localhost', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' *.calendly.com assets.calendly.com;
              style-src 'self' 'unsafe-inline' *.googleapis.com fonts.googleapis.com;
              img-src 'self' data: blob: https: * 'unsafe-inline';
              font-src 'self' fonts.gstatic.com data:;
              object-src 'none';
              media-src 'self';
              connect-src 'self' https: fonts.googleapis.com ws: wss:;
              frame-src 'self' calendly.com *.calendly.com assets.calendly.com;
            `.replace(/\s{2,}/g, ' ').trim()
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          }
        ]
      }
    ]
  }

}

export default nextConfig;
