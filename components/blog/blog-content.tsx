"use client"

import { Mdx } from "@/components/mdx/mdx-components"

interface BlogContentProps {
  content: string
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="prose prose-gray dark:prose-invert mx-auto max-w-3xl">
      <Mdx code={content} />
    </div>
  )
}

