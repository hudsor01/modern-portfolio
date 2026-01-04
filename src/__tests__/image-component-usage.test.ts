/**
 * Property-Based Tests for Image Component Usage
 *
 * **Property 4: Image Component Usage**
 * **Validates: Requirements 3.4**
 *
 * Feature: type-safety-improvements, Property 4: Image Component Usage
 *
 * This test validates that React components use Next.js Image component
 * instead of HTML img tags where optimization is beneficial.
 */

import { describe, it, expect } from 'bun:test'
import * as fc from 'fast-check'
import * as fs from 'fs'
import * as path from 'path'

// ============================================================================
// GENERATORS FOR PROPERTY-BASED TESTING
// ============================================================================

/**
 * Generator for TSX file paths in the src directory
 */
const tsxFilePathGenerator = (): fc.Arbitrary<string> => {
  const srcDir = path.join(process.cwd(), 'src')
  const tsxFiles: string[] = []

  const findTsxFiles = (dir: string): void => {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true })
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          findTsxFiles(fullPath)
        } else if (
          entry.isFile() &&
          entry.name.endsWith('.tsx') &&
          !entry.name.includes('.test.')
        ) {
          tsxFiles.push(fullPath)
        }
      }
    } catch {
      // Ignore permission errors
    }
  }

  findTsxFiles(srcDir)

  if (tsxFiles.length === 0) {
    return fc.constant('')
  }

  return fc.constantFrom(...tsxFiles)
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Checks if a file contains HTML img tags that should be replaced with Next.js Image
 * Returns an object with the analysis results
 */
interface ImgTagAnalysis {
  hasImgTags: boolean
  hasNextImageImport: boolean
  imgTagCount: number
  hasEslintDisable: boolean
  isTestMock: boolean
  isMarkdownParser: boolean
  filePath: string
}

const analyzeImageUsage = (filePath: string): ImgTagAnalysis => {
  if (!filePath || !fs.existsSync(filePath)) {
    return {
      hasImgTags: false,
      hasNextImageImport: false,
      imgTagCount: 0,
      hasEslintDisable: false,
      isTestMock: false,
      isMarkdownParser: false,
      filePath,
    }
  }

  const content = fs.readFileSync(filePath, 'utf-8')

  // Check for Next.js Image import
  const hasNextImageImport = /from\s+['"]next\/image['"]/.test(content)

  // Check for HTML img tags (JSX format)
  const imgTagMatches = content.match(/<img\s/g) || []
  const imgTagCount = imgTagMatches.length

  // Check for ESLint disable comment for no-img-element
  const hasEslintDisable = /@next\/next\/no-img-element/.test(content)

  // Check if this is a test mock (intentional img usage for mocking)
  const isTestMock =
    filePath.includes('.test.') ||
    filePath.includes('__tests__') ||
    (content.includes('vi.mock') && content.includes('next/image'))

  // Check if this is a markdown parser (generates HTML strings)
  const isMarkdownParser =
    content.includes('dangerouslySetInnerHTML') ||
    content.includes('parseMarkdown') ||
    (content.includes('.replace(') && content.includes('<img'))

  return {
    hasImgTags: imgTagCount > 0,
    hasNextImageImport,
    imgTagCount,
    hasEslintDisable,
    isTestMock,
    isMarkdownParser,
    filePath,
  }
}

/**
 * Determines if an img tag usage is acceptable
 * Acceptable cases:
 * 1. Test mocks (intentional for testing)
 * 2. Markdown parsers (generate HTML strings)
 * 3. Has ESLint disable comment (acknowledged exception)
 */
const isAcceptableImgUsage = (analysis: ImgTagAnalysis): boolean => {
  if (!analysis.hasImgTags) return true
  return analysis.isTestMock || analysis.isMarkdownParser || analysis.hasEslintDisable
}

// ============================================================================
// PROPERTY TESTS
// ============================================================================

describe('Image Component Usage', () => {
  describe('Property 4: Image Component Usage', () => {
    it('React components should use Next.js Image component instead of HTML img tags where optimization is beneficial', () => {
      fc.assert(
        fc.property(tsxFilePathGenerator(), (filePath) => {
          if (!filePath) return true // Skip if no files found

          const analysis = analyzeImageUsage(filePath)

          // If the file has img tags, they should be in acceptable contexts
          if (analysis.hasImgTags) {
            const isAcceptable = isAcceptableImgUsage(analysis)

            // If not acceptable, the file should have Next.js Image import
            // (meaning it's using both, which is unusual but might be valid)
            if (!isAcceptable && !analysis.hasNextImageImport) {
              // This is a violation - img tag without Next.js Image and not in acceptable context
              throw new Error(
                `File ${analysis.filePath} has unacceptable img tag usage (${analysis.imgTagCount} img tags)`
              )
            }
          }

          return true
        }),
        { numRuns: 25 }
      )
    })

    it('files with Next.js Image import should not have unacknowledged HTML img tags', () => {
      fc.assert(
        fc.property(tsxFilePathGenerator(), (filePath) => {
          if (!filePath) return true

          const analysis = analyzeImageUsage(filePath)

          // If file imports Next.js Image and has img tags, they should be acknowledged
          if (analysis.hasNextImageImport && analysis.hasImgTags) {
            const isAcceptable = isAcceptableImgUsage(analysis)
            expect(isAcceptable).toBe(true)
          }

          return true
        }),
        { numRuns: 25 }
      )
    })

    it('all img tag usages should be in acceptable contexts', () => {
      fc.assert(
        fc.property(tsxFilePathGenerator(), (filePath) => {
          if (!filePath) return true

          const analysis = analyzeImageUsage(filePath)

          if (analysis.hasImgTags) {
            // Every img tag should be in an acceptable context
            const isAcceptable = isAcceptableImgUsage(analysis)

            // Provide detailed error message if not acceptable
            if (!isAcceptable) {
              console.error(
                `File ${filePath} has ${analysis.imgTagCount} img tag(s) without acceptable context`
              )
            }

            expect(isAcceptable).toBe(true)
          }

          return true
        }),
        { numRuns: 25 }
      )
    })
  })

  describe('Image Component Best Practices', () => {
    it('components with images should import Next.js Image for optimization', () => {
      fc.assert(
        fc.property(tsxFilePathGenerator(), (filePath) => {
          if (!filePath) return true

          const analysis = analyzeImageUsage(filePath)

          // If file has img tags that are not in acceptable contexts,
          // it should have Next.js Image import
          if (analysis.hasImgTags && !isAcceptableImgUsage(analysis)) {
            expect(analysis.hasNextImageImport).toBe(true)
          }

          return true
        }),
        { numRuns: 25 }
      )
    })
  })
})
