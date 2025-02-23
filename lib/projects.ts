"use server"

import { readFile } from "fs/promises"
import path from "path"
import type { Project, ProjectCategory } from "@/types/project"

const projectsFile = path.join(process.cwd(), "content/projects.json")

export async function getProjects(): Promise<Project[]> {
  try {
    const content = await readFile(projectsFile, "utf-8")
    const data = JSON.parse(content)
    return data.projects || []
  } catch (error) {
    console.error("Error reading projects:", error)
    return []
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const projects = await getProjects()
    return projects.find((project) => project.id === id) ?? null
  } catch (error) {
    console.error("Error getting project by id:", error)
    return null
  }
}

export async function getProjectCategories(): Promise<ProjectCategory[]> {
  try {
    const projects = await getProjects()
    const categories = new Map<string, ProjectCategory>()

    projects.forEach((project) => {
      const category = project.category || "Uncategorized"
      if (!categories.has(category)) {
        categories.set(category, {
          name: category,
          slug: category.toLowerCase().replace(/\s+/g, "-"),
          description: `${category} projects`,
        })
      }
    })

    return Array.from(categories.values())
  } catch (error) {
    console.error("Error getting project categories:", error)
    return []
  }
}

export async function getProjectTags(): Promise<string[]> {
  try {
    const projects = await getProjects()
    const tags = new Set<string>()

    projects.forEach((project) => {
      project.tags?.forEach((tag) => tags.add(tag))
    })

    return Array.from(tags)
  } catch (error) {
    console.error("Error getting project tags:", error)
    return []
  }
}

