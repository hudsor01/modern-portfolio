import { cache } from "react"
import type { BlogPost, BlogCategory } from "@/types/blog"
import type { Project } from "@/types/project"

// Mock data for development - replace with actual data fetching in production
const posts: BlogPost[] = [
  {
    slug: "introduction-to-revenue-operations",
    title: "Introduction to Revenue Operations",
    description: "Learn how RevOps can transform your business and drive growth",
    date: "2024-02-21",
    image: "/blog/revenue-operations.jpg",
    author: {
      name: "Richard Hudson Jr",
      image: "/authors/richard.jpg",
      bio: "Revenue Operations & Technology Professional",
    },
    categories: ["Revenue Operations", "Business Strategy"],
    tags: ["RevOps", "Growth", "Strategy"],
    readingTime: "5 min read",
    published: true,
    featured: true,
  },
]

const projects: Project[] = [
  {
    id: "1",
    title: "Revenue Analytics Dashboard",
    description: "Built a comprehensive analytics dashboard for revenue tracking and forecasting.",
    image: "/placeholder.svg?height=400&width=600",
    link: "#",
    github: "https://github.com/username/revenue-analytics",
    tags: ["Next.js", "TypeScript", "Data Visualization"],
    featured: true,
    publishedAt: "2024-02-21",
    technologies: ["React", "Next.js", "TypeScript"],
    category: "Analytics",
  },
]

const testimonials = [
  {
    id: "1",
    name: "Alex Thompson",
    role: "CEO",
    company: "TechCorp",
    content: "Richard's expertise in revenue operations transformed our business processes.",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
  },
]

export const getBlogPosts = cache(async () => posts)
export const getBlogCategories = cache(async () => {
  const categories = new Map<string, BlogCategory>()

  posts.forEach((post) => {
    post.categories.forEach((category) => {
      const slug = category.toLowerCase().replace(/\s+/g, "-")
      if (!categories.has(slug)) {
        categories.set(slug, {
          title: category,
          slug,
          description: `Posts about ${category}`,
        })
      }
    })
  })

  return Array.from(categories.values())
})

export const getBlogTags = cache(async () => {
  const tags = new Map<string, { name: string; count: number }>()

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      const slug = tag.toLowerCase().replace(/\s+/g, "-")
      const existing = tags.get(slug)
      if (existing) {
        existing.count++
      } else {
        tags.set(slug, { name: tag, count: 1 })
      }
    })
  })

  return Array.from(tags.entries()).map(([slug, { name, count }]) => ({
    name,
    slug,
    count,
  }))
})

export const getProjects = cache(async () => projects)
export const getTestimonials = cache(async () => testimonials)

