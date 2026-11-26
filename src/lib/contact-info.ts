/**
 * Single source for public contact details. Dependency-free so the browser
 * bundle, server code, JSON-LD and the `bun scripts/resume-pdf.ts` script can
 * all import it. Static files that cannot import it (public/llms.txt,
 * vercel.json, public/.well-known/security.txt) are pinned to it by
 * src/lib/__tests__/contact-info.test.ts.
 */
export const CONTACT = {
  email: 'hudsor01@icloud.com',
  phone: { international: '+1-214-566-0279', display: '214.566.0279' },
  location: { city: 'Dallas', region: 'TX', country: 'US', display: 'Dallas, TX' },
  linkedin: { url: 'https://www.linkedin.com/in/hudsor01', display: 'linkedin.com/in/hudsor01' },
  github: { url: 'https://github.com/hudsor01', display: 'github.com/hudsor01' },
  twitter: { url: 'https://twitter.com/hudsor01', handle: '@hudsor01' },
} as const

export const mailtoHref = `mailto:${CONTACT.email}`
export const telHref = `tel:${CONTACT.phone.international.replaceAll('-', '')}`
