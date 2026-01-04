/**
 * Mock Type Definitions - Type-Safe Mock Infrastructure
 * Ensures mock implementations maintain type compatibility with actual implementations
 * Part of the type-first architecture strategy
 */

import type { Mock } from 'bun:test'
import type { ReactNode, ForwardRefExoticComponent, RefAttributes } from 'react'

// =======================
// PRISMA MOCK TYPES
// =======================

/**
 * Type-safe mock for Prisma model operations
 * Ensures mocks match the actual Prisma client interface
 * Note: Vitest 4 Mock type takes a single type parameter for the function signature
 */
export interface MockPrismaModelOperations<T> {
  findMany: Mock<() => Promise<T[]>>
  findUnique: Mock<() => Promise<T | null>>
  findFirst: Mock<() => Promise<T | null>>
  create: Mock<() => Promise<T>>
  update: Mock<() => Promise<T>>
  delete: Mock<() => Promise<T>>
  count: Mock<() => Promise<number>>
  updateMany: Mock<() => Promise<{ count: number }>>
  deleteMany: Mock<() => Promise<{ count: number }>>
}

/**
 * Type-safe mock for the database client
 * Matches the structure of the actual PrismaClient
 */
export interface MockDatabaseClient {
  blogPost: MockPrismaModelOperations<BlogPostMockData>
  author: MockPrismaModelOperations<AuthorMockData>
  category: MockPrismaModelOperations<CategoryMockData>
  tag: MockPrismaModelOperations<TagMockData>
  contactSubmission: MockPrismaModelOperations<ContactSubmissionMockData>
  project: MockPrismaModelOperations<ProjectMockData>
  $queryRaw: Mock<(...args: unknown[]) => unknown>
  $executeRaw: Mock<(...args: unknown[]) => unknown>
  $connect: Mock<() => Promise<void>>
  $disconnect: Mock<() => Promise<void>>
}

// =======================
// MOCK DATA TYPES
// =======================

/**
 * Blog post mock data structure
 * Matches the Prisma BlogPost model
 */
export interface BlogPostMockData {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  contentType: 'MARKDOWN' | 'HTML' | 'RICH_TEXT'
  status: 'DRAFT' | 'REVIEW' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED'
  metaTitle: string | null
  metaDescription: string | null
  keywords: string[]
  canonicalUrl: string | null
  featuredImage: string | null
  featuredImageAlt: string | null
  readingTime: number | null
  wordCount: number | null
  publishedAt: Date | null
  scheduledAt: Date | null
  createdAt: Date
  updatedAt: Date
  authorId: string
  categoryId: string | null
  viewCount: number
  likeCount: number
  shareCount: number
  commentCount: number
  currentVersion: number
  seoScore: number | null
}

/**
 * Author mock data structure
 * Matches the Prisma Author model
 */
export interface AuthorMockData {
  id: string
  name: string
  email: string
  slug: string
  bio: string | null
  avatar: string | null
  website: string | null
  twitter: string | null
  linkedin: string | null
  github: string | null
  metaDescription: string | null
  totalViews: number
  totalPosts: number
  createdAt: Date
  updatedAt?: Date
}

/**
 * Category mock data structure
 * Matches the Prisma Category model
 */
