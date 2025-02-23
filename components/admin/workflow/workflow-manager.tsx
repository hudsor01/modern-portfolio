"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { ClipboardList, CalendarIcon, User } from "lucide-react"

interface WorkflowItem {
  id: string
  title: string
  status: string
  assignedTo?: {
    id: string
    name: string
    avatar?: string
  }
  dueDate?: Date
}

interface WorkflowManagerProps {
  items: WorkflowItem[]
  users: Array<{ id: string; name: string; avatar?: string }>
  onStatusChange: (itemId: string, status: string) => void
  onAssigneeChange: (itemId: string, userId: string) => void
  onDueDateChange: (itemId: string, date: Date) => void
}

function getStatusVariant(status: string) {
  switch (status) {
    case "draft":
      return "secondary"
    case "in-review":
      return "warning"
    case "approved":
      return "success"
    case "published":
      return "destructive"
    default:
      return "default"
  }
}

export function WorkflowManager({
  items,
  users,
  onStatusChange,
  onAssigneeChange,
  onDueDateChange,
}: WorkflowManagerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date>()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          Workflow Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col gap-4 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{item.title}</h3>
                  <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Select value={item.status} onValueChange={(value) => onStatusChange(item.id, value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="in-review">In Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <Select value={item.assignedTo?.id} onValueChange={(value) => onAssigneeChange(item.id, value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Assign to..." />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
                              </Avatar>
                              {user.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {item.dueDate ? format(item.dueDate, "PP") : "Set due date"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Set Due Date</DialogTitle>
                        <DialogDescription>Choose a due date for this content item</DialogDescription>
                      </DialogHeader>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date)
                          date && onDueDateChange(item.id, date)
                        }}
                        initialFocus
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                {item.assignedTo && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Assigned to {item.assignedTo.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

