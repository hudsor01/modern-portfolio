import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"
import { getPosts } from "@/lib/blog/api"
import { getProjects } from "@/lib/projects/actions"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts()
  const { projects } = await getProjects()

  const routes = ["", "/about", "/projects", "/blog", "/resume", "/contact"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  const blogPosts = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  const projectPages = projects.map((project) => ({
    url: `${siteConfig.url}/projects/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [...routes, ...blogPosts, ...projectPages]
}

