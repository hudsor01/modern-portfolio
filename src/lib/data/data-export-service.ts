/**
 * Data Export and Backup Service
 * Comprehensive data management with export, backup, and restore capabilities
 */

import { createHash } from 'crypto';
import { ProjectDataManager } from '@/lib/server/project-data-manager';
import type { Project } from '@/types/project';
import {
  createProjectBackup,
  exportProjects
} from './data-migration-utils';
import {
  AnalyticsDataProcessor
} from '@/lib/analytics/data-aggregation-service';

// Export configuration schema
interface ExportConfig {
  format: 'json' | 'csv' | 'yaml' | 'xlsx';
  includeMetadata: boolean;
  compress: boolean;
  timestamp: boolean;
  sections: {
    projects: boolean;
    analytics: boolean;
    configuration: boolean;
    cache: boolean;
  };
}

// Export result interface
interface ExportResult {
  success: boolean;
  filename: string;
  size: number;
  checksum?: string;
  metadata: {
    exportedAt: string;
    format: string;
    sections: string[];
    recordCounts: Record<string, number>;
  };
  error?: string;
}

// Backup manifest interface
interface BackupManifest {
  version: string;
  createdAt: string;
  format: string;
  sections: string[];
  files: Array<{
    name: string;
    size: number;
    checksum: string;
    recordCount: number;
  }>;
  metadata: {
    appVersion?: string;
    nodeVersion?: string;
    exportConfig: ExportConfig;
  };
}

/**
 * Data Export Service
 */
export class DataExportService {
  private static instance: DataExportService;
  private analyticsProcessor = AnalyticsDataProcessor.getInstance();

  static getInstance(): DataExportService {
    if (!DataExportService.instance) {
      DataExportService.instance = new DataExportService();
    }
    return DataExportService.instance;
  }

  /**
   * Export all data with comprehensive options
   */
  async exportAllData(config: Partial<ExportConfig> = {}): Promise<ExportResult> {
    const fullConfig: ExportConfig = {
      format: 'json',
      includeMetadata: true,
      compress: false,
      timestamp: true,
      sections: {
        projects: true,
        analytics: true,
        configuration: true,
        cache: false,
      },
      ...config,
    };

    try {
      const exportData: Record<string, unknown> = {};
      const recordCounts: Record<string, number> = {};

      // Export projects data
      if (fullConfig.sections.projects) {
        const projects = await ProjectDataManager.getProjects();
        const projectStats = await ProjectDataManager.getProjectStats();
        
        exportData.projects = {
          data: projects,
          stats: projectStats,
          filters: (await ProjectDataManager.getProjectsWithFilters()).filters,
        };
        recordCounts.projects = projects.length;
      }

      // Export analytics data (if available)
      if (fullConfig.sections.analytics) {
        const cacheStats = this.analyticsProcessor.getCacheStats();
        exportData.analytics = {
          cacheStats,
          // Note: In a real application, you would export actual analytics data
          // For now, we include cache statistics and structure
          structure: {
            dailyStats: 'DailyStats[]',
            weeklyStats: 'WeeklyStats[]',
            pageViews: 'PageView[]',
            interactions: 'InteractionEvent[]',
          },
        };
        recordCounts.analytics = cacheStats.size;
      }

      // Export configuration
      if (fullConfig.sections.configuration) {
        exportData.configuration = {
          exportConfig: fullConfig,
          environment: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
        };
        recordCounts.configuration = 1;
      }

      // Add metadata
      if (fullConfig.includeMetadata) {
        exportData.metadata = {
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
          format: fullConfig.format,
          nodeVersion: process.version,
          sections: Object.keys(fullConfig.sections).filter(
            key => fullConfig.sections[key as keyof typeof fullConfig.sections]
          ),
        };
      }

      // Generate filename
      const timestamp = fullConfig.timestamp 
        ? `-${new Date().toISOString().split('T')[0]}` 
        : '';
      const filename = `portfolio-export${timestamp}.${fullConfig.format}`;

      // Convert to requested format
      let exportContent: string;
      
      switch (fullConfig.format) {
        case 'json':
          exportContent = JSON.stringify(exportData, null, 2);
          break;
        case 'yaml':
          exportContent = this.convertToYAML(exportData);
          break;
        case 'csv':
          exportContent = this.convertToCSV(exportData);
          break;
        default:
          throw new Error(`Unsupported export format: ${fullConfig.format}`);
      }

      // Calculate checksum
      const checksum = await this.calculateChecksum(exportContent);

      return {
        success: true,
        filename,
        size: Buffer.byteLength(exportContent, 'utf8'),
        checksum,
        metadata: {
          exportedAt: new Date().toISOString(),
          format: fullConfig.format,
          sections: Object.keys(fullConfig.sections).filter(
            key => fullConfig.sections[key as keyof typeof fullConfig.sections]
          ),
          recordCounts,
        },
      };

    } catch (error) {
      return {
        success: false,
        filename: '',
        size: 0,
        metadata: {
          exportedAt: new Date().toISOString(),
          format: fullConfig.format,
          sections: [],
          recordCounts: {},
        },
        error: error instanceof Error ? error.message : 'Unknown export error',
      };
    }
  }

