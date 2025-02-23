"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface Comment {
  id: string
  user: {
    id: string
    name: string
    avatar?: string
  }
  content: string
  createdAt: Date
  replies?: Comment[]
}

interface CommentsSectionProps {
  comments: Comment[]
  onAddComment: (content: string, parentId?: string) => Promise<void>
  onEditComment?: (id: string, content: string) => Promise<void>
  onDeleteComment?: (id: string) => Promise<void>
}

export function CommentsSection({ comments, onAddComment, onEditComment, onDeleteComment }: CommentsSectionProps) {
  const [newComment, setNewComment] = React.useState("")
  const [replyTo, setReplyTo] = React.useState<string | null>(null)
  const [editingComment, setEditingComment] = React.useState<string | null>(null)
  const [editContent, setEditContent] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    await onAddComment(newComment, replyTo || undefined)
    setNewComment("")
    setReplyTo(null)
  }

  const handleEdit = async (id: string) => {
    if (!onEditComment || !editContent.trim()) return
    await onEditComment(id, editContent)
    setEditingComment(null)
    setEditContent("")
  }

  const renderComment = (comment: Comment, depth = 0) => {
    const isEditing = editingComment === comment.id

    return (
      <div key={comment.id} className={cn("grid gap-4", depth > 0 && "ml-8 border-l pl-4")}>
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={comment.user.avatar} />
            <AvatarFallback>
              {comment.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="grid gap-1.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{comment.user.name}</span>
              <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </span>
            </div>
            {isEditing ? (
              <div className="grid gap-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => handleEdit(comment.id)}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingComment(null)
                      setEditContent("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm">{comment.content}</p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setReplyTo(comment.id)}>
                    Reply
                  </Button>
                  {onEditComment && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingComment(comment.id)
                        setEditContent(comment.content)
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  {onDeleteComment && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => onDeleteComment(comment.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {comment.replies?.map((reply) => renderComment(reply, depth + 1))}

        {replyTo === comment.id && (
          <form onSubmit={handleSubmit} className="ml-8 grid gap-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a reply..."
              className="min-h-[100px]"
            />
            <div className="flex items-center gap-2">
              <Button type="submit">Reply</Button>
              <Button type="button" variant="ghost" onClick={() => setReplyTo(null)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <form onSubmit={handleSubmit} className="grid gap-4">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="min-h-[100px]"
            />
            <Button type="submit">Add Comment</Button>
          </form>

          <div className="grid gap-6">{comments.map((comment) => renderComment(comment))}</div>
        </div>
      </CardContent>
    </Card>
  )
}

