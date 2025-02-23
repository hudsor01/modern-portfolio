"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NewsletterForm } from "@/components/forms/newsletter-form"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import type { BlogCategory, BlogTag } from "@/types/blog"

export function BlogSidebar() {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get("category")
  const selectedTag = searchParams.get("tag")

  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [tags, setTags] = useState<BlogTag[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesData, tagsData] = await Promise.all([
          fetch("/api/blog/categories").then((res) => res.json()),
          fetch("/api/blog/tags").then((res) => res.json()),
        ])
        setCategories(categoriesData)
        setTags(tagsData)
      } catch (error) {
        console.error("Error fetching blog data:", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Subscribe to get notified about new posts and revenue operations insights.
          </p>
          <NewsletterForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog?category=${category.slug}`}
                className={cn(
                  "inline-flex items-center",
                  selectedCategory === category.slug && "text-primary underline underline-offset-4",
                )}
              >
                <Badge variant={selectedCategory === category.slug ? "default" : "secondary"}>{category.title}</Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags
              .sort((a, b) => b.count - a.count)
              .slice(0, 15)
              .map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/blog?tag=${tag.slug}`}
                  className={cn(
                    "inline-flex items-center",
                    selectedTag === tag.slug && "text-primary underline underline-offset-4",
                  )}
                >
                  <Badge variant={selectedTag === tag.slug ? "default" : "secondary"}>
                    {tag.name} ({tag.count})
                  </Badge>
                </Link>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

