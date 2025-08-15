/**
 * Integration Examples for Hono RPC Client
 * Shows how to integrate the new RPC client with existing React components
 */

// Example: Contact Form Integration
// Replace existing API calls in contact components

import { rpcClient, RPCError } from '@/server/rpc/client'
import { ContactFormInput } from '@/server/rpc/types'

// In your contact form component
export async function submitContactForm(formData: ContactFormInput) {
  try {
    const response = await rpcClient.contact.submit(formData)
    
    return {
      success: true,
      data: response,
      message: 'Your message has been sent successfully!'
    }
  } catch (error) {
    if (error instanceof RPCError) {
      if (error.code === 'RATE_LIMIT_EXCEEDED') {
        return {
          success: false,
          error: 'Too many requests. Please try again later.',
        }
      }
      
      if (error.code === 'VALIDATION_ERROR') {
        return {
          success: false,
          error: 'Please check your input and try again.',
          details: error.details,
        }
      }
    }
    
    return {
      success: false,
      error: 'Something went wrong. Please try again.',
    }
  }
}

// Example: React Query Integration
// Use with TanStack Query for caching and state management

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Projects query hook
export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => rpcClient.projects.getProjects({
      page: 1,
      limit: 20,
      ...filters,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  })
}

// Single project query hook
export function useProject(slug: string) {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => rpcClient.projects.getProject(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Blog posts query hook with pagination
export function useBlogPosts(filters: BlogPostFilters & { page: number; limit: number }) {
  return useQuery({
    queryKey: ['blogPosts', filters],
    queryFn: () => rpcClient.blog.getPosts(filters),
    keepPreviousData: true, // For pagination
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Contact form mutation
export function useContactFormMutation() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (formData: ContactFormInput) => 
      rpcClient.contact.submit(formData),
    onSuccess: () => {
      // Invalidate contact stats to refresh them
      queryClient.invalidateQueries({ queryKey: ['contactStats'] })
    },
    onError: (error: RPCError) => {
      console.error('Contact form error:', {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
      })
    }
  })
}

// Analytics tracking hook
export function useAnalyticsTracking() {
  const trackPageView = async (page: string, title: string, referrer?: string) => {
    try {
      await rpcClient.analytics.trackPageView({ page, title, referrer })
    } catch (error) {
      console.warn('Analytics tracking failed:', error)
      // Don't throw - analytics failures shouldn't break the app
    }
  }
  
  const reportWebVital = async (vital: WebVitalReport) => {
    try {
      await rpcClient.analytics.reportVital(vital)
    } catch (error) {
      console.warn('Web vital reporting failed:', error)
    }
  }
  
  return { trackPageView, reportWebVital }
}

// Authentication hook
export function useAuth() {
  const queryClient = useQueryClient()
  
  const login = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      rpcClient.auth.login(credentials),
    onSuccess: (data) => {
      // Store auth data
      queryClient.setQueryData(['auth', 'user'], data.user)
      
      // Store token in localStorage or secure storage
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('tokenExpiry', data.expiresAt)
    }
  })
  
  const logout = useMutation({
    mutationFn: () => rpcClient.auth.logout(),
    onSuccess: () => {
      // Clear auth data
      queryClient.removeQueries({ queryKey: ['auth'] })
      localStorage.removeItem('authToken')
      localStorage.removeItem('tokenExpiry')
      
      // Redirect to login or home
      window.location.href = '/'
    }
  })
  
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => rpcClient.auth.getProfile(),
    retry: false,
    staleTime: Infinity, // Don't refetch user data
  })
  
  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  }
}

// Example: Global RPC Client Setup
// Configure the client on app initialization

import { rpcClient } from '@/server/rpc/client'

// Initialize with auth token from storage
export function initializeRPCClient() {
  const token = localStorage.getItem('authToken')
  const expiry = localStorage.getItem('tokenExpiry')
  
  if (token && expiry) {
    const expiryDate = new Date(expiry)
    
    if (expiryDate > new Date()) {
      // Token is still valid
      rpcClient.setAuthToken(token)
    } else {
      // Token expired, clear storage
      localStorage.removeItem('authToken')
      localStorage.removeItem('tokenExpiry')
    }
  }
}

// Example: Error Boundary Integration
// Handle RPC errors globally

import { ErrorBoundary } from 'react-error-boundary'

function RPCErrorFallback({ error, resetErrorBoundary }: any) {
  if (error instanceof RPCError) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error.message}</p>
        {error.code === 'AUTHENTICATION_REQUIRED' && (
          <button onClick={() => window.location.href = '/login'}>
            Login
          </button>
        )}
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    )
  }
  
  return (
    <div className="error-container">
      <h2>Unexpected error</h2>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

// Wrap your app with error boundary
export function RPCProvider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={RPCErrorFallback}>
      {children}
    </ErrorBoundary>
  )
}

// Example: Real-time Features
// WebSocket integration for real-time updates

export function useRealtimeAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  
  useEffect(() => {
    // Poll analytics data every 30 seconds
    const interval = setInterval(async () => {
      try {
        const data = await rpcClient.analytics.getDashboard()
        setAnalytics(data)
      } catch (error) {
        console.warn('Failed to fetch analytics:', error)
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])
  
  return analytics
}

// Example: Optimistic Updates
// Update UI immediately, then sync with server

export function useOptimisticBlogPost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: BlogPostUpdate }) =>
      rpcClient.blog.updatePost(id, data),
    
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['blogPost', id] })
      
      // Snapshot previous value
      const previousPost = queryClient.getQueryData(['blogPost', id])
      
      // Optimistically update
      queryClient.setQueryData(['blogPost', id], (old: any) => ({
        ...old,
        ...data,
        updatedAt: new Date().toISOString(),
      }))
      
      return { previousPost }
    },
    
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousPost) {
        queryClient.setQueryData(['blogPost', variables.id], context.previousPost)
      }
    },
    
    onSettled: (data, error, variables) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['blogPost', variables.id] })
    }
  })
}