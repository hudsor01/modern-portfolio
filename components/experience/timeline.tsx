"use client"

import { ScrollFade } from "@/components/animations/scroll-fade"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TimelineItem {
  id: string
  date: string
  title: string
  company: string
  description: string
  technologies: string[]
}

interface TimelineProps {
  items: TimelineItem[]
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative space-y-8">
      <div className="absolute left-[16px] top-3 h-[calc(100%-24px)] w-px bg-border md:left-1/2" />
      {items.map((item, index) => (
        <ScrollFade key={item.id} delay={index * 100} className="relative grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={`md:text-right ${index % 2 === 0 ? "md:pr-8" : "md:order-last md:pl-8"}`}>
            <time className="text-sm text-muted-foreground">{item.date}</time>
          </div>
          <div className={index % 2 === 0 ? "md:pl-8" : "md:pr-8"}>
            <div className="absolute left-0 top-3 h-3 w-3 rounded-full border-2 border-primary bg-background md:left-1/2 md:-ml-1.5" />
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold leading-none">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.company}</p>
                  </div>
                  <p className="text-sm">{item.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollFade>
      ))}
    </div>
  )
}

