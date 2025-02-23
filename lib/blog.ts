import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { serializeMDX } from "@/lib/mdx"
import type { BlogPost, BlogCategory, BlogTag } from "@/types/blog"

const postsDirectory = path.join(process.cwd(), "content/blog")

interface GetBlogPostsOptions {
  skip?: number
  limit?: number
  category?: string
  tag?: string
  search?: string
}

export async function getBlogPosts(options: GetBlogPostsOptions = {}) {
  const { skip = 0, limit = 10, category, tag, search } = options

  try {
    const fileNames = await fs.readdir(postsDirectory)
    let posts = await Promise.all(
      fileNames.map(async (fileName) => {
        const slug = fileName.replace(/\.mdx$/, "")
        return getPostBySlug(slug)
      }),
    )

    // Filter out unpublished and null posts
    posts = posts.filter((post): post is BlogPost => post !== null && post.published)

    // Apply filters
    if (category) {
      posts = posts.filter((post) => post.categories.includes(category))
    }
    if (tag) {
      posts = posts.filter((post) => post.tags.includes(tag))
    }
    if (search) {
      const searchLower = search.toLowerCase()
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchLower) ||
          post.description.toLowerCase().includes(searchLower) ||
          post.categories.some((cat) => cat.toLowerCase().includes(searchLower)) ||
          post.tags.some((tag) => tag.toLowerCase().includes(searchLower)),
      )
    }

    // Sort by date
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return {
      items: posts.slice(skip, skip + limit),
      total: posts.length,
    }
  } catch (error) {
    console.error("Error getting blog posts:", error)
    return {
      items: [],
      total: 0,
    }
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = await fs.readFile(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    if (!data.published) {
      return null
    }

    const mdxSource = await serializeMDX(content)

    return {
      slug,
      content: mdxSource,
      title: data.title,
      description: data.description,
      date: data.date,
      image: data.image,
      author: data.author,
      categories: data.categories || [],
      tags: data.tags || [],
      published: data.published,
      featured: data.featured || false,
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const posts = await getBlogPosts({ limit: Number.POSITIVE_INFINITY })
    const categories = new Map<string, BlogCategory>()

    posts.items.forEach((post) => {
      post.categories.forEach((category) => {
        if (!categories.has(category)) {
          categories.set(category, {
            title: category,
            slug: category.toLowerCase().replace(/\s+/g, "-"),
            description: `Posts about ${category}`,
          })
        }
      })
    })

    return Array.from(categories.values())
  } catch (error) {
    console.error("Error getting blog categories:", error)
    return []
  }
}

export async function getBlogTags(): Promise<BlogTag[]> {
  try {
    const posts = await getBlogPosts({ limit: Number.POSITIVE_INFINITY })
    const tags = new Map<string, { count: number }>()

    posts.items.forEach((post) => {
      post.tags.forEach((tag) => {
        const existing = tags.get(tag)
        if (existing) {
          existing.count++
        } else {
          tags.set(tag, { count: 1 })
        }
      })
    })

    return Array.from(tags.entries()).map(([name, { count }]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      count,
    }))
  } catch (error) {
    console.error("Error getting blog tags:", error)
    return []
  }
}

