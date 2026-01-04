/**
 * Property Test: Backward Compatibility Preservation
 * **Feature: type-safety-improvements, Property 1: Backward Compatibility Preservation**
 * **Validates: Requirements 1.3, 6.1**
 *
 * This test validates that type improvements maintain backward compatibility
 * with existing public API contracts and component interfaces.
 */

import { describe, it } from 'vitest'
import * as fc from 'fast-check'

// Import public API types to verify their contracts
import {
  ApiResponse,
  ApiError,
  PaginationParams,
  ContactFormData,
  ContactResponse,
  BlogPostData,
  BlogAuthorData,
  isApiResponse,
  isApiError,
} from '@/types/shared-api'

import type { ChartDataPoint, ChartConfig, ChartAnimation } from '@/types/chart'

import type { Project, STARMetric, ProjectFilterOptions } from '@/types/project'

import type {
  MockComponentProps,
  DeepPartial,
  NonEmptyArray,
  EventHandler,
} from '@/types/test-utils'

describe('Property 1: Backward Compatibility Preservation', () => {
  /**
   * Property: For any existing public API function or component interface,
   * applying type improvements should not change the function signature
   * or component props interface.
   */

  describe('API Response Types Contract', () => {
    it('should maintain ApiResponse interface contract', () => {
      // For any ApiResponse, it must have data, success, and optional message/error
      const apiResponseArb = fc.record({
        data: fc.anything(),
        success: fc.boolean(),
        message: fc.option(fc.string(), { nil: undefined }),
        error: fc.option(fc.string(), { nil: undefined }),
      })

      fc.assert(
        fc.property(apiResponseArb, (response) => {
          // Type assertion to verify contract
          const typed: ApiResponse = response

          // Required properties must exist
          const hasData = 'data' in typed
          const hasSuccess = typeof typed.success === 'boolean'

          // Optional properties should be string or undefined
          const messageValid = typed.message === undefined || typeof typed.message === 'string'
          const errorValid = typed.error === undefined || typeof typed.error === 'string'

          return hasData && hasSuccess && messageValid && errorValid
        }),
        { numRuns: 25 }
      )
    })

    it('should maintain ApiError interface contract', () => {
      // For any ApiError, it must have code and message
      const apiErrorArb = fc.record({
        code: fc.string({ minLength: 1 }),
        message: fc.string({ minLength: 1 }),
        details: fc.option(fc.dictionary(fc.string(), fc.anything()), { nil: undefined }),
      })

      fc.assert(
        fc.property(apiErrorArb, (error) => {
          const typed: ApiError = error

          // Required properties must be strings
          const codeValid = typeof typed.code === 'string' && typed.code.length > 0
          const messageValid = typeof typed.message === 'string' && typed.message.length > 0

          // Optional details should be object or undefined
          const detailsValid =
            typed.details === undefined ||
            (typeof typed.details === 'object' && typed.details !== null)

          return codeValid && messageValid && detailsValid
        }),
        { numRuns: 25 }
      )
    })

    it('should maintain PaginationParams interface contract', () => {
      // For any PaginationParams, it must have page and limit
      const paginationArb = fc.record({
        page: fc.integer({ min: 1, max: 1000 }),
        limit: fc.integer({ min: 1, max: 100 }),
        offset: fc.option(fc.integer({ min: 0 }), { nil: undefined }),
      })

      fc.assert(
        fc.property(paginationArb, (params) => {
          const typed: PaginationParams = params

          // Required properties must be positive integers
          const pageValid = typeof typed.page === 'number' && typed.page >= 1
          const limitValid = typeof typed.limit === 'number' && typed.limit >= 1

          // Optional offset should be non-negative or undefined
          const offsetValid =
            typed.offset === undefined || (typeof typed.offset === 'number' && typed.offset >= 0)

          return pageValid && limitValid && offsetValid
        }),
        { numRuns: 25 }
      )
    })
  })

  describe('Project Types Contract', () => {
    it('should maintain Project interface required fields', () => {
      // For any Project, required fields must be present and correctly typed
      const projectArb = fc.record({
        id: fc.uuid(),
        title: fc.string({ minLength: 1 }),
        slug: fc.string({ minLength: 1 }),
        description: fc.string(),
        image: fc.string(),
        category: fc.string({ minLength: 1 }),
        viewCount: fc.integer({ min: 0 }),
        clickCount: fc.integer({ min: 0 }),
      })

      fc.assert(
        fc.property(projectArb, (project) => {
          const typed: Pick<
            Project,
            | 'id'
            | 'title'
            | 'slug'
            | 'description'
            | 'image'
            | 'category'
            | 'viewCount'
            | 'clickCount'
          > = project

          // All required fields must be present and correctly typed
          const idValid = typeof typed.id === 'string'
          const titleValid = typeof typed.title === 'string'
          const slugValid = typeof typed.slug === 'string'
          const descriptionValid = typeof typed.description === 'string'
          const imageValid = typeof typed.image === 'string'
          const categoryValid = typeof typed.category === 'string'
          const viewCountValid = typeof typed.viewCount === 'number' && typed.viewCount >= 0
          const clickCountValid = typeof typed.clickCount === 'number' && typed.clickCount >= 0

          return (
            idValid &&
            titleValid &&
            slugValid &&
            descriptionValid &&
            imageValid &&
            categoryValid &&
            viewCountValid &&
            clickCountValid
          )
        }),
        { numRuns: 25 }
      )
    })

    it('should maintain STARMetric interface contract', () => {
      // For any STARMetric, all fields must be present
      const starMetricArb = fc.record({
        phase: fc.string({ minLength: 1 }),
        impact: fc.float({ min: 0, max: 100 }),
        efficiency: fc.float({ min: 0, max: 100 }),
        value: fc.float({ min: 0 }),
      })

      fc.assert(
        fc.property(starMetricArb, (metric) => {
          const typed: STARMetric = metric

          const phaseValid = typeof typed.phase === 'string'
          const impactValid = typeof typed.impact === 'number'
          const efficiencyValid = typeof typed.efficiency === 'number'
          const valueValid = typeof typed.value === 'number'

          return phaseValid && impactValid && efficiencyValid && valueValid
        }),
        { numRuns: 25 }
      )
    })

    it('should maintain ProjectFilterOptions interface contract', () => {
      // For any ProjectFilterOptions, all fields should be optional
      const filterArb = fc.record({
        category: fc.option(fc.string(), { nil: undefined }),
        technology: fc.option(fc.string(), { nil: undefined }),
        featured: fc.option(fc.boolean(), { nil: undefined }),
        search: fc.option(fc.string(), { nil: undefined }),
      })

      fc.assert(
        fc.property(filterArb, (filter) => {
          const typed: ProjectFilterOptions = filter

          // All fields should be optional (undefined or correct type)
          const categoryValid = typed.category === undefined || typeof typed.category === 'string'
          const technologyValid =
            typed.technology === undefined || typeof typed.technology === 'string'
          const featuredValid = typed.featured === undefined || typeof typed.featured === 'boolean'
          const searchValid = typed.search === undefined || typeof typed.search === 'string'

          return categoryValid && technologyValid && featuredValid && searchValid
        }),
        { numRuns: 25 }
      )
    })
  })

  describe('Chart Types Contract', () => {
    it('should maintain ChartDataPoint interface contract', () => {
      // For any ChartDataPoint, name and value must be present
      const chartDataArb = fc.record({
        name: fc.string({ minLength: 1 }),
        value: fc.float(),
        color: fc.option(
          fc.string().map((s) => `#${s.slice(0, 6).padEnd(6, '0')}`),
          { nil: undefined }
        ),
        category: fc.option(fc.string(), { nil: undefined }),
      })

      fc.assert(
        fc.property(chartDataArb, (dataPoint) => {
          const typed: ChartDataPoint = dataPoint

          // Required fields
          const nameValid = typeof typed.name === 'string'
          const valueValid = typeof typed.value === 'number'

          // Optional fields
          const colorValid = typed.color === undefined || typeof typed.color === 'string'
          const categoryValid = typed.category === undefined || typeof typed.category === 'string'

          return nameValid && valueValid && colorValid && categoryValid
        }),
        { numRuns: 25 }
      )
    })

    it('should maintain ChartConfig interface contract', () => {
      // For any ChartConfig, required fields must be present
      const chartConfigArb = fc.record({
        data: fc.array(
          fc.record({
            name: fc.string(),
            value: fc.float(),
          }),
          { minLength: 1 }
        ),
        xAxisKey: fc.string({ minLength: 1 }),
        yAxisKey: fc.string({ minLength: 1 }),
        colors: fc.option(fc.array(fc.string().map((s) => `#${s.slice(0, 6).padEnd(6, '0')}`)), {
          nil: undefined,
        }),
        responsive: fc.option(fc.boolean(), { nil: undefined }),
        showGrid: fc.option(fc.boolean(), { nil: undefined }),
        showLegend: fc.option(fc.boolean(), { nil: undefined }),
        showTooltip: fc.option(fc.boolean(), { nil: undefined }),
      })

      fc.assert(
        fc.property(chartConfigArb, (config) => {
          const typed: ChartConfig = config

          // Required fields
          const dataValid = Array.isArray(typed.data)
          const xAxisKeyValid = typeof typed.xAxisKey === 'string'
          const yAxisKeyValid = typeof typed.yAxisKey === 'string'

          // Optional fields
          const colorsValid =
            typed.colors === undefined ||
            (Array.isArray(typed.colors) && typed.colors.every((c) => typeof c === 'string'))
          const responsiveValid =
            typed.responsive === undefined || typeof typed.responsive === 'boolean'

          return dataValid && xAxisKeyValid && yAxisKeyValid && colorsValid && responsiveValid
        }),
        { numRuns: 25 }
      )
    })

    it('should maintain ChartAnimation interface contract', () => {
      // For any ChartAnimation, duration and easing must be present
      const easingValues = ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out'] as const
      const chartAnimationArb = fc.record({
        duration: fc.integer({ min: 0, max: 5000 }),
        easing: fc.constantFrom(...easingValues),
        delay: fc.option(fc.integer({ min: 0 }), { nil: undefined }),
        enabled: fc.option(fc.boolean(), { nil: undefined }),
      })

      fc.assert(
        fc.property(chartAnimationArb, (animation) => {
          const typed: ChartAnimation = animation

          // Required fields
          const durationValid = typeof typed.duration === 'number' && typed.duration >= 0
          const easingValid = easingValues.includes(typed.easing)

          // Optional fields
          const delayValid =
            typed.delay === undefined || (typeof typed.delay === 'number' && typed.delay >= 0)
          const enabledValid = typed.enabled === undefined || typeof typed.enabled === 'boolean'

          return durationValid && easingValid && delayValid && enabledValid
        }),
        { numRuns: 25 }
      )
    })
  })

  describe('Contact Form Types Contract', () => {
    it('should maintain ContactFormData interface contract', () => {
      // For any ContactFormData, required fields must be present
      const contactFormArb = fc.record({
        name: fc.string({ minLength: 1 }),
        email: fc.emailAddress(),
        subject: fc.string({ minLength: 1 }),
        message: fc.string({ minLength: 1 }),
        company: fc.option(fc.string(), { nil: undefined }),
        phone: fc.option(fc.string(), { nil: undefined }),
        honeypot: fc.option(fc.string(), { nil: undefined }),
      })

      fc.assert(
        fc.property(contactFormArb, (formData) => {
          const typed: ContactFormData = formData

          // Required fields
          const nameValid = typeof typed.name === 'string' && typed.name.length > 0
          const emailValid = typeof typed.email === 'string' && typed.email.includes('@')
          const subjectValid = typeof typed.subject === 'string'
          const messageValid = typeof typed.message === 'string'

          // Optional fields
          const companyValid = typed.company === undefined || typeof typed.company === 'string'
          const phoneValid = typed.phone === undefined || typeof typed.phone === 'string'
          const honeypotValid = typed.honeypot === undefined || typeof typed.honeypot === 'string'

          return (
            nameValid &&
            emailValid &&
            subjectValid &&
            messageValid &&
            companyValid &&
            phoneValid &&
            honeypotValid
          )
        }),
        { numRuns: 25 }
      )
    })

    it('should maintain ContactResponse interface contract', () => {
      // For any ContactResponse, required fields must be present
      const statusValues = ['sent', 'failed', 'pending'] as const

      // Use integer timestamps to avoid invalid date issues
      const minTimestamp = new Date('2000-01-01').getTime()
      const maxTimestamp = new Date('2100-01-01').getTime()

      const validDateStringArb = fc
        .integer({ min: minTimestamp, max: maxTimestamp })
        .map((ts) => new Date(ts).toISOString())

      const contactResponseArb = fc.record({
        id: fc.uuid(),
        status: fc.constantFrom(...statusValues),
        timestamp: validDateStringArb,
        createdAt: validDateStringArb,
      })

      fc.assert(
        fc.property(contactResponseArb, (response) => {
          const typed: ContactResponse = response

          // Required fields
          const idValid = typeof typed.id === 'string'
          const statusValid = statusValues.includes(typed.status)
          const timestampValid = typeof typed.timestamp === 'string'
          const createdAtValid = typeof typed.createdAt === 'string'

          return idValid && statusValid && timestampValid && createdAtValid
        }),
        { numRuns: 25 }
      )
    })
  })

  describe('Blog Types Contract', () => {
    it('should maintain BlogPostData required fields', () => {
      // For any BlogPostData, required fields must be present
      const contentTypes = ['MARKDOWN', 'HTML', 'RICH_TEXT'] as const
      const statusValues = [
        'DRAFT',
        'REVIEW',
        'SCHEDULED',
        'PUBLISHED',
        'ARCHIVED',
        'DELETED',
      ] as const

      const blogPostArb = fc.record({
        id: fc.uuid(),
        title: fc.string({ minLength: 1 }),
        slug: fc.string({ minLength: 1 }),
        content: fc.string(),
        contentType: fc.constantFrom(...contentTypes),
        status: fc.constantFrom(...statusValues),
        keywords: fc.array(fc.string()),
        authorId: fc.uuid(),
        viewCount: fc.integer({ min: 0 }),
        likeCount: fc.integer({ min: 0 }),
        shareCount: fc.integer({ min: 0 }),
        commentCount: fc.integer({ min: 0 }),
        createdAt: fc.date().map((d) => d.toISOString()),
        updatedAt: fc.date().map((d) => d.toISOString()),
      })

      fc.assert(
        fc.property(blogPostArb, (post) => {
          const typed: Pick<
            BlogPostData,
            | 'id'
            | 'title'
            | 'slug'
            | 'content'
            | 'contentType'
            | 'status'
            | 'keywords'
            | 'authorId'
            | 'viewCount'
            | 'likeCount'
            | 'shareCount'
            | 'commentCount'
            | 'createdAt'
            | 'updatedAt'
          > = post

          // Required fields validation
          const idValid = typeof typed.id === 'string'
          const titleValid = typeof typed.title === 'string'
          const slugValid = typeof typed.slug === 'string'
          const contentValid = typeof typed.content === 'string'
          const contentTypeValid = contentTypes.includes(typed.contentType)
          const statusValid = statusValues.includes(typed.status)
          const keywordsValid = Array.isArray(typed.keywords)
          const authorIdValid = typeof typed.authorId === 'string'
          const viewCountValid = typeof typed.viewCount === 'number' && typed.viewCount >= 0
          const likeCountValid = typeof typed.likeCount === 'number' && typed.likeCount >= 0

          return (
            idValid &&
            titleValid &&
            slugValid &&
            contentValid &&
            contentTypeValid &&
            statusValid &&
            keywordsValid &&
            authorIdValid &&
            viewCountValid &&
            likeCountValid
          )
        }),
        { numRuns: 25 }
      )
    })

    it('should maintain BlogAuthorData interface contract', () => {
      // For any BlogAuthorData, required fields must be present
      const authorArb = fc.record({
        id: fc.uuid(),
        name: fc.string({ minLength: 1 }),
        email: fc.emailAddress(),
        slug: fc.string({ minLength: 1 }),
        totalPosts: fc.integer({ min: 0 }),
        totalViews: fc.integer({ min: 0 }),
        createdAt: fc.date().map((d) => d.toISOString()),
        bio: fc.option(fc.string(), { nil: undefined }),
        avatar: fc.option(fc.string(), { nil: undefined }),
        website: fc.option(fc.string(), { nil: undefined }),
      })

      fc.assert(
        fc.property(authorArb, (author) => {
          const typed: BlogAuthorData = author

          // Required fields
          const idValid = typeof typed.id === 'string'
          const nameValid = typeof typed.name === 'string'
          const emailValid = typeof typed.email === 'string'
          const slugValid = typeof typed.slug === 'string'
          const totalPostsValid = typeof typed.totalPosts === 'number' && typed.totalPosts >= 0
          const totalViewsValid = typeof typed.totalViews === 'number' && typed.totalViews >= 0
          const createdAtValid = typeof typed.createdAt === 'string'

          // Optional fields
          const bioValid = typed.bio === undefined || typeof typed.bio === 'string'
          const avatarValid = typed.avatar === undefined || typeof typed.avatar === 'string'
          const websiteValid = typed.website === undefined || typeof typed.website === 'string'

          return (
            idValid &&
            nameValid &&
            emailValid &&
            slugValid &&
            totalPostsValid &&
            totalViewsValid &&
            createdAtValid &&
            bioValid &&
            avatarValid &&
            websiteValid
          )
        }),
        { numRuns: 25 }
      )
    })
  })

  describe('Test Utility Types Contract', () => {
    it('should maintain MockComponentProps interface contract', () => {
      // For any MockComponentProps, props must be present
      const mockPropsArb = fc.record({
        props: fc.dictionary(fc.string(), fc.anything()),
        children: fc.option(fc.string(), { nil: undefined }),
      })

      fc.assert(
        fc.property(mockPropsArb, (mockProps) => {
          const typed: MockComponentProps = mockProps

          // Required fields
          const propsValid = typeof typed.props === 'object' && typed.props !== null

          // Optional fields
          const childrenValid = typed.children === undefined || typed.children !== null

          return propsValid && childrenValid
        }),
        { numRuns: 25 }
      )
    })

    it('should maintain DeepPartial utility type behavior', () => {
      // For any object, DeepPartial should make all properties optional recursively
      interface TestObject {
        a: string
        b: {
          c: number
          d: {
            e: boolean
          }
        }
      }

      const deepPartialArb = fc.record({
        a: fc.option(fc.string(), { nil: undefined }),
        b: fc.option(
          fc.record({
            c: fc.option(fc.integer(), { nil: undefined }),
            d: fc.option(
              fc.record({
                e: fc.option(fc.boolean(), { nil: undefined }),
              }),
              { nil: undefined }
            ),
          }),
          { nil: undefined }
        ),
      })

      fc.assert(
        fc.property(deepPartialArb, (partial) => {
          const typed: DeepPartial<TestObject> = partial

          // All properties should be optional
          const aValid = typed.a === undefined || typeof typed.a === 'string'
          const bValid =
            typed.b === undefined ||
            (typeof typed.b === 'object' &&
              (typed.b.c === undefined || typeof typed.b.c === 'number'))

          return aValid && bValid
        }),
        { numRuns: 25 }
      )
    })

    it('should maintain NonEmptyArray utility type behavior', () => {
      // For any NonEmptyArray, it must have at least one element
      const nonEmptyArb = fc.array(fc.integer(), { minLength: 1 })

      fc.assert(
        fc.property(nonEmptyArb, (arr) => {
          // Type assertion - NonEmptyArray requires at least one element
          const typed: NonEmptyArray<number> = arr as NonEmptyArray<number>

          // Must have at least one element
          const hasFirstElement = typed[0] !== undefined
          const isArray = Array.isArray(typed)
          const hasLength = typed.length >= 1

          return hasFirstElement && isArray && hasLength
        }),
        { numRuns: 25 }
      )
    })

    it('should maintain EventHandler utility type behavior', () => {
      // For any EventHandler, it should be a function that accepts an event
      fc.assert(
        fc.property(fc.constant(null), () => {
          // Create a typed event handler
          const handler: EventHandler<MouseEvent> = (_event: MouseEvent) => {
            // Handler implementation
          }

          // Verify it's a function
          const isFunction = typeof handler === 'function'

          // Verify it accepts the correct parameter type
          const acceptsEvent = handler.length <= 1 // Function can have 0 or 1 parameter

          return isFunction && acceptsEvent
        }),
        { numRuns: 10 }
      )
    })
  })

  describe('Type Guards Contract', () => {
    it('should maintain isApiResponse type guard behavior', () => {
      // Valid API responses should pass
      const validResponseArb = fc.record({
        data: fc.anything(),
        success: fc.boolean(),
      })

      fc.assert(
        fc.property(validResponseArb, (response) => {
          return isApiResponse(response) === true
        }),
        { numRuns: 25 }
      )

      // Invalid objects should fail
      const invalidResponseArb = fc.oneof(
        fc.constant(null),
        fc.constant(undefined),
        fc.string(),
        fc.integer(),
        fc.record({ data: fc.anything() }), // Missing success
        fc.record({ success: fc.string() }) // Wrong type for success
      )

      fc.assert(
        fc.property(invalidResponseArb, (invalid) => {
          // Objects without success boolean should fail
          if (
            typeof invalid === 'object' &&
            invalid !== null &&
            'success' in invalid &&
            typeof invalid.success === 'boolean'
          ) {
            return true // This is actually valid
          }
          return isApiResponse(invalid) === false
        }),
        { numRuns: 25 }
      )
    })

    it('should maintain isApiError type guard behavior', () => {
      // Valid API errors should pass
      const validErrorArb = fc.record({
        code: fc.string({ minLength: 1 }),
        message: fc.string({ minLength: 1 }),
      })

      fc.assert(
        fc.property(validErrorArb, (error) => {
          return isApiError(error) === true
        }),
        { numRuns: 25 }
      )

      // Invalid objects should fail
      const invalidErrorArb = fc.oneof(
        fc.constant(null),
        fc.constant(undefined),
        fc.string(),
        fc.integer(),
        fc.record({ code: fc.string() }), // Missing message
        fc.record({ message: fc.string() }) // Missing code
      )

      fc.assert(
        fc.property(invalidErrorArb, (invalid) => {
          // Objects with both code and message strings should pass
          if (
            typeof invalid === 'object' &&
            invalid !== null &&
            'code' in invalid &&
            'message' in invalid &&
            typeof invalid.code === 'string' &&
            typeof invalid.message === 'string'
          ) {
            return true // This is actually valid
          }
          return isApiError(invalid) === false
        }),
        { numRuns: 25 }
      )
    })
  })
})
