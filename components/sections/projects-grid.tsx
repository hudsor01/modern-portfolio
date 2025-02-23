"use client"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"
import { FadeIn } from "@/components/ui/fade-in"

interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  demoUrl?: string
  githubUrl?: string
}

interface ProjectsGridProps {
  projects: Project[]
}

export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        <FadeIn key={project.id} delay={index * 0.1}>
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
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                {project.demoUrl && (
                  <Button variant="outline" size="sm" className="group/button" asChild>
                    <Link href={project.demoUrl} target="_blank">
                      <ExternalLink className="mr-2 h-4 w-4 transition-transform group-hover/button:scale-110" />
                      Demo
                    </Link>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button variant="outline" size="sm" className="group/button" asChild>
                    <Link href={project.githubUrl} target="_blank">
                      <Github className="mr-2 h-4 w-4 transition-transform group-hover/button:scale-110" />
                      Code
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      ))}
    </div>
  )
}

