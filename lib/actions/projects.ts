'use server'

import { getProjects, Project } from '@/lib/data/projects'

export async function fetchProjects(): Promise<Project[]> {
	try {
		return getProjects()
	} catch (error) {
		console.error('Error fetching projects:', error)
		return []
	}
}

export async function fetchFeaturedProjects(): Promise<Project[]> {
	try {
		const projects = getProjects()
		return projects.filter(project => project.featured)
	} catch (error) {
		console.error('Error fetching featured projects:', error)
		return []
	}
}

export async function fetchProjectById(id: string): Promise<Project | null> {
	try {
		const project = getProjects().find(p => p.id === id)
		return project || null
	} catch (error) {
		console.error(`Error fetching project with id ${id}:`, error)
		return null
	}
}
