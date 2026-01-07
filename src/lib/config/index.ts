/**
 * Centralized Configuration Management System
 * Provides type-safe, environment-aware configuration for the entire application
 */

import { z } from 'zod'
import { createContextLogger } from '@/lib/monitoring/logger'

const configLogger = createContextLogger('Configuration')

// ============================================================================
// Environment Schema Validation
// ============================================================================

const EnvironmentSchema = z.enum(['development', 'staging', 'production', 'test'])
export type Environment = z.infer<typeof EnvironmentSchema>

const NodeEnvironmentSchema = z.enum(['development', 'production', 'test'])
export type NodeEnvironment = z.infer<typeof NodeEnvironmentSchema>

// ============================================================================
// Base Configuration Schema
// ============================================================================

export const BaseConfigSchema = z.object({
  environment: EnvironmentSchema,
  nodeEnv: NodeEnvironmentSchema,
  isDevelopment: z.boolean(),
  isProduction: z.boolean(),
  isTest: z.boolean(),
  isStaging: z.boolean(),
})

// ============================================================================
// Application Configuration
// ============================================================================

export const AppConfigSchema = z.object({
  // Site URLs
  siteUrl: z.string().url(),
  apiUrl: z.string().url().optional(),

  // External Services
  githubUrl: z.string().url(),
  linkedinUrl: z.string().url(),
  twitterUrl: z.string().url().optional(),

  // Vercel Analytics
  vercelAnalyticsId: z.string().optional(),

  // Contact Information
  contactEmail: z.string().email(),

  // Social Media Handles
  githubUsername: z.string(),
  linkedinUsername: z.string(),
  twitterUsername: z.string().optional(),
})

export type AppConfig = z.infer<typeof AppConfigSchema>

// ============================================================================
// Analytics Configuration
// ============================================================================

export const AnalyticsConfigSchema = z.object({
  // Data retention
  maxDataAgeDays: z.number().min(1).max(365),

  // Aggregation settings
  aggregationBatchSize: z.number().min(1).max(1000),
  aggregationIntervalMs: z.number().min(1000).max(3600000), // 1s to 1h

  // Cache settings
  cacheMaxSize: z.number().min(100).max(100000),
  cacheTtlMs: z.number().min(60000).max(86400000), // 1min to 24h

  // Performance thresholds
  slowQueryThresholdMs: z.number().min(100).max(10000),
  highTrafficThreshold: z.number().min(10).max(10000),

  // Sampling rates (0.0 to 1.0)
  pageViewSampleRate: z.number().min(0).max(1),
  interactionSampleRate: z.number().min(0).max(1),
  errorSampleRate: z.number().min(0).max(1),
})

export type AnalyticsConfig = z.infer<typeof AnalyticsConfigSchema>

// ============================================================================
// Security Configuration
// ============================================================================

export const SecurityConfigSchema = z.object({
  // Rate Limiting
  rateLimitMaxRequests: z.number().min(1).max(10000),
  rateLimitWindowMs: z.number().min(1000).max(3600000), // 1s to 1h
  rateLimitMaxHistoryPerClient: z.number().min(10).max(1000),
  rateLimitClientExpiryMs: z.number().min(3600000).max(604800000), // 1h to 7d

  // CSP Settings
  cspEnabled: z.boolean(),
  cspReportOnly: z.boolean(),

  // HSTS Settings
  hstsMaxAge: z.number().min(86400).max(31536000), // 1d to 1y
  hstsIncludeSubDomains: z.boolean(),
  hstsPreload: z.boolean(),

  // CORS Settings
  corsAllowedOrigins: z.array(z.string().url()),
  corsAllowedMethods: z.array(z.string()),
  corsAllowedHeaders: z.array(z.string()),
  corsMaxAge: z.number().min(86400).max(31536000), // 1d to 1y

  // Content Security Policy domains
  cspDomains: z.object({
    fonts: z.array(z.string()),
    scripts: z.array(z.string()),
    styles: z.array(z.string()),
    images: z.array(z.string()),
    connect: z.array(z.string()),
  }),

  // Additional Security Headers
  frameOptions: z.string().optional(),
  contentTypeOptions: z.boolean().default(true),
  xssProtection: z.boolean().default(true),
  referrerPolicy: z.string().optional(),
  permissionsPolicy: z.array(z.string()).optional(),
  crossOriginEmbedderPolicy: z.string().optional(),
  crossOriginOpenerPolicy: z.string().optional(),
  crossOriginResourcePolicy: z.string().optional(),
})

export type SecurityConfig = z.infer<typeof SecurityConfigSchema>

// ============================================================================
// External Services Configuration
// ============================================================================

