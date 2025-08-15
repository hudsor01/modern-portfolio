/**
 * Data Migration and Transformation Utilities
 * Handles data format transformations, migrations, and backup/restore
 */

// Note: zod is imported via project schema validations
import { Project } from '@/types/project';
import {
  ProjectSchema,
  safeValidateProjectsArray,
  sanitizeProjectForAPI,
  type ValidatedProject
} from '@/lib/validations/project-schema';

// Legacy project data formats for migration support
export interface LegacyProjectV1 {
  id: string;
  title: string;
  description: string;
  image?: string;
  link?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  createdAt?: string;
}

export interface LegacyProjectV2 extends LegacyProjectV1 {
  slug?: string;
  github?: string;
  technologies?: string[];
  updatedAt?: string;
}

// Migration result interface
export interface MigrationResult<T> {
  success: boolean;
  data: T[];
  errors: Array<{
    index: number;
    item: unknown;
    error: string;
    details?: unknown;
  }>;
  warnings: Array<{
    index: number;
    item: unknown;
    warning: string;
  }>;
  stats: {
    total: number;
    migrated: number;
    failed: number;
    warnings: number;
  };
}

/**
 * Data Migration Manager
 */
export class DataMigrationManager {
  /**
   * Migrate legacy project data to current format
   */
  static migrateLegacyProjects(
    legacyData: unknown[],
    version: 'v1' | 'v2' = 'v2'
  ): MigrationResult<ValidatedProject> {
    const results: ValidatedProject[] = [];
    const errors: MigrationResult<ValidatedProject>['errors'] = [];
    const warnings: MigrationResult<ValidatedProject>['warnings'] = [];

    legacyData.forEach((item, index) => {
      try {
        let migratedProject: Partial<Project>;

        if (version === 'v1') {
          migratedProject = this.migrateLegacyV1ToCurrentFormat(item as LegacyProjectV1);
        } else {
          migratedProject = this.migrateLegacyV2ToCurrentFormat(item as LegacyProjectV2);
        }

        // Validate migrated project
        const validation = ProjectSchema.safeParse(migratedProject);
        
        if (validation.success) {
          const sanitized = sanitizeProjectForAPI(validation.data);
          results.push(sanitized);

          // Check for potential data quality issues
          if (!sanitized.image) {
            warnings.push({
              index,
              item,
              warning: 'Missing image URL - consider adding a placeholder'
            });
          }

          if (!sanitized.slug) {
            warnings.push({
              index,
              item,
              warning: 'Auto-generated slug from ID - consider setting explicit slug'
            });
          }
        } else {
          errors.push({
            index,
            item,
            error: 'Validation failed after migration',
            details: validation.error?.issues || 'Unknown validation error'
          });
        }
      } catch (error) {
        errors.push({
          index,
          item,
          error: error instanceof Error ? error.message : 'Unknown migration error',
          details: error
        });
      }
    });

    return {
      success: errors.length === 0,
      data: results,
      errors,
      warnings,
      stats: {
        total: legacyData.length,
        migrated: results.length,
        failed: errors.length,
        warnings: warnings.length,
      }
    };
  }

  /**
   * Migrate from legacy V1 format
   */
  private static migrateLegacyV1ToCurrentFormat(legacy: LegacyProjectV1): Partial<Project> {
    return {
      id: legacy.id,
      slug: legacy.id, // Generate slug from ID
      title: legacy.title,
      description: legacy.description,
      image: legacy.image,
      link: legacy.link,
      liveUrl: legacy.link, // Map link to liveUrl
      category: legacy.category,
      tags: legacy.tags || [],
      technologies: legacy.tags || [], // Use tags as technologies for V1
      featured: legacy.featured || false,
      createdAt: legacy.createdAt ? new Date(legacy.createdAt) : new Date(),
      updatedAt: legacy.createdAt ? new Date(legacy.createdAt) : new Date(),
    };
  }

