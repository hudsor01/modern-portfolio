"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useScrollSpy } from "@/lib/hooks/use-scroll-spy"
import { Card } from "@/components/ui/card"

interface TableOfContentsProps {
  content: string
}

interface HeadingItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeadingItem[]>([])
  const activeId = useScrollSpy(
    headings.map(({ id }) => `#${id}`),
    {
      rootMargin: "0% 0% -80% 0%",
    },
  )

  useEffect(() => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm
    const matches = Array.from(content.matchAll(headingRegex))

    const items = matches.map((match) => {
      const level = match[1].length
      const text = match[2]
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      return { id, text, level }
    })

    setHeadings(items)
  }, [content])

  if (headings.length === 0) return null

  return (
    <Card className="sticky top-20 p-4 max-h-[calc(100vh-6rem)] overflow-auto">
      <h4 className="font-medium mb-4">Table of Contents</h4>
      <nav>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id} style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "text-sm hover:text-primary transition-colors",
                  activeId === heading.id ? "text-primary font-medium" : "text-muted-foreground",
                )}
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector(`#${heading.id}`)?.scrollIntoView({
                    behavior: "smooth",
                  })
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Card>
  )
}