export const ExternalServicesConfigSchema = z.object({
  // Email Service
  emailServiceEnabled: z.boolean(),
  emailServiceProvider: z.enum(['resend', 'sendgrid', 'mailgun']).optional(),
  emailServiceApiKey: z.string().optional(),

  // Analytics Services
  googleAnalyticsId: z.string().optional(),
  mixpanelToken: z.string().optional(),
  amplitudeApiKey: z.string().optional(),

  // Monitoring Services
  sentryDsn: z.string().url().optional(),
  datadogApiKey: z.string().optional(),

  // CDN/Image Services
  cloudinaryCloudName: z.string().optional(),
  cloudinaryApiKey: z.string().optional(),
  cloudinaryApiSecret: z.string().optional(),

  // Database
  databaseUrl: z.string().url(),
  databaseMaxConnections: z.number().min(1).max(100),
  databaseConnectionTimeoutMs: z.number().min(1000).max(30000),
})

export type ExternalServicesConfig = z.infer<typeof ExternalServicesConfigSchema>

// ============================================================================
// Feature Flags
// ============================================================================

export const FeatureFlagsSchema = z.object({
  // Analytics features
  enableAdvancedAnalytics: z.boolean(),
  enableRealTimeAnalytics: z.boolean(),
  enableUserTracking: z.boolean(),

  // Security features
  enableRateLimiting: z.boolean(),
  enableCsrfProtection: z.boolean(),
  enableSecurityHeaders: z.boolean(),

  // UI features
  enableDarkMode: z.boolean(),
  enableAnimations: z.boolean(),
  enableOfflineSupport: z.boolean(),

  // Development features
  enableDebugLogging: z.boolean(),
  enablePerformanceMonitoring: z.boolean(),
  enableErrorReporting: z.boolean(),
})

export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>

// ============================================================================
// Site Configuration (for SEO and metadata)
// ============================================================================

export const SiteConfigSchema = z.object({
  name: z.string(),
  description: z.string(),
  url: z.string().url(),
  ogImage: z.string().url(),
  links: z.object({
    github: z.string().url(),
    linkedin: z.string().url(),
    twitter: z.string().url().optional(),
  }),
  author: z.object({
    name: z.string(),
    email: z.string().email(),
    url: z.string().url().optional(),
  }),
})

export type SiteConfigType = z.infer<typeof SiteConfigSchema>

// ============================================================================
// Complete Configuration Schema
// ============================================================================

export const ConfigSchema = z.object({
  base: BaseConfigSchema,
  app: AppConfigSchema,
  analytics: AnalyticsConfigSchema,
  security: SecurityConfigSchema,
  externalServices: ExternalServicesConfigSchema,
  features: FeatureFlagsSchema,
  site: SiteConfigSchema,
})

export type Config = z.infer<typeof ConfigSchema>

// ============================================================================
// Configuration Factory
// ============================================================================

class ConfigurationManager {
  private config: Config | null = null
  private isInitialized = false

