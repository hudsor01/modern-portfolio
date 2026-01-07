import type { SiteConfig } from '@/types/seo'
import { getConfigSection } from '@/lib/config'

// Lazy-loaded site configuration to avoid circular dependency
let _siteConfig: SiteConfig | null = null

function getSiteConfig(): SiteConfig {
  if (!_siteConfig) {
    _siteConfig = getConfigSection('site')
  }
  return _siteConfig
}

export const siteConfig: SiteConfig = new Proxy({} as SiteConfig, {
  get(_target, prop) {
    const config = getSiteConfig()
    return config[prop as keyof SiteConfig]
  },
})

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