  /**
   * Create incremental backup
   */
  async createIncrementalBackup(
    lastBackupTimestamp?: string
  ): Promise<{
    manifest: BackupManifest;
    files: Map<string, string>;
    changes: {
      added: number;
      modified: number;
      deleted: number;
    };
  }> {
    const manifest: BackupManifest = {
      version: '2.0.0',
      createdAt: new Date().toISOString(),
      format: 'json',
      sections: ['projects', 'analytics'],
      files: [],
      metadata: {
        appVersion: process.env.npm_package_version,
        nodeVersion: process.version,
        exportConfig: {
          format: 'json',
          includeMetadata: true,
          compress: false,
          timestamp: true,
          sections: {
            projects: true,
            analytics: true,
            configuration: true,
            cache: false,
          },
        },
      },
    };

    const files = new Map<string, string>();
    const changes = { added: 0, modified: 0, deleted: 0 };
    const lastBackup = lastBackupTimestamp ? new Date(lastBackupTimestamp) : null;

    // Backup projects
    const projects = await ProjectDataManager.getProjects();
    const projectsBackup = createProjectBackup(projects);
    const projectsContent = JSON.stringify(projectsBackup, null, 2);
    
    files.set('projects.json', projectsContent);
    manifest.files.push({
      name: 'projects.json',
      size: Buffer.byteLength(projectsContent, 'utf8'),
      checksum: await this.calculateChecksum(projectsContent),
      recordCount: projects.length,
    });

    // Count changes (simplified - in a real app, you'd compare with previous backup)
    changes.added = projects.filter((p: Project) => 
      !lastBackup || (p.createdAt && new Date(p.createdAt) > lastBackup)
    ).length;
    
    changes.modified = projects.filter((p: Project) => 
      lastBackup && p.updatedAt && new Date(p.updatedAt) > lastBackup
    ).length;

    // Backup analytics configuration
    const analyticsConfig = {
      cacheStats: this.analyticsProcessor.getCacheStats(),
      backupTime: new Date().toISOString(),
    };
    const analyticsContent = JSON.stringify(analyticsConfig, null, 2);
    
    files.set('analytics.json', analyticsContent);
    manifest.files.push({
      name: 'analytics.json',
      size: Buffer.byteLength(analyticsContent, 'utf8'),
      checksum: await this.calculateChecksum(analyticsContent),
      recordCount: 1,
    });

    return { manifest, files, changes };
  }

