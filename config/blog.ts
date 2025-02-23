import type { BlogConfig } from "@/lib/blog/types"

export const blogConfig: BlogConfig = {
  name: "Richard Hudson's Blog",
  description: "Insights on Revenue Operations, Technology, and Business Growth",
  postsPerPage: 9,
  featuredPosts: 3,
}

export const ogImageConfig = {
  secret: process.env.OG_IMAGE_SECRET || "your-fallback-secret",
  baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
}

