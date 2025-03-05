import { Project } from './projects'

export const sampleProjects: Project[] = [
	{
		id: 'revenue-dashboard',
		slug: 'revenue-dashboard',
		title: 'Revenue Dashboard',
		description:
			'An interactive dashboard for tracking and analyzing revenue metrics with advanced visualization features.',
		image: '/images/projects/revenue-dashboard.jpg',
		liveUrl: 'https://example.com/revenue-dashboard',
		githubUrl: 'https://github.com/example/revenue-dashboard',
		technologies: ['React', 'TypeScript', 'D3.js', 'TailwindCSS', 'Next.js'],
		featured: true,
		features: [
			'Real-time data visualization',
			'Customizable dashboard widgets',
			'Revenue forecasting',
			'Data export capabilities',
		],
	},
	{
		id: 'marketing-automation',
		slug: 'marketing-automation',
		title: 'Marketing Automation Platform',
		description:
			'A comprehensive marketing automation system designed to streamline campaign management and lead generation.',
		image: '/images/projects/marketing-automation.jpg',
		liveUrl: 'https://example.com/marketing-automation',
		githubUrl: 'https://github.com/example/marketing-automation',
		technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'Redis'],
		featured: true,
		features: [
			'Email campaign automation',
			'Lead scoring and qualification',
			'A/B testing capabilities',
			'Performance analytics',
		],
	},
	{
		id: 'data-visualization',
		slug: 'data-visualization',
		title: 'Data Visualization Toolkit',
		description:
			'A powerful data visualization toolkit that transforms complex datasets into intuitive, interactive visual representations.',
		image: '/images/projects/data-visualization.jpg',
		liveUrl: 'https://example.com/data-visualization',
		githubUrl: 'https://github.com/example/data-visualization',
		technologies: ['D3.js', 'React', 'TypeScript', 'SVG', 'Canvas API'],
		featured: true,
		features: [
			'Interactive chart components',
			'Real-time data updates',
			'Customizable visual themes',
			'Cross-browser compatibility',
		],
	},
	{
		id: 'crm-integration',
		slug: 'crm-integration',
		title: 'CRM Integration Suite',
		description:
			'A seamless integration solution that connects various CRM platforms with other business systems for improved workflow efficiency.',
		image: '/images/projects/crm-integration.jpg',
		liveUrl: 'https://example.com/crm-integration',
		githubUrl: 'https://github.com/example/crm-integration',
		technologies: ['API Development', 'Node.js', 'Express', 'MongoDB', 'OAuth'],
		featured: true,
		features: [
			'Multi-platform CRM connectivity',
			'Data synchronization',
			'Custom workflow automation',
			'Secure data transfer',
		],
	},
	{
		id: 'sales-analytics',
		slug: 'sales-analytics',
		title: 'Sales Analytics Platform',
		description:
			'A comprehensive analytics platform focused on sales performance tracking, forecasting, and team management.',
		image: '/images/projects/sales-analytics.jpg',
		liveUrl: 'https://example.com/sales-analytics',
		githubUrl: 'https://github.com/example/sales-analytics',
		technologies: ['React', 'Redux', 'Express', 'PostgreSQL', 'Chart.js'],
		featured: true,
		features: [
			'Sales performance dashboards',
			'Team productivity tracking',
			'Pipeline visualization',
			'Goal setting and monitoring',
		],
	},
	{
		id: 'lead-generation',
		slug: 'lead-generation',
		title: 'Lead Generation System',
		description:
			'An intelligent lead generation system that identifies, captures, and qualifies potential customers through multiple channels.',
		image: '/images/projects/lead-generation.jpg',
		liveUrl: 'https://example.com/lead-generation',
		githubUrl: 'https://github.com/example/lead-generation',
		technologies: ['Next.js', 'Machine Learning', 'TensorFlow.js', 'Firebase', 'TailwindCSS'],
		featured: true,
		features: [
			'Intelligent lead scoring',
			'Multi-channel capture',
			'Automated qualification',
			'Integration with CRM systems',
		],
	},
]
