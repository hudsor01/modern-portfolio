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
} as const

export const mailtoHref = `mailto:${CONTACT.email}`
export const telHref = `tel:${CONTACT.phone.international.replaceAll('-', '')}`

/** The metro area by its short name, as marketing copy and titles say it. */
export const SERVICE_METRO = 'Dallas-Fort Worth'

/** The metro area as a place name (schema.org AdministrativeArea, Person workLocation). */
export const SERVICE_REGION = `${SERVICE_METRO} Metroplex`

/**
 * The local area served: the single source for the ProfessionalService
 * `areaServed` JSON-LD and the /contact "serving …" copy (SERVICE_AREA).
 * Outside CONTACT on purpose: the résumé data hash covers all of CONTACT
 * (src/lib/resume-source-hash.ts), and the résumé never prints this, so editing
 * it must not mark the PDF stale. Literals, not derived from the city: the
 * cities and the metro region are facts of their own, and contact-info.test.ts
 * fails if the list stops starting at CONTACT.location.city or names a region
 * without it, so a city change cannot leave contradictory copy. The same test
 * fails on a bare city name anywhere else in the source unless allow-listed.
 */
export const SERVICE_AREA_PLACES = [
  { '@type': 'City', name: 'Dallas' },
  { '@type': 'City', name: 'Fort Worth' },
  { '@type': 'City', name: 'Frisco' },
  { '@type': 'AdministrativeArea', name: SERVICE_REGION },
] as const

const SERVICE_CITIES = SERVICE_AREA_PLACES.filter((p) => p['@type'] === 'City').map((p) => p.name)

/** The area served, as a list that reads after "serving" on /contact. */
export const SERVICE_AREA = `${SERVICE_CITIES.join(', ')}, and the broader ${SERVICE_REGION}`