export interface CategoryMockData {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null
  icon: string | null
  metaTitle: string | null
  metaDescription: string | null
  keywords: string[]
  parentId: string | null
  postCount: number
  totalViews: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Tag mock data structure
 * Matches the Prisma Tag model
 */
export interface TagMockData {
  id: string
  name: string
  slug: string
  description: string | null
  color: string | null
  metaDescription: string | null
  postCount: number
  totalViews: number
  createdAt: Date
  updatedAt: Date
}

/**
 * Contact submission mock data structure
 * Matches the Prisma ContactSubmission model
 */
export interface ContactSubmissionMockData {
  id: string
  name: string
  email: string
  company: string | null
  phone: string | null
  subject: string | null
  message: string
  status: 'NEW' | 'READ' | 'IN_PROGRESS' | 'RESPONDED' | 'ARCHIVED' | 'SPAM'
  responded: boolean
  respondedAt: Date | null
  notes: string | null
  ipAddress: string | null
  userAgent: string | null
  referer: string | null
  emailSent: boolean
  emailId: string | null
  emailError: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * Project mock data structure
 * Matches the Prisma Project model
 */
export interface ProjectMockData {
  id: string
  slug: string
  title: string
  description: string
  image: string
  link: string | null
  github: string | null
  category: string
  tags: string[]
  featured: boolean
  viewCount: number
  clickCount: number
  createdAt: Date
  updatedAt: Date
}

// =======================
// NEXT.JS MOCK TYPES
// =======================

/**
 * Mock Next.js router interface
 * Matches the useRouter hook return type
 */
export interface MockNextRouter {
  push: Mock<(url: string) => Promise<boolean>>
  replace: Mock<(url: string) => Promise<boolean>>
  prefetch: Mock<(url: string) => Promise<void>>
  back: Mock<() => void>
  forward: Mock<() => void>
  refresh: Mock<() => void>
  pathname: string
  query: Record<string, string | string[]>
  asPath: string
  basePath: string
  locale?: string
  locales?: string[]
  defaultLocale?: string
  isReady: boolean
  isPreview: boolean
  isFallback: boolean
  events: {
    on: Mock<(...args: unknown[]) => unknown>
    off: Mock<(...args: unknown[]) => unknown>
    emit: Mock<(...args: unknown[]) => unknown>
  }
}

/**
 * Mock Next.js Image component props
 * Matches the next/image component interface
 */
export interface MockNextImageProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  fill?: boolean
  priority?: boolean
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  unoptimized?: boolean
  onLoadingComplete?: (result: { naturalWidth: number; naturalHeight: number }) => void
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void
  loading?: 'lazy' | 'eager'
  className?: string
  style?: React.CSSProperties
}

/**
 * Mock Next.js Link component props
 * Matches the next/link component interface
 */
export interface MockNextLinkProps {
  href: string
  as?: string
  replace?: boolean
  scroll?: boolean
  shallow?: boolean
  passHref?: boolean
  prefetch?: boolean
  locale?: string | false
  legacyBehavior?: boolean
  children: ReactNode
  className?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
}

// =======================
// REACT QUERY MOCK TYPES
// =======================

/**
 * Mock useQuery return type
 * Matches TanStack Query v5 interface
 */
export interface MockUseQueryResult<TData = unknown, TError = Error> {
  data: TData | undefined
  error: TError | null
  isError: boolean
  isPending: boolean
  isLoading: boolean
  isFetching: boolean
  isSuccess: boolean
  status: 'pending' | 'error' | 'success'
  fetchStatus: 'fetching' | 'paused' | 'idle'
  refetch: Mock<() => Promise<MockUseQueryResult<TData, TError>>>
}

/**
 * Mock useMutation return type
 * Matches TanStack Query v5 interface
 */
export interface MockUseMutationResult<TData = unknown, TError = Error, TVariables = void> {
  data: TData | undefined
  error: TError | null
  isError: boolean
  isPending: boolean
  isLoading: boolean
  isSuccess: boolean
  isIdle: boolean
  status: 'idle' | 'pending' | 'error' | 'success'
  mutate: Mock<(variables: TVariables) => void>
  mutateAsync: Mock<(variables: TVariables) => Promise<TData>>
  reset: Mock<() => void>
}

/**
 * Mock QueryClient interface
 * Matches TanStack Query QueryClient
 */
export interface MockQueryClient {
  setQueryData: Mock<(...args: unknown[]) => unknown>
  getQueryData: Mock<(...args: unknown[]) => unknown>
  invalidateQueries: Mock<(...args: unknown[]) => unknown>
  clear: Mock<(...args: unknown[]) => unknown>
  getQueryState: Mock<(...args: unknown[]) => unknown>
  prefetchQuery: Mock<(...args: unknown[]) => unknown>
  cancelQueries: Mock<(...args: unknown[]) => unknown>
  removeQueries: Mock<(...args: unknown[]) => unknown>
  resetQueries: Mock<(...args: unknown[]) => unknown>
}

// =======================
// FRAMER MOTION MOCK TYPES
// =======================

/**
 * Mock motion component type
 * Matches framer-motion motion component interface
 */
export type MockMotionComponent<T extends keyof React.JSX.IntrinsicElements> =
  ForwardRefExoticComponent<React.JSX.IntrinsicElements[T] & RefAttributes<HTMLElement>>

/**
 * Mock motion object
 * Matches framer-motion motion export
 */
export interface MockMotion {
  div: MockMotionComponent<'div'>
  section: MockMotionComponent<'section'>
  h1: MockMotionComponent<'h1'>
  h2: MockMotionComponent<'h2'>
  h3: MockMotionComponent<'h3'>
  p: MockMotionComponent<'p'>
  span: MockMotionComponent<'span'>
  button: MockMotionComponent<'button'>
  a: MockMotionComponent<'a'>
  ul: MockMotionComponent<'ul'>
  li: MockMotionComponent<'li'>
  img: MockMotionComponent<'img'>
}

/**
 * Mock AnimatePresence props
 * Matches framer-motion AnimatePresence interface
 */
export interface MockAnimatePresenceProps {
  children: ReactNode
  mode?: 'sync' | 'wait' | 'popLayout'
  initial?: boolean
  onExitComplete?: () => void
}

/**
 * Mock useAnimation return type
 * Matches framer-motion useAnimation hook
 */
export interface MockAnimationControls {
  start: Mock<(target: string | object) => Promise<void>>
  stop: Mock<() => void>
  set: Mock<(values: object) => void>
}

// =======================
// RECHARTS MOCK TYPES
// =======================

/**
 * Mock Recharts component props
 * Common props for chart components
 */
export interface MockRechartsComponentProps {
  children?: ReactNode
  width?: number | string
  height?: number | string
  data?: Array<Record<string, unknown>>
  margin?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
}

/**
 * Mock ResponsiveContainer props
 */
export interface MockResponsiveContainerProps extends MockRechartsComponentProps {
  aspect?: number
  minWidth?: number
  minHeight?: number
  debounce?: number
}

// =======================
// THEME MOCK TYPES
// =======================

/**
 * Mock useTheme return type
 * Matches next-themes useTheme hook
 */
export interface MockUseThemeResult {
  theme: string | undefined
  setTheme: Mock<(theme: string) => void>
  resolvedTheme: string | undefined
  themes: string[]
  forcedTheme?: string
  systemTheme?: 'dark' | 'light'
}

// =======================
// API MOCK TYPES
// =======================

/**
 * Mock fetch response
 * Matches the Fetch API Response interface
 */
export interface MockFetchResponse<T = unknown> {
  ok: boolean
  status: number
  statusText: string
  headers: Headers
  json: () => Promise<T>
  text: () => Promise<string>
  blob: () => Promise<Blob>
  arrayBuffer: () => Promise<ArrayBuffer>
  clone: () => MockFetchResponse<T>
}

/**
 * Mock NextRequest interface
 * Matches Next.js NextRequest
 */
export interface MockNextRequest {
  headers: {
    get: (key: string) => string | null
    has: (key: string) => boolean
    entries: () => IterableIterator<[string, string]>
  }
  json: () => Promise<unknown>
  text: () => Promise<string>
  url: string
  method: string
  nextUrl: {
    pathname: string
    searchParams: URLSearchParams
  }
  cookies: {
    get: (name: string) => { value: string } | undefined
    getAll: () => Array<{ name: string; value: string }>
    has: (name: string) => boolean
  }
  ip?: string
  geo?: {
    city?: string
    country?: string
    region?: string
  }
}

// =======================
// UTILITY TYPES
// =======================

/**
 * Type for creating type-safe mock factories
 */
export type MockFactory<T> = (overrides?: Partial<T>) => T

/**
 * Type for ensuring mock compatibility with actual implementation
 * Uses function signature for Mock type (Vitest 4 compatible)
 */
export type MockCompatible<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R ? Mock<(...args: A) => R> : T[K]
}

/**
 * Type for partial mock - allows mocking only specific methods
 */
export type PartialMock<T> = {
  [K in keyof T]?: T[K] extends (...args: infer A) => infer R ? Mock<(...args: A) => R> : T[K]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyMock = Mock<(...args: any[]) => any>

/**
 * Type guard to check if a value is a mock function
 */
export function isMockFunction(value: unknown): value is AnyMock {
  return (
    typeof value === 'function' &&
    'mock' in value &&
    typeof (value as AnyMock).mockReturnValue === 'function'
  )
}

/**
 * Type guard to check if an object has all required mock methods
 */
export function hasMockMethods<T extends object>(
  obj: unknown,
  methods: (keyof T)[]
): obj is MockCompatible<T> {
  if (typeof obj !== 'object' || obj === null) return false
  return methods.every((method) => method in obj)
}
