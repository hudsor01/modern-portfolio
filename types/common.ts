export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    github: string
    linkedin: string
  }
  author: {
    name: string
    email: string
  }
  keywords: string[]
}

export interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  label?: string
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItem {
  items?: NavItem[]
}

export type SectionName = "hero" | "features" | "projects" | "testimonials" | "contact"

export interface ProjectType {
  id: string
  title: string
  description: string
  image: string
  link: string
  github?: string
  tags: string[]
  featured?: boolean
  publishedAt: string
}

export interface SkillType {
  name: string
  level: number
  category: string
}

export interface TestimonialType {
  id: string
  name: string
  role: string
  company: string
  content: string
  image?: string
}

