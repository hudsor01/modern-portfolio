#!/usr/bin/env node

/**
 * Quality Assurance Script for Modern Portfolio
 * Ensures architectural consistency and code quality
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

class QualityChecker {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.srcDir = path.join(rootDir, 'src');
  }

  log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
  }

  async checkFileExists(filePath, description) {
    try {
      await fs.access(filePath);
      this.log(`✓ ${description}`, colors.green);
      return true;
    } catch {
      this.issues.push(`Missing ${description}: ${filePath}`);
      this.log(`✗ Missing ${description}`, colors.red);
      return false;
    }
  }

  async checkDirectoryStructure() {
    this.log('\n📁 Checking directory structure...', colors.blue);
    
    const requiredDirs = [
      'src/app',
      'src/components',
      'src/lib',
      'src/hooks',
      'src/types',
      'src/styles'
    ];

    for (const dir of requiredDirs) {
      await this.checkFileExists(path.join(rootDir, dir), `Directory ${dir}`);
    }
  }

  async checkTypeDefinitions() {
    this.log('\n🏷️  Checking type definitions...', colors.blue);
    
    const typeFiles = [
      'src/types/project.ts',
      'src/types/shared-api.ts',
      'src/types/chart.ts',
      'src/types/common.ts'
    ];

    for (const file of typeFiles) {
      await this.checkFileExists(path.join(rootDir, file), `Type definition ${file}`);
    }
  }

  async checkConfigurationFiles() {
    this.log('\n⚙️  Checking configuration files...', colors.blue);
    
    const configFiles = [
      'next.config.js',
      'tsconfig.json',
      'tailwind.config.js',
      'package.json'
    ];

    for (const file of configFiles) {
      await this.checkFileExists(path.join(rootDir, file), `Config file ${file}`);
    }
  }

  async checkApiRoutes() {
    this.log('\n🌐 Checking API routes...', colors.blue);
    
    const apiDir = path.join(this.srcDir, 'app', 'api');
    try {
      const apiRoutes = await fs.readdir(apiDir, { withFileTypes: true });
      const routeDirs = apiRoutes.filter(dirent => dirent.isDirectory());
      
      for (const routeDir of routeDirs) {
        const routePath = path.join(apiDir, routeDir.name, 'route.ts');
        await this.checkFileExists(routePath, `API route ${routeDir.name}`);
      }
    } catch (error) {
      this.issues.push(`Cannot read API directory: ${error.message}`);
    }
  }

  async checkImportPatterns() {
    this.log('\n📦 Checking import patterns...', colors.blue);
    
    try {
      const files = await this.getAllTSFiles(this.srcDir);
      
      for (const file of files) {
        const content = await fs.readFile(file, 'utf-8');
        
        // Check for barrel imports (not allowed)
        if (content.includes('from \'@/components\'') || content.includes('from \'@/lib\'')) {
          this.warnings.push(`Potential barrel import in ${file.replace(rootDir, '')}`);
        }
        
        // Check for proper path aliases
        if (content.includes('../../../') || content.includes('../../../../')) {
          this.warnings.push(`Deep relative import in ${file.replace(rootDir, '')}`);
        }
      }
    } catch (error) {
      this.issues.push(`Error checking import patterns: ${error.message}`);
    }
  }

  async getAllTSFiles(dir) {
    const files = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        files.push(...await this.getAllTSFiles(fullPath));
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  async checkPackageJsonConsistency() {
    this.log('\n📄 Checking package.json consistency...', colors.blue);
    
    try {
      const packageJson = JSON.parse(await fs.readFile(path.join(rootDir, 'package.json'), 'utf-8'));
      
      // Check for unused axios
      if (packageJson.dependencies?.axios) {
        this.warnings.push('Axios dependency found - should use native fetch');
      }
      
      // Check for required scripts
      const requiredScripts = ['dev', 'build', 'lint', 'type-check'];
      for (const script of requiredScripts) {
        if (!packageJson.scripts?.[script]) {
          this.issues.push(`Missing required script: ${script}`);
        }
      }
      
      // Check Node.js version compatibility
      if (packageJson.engines?.node) {
        this.log(`✓ Node.js version constraint: ${packageJson.engines.node}`, colors.green);
      } else {
        this.warnings.push('No Node.js version constraint specified');
      }
      
    } catch (error) {
      this.issues.push(`Error reading package.json: ${error.message}`);
    }
  }

  async generateReport() {
    this.log('\n📊 Quality Check Summary', colors.bold);
    this.log('═'.repeat(50), colors.blue);
    
    if (this.issues.length === 0 && this.warnings.length === 0) {
      this.log('🎉 All quality checks passed!', colors.green);
      return true;
    }
    
    if (this.issues.length > 0) {
      this.log(`\n❌ Issues found (${this.issues.length}):`, colors.red);
      this.issues.forEach(issue => this.log(`  • ${issue}`, colors.red));
    }
    
    if (this.warnings.length > 0) {
      this.log(`\n⚠️  Warnings (${this.warnings.length}):`, colors.yellow);
      this.warnings.forEach(warning => this.log(`  • ${warning}`, colors.yellow));
    }
    
    this.log(`\n📈 Quality Score: ${this.calculateQualityScore()}%`, colors.blue);
    
    return this.issues.length === 0;
  }

  calculateQualityScore() {
    const totalChecks = 20; // Approximate number of checks
    const penalties = this.issues.length * 5 + this.warnings.length * 2;
    return Math.max(0, Math.min(100, 100 - penalties));
  }

  async run() {
    this.log('🔍 Starting Quality Assurance Check...', colors.bold);
    
    await this.checkDirectoryStructure();
    await this.checkTypeDefinitions();
    await this.checkConfigurationFiles();
    await this.checkApiRoutes();
    await this.checkImportPatterns();
    await this.checkPackageJsonConsistency();
    
    const success = await this.generateReport();
    
    process.exit(success ? 0 : 1);
  }
}

// Run the quality checker
const checker = new QualityChecker();
checker.run().catch(error => {
  console.error('Quality check failed:', error);
  process.exit(1);
});