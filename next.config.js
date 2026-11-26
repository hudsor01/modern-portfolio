// `/config` subpath: SDK v11 removed the root `@sentry/nextjs` re-export of
// withSentryConfig (deprecated since 10.76).
import { withSentryConfig } from '@sentry/nextjs/config'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildRedirectTable } from './src/lib/redirect-table.mjs'

const readJson = (file) => JSON.parse(readFileSync(join(process.cwd(), file), 'utf8'))

// old slug -> current slug for renamed blog posts, retired slug -> the post it
// was merged into, and the hand-written redirects. All three feed
// buildRedirectTable below; src/lib/redirects.ts builds the same table for the
// proxy, the sitemap and the tests.
const BLOG_SLUG_RENAMES = readJson('src/data/blog-slug-renames.json')
const BLOG_RETIRED_SLUGS = readJson('src/data/blog-retired-slugs.json')
const HAND_WRITTEN_REDIRECTS = readJson('src/data/redirects.json')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  // Next 16.4+ `next dev` manages its agent-rules block only in AGENTS.md (which
  // .gitignore's `*.md` hides) and no longer reads the copy in CLAUDE.md. Off so
  // CLAUDE.md stays the single, hand-maintained source.
  agentRules: false,
  compress: true,
  basePath: '',
  trailingSlash: false,

  // React Compiler. This DOES need `babel-plugin-react-compiler`, which is a
  // declared devDependency — Next lists it as an optional peer, and bun used to
  // auto-install it, so the requirement was invisible until `install.peer=false`
  // (bunfig.toml) turned peer auto-install off and the build failed to resolve it.
  // Ref: https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler
  reactCompiler: true,

  // Strip console.log/info/debug in prod bundles. Keep warn/error so Sentry
  // breadcrumbs and runtime diagnostics still surface.
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  experimental: {
    // Tree-shake large icon/chart libraries on first import. Each named import
    // becomes its own subpath so the bundle only pulls in what we use, not the
    // whole index. Big first-load TBT win for blog and project pages.
    optimizePackageImports: ['lucide-react', 'recharts', 'radix-ui', '@tanstack/react-form', 'motion'],
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
            // it. CSP (set per-request in proxy.ts) is the real XSS control.
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
          // CSP itself is set per-request in proxy.ts (script-src uses
          // 'unsafe-inline', not a nonce — see SECURITY.md for why a nonce is
          // incompatible with this site's static prerendering).
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
        source: '/:path*\\.(js|css|ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Vary', value: 'Accept-Encoding' },
        ],
      },
      // ISR + dynamic content caching for blog/project/tool pages.
      //
      // Note `:path*` matches zero-or-more segments, so this also covers the
      // bare index pages (/blog, /projects) — verified against a production
      // build, not assumed.
      //
      // Vercel's CDN takes its TTL from CDN-Cache-Control (1 hour), not from
      // Cache-Control; s-maxage matches it so any other shared cache agrees
      // (it said 60, which read as a 60-second edge TTL but never was one).
      {
        source: '/(projects|blog|tools)/:path*',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=3600, stale-while-revalidate=86400' },
          { key: 'CDN-Cache-Control', value: 'max-age=3600' },
        ],
      },
      // Search-result renders (/blog?q=…) get a much shorter edge TTL.
      //
      // Vercel's CDN keys on the full URL including the query string, so once
      // `?q=` became a real server render every distinct query started
      // occupying its own edge entry for a full hour. Two consequences: the set
      // of entries is unbounded and attacker-sprayable, and a newly published
      // post stays invisible in search results for up to an hour while the
      // index page it came from has already revalidated.
      //
      // 60s keeps the burst protection that matters (repeat submissions of the
      // same query) without either problem. `has` query matching is the
      // documented mechanism for this — see the "Header, Cookie, and Query
      // Matching" section of the Next.js headers docs. This rule is declared
      // AFTER the general one because later matches win for the same key.
      {
        source: '/blog',
        has: [{ type: 'query', key: 'q' }],
        headers: [
          { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate=300' },
          { key: 'CDN-Cache-Control', value: 'max-age=60' },
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
        // exists today (the résumé PDF). If a future PDF
        // should NOT be framable (e.g., signed contract, gated content),
        // narrow the source to the literal résumé filename and add an
        // explicit deny rule for the new path.
        //
        // Other security headers from the global /(.*) rule (nosniff, HSTS,
        // Referrer-Policy, Permissions-Policy) are preserved — Next.js
        // merges by header key, only colliding keys override.
        //
        // X-Robots-Tag: noindex keeps the résumé PDF out of search results so
        // searches land on /resume (tracked, linked to the rest of the site);
        // the PDF stays crawlable and downloadable (owner decision 2026-11-25).
        source: '/:path*\\.pdf',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Robots-Tag', value: 'noindex' },
        ],
      },
    ]
  },

  // One table: src/data/redirects.json (each entry's "why") plus the two blog
  // slug maps, validated by src/lib/redirect-table.mjs. /github, /linkedin and
  // /twitter moved here from vercel.json so there is a single source. On Vercel
  // these match only the exact lowercase source, which is why the proxy
  // resolves mixed-case and slash variants in one hop.
  async redirects() {
    return buildRedirectTable({
      handWritten: HAND_WRITTEN_REDIRECTS,
      renames: BLOG_SLUG_RENAMES,
      retired: BLOG_RETIRED_SLUGS,
    }).map(({ source, destination }) => ({ source, destination, permanent: true }))
  },
}

const sentryBuildOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  sentryUrl: process.env.SENTRY_URL,
  silent: true,

  // NOTE: `tunnelRoute` is deliberately NOT set. It would proxy events
  // same-origin and dodge ad blockers, but the Next.js external rewrite it
  // installs hangs ~10s and returns 408 (direct-to-Sentry answers in ~60ms),
  // leaving a pending request on every page load — which stalls every
  // `waitForLoadState('networkidle')` and took the e2e suite from 14 failures
  // to 122. Events go direct instead, which requires the Sentry ingest host in
  // `connect-src` (src/lib/csp-edge.ts). Revisit only with a verified fix.

  // Upload a wider set of client bundles so stack traces resolve through
  // framework frames instead of stopping at minified boundaries.
  widenClientFileUpload: true,

  // NOT set: `disableLogger`, `automaticVercelMonitors`. SDK v11 removed both as
  // top-level options; their replacements (`webpack.treeshake.removeDebugLogging`,
  // `webpack.automaticVercelMonitors`) are webpack-only and no-ops on Turbopack,
  // which this app builds with. Re-add only under `webpack.*` if it ever moves
  // off Turbopack.
  //
  // Also NOT set: `reactComponentAnnotation`. v11 reinstated it as a top-level
  // option that DOES work on Turbopack (Next 16+), so it is no longer a no-op —
  // it is simply not enabled. It injects component names into the DOM for
  // Replay/breadcrumbs; turn it on deliberately, not as a migration side effect.
}

export default withSentryConfig(nextConfig, sentryBuildOptions)