  /**
   * Migrate from legacy V2 format
   */
  private static migrateLegacyV2ToCurrentFormat(legacy: LegacyProjectV2): Partial<Project> {
    return {
      id: legacy.id,
      slug: legacy.slug || legacy.id,
      title: legacy.title,
      description: legacy.description,
      image: legacy.image,
      link: legacy.link,
      liveUrl: legacy.link,
      github: legacy.github,
      githubUrl: legacy.github,
      category: legacy.category,
      tags: legacy.tags || [],
      technologies: legacy.technologies || legacy.tags || [],
      featured: legacy.featured || false,
      createdAt: legacy.createdAt ? new Date(legacy.createdAt) : new Date(),
      updatedAt: legacy.updatedAt ? new Date(legacy.updatedAt) : legacy.createdAt ? new Date(legacy.createdAt) : new Date(),
    };
  }

  /**
   * Backup project data to JSON
   */
  static createBackup(projects: Project[]): {
    timestamp: string;
    version: string;
    projects: Project[];
    metadata: {
      total: number;
      featured: number;
      categories: string[];
    };
  } {
    const categories = [...new Set(projects.map(p => p.category).filter((cat): cat is string => Boolean(cat)))];
    
    return {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      projects: projects.map(project => ({
        ...project,
        // Ensure dates are serialized properly
        createdAt: project.createdAt instanceof Date 
          ? project.createdAt.toISOString() 
          : project.createdAt,
        updatedAt: project.updatedAt instanceof Date 
          ? project.updatedAt.toISOString() 
          : project.updatedAt,
      })),
      metadata: {
        total: projects.length,
        featured: projects.filter(p => p.featured).length,
        categories,
      }
    };
  }

  /**
   * Restore project data from backup
   */
  static restoreFromBackup(backupData: unknown): MigrationResult<ValidatedProject> {
    try {
      const backup = backupData as Record<string, unknown>;
      const projects = backup.projects || backupData;
      
      if (!Array.isArray(projects)) {
        throw new Error('Invalid backup format: projects must be an array');
      }

      // Convert date strings back to Date objects
      const processedProjects = projects.map((project: unknown) => {
        const proj = project as Record<string, unknown>;
        return {
          ...proj,
          createdAt: proj.createdAt ? new Date(proj.createdAt as string) : undefined,
          updatedAt: proj.updatedAt ? new Date(proj.updatedAt as string) : undefined,
        };
      });

      return this.validateAndTransformProjects(processedProjects);
    } catch (error) {
      return {
        success: false,
        data: [],
        errors: [{
          index: 0,
          item: backupData,
          error: error instanceof Error ? error.message : 'Failed to restore backup'
        }],
        warnings: [],
        stats: {
          total: 0,
          migrated: 0,
          failed: 1,
          warnings: 0,
        }
      };
    }
  }

  /**
   * Validate and transform project data
   */
  static validateAndTransformProjects(data: unknown[]): MigrationResult<ValidatedProject> {
    const validation = safeValidateProjectsArray(data);
    const sanitizedProjects = validation.data.map(sanitizeProjectForAPI);

    const errors = validation.errors.map(err => ({
      index: err.index,
      item: data[err.index],
      error: 'Validation failed',
      details: err.error.issues
    }));

    const warnings: MigrationResult<ValidatedProject>['warnings'] = [];

    // Check for data quality issues
    sanitizedProjects.forEach((project, index) => {
      if (!project.image) {
        warnings.push({
          index,
          item: project,
          warning: 'Missing image - consider adding a placeholder'
        });
      }

      if (!project.category) {
        warnings.push({
          index,
          item: project,
          warning: 'Missing category - consider assigning a category'
        });
      }

      if (!project.tags || project.tags.length === 0) {
        warnings.push({
          index,
          item: project,
          warning: 'No tags assigned - consider adding relevant tags'
        });
      }
    });

    return {
      success: errors.length === 0,
      data: sanitizedProjects,
      errors,
      warnings,
      stats: {
        total: data.length,
        migrated: sanitizedProjects.length,
        failed: errors.length,
        warnings: warnings.length,
      }
    };
  }

