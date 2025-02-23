export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  image: string
  link?: string
  github?: string
  demo?: string
  tags: string[]
  featured: boolean
  publishedAt: string
  technologies: string[]
  category: string
}

export interface ProjectCategory {
  name: string
  description: string
  slug: string
}

export type ProjectFilter = {
  category?: string
  tag?: string
  search?: string
}

