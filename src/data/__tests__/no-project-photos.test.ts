// @vitest-environment node
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'
import { showcaseProjects } from '../projects'

const ROOT = process.cwd()

function photoRefs(source: string): string[] {
  const patterns = [
    'images/projects',
    'images.unsplash.com',
    'unsplashUrl(',
    'ProjectFeaturedImage',
  ]
  return patterns.filter((p) => source.includes(p))
}

function walk(dir: string, skip: (path: string) => boolean): string[] {
  if (!existsSync(dir)) return []
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (skip(full)) continue
    if (statSync(full).isDirectory()) out.push(...walk(full, skip))
    else if (/\.(tsx?|mts|cjs|mjs|js|json|sql)$/.test(name)) out.push(full)
  }
  return out
}

const BLOG_COVER_FILES = [
  'src/data/blog-featured-images.ts',
  'src/lib/unsplash.ts',
  'src/lib/featured-image-url.ts',
  'src/components/ui/image-with-fallback.tsx',
].map((f) => join(ROOT, f))
const BLOG_DIR = join(ROOT, 'src/components/blog')

const skipSrc = (p: string) =>
  p.includes('__tests__') || BLOG_COVER_FILES.includes(p) || p.startsWith(BLOG_DIR)

describe('photo detector', () => {
  it('catches each pattern', () => {
    expect(photoRefs("image: '/images/projects/a.jpg'")).toEqual(['images/projects'])
    expect(photoRefs('https://images.unsplash.com/photo-1')).toEqual(['images.unsplash.com'])
    expect(photoRefs("unsplashUrl('1', 'project')")).toEqual(['unsplashUrl('])
    expect(photoRefs('<ProjectFeaturedImage />')).toEqual(['ProjectFeaturedImage'])
  })
  it('passes clean source', () => {
    expect(photoRefs('const a = 1')).toEqual([])
  })
})

describe('no project photos', () => {
  const srcFiles = walk(join(ROOT, 'src'), skipSrc)
  const others = [
    ...walk(join(ROOT, 'e2e'), () => false),
    ...walk(join(ROOT, 'drizzle'), () => false),
    ...walk(join(ROOT, 'scripts'), () => false),
    join(ROOT, 'next.config.js'),
  ].filter((f) => existsSync(f))

  it('scans more than 50 files (non-vacuous)', () => {
    expect(srcFiles.length + others.length).toBeGreaterThan(50)
  })

  it('src/data/projects.ts does not call unsplashUrl', () => {
    expect(readFileSync(join(ROOT, 'src/data/projects.ts'), 'utf8')).not.toContain('unsplashUrl')
  })

  it('no showcase project has an image key', () => {
    const offenders = showcaseProjects.filter((p) => Object.hasOwn(p, 'image')).map((p) => p.slug)
    expect(offenders).toEqual([])
  })

  it('nothing outside blog covers references images/projects', () => {
    const offenders = [...srcFiles, ...others]
      .filter((f) => readFileSync(f, 'utf8').includes('images/projects'))
      .map((f) => relative(ROOT, f))
    expect(offenders.join('\n')).toBe('')
  })

  it('project and contact surfaces carry none of the photo patterns', () => {
    const files = [
      ...walk(join(ROOT, 'src/app/projects'), (p) => p.includes('__tests__')),
      ...walk(join(ROOT, 'src/components/projects'), (p) => p.includes('__tests__')),
      ...walk(join(ROOT, 'src/components/contact'), (p) => p.includes('__tests__')),
    ].filter((f) => !f.endsWith('metadata.json'))
    expect(files.length).toBeGreaterThan(20)
    const offenders = files
      .map((f) => [relative(ROOT, f), photoRefs(readFileSync(f, 'utf8'))] as const)
      .filter(([, refs]) => refs.length > 0)
      .map(([f, refs]) => `${f}: ${refs.join(', ')}`)
    expect(offenders.join('\n')).toBe('')
  })

  it('public/images/projects is gone', () => {
    expect(existsSync(join(ROOT, 'public/images/projects'))).toBe(false)
  })

  it('ProjectFeaturedImage component file is gone', () => {
    expect(existsSync(join(ROOT, 'src/components/projects/project-featured-image.tsx'))).toBe(false)
  })

  it('unsplash.ts has no project preset', () => {
    expect(readFileSync(join(ROOT, 'src/lib/unsplash.ts'), 'utf8')).not.toMatch(/\bproject:/)
  })

  it('no metadata.json carries an image key', () => {
    const dir = join(ROOT, 'src/app/projects')
    const offenders = readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => join(dir, d.name, 'metadata.json'))
      .filter((f) => existsSync(f))
      .filter((f) => Object.hasOwn(JSON.parse(readFileSync(f, 'utf8')), 'image'))
      .map((f) => relative(ROOT, f))
    expect(offenders.join('\n')).toBe('')
  })
})
