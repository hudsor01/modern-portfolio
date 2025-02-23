import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Github, Globe, ExternalLink } from "lucide-react"
import type { Project } from "@/types/project"

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group h-full overflow-hidden">
      <CardHeader className="p-0">
        <Link href={`/projects/${project.id}`}>
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {project.featured && (
              <Badge className="absolute right-2 top-2" variant="secondary">
                Featured
              </Badge>
            )}
          </div>
        </Link>
      </CardHeader>
      <CardContent className="grid gap-4 p-6">
        <div>
          <Link href={`/projects/${project.id}`}>
            <h3 className="text-xl font-bold transition-colors group-hover:text-primary">{project.title}</h3>
          </Link>
          <p className="mt-2 line-clamp-2 text-muted-foreground">{project.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <div className="flex w-full gap-2">
          {project.github && (
            <Button asChild size="sm" variant="outline">
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                Code
              </a>
            </Button>
          )}
          {project.demo && (
            <Button asChild size="sm" variant="outline">
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                <Globe className="mr-2 h-4 w-4" />
                Demo
              </a>
            </Button>
          )}
          <Button asChild size="sm" className="ml-auto">
            <Link href={`/projects/${project.id}`}>
              View Details
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

