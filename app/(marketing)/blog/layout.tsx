import type React from "react"
import type { Metadata } from "next"
import { blogConfig } from "@/config/blog"
import { SearchPosts } from "@/components/blog/search-posts"

export const metadata: Metadata = {
  title: "Blog | Richard Hudson",
  description: blogConfig.description,
}

interface BlogLayoutProps {
  children: React.ReactNode
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tighter">Blog</h1>
          <SearchPosts />
        </div>
        {children}
      </div>
    </div>
  )
}

