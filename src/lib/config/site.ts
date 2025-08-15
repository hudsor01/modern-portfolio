import type { SiteConfig } from '@/types/seo'

export const siteConfig: SiteConfig = {
  name: 'Richard Hudson | Revenue Operations Professional',
  description:
    'Driving business growth through data-driven insights, process optimization, and strategic operational improvements.',
  url: 'https://richardwhudsonjr.com',
  ogImage: 'https://richardwhudsonjr.com/richard.jpg',
  links: {
    github: 'https://github.com/hudsonr01',
    linkedin: 'https://linkedin.com/in/hudsor01',
    twitter: 'https://twitter.com/richardhudson',
  },
  author: {
    name: 'Richard Hudson',
    email: 'hello@richardwhudsonjr.com',
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
