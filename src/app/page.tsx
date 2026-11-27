import HomePageContent from '@/components/layout/home-page-content'
import { generateMetadata as genMeta } from '@/app/shared-metadata'
import { getFeaturedProjects } from '@/lib/projects'
import { REVENUE_IMPACT } from '@/lib/stats'
import { SERVICE_METRO } from '@/lib/contact-info'

export const dynamic = 'force-static'

export const metadata = genMeta({
  title: `Richard Hudson | RevOps Professional in ${SERVICE_METRO}`,
  absoluteTitle: true,
  description: `Richard Hudson — Revenue Operations Professional in ${SERVICE_METRO}. Salesloft Admin (L1/L2) and HubSpot RevOps certified. ${REVENUE_IMPACT} revenue impact.`,
  path: '/',
  ogTitle: 'Richard Hudson',
  subtitle: 'Revenue Operations Professional',
  ogAlt: 'Richard Hudson - Revenue Operations Professional',
})

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects()

  return (
    <div className="animate-fade-in-up">
      <HomePageContent featuredProjects={featuredProjects} />
    </div>
  )
}
