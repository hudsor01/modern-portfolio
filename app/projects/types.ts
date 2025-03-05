export interface Project {
	id: string
	title: string
	description: string
	image?: string
	featured?: boolean
	tags: string[]
	githubUrl?: string
	demoUrl?: string
	slug: string
}
