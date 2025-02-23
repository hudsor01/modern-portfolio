"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function CreatePostButton() {
  const router = useRouter()

  return (
    <Button onClick={() => router.push("/dashboard/posts/new")} className="gap-2">
      <Plus className="h-4 w-4" />
      New Post
    </Button>
  )
}

