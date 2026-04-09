import { Metadata } from 'next'
import ContactPageClient from './contact-client'

export const dynamic = 'force-static'
export const metadata: Metadata = {
  title: 'Contact | Richard Hudson',
  description: 'Get in touch with Richard Hudson for Revenue Operations consulting, sales optimization, and business growth strategies.',
}

export default function ContactPage() {
  return <ContactPageClient />
}