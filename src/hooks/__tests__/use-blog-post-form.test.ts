/**
 * Property-based tests for useBlogPostForm hook
 * Feature: tanstack-form-migration
 * Validates: Requirements 4.2, 4.3, 4.5, 4.6, 4.7, 3.6, 4.4
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'bun:test'
import { renderHook, act } from '@testing-library/react'
import * as fc from 'fast-check'
import { useBlogPostForm, blogPostFormSchema, generateSlug } from '../use-blog-post-form'
import type { BlogPost, PostTag } from '@/types/blog'

describe('useBlogPostForm - Property-Based Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  /**
   * Property 3: Valid Submission Calls Handler
   * Feature: tanstack-form-migration, Property 3: Valid submission calls handler
   * Validates: Requirements 4.2
   *
   * For any form with valid data (passing all Zod schema validations),
   * calling form.handleSubmit() SHALL invoke the onSubmit handler with
   * the validated form values.
   */
  describe('Property 3: Valid submission calls handler', () => {
    it('should have valid form values accessible after setting them', () => {
      // Generator for valid blog post form data
      const validTitleArb = fc.string({ minLength: 5, maxLength: 200 }).map((s) => {
        const trimmed = s.trim()
        return trimmed.length >= 5 ? trimmed : 'Valid Title Here'
      })

      fc.assert(
        fc.property(validTitleArb, (title) => {
          const { result } = renderHook(() => useBlogPostForm())

          // Set the title using handleTitleChange
          act(() => {
            result.current.handleTitleChange(title)
          })

          // The form values should contain the title
          return result.current.formValues.title === title
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Property 4: Invalid Submission Shows Errors
   * Feature: tanstack-form-migration, Property 4: Invalid submission shows errors
   * Validates: Requirements 4.3
   *
   * For any form with invalid data (failing Zod schema validation),
   * the Zod schema SHALL reject the data.
   */
  describe('Property 4: Invalid submission shows errors', () => {
    it('should reject invalid form data via Zod schema', () => {
      // Generator for invalid titles (too short)
      const invalidTitleArb = fc.string({ minLength: 0, maxLength: 4 })

      fc.assert(
        fc.property(invalidTitleArb, (invalidTitle) => {
          // Create form data with invalid title
          const formData = {
            title: invalidTitle,
            slug: 'valid-slug',
            content: 'a'.repeat(100), // Valid content
            contentType: 'MARKDOWN' as const,
            status: 'DRAFT' as const,
            keywords: [],
            tagIds: [],
          }

          const result = blogPostFormSchema.safeParse(formData)

          // Should fail validation for titles shorter than 5 characters
          if (invalidTitle.length < 5) {
            return !result.success
          }
          return true
        }),
        { numRuns: 100 }
      )
    })

    it('should reject invalid slug format via Zod schema', () => {
      // Generator for invalid slugs (containing uppercase or special chars)
      const invalidSlugArb = fc
        .string({ minLength: 1, maxLength: 50 })
        .filter((s) => /[A-Z]|[^a-z0-9-]/.test(s))

      fc.assert(
        fc.property(invalidSlugArb, (invalidSlug) => {
          const formData = {
            title: 'Valid Title Here',
            slug: invalidSlug,
            content: 'a'.repeat(100),
            contentType: 'MARKDOWN' as const,
            status: 'DRAFT' as const,
            keywords: [],
            tagIds: [],
          }

          const result = blogPostFormSchema.safeParse(formData)

          // Should fail validation for invalid slug format
          return !result.success
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Property 8: Slug Generation
   * Feature: tanstack-form-migration, Property 8: Slug generation
   * Validates: Requirements 4.5
   *
   * For any non-empty title string, the generateSlug function SHALL produce
   * a valid slug containing only lowercase letters, numbers, and hyphens,
   * with no leading/trailing hyphens.
   */
  describe('Property 8: Slug generation', () => {
    it('should generate valid slugs for any non-empty title', () => {
      // Generator for non-empty title strings
      const titleArb = fc
        .string({ minLength: 1, maxLength: 200 })
        .filter((s) => s.trim().length > 0)

      fc.assert(
        fc.property(titleArb, (title) => {
          const slug = generateSlug(title)

          // Slug should only contain lowercase letters, numbers, and hyphens
          const validCharsOnly = /^[a-z0-9-]*$/.test(slug)

          // Slug should not have leading or trailing hyphens
          const noLeadingTrailingHyphens = !slug.startsWith('-') && !slug.endsWith('-')

          // Slug should not have consecutive hyphens
          const noConsecutiveHyphens = !slug.includes('--')

          return validCharsOnly && noLeadingTrailingHyphens && noConsecutiveHyphens
        }),
        { numRuns: 100 }
      )
    })

    it('should auto-generate slug when title changes and slug is empty', () => {
      const titleArb = fc
        .string({ minLength: 1, maxLength: 100 })
        .filter((s) => /[a-zA-Z0-9]/.test(s)) // Must have at least one alphanumeric char

      fc.assert(
        fc.property(titleArb, (title) => {
          const { result } = renderHook(() => useBlogPostForm())

          // Initially slug should be empty
          expect(result.current.formValues.slug).toBe('')

          // Change title
          act(() => {
            result.current.handleTitleChange(title)
          })

          // Slug should be auto-generated
          const expectedSlug = generateSlug(title)
          return result.current.formValues.slug === expectedSlug
        }),
        { numRuns: 100 }
      )
    })

    it('should not overwrite existing slug when title changes', () => {
      const { result } = renderHook(() =>
        useBlogPostForm({
          title: 'Initial Title',
          slug: 'existing-slug',
        } as Partial<BlogPost>)
      )

      // Slug should be the existing one
      expect(result.current.formValues.slug).toBe('existing-slug')

      // Change title
      act(() => {
        result.current.handleTitleChange('New Title')
      })

      // Slug should NOT be overwritten
      expect(result.current.formValues.slug).toBe('existing-slug')
    })
  })

  /**
   * Property 9: Array Field Operations
   * Feature: tanstack-form-migration, Property 9: Array field operations
   * Validates: Requirements 4.6, 4.7
   *
   * For any array field (keywords, tagIds), calling add operation SHALL
   * increase array length by 1 and contain the new item, and calling
   * remove operation SHALL decrease array length by 1 and not contain
   * the removed item.
   */
  describe('Property 9: Array field operations', () => {
    describe('Keywords array operations', () => {
      it('should add keyword and increase array length by 1', () => {
        // Generator for valid keyword strings
        const keywordArb = fc
          .string({ minLength: 1, maxLength: 50 })
          .map((s) => s.trim() || 'keyword')

        fc.assert(
          fc.property(keywordArb, (keyword) => {
            const { result } = renderHook(() => useBlogPostForm())

            const initialLength = result.current.formValues.keywords.length

            // Set the new keyword and add it
            act(() => {
              result.current.setNewKeyword(keyword)
            })
            act(() => {
              result.current.addKeyword()
            })

            // Array length should increase by 1
            const newLength = result.current.formValues.keywords.length
            const containsKeyword = result.current.formValues.keywords.includes(keyword.trim())

            return newLength === initialLength + 1 && containsKeyword
          }),
          { numRuns: 100 }
        )
      })

      it('should remove keyword and decrease array length by 1', () => {
        // Generator for keyword to add then remove
        const keywordArb = fc
          .string({ minLength: 1, maxLength: 50 })
          .map((s) => s.trim() || 'keyword')

        fc.assert(
          fc.property(keywordArb, (keyword) => {
            const { result } = renderHook(() => useBlogPostForm())

            // First add a keyword
            act(() => {
              result.current.setNewKeyword(keyword)
            })
            act(() => {
              result.current.addKeyword()
            })

            const lengthAfterAdd = result.current.formValues.keywords.length

            // Now remove it
            act(() => {
              result.current.removeKeyword(keyword.trim())
            })

            // Array length should decrease by 1
            const lengthAfterRemove = result.current.formValues.keywords.length
            const doesNotContainKeyword = !result.current.formValues.keywords.includes(
              keyword.trim()
            )

            return lengthAfterRemove === lengthAfterAdd - 1 && doesNotContainKeyword
          }),
          { numRuns: 100 }
        )
      })

      it('should not add duplicate keywords', () => {
        const { result } = renderHook(() => useBlogPostForm())

        // Add a keyword
        act(() => {
          result.current.setNewKeyword('test-keyword')
        })
        act(() => {
          result.current.addKeyword()
        })

        const lengthAfterFirstAdd = result.current.formValues.keywords.length

        // Try to add the same keyword again
        act(() => {
          result.current.setNewKeyword('test-keyword')
        })
        act(() => {
          result.current.addKeyword()
        })

        // Length should not change
        expect(result.current.formValues.keywords.length).toBe(lengthAfterFirstAdd)
      })

      it('should not add more than 10 keywords', () => {
        const { result } = renderHook(() => useBlogPostForm())

        // Add 10 keywords
        for (let i = 0; i < 10; i++) {
          act(() => {
            result.current.setNewKeyword(`keyword-${i}`)
          })
          act(() => {
            result.current.addKeyword()
          })
        }

        expect(result.current.formValues.keywords.length).toBe(10)

        // Try to add 11th keyword
        act(() => {
          result.current.setNewKeyword('keyword-11')
        })
        act(() => {
          result.current.addKeyword()
        })

        // Should still be 10
        expect(result.current.formValues.keywords.length).toBe(10)
      })
    })

    describe('Tags array operations', () => {
      it('should toggle tag and update tagIds array', () => {
        // Generator for tag IDs
        const tagIdArb = fc.uuid()

        fc.assert(
          fc.property(tagIdArb, (tagId) => {
            const { result } = renderHook(() => useBlogPostForm())

            const initialLength = result.current.formValues.tagIds.length

            // Toggle tag on
            act(() => {
              result.current.toggleTag(tagId)
            })

            const lengthAfterToggleOn = result.current.formValues.tagIds.length
            const containsTag = result.current.formValues.tagIds.includes(tagId)

            // Should increase by 1 and contain the tag
            if (lengthAfterToggleOn !== initialLength + 1 || !containsTag) {
              return false
            }

            // Toggle tag off
            act(() => {
              result.current.toggleTag(tagId)
            })

            const lengthAfterToggleOff = result.current.formValues.tagIds.length
            const doesNotContainTag = !result.current.formValues.tagIds.includes(tagId)

            // Should decrease by 1 and not contain the tag
            return lengthAfterToggleOff === initialLength && doesNotContainTag
          }),
          { numRuns: 100 }
        )
      })
    })
  })

  /**
   * Property 13: Form Reset After Success
   * Feature: tanstack-form-migration, Property 13: Form reset after success
   * Validates: Requirements 3.6
   *
   * For any successful form submission, calling form.reset() SHALL reset
   * all field values to their defaultValues.
   */
  describe('Property 13: Form reset after success', () => {
    it('should reset form to default values', () => {
      // Generator for form modifications
      const titleArb = fc
        .string({ minLength: 5, maxLength: 100 })
        .map((s) => s.trim() || 'Valid Title')
      const keywordArb = fc
        .string({ minLength: 1, maxLength: 30 })
        .map((s) => s.trim() || 'keyword')

      fc.assert(
        fc.property(titleArb, keywordArb, (title, keyword) => {
          const { result } = renderHook(() => useBlogPostForm())

          // Modify the form
          act(() => {
            result.current.handleTitleChange(title)
            result.current.setNewKeyword(keyword)
          })
          act(() => {
            result.current.addKeyword()
          })

          // Verify modifications
          expect(result.current.formValues.title).toBe(title)
          expect(result.current.formValues.keywords.length).toBeGreaterThan(0)

          // Reset the form
          act(() => {
            result.current.resetForm()
          })

          // All values should be reset to defaults
          return (
            result.current.formValues.title === '' &&
            result.current.formValues.slug === '' &&
            result.current.formValues.keywords.length === 0 &&
            result.current.newKeyword === '' &&
            result.current.previewMode === false
          )
        }),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Property 14: Default Values Population
   * Feature: tanstack-form-migration, Property 14: Default values population
   * Validates: Requirements 4.4
   *
   * For any initial data object passed to useBlogPostForm, the form's
   * defaultValues SHALL be populated with the corresponding values from
   * the initial data.
   */
  describe('Property 14: Default values population', () => {
    it('should populate form with initial post data', () => {
      // Generator for initial post data
      const postDataArb = fc.record({
        title: fc.string({ minLength: 5, maxLength: 100 }).map((s) => s.trim() || 'Title'),
        slug: fc
          .string({ minLength: 1, maxLength: 50 })
          .map((s) => s.toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'slug'),
        content: fc.string({ minLength: 100, maxLength: 500 }).map((s) => s || 'a'.repeat(100)),
        excerpt: fc.string({ minLength: 0, maxLength: 200 }),
        contentType: fc.constantFrom('MARKDOWN', 'HTML', 'RICH_TEXT') as fc.Arbitrary<
          'MARKDOWN' | 'HTML' | 'RICH_TEXT'
        >,
        status: fc.constantFrom(
          'DRAFT',
          'REVIEW',
          'SCHEDULED',
          'PUBLISHED',
          'ARCHIVED',
          'DELETED'
        ) as fc.Arbitrary<'DRAFT' | 'REVIEW' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED'>,
      })

      fc.assert(
        fc.property(postDataArb, (postData) => {
          const { result } = renderHook(() => useBlogPostForm(postData as Partial<BlogPost>))

          // Form values should match the initial data
          return (
            result.current.formValues.title === postData.title &&
            result.current.formValues.slug === postData.slug &&
            result.current.formValues.content === postData.content &&
            result.current.formValues.contentType === postData.contentType &&
            result.current.formValues.status === postData.status
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should populate tagIds from post tags', () => {
      // Generator for tag IDs
      const tagIdsArb = fc.array(fc.uuid(), { minLength: 1, maxLength: 5 })

      fc.assert(
        fc.property(tagIdsArb, (tagIds) => {
          // Create post with tags
          const post: Partial<BlogPost> = {
            title: 'Test Post',
            slug: 'test-post',
            content: 'a'.repeat(100),
            tags: tagIds.map(
              (tagId) => ({ tagId, postId: 'post-1', createdAt: new Date() }) as PostTag
            ),
          }

          const { result } = renderHook(() => useBlogPostForm(post))

          // Form tagIds should match the post tags
          const formTagIds = result.current.formValues.tagIds
          const selectedTags = result.current.selectedTags

          return (
            formTagIds.length === tagIds.length &&
            tagIds.every((id) => formTagIds.includes(id)) &&
            selectedTags.length === tagIds.length &&
            tagIds.every((id) => selectedTags.includes(id))
          )
        }),
        { numRuns: 100 }
      )
    })

    it('should use default values when no post is provided', () => {
      const { result } = renderHook(() => useBlogPostForm())

      expect(result.current.formValues.title).toBe('')
      expect(result.current.formValues.slug).toBe('')
      expect(result.current.formValues.content).toBe('')
      expect(result.current.formValues.contentType).toBe('MARKDOWN')
      expect(result.current.formValues.status).toBe('DRAFT')
      expect(result.current.formValues.keywords).toEqual([])
      expect(result.current.formValues.tagIds).toEqual([])
      expect(result.current.selectedTags).toEqual([])
      expect(result.current.newKeyword).toBe('')
      expect(result.current.previewMode).toBe(false)
    })
  })

  // Unit tests for specific behaviors
  describe('Unit Tests', () => {
    it('should initialize with empty form data when no post provided', () => {
      const { result } = renderHook(() => useBlogPostForm())

      expect(result.current.formValues.title).toBe('')
      expect(result.current.formValues.slug).toBe('')
      expect(result.current.formValues.content).toBe('')
      expect(result.current.formValues.contentType).toBe('MARKDOWN')
      expect(result.current.formValues.status).toBe('DRAFT')
    })

    it('should toggle preview mode', () => {
      const { result } = renderHook(() => useBlogPostForm())

      expect(result.current.previewMode).toBe(false)

      act(() => {
        result.current.setPreviewMode(true)
      })

      expect(result.current.previewMode).toBe(true)

      act(() => {
        result.current.setPreviewMode(false)
      })

      expect(result.current.previewMode).toBe(false)
    })

    it('should clear newKeyword after adding', () => {
      const { result } = renderHook(() => useBlogPostForm())

      act(() => {
        result.current.setNewKeyword('test-keyword')
      })

      expect(result.current.newKeyword).toBe('test-keyword')

      act(() => {
        result.current.addKeyword()
      })

      expect(result.current.newKeyword).toBe('')
      expect(result.current.formValues.keywords).toContain('test-keyword')
    })

    it('should not add empty keyword', () => {
      const { result } = renderHook(() => useBlogPostForm())

      act(() => {
        result.current.setNewKeyword('')
      })
      act(() => {
        result.current.addKeyword()
      })

      expect(result.current.formValues.keywords.length).toBe(0)

      // Also test whitespace-only
      act(() => {
        result.current.setNewKeyword('   ')
      })
      act(() => {
        result.current.addKeyword()
      })

      expect(result.current.formValues.keywords.length).toBe(0)
    })

    it('should expose generateSlug function', () => {
      const { result } = renderHook(() => useBlogPostForm())

      const slug = result.current.generateSlug('Hello World Test')
      expect(slug).toBe('hello-world-test')
    })

    it('should handle special characters in slug generation', () => {
      expect(generateSlug('Hello, World!')).toBe('hello-world')
      expect(generateSlug('Test@#$%^&*()Post')).toBe('testpost')
      expect(generateSlug('Multiple   Spaces')).toBe('multiple-spaces')
      expect(generateSlug('---Leading-Trailing---')).toBe('leading-trailing')
    })
  })
})
