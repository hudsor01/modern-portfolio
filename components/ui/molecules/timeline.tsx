"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TimelineItem {
  date: string
  title: string
  description: string
  category: "work" | "education" | "project"
  tags?: string[]
}

interface TimelineProps {
  items: TimelineItem[]
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative space-y-8">
      <div className="absolute left-[15px] top-2 h-full w-[2px] bg-border md:left-1/2" />
      {items.map((item, index) => (
        <TimelineEntry key={index} item={item} index={index} />
      ))}
    </div>
  )
}

function TimelineEntry({ item, index }: { item: TimelineItem; index: number }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "relative flex flex-col md:flex-row md:justify-between",
        index % 2 === 0 ? "md:flex-row-reverse" : "",
      )}
    >
      <div className="ml-10 md:ml-0 md:w-[45%]">
        <div
          className={cn(
            "rounded-lg border bg-card p-4 shadow-md",
            item.category === "work" && "border-blue-200 dark:border-blue-800",
            item.category === "education" && "border-green-200 dark:border-green-800",
            item.category === "project" && "border-purple-200 dark:border-purple-800",
          )}
        >
          <time className="mb-1 text-sm text-muted-foreground">{item.date}</time>
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="mt-2 text-muted-foreground">{item.description}</p>
          {item.tags && (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="absolute left-4 top-4 h-4 w-4 rounded-full border-2 border-primary bg-background md:left-1/2 md:-ml-2">
        <div className="absolute -left-[1px] -top-[1px] h-4 w-4 animate-ping rounded-full border-2 border-primary" />
      </div>
    </motion.div>
  )
}

