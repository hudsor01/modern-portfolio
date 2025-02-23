"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

interface BlogPreviewProps {
  content: string
  className?: string
}

export function BlogPreview({ content, className }: BlogPreviewProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="prose prose-stone dark:prose-invert max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </Card>
  )
}

