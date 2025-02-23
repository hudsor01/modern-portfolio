import { readingTime as readingTimeHelper } from "reading-time-estimator"
import type { BlogPost } from "@/types/blog"

export function formatBlogDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function calculateReadingTime(content: string): string {
  const { minutes } = readingTimeHelper(content, 200)
  return `${Math.ceil(minutes)} min read`
}

export function sortBlogPosts(posts: BlogPost[]): BlogPost[] {
  return posts.sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

export function getRelatedPosts(currentPost: BlogPost, allPosts: BlogPost[], limit = 3): BlogPost[] {
  const posts = allPosts
    .filter(
      (post) =>
        post.slug !== currentPost.slug && // Exclude current post
        (post.categories.some((cat) => currentPost.categories.includes(cat)) || // Same category
          post.tags.some((tag) => currentPost.tags.includes(tag))), // Same tags
    )
    .sort((a, b) => {
      // Count matching categories and tags
      const aMatches =
        a.categories.filter((cat) => currentPost.categories.includes(cat)).length +
        a.tags.filter((tag) => currentPost.tags.includes(tag)).length

      const bMatches =
        b.categories.filter((cat) => currentPost.categories.includes(cat)).length +
        b.tags.filter((tag) => currentPost.tags.includes(tag)).length

      return bMatches - aMatches
    })
    .slice(0, limit)

  return posts
}

