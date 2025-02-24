"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle } from "lucide-react"

interface SEOAuditProps {
  url: string
  title: string
  description: string
  content: string
}

export function SEOAudit({ url, title, description, content }: SEOAuditProps) {
  const titleScore = getTitleScore(title)
  const descriptionScore = getDescriptionScore(description)
  const contentScore = getContentScore(content)
  const overallScore = Math.round((titleScore + descriptionScore + contentScore) / 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Audit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Score</span>
              <Badge variant={getScoreVariant(overallScore)}>{overallScore}%</Badge>
            </div>
            <Progress value={overallScore} />
          </div>

          <div className="space-y-4">
            <AuditItem title="Title Tag" score={titleScore} issues={getTitleIssues(title)} />
            <AuditItem title="Meta Description" score={descriptionScore} issues={getDescriptionIssues(description)} />
            <AuditItem title="Content" score={contentScore} issues={getContentIssues(content)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AuditItem({
  title,
  score,
  issues,
}: {
  title: string
  score: number
  issues: string[]
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{title}</span>
        <Badge variant={getScoreVariant(score)}>{score}%</Badge>
      </div>
      <div className="space-y-1">
        {issues.map((issue, index) => (
          <div key={index} className="flex items-start gap-2 text-sm">
            {score >= 70 ? (
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
            )}
            <span className="text-muted-foreground">{issue}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function getScoreVariant(score: number) {
  if (score >= 90) return "success"
  if (score >= 70) return "warning"
  return "destructive"
}

function getTitleScore(title: string): number {
  let score = 100
  if (!title) return 0
  if (title.length < 30) score -= 30
  if (title.length > 60) score -= 20
  if (!title.match(/^[A-Z]/)) score -= 10
  return Math.max(0, score)
}

function getDescriptionScore(description: string): number {
  let score = 100
  if (!description) return 0
  if (description.length < 120) score -= 30
  if (description.length > 160) score -= 20
  if (!description.includes(" ")) score -= 20
  return Math.max(0, score)
}

function getContentScore(content: string): number {
  let score = 100
  if (!content) return 0
  const wordCount = content.split(/\s+/).length
  if (wordCount < 300) score -= 30
  if (!content.includes("\n")) score -= 20
  return Math.max(0, score)
}

function getTitleIssues(title: string): string[] {
  const issues: string[] = []
  if (!title) {
    issues.push("Title tag is missing")
  } else {
    if (title.length < 30) {
      issues.push("Title is too short (aim for 30-60 characters)")
    }
    if (title.length > 60) {
      issues.push("Title is too long (keep under 60 characters)")
    }
    if (!title.match(/^[A-Z]/)) {
      issues.push("Title should start with a capital letter")
    }
  }
  return issues
}

function getDescriptionIssues(description: string): string[] {
  const issues: string[] = []
  if (!description) {
    issues.push("Meta description is missing")
  } else {
    if (description.length < 120) {
      issues.push("Description is too short (aim for 120-160 characters)")
    }
    if (description.length > 160) {
      issues.push("Description is too long (keep under 160 characters)")
    }
  }
  return issues
}

function getContentIssues(content: string): string[] {
  const issues: string[] = []
  if (!content) {
    issues.push("Content is missing")
  } else {
    const wordCount = content.split(/\s+/).length
    if (wordCount < 300) {
      issues.push("Content is too short (aim for at least 300 words)")
    }
    if (!content.includes("\n")) {
      issues.push("Add paragraphs to improve readability")
    }
  }
  return issues
}

