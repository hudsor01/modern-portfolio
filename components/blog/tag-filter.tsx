"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TagFilterProps {
  tags: {
    name: string
    count: number
  }[]
}

export function TagFilter({ tags }: TagFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentTag = searchParams.get("tag")

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams)
    if (currentTag === tag) {
      params.delete("tag")
    } else {
      params.set("tag", tag)
    }
    router.push(`/blog?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag.name}
          variant="outline"
          className={cn(
            "cursor-pointer hover:bg-primary hover:text-primary-foreground",
            currentTag === tag.name && "bg-primary text-primary-foreground",
          )}
          onClick={() => handleTagClick(tag.name)}
        >
          {tag.name}
          <span className="ml-1 text-xs">({tag.count})</span>
        </Badge>
      ))}
    </div>
  )
}

