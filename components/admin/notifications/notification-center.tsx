"use client"

import * as React from "react"
import { Bell, Check, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link?: string
  read: boolean
  createdAt: Date
}

interface NotificationCenterProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onMarkAllAsRead: () => Promise<void>
}

export function NotificationCenter({
  notifications,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
}: NotificationCenterProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await onMarkAsRead(notification.id)
    }
    if (notification.link) {
      router.push(notification.link)
    }
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-sm font-medium">Notifications</h2>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => onMarkAllAsRead()}>
              Mark all as read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No notifications</div>
          ) : (
            <div className="space-y-1 p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-4 rounded-lg p-3 text-sm transition-colors hover:bg-muted/50",
                    !notification.read && "bg-muted/30",
                  )}
                >
                  <div className="flex-1 space-y-1">
                    <div className="cursor-pointer" onClick={() => handleNotificationClick(notification)}>
                      <p className="font-medium leading-none">{notification.title}</p>
                      <p className="text-muted-foreground">{notification.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(notification.createdAt)}</span>
                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => onMarkAsRead(notification.id)}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          onClick={() => onDelete(notification.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function formatTimeAgo(date: Date) {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return "Just now"
}

