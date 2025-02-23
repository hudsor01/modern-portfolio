export const siteMap = {
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Projects",
      href: "/projects",
    },
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
  footerNav: {
    social: [
      {
        title: "Twitter",
        href: "https://twitter.com/richardwhudsonjr",
        icon: "twitter",
      },
      {
        title: "GitHub",
        href: "https://github.com/hudsor01",
        icon: "github",
      },
      {
        title: "LinkedIn",
        href: "https://linkedin.com/in/richardwhudsonjr",
        icon: "linkedin",
      },
    ],
    resources: [
      {
        title: "Blog",
        href: "/blog",
      },
      {
        title: "Newsletter",
        href: "/newsletter",
      },
      {
        title: "RSS",
        href: "/feed.xml",
      },
    ],
    legal: [
      {
        title: "Privacy",
        href: "/privacy",
      },
      {
        title: "Terms",
        href: "/terms",
      },
    ],
  },
} as const

export type SiteMap = typeof siteMap

