import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  try {
    console.log('🧹 Starting global teardown...')
    
    // Clean up any global resources
    // For example, cleaning test data, stopping services, etc.
    
    // Add any cleanup logic here
    // - Close database connections
    // - Clean up test files
    // - Reset application state
    
    console.log('✅ Global teardown completed successfully')
  } catch (error) {
    console.error('❌ Global teardown failed:', error)
    // Don't throw here to avoid masking test failures
  }
}

export default globalTeardown