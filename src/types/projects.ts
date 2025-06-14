export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  image?: string
  technologies?: string[]
  featured?: boolean
  liveUrl?: string
  githubUrl?: string
  date: string | Date
  category?: string
  client?: string
  role?: string
  testimonial?: Testimonial
  gallery?: ProjectImage[]
}

export interface ProjectImage {
  url: string
  alt: string
  caption?: string
}

export interface Testimonial {
  quote: string
  author: string
  role?: string
  company?: string
  avatar?: string
}

export interface ProjectFilterOptions {
  category?: string
  technology?: string
  featured?: boolean
}
