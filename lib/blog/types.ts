export interface Post {
  id: string
  title: string
  slug: string
  description?: string
  content: string
  publishedAt?: Date
  updatedAt: Date
  image?: string
  author: {
    name?: string
    image?: string
  }
  tags: string[]
}

export interface Tag {
  id: string
  name: string
  count: number
}

export interface BlogConfig {
  name: string
  description: string
  postsPerPage: number
  featuredPosts: number
}

