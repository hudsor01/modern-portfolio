"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "./project-card"
import type { Project } from "@/types/project"

interface ProjectFilterProps {
  projects: Project[]
}

export function ProjectFilter({ projects }: ProjectFilterProps) {
  const [selectedFilter, setSelectedFilter] = React.useState("all")

  // Get unique technologies from all projects
  const filters = React.useMemo(() => {
    const techs = projects.flatMap((project) => project.technologies)
    return ["all", ...new Set(techs)]
  }, [projects])

  const filteredProjects = React.useMemo(() => {
    if (selectedFilter === "all") return projects
    return projects.filter((project) => project.technologies.includes(selectedFilter))
  }, [selectedFilter, projects])

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFilter(filter)}
            className="capitalize"
          >
            {filter}
          </Button>
        ))}
      </div>

      <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

