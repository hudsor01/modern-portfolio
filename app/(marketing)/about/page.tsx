import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config/site'

export const metadata: Metadata = {
	title: 'About | Richard Hudson',
	description:
		"Learn more about Richard Hudson's experience, skills, and approach to revenue operations and business growth.",
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: `${siteConfig.url}/about`,
		title: 'About Richard Hudson | Revenue Operations Professional',
		description:
			"Learn more about Richard Hudson's experience, skills, and approach to revenue operations and business growth.",
		siteName: siteConfig.name,
		images: [
			{
				url: `${siteConfig.url}/og/about.jpg`,
				width: 1200,
				height: 630,
				alt: 'About Richard Hudson',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: 'About Richard Hudson | Revenue Operations Professional',
		description:
			"Learn more about Richard Hudson's experience, skills, and approach to revenue operations and business growth.",
		images: [`${siteConfig.url}/og/about.jpg`],
	},
}

export default function AboutPage() {
	return (
		<div className='container mx-auto max-w-7xl px-4 py-16'>
			<div className='mb-12 text-center'>
				<h1 className='text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl'>
					About{' '}
					<span className='from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-transparent'>
						Me
					</span>
				</h1>
				<p className='text-muted-foreground mx-auto mt-4 max-w-2xl text-lg'>
					Revenue Operations Professional with a passion for driving business growth
				</p>
			</div>

			{/* Content goes here */}
			<div className='prose dark:prose-invert prose-lg mx-auto'>
				<p>
					I&apos;m Richard Hudson, a Revenue Operations Professional with over 7 years of
					experience optimizing business processes and driving growth. My expertise lies
					in developing data-driven strategies that enhance operational efficiency and
					improve financial outcomes.
				</p>

				{/* More content can be added here */}
			</div>
		</div>
	)
}
