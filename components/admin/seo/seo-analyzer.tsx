"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

interface SEOAnalysis {
  title: {
    length: number
    score: number
    suggestions: string[]
  }
  description: {
    length: number
    score: number
    suggestions: string[]
  }
  keywords: {
    count: number
    score: number
    suggestions: string[]
  }
  content: {
    wordCount: number
    score: number
    suggestions: string[]
  }
}

interface SEOAnalyzerProps {
  initialData: {
    title: string
    description: string
    keywords: string[]
    content: string
  }
  onUpdate: (data: any) => void
}

export function SEOAnalyzer({ initialData, onUpdate }: SEOAnalyzerProps) {
  const [data, setData] = React.useState(initialData)
  const [analysis, setAnalysis] = React.useState<SEOAnalysis | null>(null)

  const analyzeSEO = React.useCallback(() => {
    // This is a simplified analysis. In a real application,
    // you would want to do more thorough checks.
    const titleAnalysis = {
      length: data.title.length,
      score: calculateTitleScore(data.title),
      suggestions: getTitleSuggestions(data.title),
    }

    const descriptionAnalysis = {
      length: data.description.length,
      score: calculateDescriptionScore(data.description),
      suggestions: getDescriptionSuggestions(data.description),
    }

    const keywordsAnalysis = {
      count: data.keywords.length,
      score: calculateKeywordsScore(data.keywords),
      suggestions: getKeywordsSuggestions(data.keywords),
    }

    const contentAnalysis = {
      wordCount: countWords(data.content),
      score: calculateContentScore(data.content),
      suggestions: getContentSuggestions(data.content),
    }

    setAnalysis({
      title: titleAnalysis,
      description: descriptionAnalysis,
      keywords: keywordsAnalysis,
      content: contentAnalysis,
    })
  }, [data])

  React.useEffect(() => {
    analyzeSEO()
  }, [analyzeSEO])

  const handleUpdate = (field: string, value: any) => {
    const newData = { ...data, [field]: value }
    setData(newData)
    onUpdate(newData)
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={data.title} onChange={(e) => handleUpdate("title", e.target.value)} maxLength={60} />
              {analysis?.title && (
                <div className="flex items-center justify-between text-sm">
                  <span>{analysis.title.length}/60 characters</span>
                  <Progress value={analysis.title.score} className="w-20" />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Meta Description</label>
              <Textarea
                value={data.description}
                onChange={(e) => handleUpdate("description", e.target.value)}
                maxLength={160}
              />
              {analysis?.description && (
                <div className="flex items-center justify-between text-sm">
                  <span>{analysis.description.length}/160 characters</span>
                  <Progress value={analysis.description.score} className="w-20" />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Keywords</label>
              <Input
                value={data.keywords.join(", ")}
                onChange={(e) =>
                  handleUpdate(
                    "keywords",
                    e.target.value.split(",").map((k) => k.trim()),
                  )
                }
                placeholder="Separate keywords with commas"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>SEO Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Title</span>
                  <Badge variant={analysis.title.score >= 70 ? "default" : "destructive"}>
                    {analysis.title.score}%
                  </Badge>
                </div>
                {analysis.title.suggestions.map((suggestion, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    {analysis.title.score >= 70 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Description</span>
                  <Badge variant={analysis.description.score >= 70 ? "default" : "destructive"}>
                    {analysis.description.score}%
                  </Badge>
                </div>
                {analysis.description.suggestions.map((suggestion, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    {analysis.description.score >= 70 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Keywords</span>
                  <Badge variant={analysis.keywords.score >= 70 ? "default" : "destructive"}>
                    {analysis.keywords.score}%
                  </Badge>
                </div>
                {analysis.keywords.suggestions.map((suggestion, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    {analysis.keywords.score >= 70 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Utility functions for SEO analysis
function calculateTitleScore(title: string): number {
  let score = 100
  if (title.length < 30) score -= 30
  if (title.length > 60) score -= 30
  if (!title.match(/^[A-Z]/)) score -= 10
  return Math.max(0, score)
}

function calculateDescriptionScore(description: string): number {
  let score = 100
  if (description.length < 120) score -= 30
  if (description.length > 160) score -= 30
  if (!description.includes(" ")) score -= 20
  return Math.max(0, score)
}

function calculateKeywordsScore(keywords: string[]): number {
  let score = 100
  if (keywords.length < 3) score -= 30
  if (keywords.length > 10) score -= 30
  return Math.max(0, score)
}

function calculateContentScore(content: string): number {
  let score = 100
  const wordCount = countWords(content)
  if (wordCount < 300) score -= 30
  if (!content.includes("\n")) score -= 20
  return Math.max(0, score)
}

function countWords(str: string): number {
  return str.trim().split(/\s+/).length
}

function getTitleSuggestions(title: string): string[] {
  const suggestions: string[] = []
  if (title.length < 30) {
    suggestions.push("Title is too short. Aim for 30-60 characters.")
  }
  if (title.length > 60) {
    suggestions.push("Title is too long. Keep it under 60 characters.")
  }
  if (!title.match(/^[A-Z]/)) {
    suggestions.push("Title should start with a capital letter.")
  }
  return suggestions
}

function getDescriptionSuggestions(description: string): string[] {
  const suggestions: string[] = []
  if (description.length < 120) {
    suggestions.push("Description is too short. Aim for 120-160 characters.")
  }
  if (description.length > 160) {
    suggestions.push("Description is too long. Keep it under 160 characters.")
  }
  return suggestions
}

function getKeywordsSuggestions(keywords: string[]): string[] {
  const suggestions: string[] = []
  if (keywords.length < 3) {
    suggestions.push("Add more keywords. Aim for 3-10 relevant keywords.")
  }
  if (keywords.length > 10) {
    suggestions.push("Too many keywords. Keep it under 10 keywords.")
  }
  return suggestions
}

function getContentSuggestions(content: string): string[] {
  const suggestions: string[] = []
  const wordCount = countWords(content)
  if (wordCount < 300) {
    suggestions.push("Content is too short. Aim for at least 300 words.")
  }
  if (!content.includes("\n")) {
    suggestions.push("Add paragraphs to improve readability.")
  }
  return suggestions
}

