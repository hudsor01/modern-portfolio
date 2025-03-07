import { getProjects, getProjectById, Project } from '@/lib/data/projects'

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
		const projects = await getProjects()
		return projects.filter((project: Project) => project.featured)
	} catch (error) {
		console.error('Error fetching featured projects:', error)
		return []
	}
}

export async function fetchProjectById(slug: string): Promise<Project | null> {
	try {
		// Use the dedicated getProjectById function from the data module
		const project = getProjectById(slug);
		return project || null;
	} catch (error) {
		console.error(`Error fetching project with slug ${slug}:`, error);
		return null;
	}
}
