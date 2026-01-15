'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'

interface KeyHighlightsProps {
  highlights: string[]
  className?: string
}

export function KeyHighlights({ highlights, className = '' }: KeyHighlightsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const displayCount = 4
  const visibleHighlights = isExpanded ? highlights : highlights.slice(0, displayCount)
  const hasMore = highlights.length > displayCount

  return (
    <section className={className}>
      <div className="text-center mb-12">
        <h2 className="font-display text-3xl lg:text-4xl font-semibold text-foreground mb-4">
          Key Strengths & Differentiators
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          What sets me apart in revenue operations and growth analytics
        </p>
      </div>

      <Card className="bg-card border border-border rounded-2xl relative overflow-hidden">
        <CardContent className="p-8">
          <div className="grid gap-4">
            {visibleHighlights.map((highlight, index) => (
              <div
                key={index}
                className="flex gap-4 items-start animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-foreground leading-relaxed flex-1">
                  {highlight}
                </p>
              </div>
            ))}
          </div>

          {hasMore && !isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-card via-card/95 to-transparent pointer-events-none" />
          )}

          {hasMore && (
            <div className="mt-8 text-center relative z-10">
              <Button
                variant={isExpanded ? "outline" : "default"}
                onClick={() => setIsExpanded(!isExpanded)}
                size="lg"
                className="rounded-full px-8 shadow-md hover:shadow-lg transition-all"
              >
                {isExpanded ? (
                  <>
                    Show Less
                    <ChevronUp className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    View All {highlights.length} Highlights
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
