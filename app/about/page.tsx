import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config/site'
import { AnimatedHeading } from '@/components/ui/animated-heading'
import { SuspenseWrapper } from '@/components/suspense-wrapper'

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
		<div className='container-custom py-16'>
			<div className='mb-12 text-center'>
				<SuspenseWrapper>
					<AnimatedHeading
						level='h1'
						text={['About Me', 'My Story', 'My Background']}
						className='text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl'
						typeSpeed={100}
						delaySpeed={2000}
					/>
				</SuspenseWrapper>
				<p className='text-muted-foreground mx-auto mt-4 max-w-2xl text-lg'>
					Revenue Operations Professional with a passion for driving business growth
				</p>
			</div>

			{/* Content goes here */}
			<div className='content-container'>
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
