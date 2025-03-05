import { cache } from 'react'
import { sampleProjects } from './sample-projects'

export interface Project {
	slug: any
	id: string
	title: string
	description: string
	image?: string
	liveUrl?: string
	githubUrl?: string
	technologies?: string[]
	featured?: boolean
	features?: string[]
}

// Use sample projects data instead of filesystem
export const getProjects = cache((): Project[] => {
	return sampleProjects
})

export function getProjectById(id: string): Project | undefined {
	return getProjects().find(project => project.id === id)
}
