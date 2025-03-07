export const siteMap = {
  mainNav: [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'About',
      href: '/about',
    },
    {
      title: 'Projects',
      href: '/projects',
    },
    {
      title: 'Resume',
      href: '/resume',
    },
    {
      title: 'Contact',
      href: '/contact',
    },
  ],
  footerNav: {
    social: [
      {
        title: 'GitHub',
        href: 'https://github.com/hudsor01',
        icon: 'github',
      },
      {
        title: 'LinkedIn',
        href: 'https://linkedin.com/in/hudsor01',
        icon: 'linkedin',
      },
    ],
    legal: [
      {
        title: 'Privacy',
        href: '/privacy',
      },
      {
        title: 'Terms',
        href: '/terms',
      },
    ],
  },
} as const;

export type SiteMap = typeof siteMap;
