import { CONTACT } from '@/lib/contact-info'
import type { SiteConfig } from '@/types/seo'

// Site identity (name, description, social links, author). URL fields
// were removed in favor of importing `SITE_ORIGIN` from
// `src/lib/absolute-url.ts` directly — see the 2026-05-07 incident
// note on SiteConfig for why two URL constants are drift bait.

export const siteConfig: SiteConfig = {
  name: 'Richard Hudson - Modern Portfolio',
  description:
    'Senior Revenue Operations Leader & Full-Stack Developer showcasing enterprise analytics platforms, data visualizations, and technical projects.',
  links: {
    github: CONTACT.github.url,
    linkedin: CONTACT.linkedin.url,
  },
  author: {
    name: 'Richard Hudson',
    email: CONTACT.email,
  },
}

// Navigation configuration (separate from SEO config)
export const navConfig = {
  mainNav: [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Projects', href: '/projects' },
    { title: 'Blog', href: '/blog' },
    { title: 'Tools', href: '/tools' },
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
