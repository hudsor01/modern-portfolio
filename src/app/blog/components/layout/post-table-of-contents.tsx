'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

interface PostTableOfContentsProps {
  content: string
}

export function PostTableOfContents({ content }: PostTableOfContentsProps) {
  const [tableOfContents, setTableOfContents] = useState<TableOfContentsItem[]>([])

  // Extract table of contents from content
  useEffect(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const toc = Array.from(headings).map((heading, index) => {
      const id = heading.id || `heading-${index}`
      heading.id = id
      return {
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1))
      }
    })
    setTableOfContents(toc)
  }, [content])

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (tableOfContents.length === 0) return null

  return (
    <div className="sticky top-8">
      <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 mb-8">
        <h3 className="font-semibold mb-4">Table of Contents</h3>
        <nav className="space-y-2">
          {tableOfContents.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToHeading(item.id)}
              className={cn(
                "block w-full text-left text-sm hover:text-blue-500 transition-colors",
                `ml-${(item.level - 1) * 4}`,
                item.level === 1 && "font-medium",
                item.level > 1 && "text-gray-600 dark:text-gray-400"
              )}
            >
              {item.text}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}