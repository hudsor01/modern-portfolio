"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"

export function BlogSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get("q") || "")

  const debouncedSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("q", term)
    } else {
      params.delete("q")
    }
    router.push(`/blog?${params.toString()}`)
  }, 300)

  const handleSearch = useCallback(
    (term: string) => {
      setValue(term)
      debouncedSearch(term)
    },
    [debouncedSearch],
  )

  useEffect(() => {
    setValue(searchParams.get("q") || "")
  }, [searchParams])

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search posts..."
        className="pl-10"
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}

