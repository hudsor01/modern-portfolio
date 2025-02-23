export interface Author {
  name: string
  image: string
  bio: string
  twitter?: string
  linkedin?: string
  github?: string
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  published: boolean
  featured?: boolean
  image?: string
  author: Author
  categories: string[]
  tags: string[]
  readingTime: string
}

export interface BlogCategory {
  title: string
  description: string
  slug: string
}

export type BlogTag = {
  name: string
  slug: string
  count: number
}

