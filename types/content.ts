export interface ProjectType {
  id: string
  title: string
  description: string
  image: string
  link: string
  github?: string
  tags: string[]
  featured: boolean
  publishedAt: string
}

export interface TestimonialType {
  id: string
  name: string
  role: string
  company: string
  content: string
  image?: string
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  image?: string
  tags: string[]
  published: boolean
  content: string
}

