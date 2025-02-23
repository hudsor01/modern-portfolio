"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDebounce } from "@/hooks/use-debounce"
import type { ProjectCategory } from "@/types/project"

interface ProjectFiltersProps {
  categories: ProjectCategory[]
  tags: string[]
}

export function ProjectFilters({ categories, tags }: ProjectFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = React.useState(searchParams?.get("search") ?? "")
  const debouncedSearch = useDebounce(search, 500)
  const currentCategory = searchParams?.get("category")
  const currentTag = searchParams?.get("tag")

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString())

    if (debouncedSearch) {
      params.set("search", debouncedSearch)
    } else {
      params.delete("search")
    }

    router.push(`/projects?${params.toString()}`)
  }, [debouncedSearch, router, searchParams])

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString())
    if (value === "all") {
      params.delete("category")
    } else {
      params.set("category", value)
    }
    params.delete("tag") // Reset tag when changing category
    router.push(`/projects?${params.toString()}`)
  }

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams?.toString())
    if (currentTag === tag) {
      params.delete("tag")
    } else {
      params.set("tag", tag)
    }
    router.push(`/projects?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-[300px]"
        />
        <Select value={currentCategory ?? "all"} onValueChange={handleCategoryChange}>
          <SelectTrigger className="sm:max-w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.slug} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant={currentTag === tag ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}

