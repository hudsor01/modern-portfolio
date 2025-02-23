"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"

interface ScheduledContent {
  id: string
  title: string
  type: "post" | "project"
  scheduledFor: Date
}

interface ContentSchedulerProps {
  scheduledContent: ScheduledContent[]
  onSchedule: (date: Date) => void
}

export function ContentScheduler({ scheduledContent, onSchedule }: ContentSchedulerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())

  const scheduledDates = scheduledContent.reduce(
    (acc, content) => {
      const date = content.scheduledFor.toISOString().split("T")[0]
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(content)
      return acc
    },
    {} as Record<string, ScheduledContent[]>,
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Content Schedule</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Content
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Content</DialogTitle>
              <DialogDescription>Choose a date to schedule your content for publication.</DialogDescription>
            </DialogHeader>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
            <Button onClick={() => selectedDate && onSchedule(selectedDate)} className="w-full">
              Confirm Schedule
            </Button>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
          modifiers={{
            scheduled: (date) => {
              const dateStr = date.toISOString().split("T")[0]
              return dateStr in scheduledDates
            },
          }}
          modifiersStyles={{
            scheduled: {
              backgroundColor: "var(--accent)",
              color: "var(--accent-foreground)",
            },
          }}
        />
        {selectedDate && (
          <div className="mt-4">
            <h4 className="mb-2 font-medium">Scheduled for {selectedDate.toLocaleDateString()}</h4>
            <div className="space-y-2">
              {scheduledDates[selectedDate.toISOString().split("T")[0]]?.map((content) => (
                <div key={content.id} className="flex items-center justify-between rounded-lg border p-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={content.type === "post" ? "default" : "secondary"}>{content.type}</Badge>
                    <span className="font-medium">{content.title}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

