"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Trash } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import type { Post } from "@/lib/blog/types"

interface BlogPostListProps {
  initialPosts: Post[]
}

export function BlogPostList({ initialPosts }: BlogPostListProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [search, setSearch] = useState("")

  const filteredPosts = posts.filter((post) => post.title.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete post")

      setPosts((prev) => prev.filter((post) => post.slug !== slug))
      toast.success("Post deleted successfully")
    } catch (error) {
      toast.error("Failed to delete post")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post) => (
              <TableRow key={post.slug}>
                <TableCell>{post.title}</TableCell>
                <TableCell>
                  {post.published ? (
                    <span className="text-green-600">Published</span>
                  ) : (
                    <span className="text-yellow-600">Draft</span>
                  )}
                </TableCell>
                <TableCell>{formatDate(post.publishedAt || post.updatedAt)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/blog/${post.slug}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View post</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/blog/${post.slug}`}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit post</span>
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(post.slug)}>
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete post</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

