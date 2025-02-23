import type { NavItem } from "@/types/nav"

interface SiteMap {
  mainNav: NavItem[]
  footerNav: {
    resources: NavItem[]
    social: {
      title: string
      href: string
      icon: string
    }[]
    legal: NavItem[]
  }
}

export const siteMap: SiteMap = {
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
      title: "Resume",
      href: "/resume",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
  footerNav: {
    resources: [
      {
        title: "Documentation",
        href: "/docs",
      },
      {
        title: "Blog",
        href: "/blog",
      },
      {
        title: "Projects",
        href: "/projects",
      },
    ],
    social: [
      {
        title: "Twitter",
        href: "https://twitter.com/dickswayze",
        icon: "twitter",
      },
      {
        title: "GitHub",
        href: "https://github.com/hudsor01",
        icon: "github",
      },
      {
        title: "LinkedIn",
        href: "https://linkedin.com/in/hudsor01",
        icon: "linkedin",
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
}

