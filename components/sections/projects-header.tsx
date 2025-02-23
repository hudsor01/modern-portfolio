"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { Search, Grid, List } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"

const categories = ["All", "Revenue Operations", "Technology", "Analytics", "Strategy"]

export function ProjectsHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = React.useState(searchParams?.get("search") ?? "")
  const debouncedSearch = useDebounce(search, 500)
  const [view, setView] = React.useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = React.useState("All")

  React.useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString())

    if (debouncedSearch) {
      params.set("search", debouncedSearch)
    } else {
      params.delete("search")
    }

    if (selectedCategory !== "All") {
      params.set("category", selectedCategory)
    } else {
      params.delete("category")
    }

    router.push(`/projects?${params.toString()}`)
  }, [debouncedSearch, selectedCategory, router, searchParams])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Projects</h1>
          <p className="mt-2 text-muted-foreground">
            Explore my portfolio of revenue operations and technology projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ToggleGroup type="single" value={view} onValueChange={(v) => setView(v as "grid" | "list")}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

