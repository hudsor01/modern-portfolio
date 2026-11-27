/**
 * Single source for public contact details. Dependency-free so the browser
 * bundle, server code, JSON-LD and the `bun scripts/resume-pdf.ts` script can
 * all import it. Static files that cannot import it (public/llms.txt,
 * public/.well-known/security.txt) are pinned to it by
 * src/lib/__tests__/contact-info.test.ts, as are the profile redirects in
 * src/data/redirects.json.
 */
export const CONTACT = {
  email: 'hudsor01@icloud.com',
  phone: { international: '+1-214-566-0279', display: '214.566.0279' },
  location: { city: 'Dallas', region: 'TX', country: 'US', display: 'Dallas, TX' },
  linkedin: {
    url: 'https://www.linkedin.com/in/hudsor01',
    display: 'linkedin.com/in/hudsor01',
    username: 'hudsor01',
  },
  github: {
    url: 'https://github.com/hudsor01',
    display: 'github.com/hudsor01',
    username: 'hudsor01',
  },
  twitter: { url: 'https://x.com/hudsor01', handle: '@hudsor01', username: 'hudsor01' },
} as const

export const mailtoHref = `mailto:${CONTACT.email}`
export const telHref = `tel:${CONTACT.phone.international.replaceAll('-', '')}`

/**
 * The local area served, as a list that reads after "serving" on /contact.
 * Outside CONTACT on purpose: the résumé data hash covers all of CONTACT
 * (src/lib/resume-source-hash.ts), and the résumé never prints this, so editing
 * it must not mark the PDF stale. A literal, not derived from the city: the
 * cities and the metro region are facts of their own, and contact-info.test.ts
 * fails if this list stops starting at CONTACT.location.city or names a
 * region without it, so a city change cannot leave contradictory copy.
 */
export const SERVICE_AREA =
  'Dallas, Fort Worth, Frisco, and the broader Dallas-Fort Worth Metroplex'
