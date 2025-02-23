"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, ExternalLink, Github, MoreVertical, Trash } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface Project {
  id: string
  title: string
  description: string
  image?: string
  tags: string[]
  demoUrl?: string
  githubUrl?: string
  createdAt: Date
  updatedAt: Date
}

interface ProjectCardProps {
  project: Project
  onDelete?: (id: string) => Promise<void>
  isAdmin?: boolean
}

export function ProjectCard({ project, onDelete, isAdmin = false }: ProjectCardProps) {
  const handleDelete = async () => {
    if (!onDelete) return
    try {
      await onDelete(project.id)
      toast.success("Project deleted successfully")
    } catch (error) {
      toast.error("Failed to delete project")
    }
  }

  return (
    <Card className="group overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1">{project.title}</CardTitle>
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/projects/${project.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">Updated {formatDate(project.updatedAt)}</div>
        <div className="flex gap-2">
          {project.demoUrl && (
            <Button variant="outline" size="sm" className="group/button" asChild>
              <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4 transition-transform group-hover/button:scale-110" />
                Demo
              </Link>
            </Button>
          )}
          {project.githubUrl && (
            <Button variant="outline" size="sm" className="group/button" asChild>
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4 transition-transform group-hover/button:scale-110" />
                Code
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

