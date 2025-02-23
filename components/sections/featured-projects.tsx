"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, ExternalLink, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  demoUrl?: string
  githubUrl?: string
  category: string
}

interface FeaturedProjectsProps {
  projects: Project[]
  className?: string
}

export function FeaturedProjects({ projects, className }: FeaturedProjectsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Get unique categories from projects
  const categories = ["all", ...Array.from(new Set(projects.map((project) => project.category)))]

  // Filter projects based on selected category
  const filteredProjects =
    selectedCategory === "all" ? projects : projects.filter((project) => project.category === selectedCategory)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className={cn("py-20", className)}>
      <div className="container px-4">
        <div className="flex flex-col gap-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Projects</h2>
              <p className="text-lg text-muted-foreground">Some of my recent work and side projects.</p>
            </div>

            {/* Category Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  {selectedCategory === "all" ? "All Projects" : selectedCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {categories.map((category) => (
                  <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)} className="capitalize">
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Projects Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProjects.map((project) => (
              <motion.div key={project.id} variants={itemVariants}>
                <Card className="group overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(min-width: 1280px) 400px, (min-width: 1040px) 33vw, (min-width: 780px) 50vw, 100vw"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{project.title}</CardTitle>
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
                    <div className="flex gap-2">
                      {project.demoUrl && (
                        <Button variant="outline" size="sm" className="group/button" asChild>
                          <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2 transition-transform group-hover/button:scale-110" />
                            Demo
                          </Link>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button variant="outline" size="sm" className="group/button" asChild>
                          <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2 transition-transform group-hover/button:scale-110" />
                            Code
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* View All Projects Button */}
          <div className="flex justify-center mt-8">
            <Button asChild>
              <Link href="/projects">
                View All Projects
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

