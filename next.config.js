import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  basePath: '',
  trailingSlash: false,

  // React Compiler — stable and bundled in Next.js 16 (no Babel plugin dep).
  // Ref: https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler
  reactCompiler: true,

  // Strip console.log/info/debug in prod bundles. Keep warn/error so Sentry
  // breadcrumbs and runtime diagnostics still surface.
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Externalize Node-native packages that ship runtime data files Turbopack
  // can't statically resolve. `isomorphic-dompurify` (used in
  // src/app/blog/_components/blog-post-article.tsx for SSR HTML sanitization)
  // loads `jsdom` under the hood, and jsdom's `data/patch.json` lookup
  // breaks under Turbopack production bundling — every /blog/[slug] render
  // 500s on "Cannot find module '../data/patch.json'". Listing these as
  // external tells Turbopack to require() them from node_modules at runtime
  // instead of trying to bundle them.
  serverExternalPackages: ['jsdom', 'isomorphic-dompurify'],

  experimental: {
    // Tree-shake large icon/chart libraries on first import. Each named import
    // becomes its own subpath so the bundle only pulls in what we use, not the
    // whole index. Big first-load TBT win for blog and project pages.
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'radix-ui',
      '@tanstack/react-form',
      '@tanstack/react-table',
      'cmdk',
      'date-fns',
      'motion',
    ],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    const corsOrigin =
      process.env.NODE_ENV === 'production'
        ? 'https://richardwhudsonjr.com'
        : 'http://localhost:3000'

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            // Explicitly disabled. The header is non-standard, removed from
            // Chrome/Edge/Firefox, and `1; mode=block` can enable reflected
            // XSS via response-splitting on legacy engines that still honor
            // it. CSP (nonced, set in proxy.ts) is the real XSS control.
            // Refs: OWASP Secure Headers, MDN X-XSS-Protection.
            key: 'X-XSS-Protection',
            value: '0',
          },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          // CSP itself is set per-request in proxy.ts so the nonce can rotate.
        ],
      },
      {
        // Negative lookahead: apply to /api/* EXCEPT /api/og (social-preview
        // images that crawlers must fetch) and /api/blog/rss (feed surface).
        // Both should be discoverable; everything else stays noindex.
        source: '/api/:path((?!og$|blog/rss$).*)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: corsOrigin },
          { key: 'Vary', value: 'Origin' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With',
          },
          { key: 'Access-Control-Max-Age', value: '86400' },
          { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
        ],
      },
      {
        // Same CORS for /api/og and /api/blog/rss but no X-Robots-Tag —
        // these are crawler-facing surfaces.
        source: '/api/:path(og|blog/rss)',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: corsOrigin },
          { key: 'Vary', value: 'Origin' },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/:path*\\.(js|css|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Vary', value: 'Accept-Encoding' },
        ],
      },
      // ISR + dynamic content caching for blog/project pages.
      {
        source: '/(projects|blog)/:path*',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate=86400' },
          { key: 'CDN-Cache-Control', value: 'max-age=3600' },
        ],
      },
      {
        // PDF assets need to be embeddable in same-origin <object> for the
        // resume viewer (/resume PDF toggle, /resume/view). Override the
        // global X-Frame-Options: DENY with SAMEORIGIN. The CSP
        // frame-ancestors directive is dropped on PDFs by excluding them
        // from the proxy matcher in src/proxy.ts — both must be loosened
        // together for browsers to render the PDF in a frame.
        //
        // NOTE: this rule applies to ALL .pdf paths under /public. Only one
        // exists today (Richard Hudson - Resume.pdf). If a future PDF
        // should NOT be framable (e.g., signed contract, gated content),
        // narrow the source to the literal résumé filename and add an
        // explicit deny rule for the new path.
        //
        // Other security headers from the global /(.*) rule (nosniff, HSTS,
        // Referrer-Policy, Permissions-Policy) are preserved — Next.js
        // merges by header key, only colliding keys override.
        source: '/:path*\\.pdf',
        headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
      },
    ]
  },

  async redirects() {
    return [
      // Legacy URL → home. /github, /linkedin, /twitter live in vercel.json
      // so they redirect at the edge before hitting the Next.js server.
      { source: '/home', destination: '/', permanent: true },
    ]
  },
}

const sentryBuildOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  sentryUrl: process.env.SENTRY_URL,
  silent: true,
}

export default withSentryConfig(nextConfig, sentryBuildOptions)