  /**
   * Initialize configuration with environment variables and defaults
   * Idempotent - safe to call multiple times
   */
  initialize(): Config {
    if (this.isInitialized && this.config) {
      return this.config
    }

    try {
      const nodeEnv = (process.env.NODE_ENV as NodeEnvironment) || 'development'
      const environment = this.determineEnvironment(nodeEnv)

      const baseConfig = {
        environment,
        nodeEnv,
        isDevelopment: environment === 'development',
        isProduction: environment === 'production',
        isTest: environment === 'test',
        isStaging: environment === 'staging',
      }

      const appConfig: AppConfig = {
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://richardwhudsonjr.com',
        apiUrl: process.env.NEXT_PUBLIC_API_URL,
        githubUrl: process.env.NEXT_PUBLIC_GITHUB_URL || 'https://github.com/hudsor01',
        linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/in/hudsor01',
        twitterUrl: process.env.NEXT_PUBLIC_TWITTER_URL,
        vercelAnalyticsId: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
        contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@richardwhudsonjr.com',
        githubUsername: process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'hudsor01',
        linkedinUsername: process.env.NEXT_PUBLIC_LINKEDIN_USERNAME || 'hudsor01',
        twitterUsername: process.env.NEXT_PUBLIC_TWITTER_USERNAME,
      }

      const analyticsConfig: AnalyticsConfig = {
        maxDataAgeDays: parseInt(process.env.ANALYTICS_MAX_DATA_AGE_DAYS || '30'),
        aggregationBatchSize: parseInt(process.env.ANALYTICS_AGGREGATION_BATCH_SIZE || '100'),
        aggregationIntervalMs: parseInt(process.env.ANALYTICS_AGGREGATION_INTERVAL_MS || '300000'), // 5min
        cacheMaxSize: parseInt(process.env.ANALYTICS_CACHE_MAX_SIZE || '10000'),
        cacheTtlMs: parseInt(process.env.ANALYTICS_CACHE_TTL_MS || '3600000'), // 1h
        slowQueryThresholdMs: parseInt(process.env.ANALYTICS_SLOW_QUERY_THRESHOLD_MS || '1000'),
        highTrafficThreshold: parseInt(process.env.ANALYTICS_HIGH_TRAFFIC_THRESHOLD || '1000'),
        pageViewSampleRate: parseFloat(process.env.ANALYTICS_PAGE_VIEW_SAMPLE_RATE || '1.0'),
        interactionSampleRate: parseFloat(process.env.ANALYTICS_INTERACTION_SAMPLE_RATE || '0.1'),
        errorSampleRate: parseFloat(process.env.ANALYTICS_ERROR_SAMPLE_RATE || '1.0'),
      }

      const securityConfig: SecurityConfig = {
        rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
        rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15min
        rateLimitMaxHistoryPerClient: parseInt(
          process.env.RATE_LIMIT_MAX_HISTORY_PER_CLIENT || '100'
        ),
        rateLimitClientExpiryMs: parseInt(process.env.RATE_LIMIT_CLIENT_EXPIRY_MS || '86400000'), // 24h
        cspEnabled: process.env.CSP_ENABLED !== 'false',
        cspReportOnly: process.env.CSP_REPORT_ONLY === 'true',
        hstsMaxAge: parseInt(process.env.HSTS_MAX_AGE || '31536000'), // 1y
        hstsIncludeSubDomains: process.env.HSTS_INCLUDE_SUBDOMAINS !== 'false',
        hstsPreload: process.env.HSTS_PRELOAD === 'true',
        corsAllowedOrigins: this.parseCorsOrigins(process.env.CORS_ALLOWED_ORIGINS),
        corsAllowedMethods: (
          process.env.CORS_ALLOWED_METHODS || 'GET,POST,PUT,DELETE,OPTIONS'
        ).split(','),
        corsAllowedHeaders: (
          process.env.CORS_ALLOWED_HEADERS || 'Content-Type,Authorization,X-Requested-With'
        ).split(','),
        corsMaxAge: parseInt(process.env.CORS_MAX_AGE || '86400'), // 1d
        cspDomains: {
          fonts: (process.env.CSP_FONT_DOMAINS || 'https://fonts.gstatic.com').split(','),
          scripts: (
            process.env.CSP_SCRIPT_DOMAINS ||
            'https://vercel.live,https://va.vercel-scripts.com,https://vitals.vercel-insights.com'
          ).split(','),
          styles: (process.env.CSP_STYLE_DOMAINS || 'https://fonts.googleapis.com').split(','),
          images: (
            process.env.CSP_IMAGE_DOMAINS || 'https://images.unsplash.com,https://vercel.com'
          ).split(','),
          connect: (
            process.env.CSP_CONNECT_DOMAINS ||
            'https://vercel.live,https://va.vercel-scripts.com,https://vitals.vercel-insights.com'
          ).split(','),
        },
        contentTypeOptions: process.env.CONTENT_TYPE_OPTIONS !== 'false',
        xssProtection: process.env.XSS_PROTECTION !== 'false',
        frameOptions: process.env.FRAME_OPTIONS || 'DENY',
        referrerPolicy: process.env.REFERRER_POLICY || 'strict-origin-when-cross-origin',
        permissionsPolicy: process.env.PERMISSIONS_POLICY
          ? process.env.PERMISSIONS_POLICY.split(',')
          : ['geolocation=()', 'camera=()', 'microphone=()'],
        crossOriginEmbedderPolicy: process.env.CROSS_ORIGIN_EMBEDDER_POLICY,
        crossOriginOpenerPolicy: process.env.CROSS_ORIGIN_OPENER_POLICY,
        crossOriginResourcePolicy: process.env.CROSS_ORIGIN_RESOURCE_POLICY,
      }

      const externalServicesConfig: ExternalServicesConfig = {
        emailServiceEnabled: process.env.EMAIL_SERVICE_ENABLED === 'true',
        emailServiceProvider:
          (process.env.EMAIL_SERVICE_PROVIDER as 'resend' | 'sendgrid' | 'mailgun') || undefined,
        emailServiceApiKey: process.env.EMAIL_SERVICE_API_KEY,
        googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
        mixpanelToken: process.env.MIXPANEL_TOKEN,
        amplitudeApiKey: process.env.AMPLITUDE_API_KEY,
        sentryDsn: process.env.SENTRY_DSN,
        datadogApiKey: process.env.DATADOG_API_KEY,
        cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
        databaseUrl: process.env.DATABASE_URL || '',
        databaseMaxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS || '20'),
        databaseConnectionTimeoutMs: parseInt(
          process.env.DATABASE_CONNECTION_TIMEOUT_MS || '10000'
        ),
      }

      const featureFlags: FeatureFlags = {
        enableAdvancedAnalytics: process.env.FEATURE_ADVANCED_ANALYTICS === 'true',
        enableRealTimeAnalytics: process.env.FEATURE_REAL_TIME_ANALYTICS === 'true',
        enableUserTracking: process.env.FEATURE_USER_TRACKING !== 'false',
        enableRateLimiting: process.env.FEATURE_RATE_LIMITING !== 'false',
        enableCsrfProtection: process.env.FEATURE_CSRF_PROTECTION !== 'false',
        enableSecurityHeaders: process.env.FEATURE_SECURITY_HEADERS !== 'false',
        enableDarkMode: process.env.FEATURE_DARK_MODE === 'true',
        enableAnimations: process.env.FEATURE_ANIMATIONS !== 'false',
        enableOfflineSupport: process.env.FEATURE_OFFLINE_SUPPORT === 'true',
        enableDebugLogging: environment === 'development',
        enablePerformanceMonitoring: process.env.FEATURE_PERFORMANCE_MONITORING !== 'false',
        enableErrorReporting: process.env.FEATURE_ERROR_REPORTING !== 'false',
      }

      const siteConfig: SiteConfigType = {
        name: process.env.NEXT_PUBLIC_SITE_NAME || 'Richard Hudson Jr',
        description:
          process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
          'Full-stack developer specializing in modern web technologies',
        url: appConfig.siteUrl,
        ogImage: process.env.NEXT_PUBLIC_OG_IMAGE || `${appConfig.siteUrl}/og-image.jpg`,
        links: {
          github: appConfig.githubUrl,
          linkedin: appConfig.linkedinUrl,
          twitter: appConfig.twitterUrl,
        },
        author: {
          name: 'Richard Hudson Jr',
          email: appConfig.contactEmail,
          url: appConfig.siteUrl,
        },
      }

      const config = ConfigSchema.parse({
        base: baseConfig,
        app: appConfig,
        analytics: analyticsConfig,
        security: securityConfig,
        externalServices: externalServicesConfig,
        features: featureFlags,
        site: siteConfig,
      })

      this.config = config
      this.isInitialized = true

      configLogger.info('Configuration initialized successfully', {
        environment: config.base.environment,
        features: Object.keys(config.features).filter(
          (key) => config.features[key as keyof FeatureFlags]
        ),
      })

      return config
    } catch (error) {
      configLogger.error('Failed to initialize configuration', { error })
      throw new Error(
        `Configuration initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  private determineEnvironment(nodeEnv: NodeEnvironment): Environment {
    // Allow override via environment variable
    const envOverride = process.env.APP_ENV as Environment
    if (envOverride && EnvironmentSchema.safeParse(envOverride).success) {
      return envOverride
    }

    // Map NODE_ENV to our environment
    switch (nodeEnv) {
      case 'production':
        return 'production'
      case 'test':
        return 'test'
      default:
        // Check for staging indicators
        if (process.env.VERCEL_ENV === 'preview' || process.env.STAGING === 'true') {
          return 'staging'
        }
        return 'development'
    }
  }

  private parseCorsOrigins(origins?: string): string[] {
    if (!origins) {
      return [
        'https://richardwhudsonjr.com',
        'https://www.richardwhudsonjr.com',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ]
    }
    return origins.split(',').map((origin) => origin.trim())
  }

  /**
   * Get the current configuration (lazy initialization)
   */
  getConfig(): Config {
    return this.initialize()
  }

  /**
   * Get a specific configuration section (lazy initialization)
   */
  get<K extends keyof Config>(section: K): Config[K] {
    const config = this.initialize()
    return config[section]
  }

  /**
   * Check if a feature flag is enabled (lazy initialization)
   */
  isFeatureEnabled(feature: keyof FeatureFlags): boolean {
    const config = this.initialize()
    return config.features[feature]
  }

  /**
   * Get environment-specific value
   */
  getEnvValue<T>(key: string, defaultValue?: T): string | T | undefined {
    return process.env[key] || defaultValue
  }
}

// ============================================================================
// Singleton Instance with Lazy Initialization
// ============================================================================

export const configManager = new ConfigurationManager()

/**
 * Get the complete configuration (lazy initialization)
 */
export function getConfig(): Config {
  return configManager.initialize()
}

/**
 * Get a specific configuration section (lazy initialization)
 */
export function getConfigSection<K extends keyof Config>(section: K): Config[K] {
  const config = configManager.initialize()
  return config[section]
}

/**
 * Check if a feature flag is enabled (lazy initialization)
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const config = configManager.initialize()
  return config.features[feature]
}

/**
 * Initialize configuration (call this at app startup)
 */
export function initializeConfig(): Config {
  return configManager.initialize()
}

// ============================================================================
// Legacy Compatibility Exports
// ============================================================================

// Re-export existing site config for backward compatibility
export { siteConfig, navConfig } from './site'
