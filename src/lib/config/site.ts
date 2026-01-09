import type { SiteConfig } from '@/types/seo'

export const siteConfig: SiteConfig = {
  name: 'Richard Hudson - Modern Portfolio',
  description: 'Senior Revenue Operations Leader & Full-Stack Developer showcasing enterprise analytics platforms, data visualizations, and technical projects.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  links: {
    github: 'https://github.com/hudsor01',
    linkedin: 'https://www.linkedin.com/in/hudsor01',
    twitter: 'https://twitter.com/hudsor01',
  },
  author: {
    name: 'Richard Hudson',
    email: 'contact@richardhudson.dev',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
}

// Navigation configuration (separate from SEO config)
export const navConfig = {
  mainNav: [
    { title: 'Home', href: '/' },
    { title: 'About', href: '/about' },
    { title: 'Projects', href: '/projects' },
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
