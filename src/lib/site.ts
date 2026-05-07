import type { SiteConfig } from '@/types/seo'

// Production-aware site URL.
//
// NEXT_PUBLIC_* env vars are inlined into the bundle at BUILD time. If the var
// isn't set on the Vercel project at build, the fallback value gets baked into
// the bundle and ships to production. Falling back to localhost was leaking
// `http://localhost:3000` into Person/Article/ProfessionalService JSON-LD
// schemas on prod (caught by Rich Results Test 2026-05-07). Mirror the
// production-aware default that env-validation.ts already enforces server-side.
const productionUrl = 'https://richardwhudsonjr.com'
const devUrl = 'http://localhost:3000'
const resolvedSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.NODE_ENV === 'production' ? productionUrl : devUrl)

export const siteConfig: SiteConfig = {
  name: 'Richard Hudson - Modern Portfolio',
  description:
    'Senior Revenue Operations Leader & Full-Stack Developer showcasing enterprise analytics platforms, data visualizations, and technical projects.',
  url: resolvedSiteUrl,
  links: {
    github: 'https://github.com/hudsor01',
    linkedin: 'https://www.linkedin.com/in/hudsor01',
    twitter: 'https://twitter.com/hudsor01',
  },
  author: {
    name: 'Richard Hudson',
    email: 'contact@richardwhudsonjr.com',
    url: resolvedSiteUrl,
  },
}

// Navigation configuration (separate from SEO config)
export const navConfig = {
  mainNav: [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Projects', href: '/projects' },
    { title: 'Blog', href: '/blog' },
    { title: 'Resume', href: '/resume' },
    { title: 'Contact', href: '/contact' },
  ],
  footerNav: {
    resources: [
      { title: 'Projects', href: '/projects' },
      { title: 'Resume', href: '/resume' },
      { title: 'Contact', href: '/contact' },
    ],
  },
}

export default siteConfig
