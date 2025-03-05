import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = siteConfig.url

	// Core pages
	const routes = [
		{
			url: `${baseUrl}`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as const,
			priority: 1,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as const,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/projects`,
			lastModified: new Date(),
			changeFrequency: 'weekly' as const,
			priority: 0.9,
		},
		{
			url: `${baseUrl}/resume`,
			lastModified: new Date(),
			changeFrequency: 'monthly' as const,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/contact`,
			lastModified: new Date(),
			changeFrequency: 'yearly' as const,
			priority: 0.7,
		},
	]

	// You could dynamically add project routes here by importing getProjects()
	// For example:
	// const projects = getProjects()
	// const projectRoutes = projects.map(project => ({
	//   url: `${baseUrl}/projects/${project.id}`,
	//   lastModified: new Date(),
	//   changeFrequency: 'monthly' as const,
	//   priority: 0.7,
	// }))

	// return [...routes, ...projectRoutes]
	return routes
}
