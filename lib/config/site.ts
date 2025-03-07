export const siteConfig = {
	name: 'Richard Hudson | Revenue Operations Professional',
	description:
		'Driving business growth through data-driven insights, process optimization, and strategic operational improvements.',
	url: 'https://richardwhudsonjr.com',
	ogImage: 'https://richardwhudsonjr.com/richard.jpg',
	links: {
		github: 'https://github.com/hudsonr01',
		linkedin: 'https://linkedin.com/in/hudsor01',
		email: 'hello@richardwhudsonjr.com',
	},
	mainNav: [
		{ title: 'Home', href: '/' },
		{ title: 'About', href: '/about' },
		{ title: 'Projects', href: '/projects' },
		{ title: 'Resume', href: '/resume' },
		{ title: 'Contact', href: '/contact' },
	],
	footerNav: {
		resources: [
			{ title: 'Projects', href: '/projects' },
			{ title: 'Resume', href: '/resume' },
			{ title: 'Contact', href: '/contact' },
		],
	},
	keywords: [
		'Richard Hudson',
		'Revenue Operations',
		'Data Analysis',
		'Process Optimization',
		'Business Intelligence',
		'Strategic Planning',
		'Cross-functional Leadership',
		'Portfolio',
		'Resume',
	],
	author: {
		name: 'Richard Hudson',
		url: 'https://richardwhudsonjr.com',
	},
}

export type SiteConfig = typeof siteConfig
