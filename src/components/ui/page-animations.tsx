'use client'

import React from 'react'
// import { Animate, AnimatedCard } from '@/components/ui/animate' // Removed: @/components/ui/animate does not exist
import { AnimateOnScroll } from '@/components/ui/animate-on-scroll' // Added: Use AnimateOnScroll instead
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import Link from 'next/link'
import Image from 'next/image'
// import { Project } from '@/app/(home)/projects/types' // Removed: @/app/(home)/projects/types does not exist

// Define Project type locally based on usage, as the original import path is invalid
interface Project {
  id: string | number; // Assuming id can be string or number
  image?: string; // Optional, with fallback
  title?: string; // Optional, with fallback
  featured?: boolean; // Assuming featured is boolean based on usage
  description?: string;
  tags?: string[]; // Used as string[]
  slug: string;
  githubUrl?: string;
}

export function AnimatedProjectCard({ project }: { project: Project }) {
  // Destructure project properties to improve readability
  const {
    image,
    title,
    featured,
    description,
    tags: maybeTags,
    slug,
    githubUrl
  } = project;

  // Ensure 'tags' is typed as an array of strings. If not, default to an empty array.
  const tags = Array.isArray(maybeTags) ? (maybeTags as string[]) : [];

  return (
    // Replaced AnimatedCard with AnimateOnScroll, assuming a default fadeIn animation
    <AnimateOnScroll animation="fadeIn" duration={0.5} delay={0} className="h-full overflow-hidden">
      <Card className="group h-full overflow-hidden">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center&q=80'}
            alt={title || 'Project Image'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {featured && (
            <Badge className="absolute top-2 right-2 z-10">Featured</Badge>
          )}
        </div>
        <CardHeader className="p-4">
          <h3 className="line-clamp-1 text-xl font-semibold">{title}</h3>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={String(tag)} variant="outline">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="outline">+{tags.length - 3}</Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 p-4 pt-0">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/projects/${slug}`} className="flex items-center justify-center">
              Details
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          {githubUrl && (
            <Button asChild variant="outline" size="icon" className="shrink-0">
              <Link href={githubUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center">
                <span className="sr-only">GitHub Repository</span>
                <SiGithub className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </AnimateOnScroll> 
  )
}

export function AnimatedProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, index) => (
        // Replaced Animate with AnimateOnScroll, mapping variant="slide-up" to animation="fadeInUp"
        <AnimateOnScroll
          key={String(project.id)}
          animation="fadeInUp" // Mapped from variant="slide-up"
          delay={0.1 * index}
          duration={0.5}
        >
          {<AnimatedProjectCard project={project} /> as React.ReactNode}
        </AnimateOnScroll>
      ))}
    </div>
  )
}
