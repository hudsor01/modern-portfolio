import axios from 'axios'
import { format, parseISO } from 'date-fns'

// Create axios instance with defaults
const api = axios.create({
	baseURL: '/api',
	headers: {
		'Content-Type': 'application/json',
	},
})

// Example project data interface
export interface Project {
	slug: string
	id: string
	title: string
	description: string
	technologies: string[]
	imageUrl: string
	githubUrl: string
	liveUrl?: string
	date: string
	featured: boolean
}

// Format dates with date-fns
export const formatProjectDate = (dateString: string) => {
	try {
		return format(parseISO(dateString), 'MMMM dd, yyyy')
	} catch (error) {
		console.error('Invalid date format', error)
		return dateString
	}
}

// API functions
export const fetchProjects = async (): Promise<Project[]> => {
	const { data } = await api.get('/projects')
	return data
}

export const fetchFeaturedProjects = async (): Promise<Project[]> => {
	const { data } = await api.get('/projects?featured=true')
	return data
}

export const fetchProjectById = async (id: string): Promise<Project> => {
	const { data } = await api.get(`/projects/${id}`)
	return data
}

export const sendContactForm = async (formData: any) => {
	const { data } = await api.post('/contact', formData)
	return data
}

export default api
