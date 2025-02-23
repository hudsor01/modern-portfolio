"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Post } from "@/types/blog"
import { Button } from "@/components/ui/button"

interface PostListProps {
  initialPosts: Post[]
}

export function PostList({ initialPosts }: PostListProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return
    }

    setIsDeleting(slug)
    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      router.refresh()
    } catch (error) {
      console.error("Failed to delete post:", error)
      alert("Failed to delete post")
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      {initialPosts.map((post) => (
        <div key={post.slug} className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 className="font-semibold">{post.title}</h3>
            <p className="text-sm text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/admin/blog/${post.slug}`}>Edit</Link>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(post.slug)}
              disabled={isDeleting === post.slug}
            >
              {isDeleting === post.slug ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

