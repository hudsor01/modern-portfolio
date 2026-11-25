// @vitest-environment node
import type { ReactElement } from 'react'
import { describe, expect, it } from 'vitest'
import { PersonJsonLd } from '@/components/seo/json-ld/person-json-ld'
import { ProfilePageJsonLd } from '@/components/seo/json-ld/profile-page-json-ld'

type Script = ReactElement<{ dangerouslySetInnerHTML: { __html: string } }>
const parse = (el: unknown) => JSON.parse((el as Script).props.dangerouslySetInnerHTML.__html)

describe('ProfilePageJsonLd', () => {
  const page = parse(ProfilePageJsonLd({}))
  const person = parse(PersonJsonLd({}))

  it('is a ProfilePage for /about whose mainEntity is the sitewide Person', () => {
    expect(page['@type']).toBe('ProfilePage')
    expect(page.url).toBe('https://richardwhudsonjr.com/about')
    expect(page.mainEntity['@type']).toBe('Person')
    expect(page.mainEntity['@id']).toBe(person['@id'])
    expect(person['@id']).toBe('https://richardwhudsonjr.com/#person')
  })

  it("carries Google's required name and the recommended image and sameAs, matching Person", () => {
    expect(page.mainEntity.name).toBe(person.name)
    expect(page.mainEntity.image).toBe(person.image)
    expect(page.mainEntity.sameAs).toEqual(person.sameAs)
  })
})
