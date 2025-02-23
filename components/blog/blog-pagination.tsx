"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

interface BlogPaginationProps {
  totalPages: number
}

export function BlogPagination({ totalPages }: BlogPaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page")) || 1

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button variant="outline" size="icon" asChild disabled={currentPage <= 1}>
        <Link href={createPageURL(currentPage - 1)}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Link>
      </Button>
      <div className="flex items-center space-x-2">
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1
          return (
            <Button key={page} variant={currentPage === page ? "default" : "outline"} size="icon" asChild>
              <Link href={createPageURL(page)}>
                {page}
                <span className="sr-only">Page {page}</span>
              </Link>
            </Button>
          )
        })}
      </div>
      <Button variant="outline" size="icon" asChild disabled={currentPage >= totalPages}>
        <Link href={createPageURL(currentPage + 1)}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Link>
      </Button>
    </div>
  )
}

