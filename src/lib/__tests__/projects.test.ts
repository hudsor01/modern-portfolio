// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  getProjects,
  getProject,
  getFeaturedProjects,
  getProjectsByCategory,
  getCategories,
} from '@/lib/projects'

describe('getProjects', () => {
  it('returns all showcase projects mapped to Project shape', async () => {
    const projects = await getProjects()
    expect(Array.isArray(projects)).toBe(true)
    expect(projects.length).toBeGreaterThan(0)
    const first = projects[0]!
    expect(first).toHaveProperty('id')
    expect(first).toHaveProperty('slug')
    expect(first).toHaveProperty('title')
    expect(first).toHaveProperty('displayMetrics')
    expect(first.viewCount).toBe(0)
    expect(first.clickCount).toBe(0)
    expect(first.createdAt).toBeInstanceOf(Date)
  })
})

describe('getProject', () => {
  it('returns the matching project for a known slug', async () => {
    const all = await getProjects()
    const known = all[0]!
    const single = await getProject(known.slug)
    expect(single?.slug).toBe(known.slug)
  })

  it('returns null for an unknown slug', async () => {
    expect(await getProject('this-does-not-exist')).toBeNull()
  })
})

describe('getFeaturedProjects', () => {
  it('returns only featured projects', async () => {
    const featured = await getFeaturedProjects()
    expect(featured.every((p) => p.featured)).toBe(true)
  })
})

describe('getProjectsByCategory', () => {
  it('filters projects to the specified category', async () => {
    const all = await getProjects()
    const cat = all[0]!.category
    const filtered = await getProjectsByCategory(cat)
    expect(filtered.every((p) => p.category === cat)).toBe(true)
  })

  it('returns empty array for unknown category', async () => {
    expect(await getProjectsByCategory('not-a-category')).toEqual([])
  })
})

describe('getCategories', () => {
  it('returns deduplicated category list', async () => {
    const cats = await getCategories()
    expect(new Set(cats).size).toBe(cats.length)
    expect(cats.length).toBeGreaterThan(0)
  })
})

describe('displayMetrics shape', () => {
  it('iconName is kebab-cased lower string or fallback "circle"', async () => {
    const projects = await getProjects()
    for (const p of projects) {
      for (const m of p.displayMetrics ?? []) {
        expect(typeof m.iconName).toBe('string')
        expect(m.iconName).toBe(m.iconName.toLowerCase())
      }
    }
  })
})
