import { siteConfig } from '../config/site'

export function getCanonicalUrl(path: string): string {
	// Remove trailing slash
	const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path

	// Remove query parameters
	const pathWithoutQuery = cleanPath.split('?')[0]

	// Handle pagination
	const paginationMatch = pathWithoutQuery.match(/\/page\/\d+/)
	if (paginationMatch) {
		// Remove pagination from canonical URL
		return `${siteConfig.url}${pathWithoutQuery.replace(paginationMatch[0], '')}`
	}

	// Handle preview mode
	if (pathWithoutQuery.includes('/preview/')) {
		return `${siteConfig.url}${pathWithoutQuery.replace('/preview/', '/')}`
	}

	return `${siteConfig.url}${pathWithoutQuery}`
}

export function shouldNoIndex(path: string): boolean {
	// List of paths that should not be indexed
	const noIndexPaths = ['/admin', '/preview', '/api', '/login', '/404', '/500', '/maintenance']

	return noIndexPaths.some(noIndexPath => path.startsWith(noIndexPath))
}
