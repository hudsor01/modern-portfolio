interface SEOScore {
	title: number
	description: number
	keywords: number
	content: number
	overall: number
}

interface SEOSuggestion {
	type: 'title' | 'description' | 'keywords' | 'content'
	message: string
	priority: 'high' | 'medium' | 'low'
}

export function analyzeSEO(content: {
	title: string
	description: string
	keywords: string[]
	content: string
}): { score: SEOScore; suggestions: SEOSuggestion[] } {
	const suggestions: SEOSuggestion[] = []
	const score: SEOScore = {
		title: analyzeTitleScore(content.title, suggestions),
		description: analyzeDescriptionScore(content.description, suggestions),
		keywords: analyzeKeywordsScore(content.keywords, suggestions),
		content: analyzeContentScore(content.content, suggestions),
		overall: 0,
	}

	// Calculate overall score
	score.overall = Math.round(
		(score.title + score.description + score.keywords + score.content) / 4
	)

	return { score, suggestions }
}

function analyzeTitleScore(title: string, suggestions: SEOSuggestion[]): number {
	let score = 100

	if (title.length < 30) {
		score -= 20
		suggestions.push({
			type: 'title',
			message: 'Title is too short. Aim for 30-60 characters.',
			priority: 'high',
		})
	} else if (title.length > 60) {
		score -= 20
		suggestions.push({
			type: 'title',
			message: 'Title is too long. Keep it under 60 characters.',
			priority: 'high',
		})
	}

	if (!title.match(/^[A-Z]/)) {
		score -= 10
		suggestions.push({
			type: 'title',
			message: 'Title should start with a capital letter.',
			priority: 'medium',
		})
	}

	return Math.max(0, score)
}

function analyzeDescriptionScore(description: string, suggestions: SEOSuggestion[]): number {
	let score = 100

	if (description.length < 120) {
		score -= 20
		suggestions.push({
			type: 'description',
			message: 'Description is too short. Aim for 120-160 characters.',
			priority: 'high',
		})
	} else if (description.length > 160) {
		score -= 20
		suggestions.push({
			type: 'description',
			message: 'Description is too long. Keep it under 160 characters.',
			priority: 'high',
		})
	}

	return Math.max(0, score)
}

function analyzeKeywordsScore(keywords: string[], suggestions: SEOSuggestion[]): number {
	let score = 100

	if (keywords.length < 3) {
		score -= 20
		suggestions.push({
			type: 'keywords',
			message: 'Add more keywords. Aim for 3-10 relevant keywords.',
			priority: 'medium',
		})
	} else if (keywords.length > 10) {
		score -= 20
		suggestions.push({
			type: 'keywords',
			message: 'Too many keywords. Keep it under 10 keywords.',
			priority: 'medium',
		})
	}

	return Math.max(0, score)
}

function analyzeContentScore(content: string, suggestions: SEOSuggestion[]): number {
	let score = 100
	const wordCount = content.trim().split(/\s+/).length

	if (wordCount < 300) {
		score -= 20
		suggestions.push({
			type: 'content',
			message: 'Content is too short. Aim for at least 300 words.',
			priority: 'high',
		})
	}

	if (!content.includes('\n\n')) {
		score -= 10
		suggestions.push({
			type: 'content',
			message: 'Add more paragraphs to improve readability.',
			priority: 'medium',
		})
	}

	return Math.max(0, score)
}