  /**
   * Convert projects to different export formats
   */
  static exportToFormat(projects: Project[], format: 'json' | 'csv' | 'yaml'): string {
    switch (format) {
      case 'json':
        return JSON.stringify(this.createBackup(projects), null, 2);
      
      case 'csv':
        return this.convertToCSV(projects);
      
      case 'yaml':
        return this.convertToYAML(projects);
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Convert projects to CSV format
   */
  private static convertToCSV(projects: Project[]): string {
    const headers = [
      'id', 'title', 'slug', 'description', 'category', 'featured',
      'image', 'link', 'github', 'tags', 'technologies', 'createdAt', 'updatedAt'
    ];

    const csvRows = [
      headers.join(','),
      ...projects.map(project => {
        const row = headers.map(header => {
          let value = project[header as keyof Project];
          
          if (Array.isArray(value)) {
            value = value.join(';');
          } else if (value instanceof Date) {
            value = value.toISOString();
          } else if (typeof value === 'string' && value.includes(',')) {
            value = `"${value}"`;
          }
          
          return value || '';
        });
        
        return row.join(',');
      })
    ];

    return csvRows.join('\n');
  }

  /**
   * Convert projects to YAML format (basic implementation)
   */
  private static convertToYAML(projects: Project[]): string {
    const yamlLines = ['projects:'];
    
    projects.forEach(project => {
      yamlLines.push(`  - id: "${project.id}"`);
      yamlLines.push(`    title: "${project.title}"`);
      yamlLines.push(`    slug: "${project.slug || project.id}"`);
      yamlLines.push(`    description: "${project.description}"`);
      
      if (project.category) {
        yamlLines.push(`    category: "${project.category}"`);
      }
      
      if (project.featured) {
        yamlLines.push(`    featured: ${project.featured}`);
      }
      
      if (project.tags && project.tags.length > 0) {
        yamlLines.push(`    tags:`);
        project.tags.forEach(tag => {
          yamlLines.push(`      - "${tag}"`);
        });
      }
      
      yamlLines.push('');
    });

    return yamlLines.join('\n');
  }

  /**
   * Generate migration report
   */
  static generateMigrationReport<T>(result: MigrationResult<T>): string {
    const report: string[] = [];
    
    report.push('=== DATA MIGRATION REPORT ===');
    report.push(`Generated: ${new Date().toISOString()}`);
    report.push('');
    
    report.push('SUMMARY:');
    report.push(`  Total Records: ${result.stats.total}`);
    report.push(`  Migrated Successfully: ${result.stats.migrated}`);
    report.push(`  Failed: ${result.stats.failed}`);
    report.push(`  Warnings: ${result.stats.warnings}`);
    report.push(`  Success Rate: ${((result.stats.migrated / result.stats.total) * 100).toFixed(1)}%`);
    report.push('');

    if (result.errors.length > 0) {
      report.push('ERRORS:');
      result.errors.forEach((error, index) => {
        report.push(`  ${index + 1}. Record ${error.index}: ${error.error}`);
        if (error.details) {
          report.push(`     Details: ${JSON.stringify(error.details, null, 2)}`);
        }
      });
      report.push('');
    }

    if (result.warnings.length > 0) {
      report.push('WARNINGS:');
      result.warnings.forEach((warning, index) => {
        report.push(`  ${index + 1}. Record ${warning.index}: ${warning.warning}`);
      });
      report.push('');
    }

    report.push('=== END REPORT ===');
    
    return report.join('\n');
  }
}

// Export convenience functions
export const migrateLegacyProjects = (data: unknown[], version: 'v1' | 'v2' = 'v2') =>
  DataMigrationManager.migrateLegacyProjects(data, version);

export const createProjectBackup = (projects: Project[]) =>
  DataMigrationManager.createBackup(projects);

export const restoreProjectBackup = (backupData: unknown) =>
  DataMigrationManager.restoreFromBackup(backupData);

export const validateProjects = (data: unknown[]) =>
  DataMigrationManager.validateAndTransformProjects(data);

export const exportProjects = (projects: Project[], format: 'json' | 'csv' | 'yaml') =>
  DataMigrationManager.exportToFormat(projects, format);