  /**
   * Validate backup integrity
   */
  async validateBackup(
    manifest: BackupManifest,
    files: Map<string, string>
  ): Promise<{
    isValid: boolean;
    errors: string[];
    checksumMatches: Record<string, boolean>;
  }> {
    const errors: string[] = [];
    const checksumMatches: Record<string, boolean> = {};

    // Validate manifest structure
    if (!manifest.version || !manifest.createdAt || !manifest.files) {
      errors.push('Invalid manifest structure');
    }

    // Validate each file
    for (const fileInfo of manifest.files) {
      const content = files.get(fileInfo.name);
      
      if (!content) {
        errors.push(`Missing file: ${fileInfo.name}`);
        checksumMatches[fileInfo.name] = false;
        continue;
      }

      // Validate size
      const actualSize = Buffer.byteLength(content, 'utf8');
      if (actualSize !== fileInfo.size) {
        errors.push(`Size mismatch for ${fileInfo.name}: expected ${fileInfo.size}, got ${actualSize}`);
      }

      // Validate checksum
      const actualChecksum = await this.calculateChecksum(content);
      checksumMatches[fileInfo.name] = actualChecksum === fileInfo.checksum;
      
      if (!checksumMatches[fileInfo.name]) {
        errors.push(`Checksum mismatch for ${fileInfo.name}`);
      }

      // Validate JSON structure
      if (fileInfo.name.endsWith('.json')) {
        try {
          JSON.parse(content);
        } catch (error) {
          errors.push(`Invalid JSON in ${fileInfo.name}: ${error}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      checksumMatches,
    };
  }

  /**
   * Generate data quality report
   */
  async generateDataQualityReport(): Promise<{
    projects: {
      total: number;
      withImages: number;
      withDescriptions: number;
      withTags: number;
      missingFields: Array<{ project: string; fields: string[] }>;
    };
    analytics: {
      cacheSize: number;
      memoryUsage: number;
      hitRate: number;
    };
    overall: {
      score: number;
      issues: string[];
      recommendations: string[];
    };
  }> {
    const projects = await ProjectDataManager.getProjects();
    const analyticsStats = this.analyticsProcessor.getCacheStats();

    // Analyze projects
    const projectAnalysis = {
      total: projects.length,
      withImages: projects.filter((p: Project) => p.image).length,
      withDescriptions: projects.filter((p: Project) => p.description && p.description.length > 10).length,
      withTags: projects.filter((p: Project) => p.tags && p.tags.length > 0).length,
      missingFields: [] as Array<{ project: string; fields: string[] }>,
    };

    // Check for missing fields
    projects.forEach((project: Project) => {
      const missingFields: string[] = [];
      
      if (!project.image) missingFields.push('image');
      if (!project.description || project.description.length < 10) missingFields.push('description');
      if (!project.tags || project.tags.length === 0) missingFields.push('tags');
      if (!project.category) missingFields.push('category');
      
      if (missingFields.length > 0) {
        projectAnalysis.missingFields.push({
          project: project.title,
          fields: missingFields,
        });
      }
    });

    // Calculate overall quality score
    const projectCompleteness = (
      projectAnalysis.withImages + 
      projectAnalysis.withDescriptions + 
      projectAnalysis.withTags
    ) / (projectAnalysis.total * 3);

    const overallScore = Math.round(projectCompleteness * 100);

    // Generate issues and recommendations
    const issues: string[] = [];
    const recommendations: string[] = [];

    if (projectAnalysis.withImages / projectAnalysis.total < 0.9) {
      issues.push('Some projects are missing images');
      recommendations.push('Add images to all projects for better visual appeal');
    }

    if (projectAnalysis.withTags / projectAnalysis.total < 0.8) {
      issues.push('Many projects lack proper tags');
      recommendations.push('Add relevant tags to improve project discoverability');
    }

    if (analyticsStats.size === 0) {
      issues.push('No analytics data cached');
      recommendations.push('Enable analytics data collection for insights');
    }

    return {
      projects: projectAnalysis,
      analytics: {
        cacheSize: analyticsStats.size,
        memoryUsage: analyticsStats.memoryUsage,
        hitRate: analyticsStats.hitRate,
      },
      overall: {
        score: overallScore,
        issues,
        recommendations,
      },
    };
  }

  /**
   * Convert data to YAML format
   */
  private convertToYAML(data: unknown): string {
    // Basic YAML conversion - in production, use a proper YAML library
    
    const convertValue = (value: unknown, indent: number = 0): string[] => {
      const spaces = '  '.repeat(indent);
      const lines: string[] = [];
      
      if (Array.isArray(value)) {
        value.forEach(item => {
          if (typeof item === 'object' && item !== null) {
            lines.push(`${spaces}- `);
            lines.push(...convertValue(item, indent + 1));
          } else {
            lines.push(`${spaces}- ${item}`);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([key, val]) => {
          if (typeof val === 'object' && val !== null) {
            lines.push(`${spaces}${key}:`);
            lines.push(...convertValue(val, indent + 1));
          } else {
            lines.push(`${spaces}${key}: ${val}`);
          }
        });
      }
      
      return lines;
    };

    return convertValue(data).join('\n');
  }

  /**
   * Convert data to CSV format
   */
  private convertToCSV(data: Record<string, unknown>): string {
    // Extract projects for CSV conversion
    if (data.projects && typeof data.projects === 'object' && data.projects !== null) {
      const projectsData = data.projects as Record<string, unknown>;
      if (Array.isArray(projectsData.data)) {
        return exportProjects(projectsData.data, 'csv');
      }
    }
    
    return 'No tabular data available for CSV export';
  }

  /**
   * Calculate checksum for data integrity
   */
  private async calculateChecksum(content: string): Promise<string> {
    // Check if we're in browser environment with Web Crypto API
    if (typeof globalThis.crypto !== 'undefined' && globalThis.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(content);
      const hashBuffer = await globalThis.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback for Node.js environment
    return createHash('sha256').update(content).digest('hex');
  }
}

// Export singleton instance and convenience functions
const dataExportService = DataExportService.getInstance();

export const exportAllData = (config?: Partial<ExportConfig>) =>
  dataExportService.exportAllData(config);

export const createIncrementalBackup = (lastBackupTimestamp?: string) =>
  dataExportService.createIncrementalBackup(lastBackupTimestamp);

export const validateBackup = (manifest: BackupManifest, files: Map<string, string>) =>
  dataExportService.validateBackup(manifest, files);

export const generateDataQualityReport = () =>
  dataExportService.generateDataQualityReport();

export type {
  ExportConfig,
  ExportResult,
  BackupManifest,
};

export default dataExportService;