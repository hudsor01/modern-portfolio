import { generateMetadata } from '@/app/shared-metadata'
import ContactPageClient from './contact-client'

export const dynamic = 'force-static'
export const metadata = generateMetadata(
  'Contact Richard Hudson | Revenue Operations Consulting',
  'Get in touch with Richard Hudson for Revenue Operations consulting, sales optimization, and business growth strategies in Dallas-Fort Worth.',
  '/contact'
)

export default function ContactPage() {
  return <ContactPageClient />
}