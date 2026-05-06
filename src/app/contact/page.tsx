import { headers } from 'next/headers'
import { generateMetadata } from '@/app/shared-metadata'
import { ProfessionalServiceJsonLd } from '@/components/seo/json-ld/professional-service-json-ld'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import ContactPageClient from './contact-client'

export const dynamic = 'force-static'
export const metadata = generateMetadata(
  'Contact Richard Hudson | Revenue Operations Consulting',
  'Get in touch with Richard Hudson for Revenue Operations consulting, sales optimization, and business growth strategies in Dallas-Fort Worth.',
  '/contact'
)

export default async function ContactPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <ProfessionalServiceJsonLd nonce={nonce} />
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: 'https://richardwhudsonjr.com' },
          { name: 'Contact', url: 'https://richardwhudsonjr.com/contact' },
        ]}
      />
      <ContactPageClient />
    </>
  )
}