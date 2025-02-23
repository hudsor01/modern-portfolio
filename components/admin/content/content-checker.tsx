"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContentCheck {
  id: string
  type: "error" | "warning" | "info" | "success"
  message: string
  details?: string
  suggestion?: string
}

interface ContentScore {
  readability: number
  seo: number
  quality: number
}

interface ContentCheckerProps {
  content: string
  checks: ContentCheck[]
  score: ContentScore
  onFix?: (checkId: string) => void
}

export function ContentChecker({ content, checks, score, onFix }: ContentCheckerProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  const getIcon = (type: ContentCheck["type"]) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Readability</span>
                <span className={cn("text-sm font-bold", getScoreColor(score.readability))}>{score.readability}%</span>
              </div>
              <Progress value={score.readability} />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">SEO</span>
                <span className={cn("text-sm font-bold", getScoreColor(score.seo))}>{score.seo}%</span>
              </div>
              <Progress value={score.seo} />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Quality</span>
                <span className={cn("text-sm font-bold", getScoreColor(score.quality))}>{score.quality}%</span>
              </div>
              <Progress value={score.quality} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Checks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {checks.map((check) => (
              <div key={check.id} className="flex items-start gap-4 rounded-lg border p-4">
                {getIcon(check.type)}
                <div className="grid gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{check.message}</span>
                    <Badge variant={check.type === "error" ? "destructive" : "secondary"}>{check.type}</Badge>
                  </div>
                  {check.details && <p className="text-sm text-muted-foreground">{check.details}</p>}
                  {check.suggestion && <p className="text-sm text-muted-foreground">Suggestion: {check.suggestion}</p>}
                  {onFix && (
                    <button
                      className="mt-2 text-sm font-medium text-primary hover:underline"
                      onClick={() => onFix(check.id)}
                    >
                      Fix this issue
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

