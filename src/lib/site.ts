import type { SiteConfig } from '@/types/seo'
import { SITE_ORIGIN } from '@/lib/absolute-url'

// `siteConfig.url` and `siteConfig.author.url` were previously
// env-aware (NEXT_PUBLIC_SITE_URL || prod-on-NODE_ENV=production ||
// localhost). That fallback chain was leaking `http://localhost:3000`
// into Person/Article/ProfessionalService JSON-LD schemas on preview
// deploys (caught by Rich Results Test 2026-05-07). The fix in that
// incident was the env-aware fallback; the canonical fix here is to
// pin SEO URLs to the production origin via `SITE_ORIGIN`, eliminating
// the env source entirely. siteConfig still owns non-URL identity
// (name, description, social links, author name/email).

export const siteConfig: SiteConfig = {
  name: 'Richard Hudson - Modern Portfolio',
  description:
    'Senior Revenue Operations Leader & Full-Stack Developer showcasing enterprise analytics platforms, data visualizations, and technical projects.',
  url: SITE_ORIGIN,
  links: {
    github: 'https://github.com/hudsor01',
    linkedin: 'https://www.linkedin.com/in/hudsor01',
    twitter: 'https://twitter.com/hudsor01',
  },
  author: {
    name: 'Richard Hudson',
    email: 'contact@richardwhudsonjr.com',
    url: SITE_ORIGIN,
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
