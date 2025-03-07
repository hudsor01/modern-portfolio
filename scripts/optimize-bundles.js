#!/usr/bin/env node

/**
 * This script analyzes the Next.js build output to identify large bundles
 * and provides optimization suggestions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = path.join(__dirname, '..', '.next');
const BUNDLE_THRESHOLD = 100 * 1024; // 100KB

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function analyzeBundles() {
  console.log(
    `\n${colors.bold}${colors.blue}=== Modern Portfolio Bundle Analyzer ===${colors.reset}\n`
  );

  // Check if build directory exists
  if (!fs.existsSync(BUILD_DIR)) {
    console.error(
      `${colors.red}Build directory not found. Run 'npm run build' first.${colors.reset}`
    );
    process.exit(1);
  }

  // Get build stats
  const statsPath = path.join(BUILD_DIR, 'stats.json');

  if (!fs.existsSync(statsPath)) {
    console.log(
      `${colors.yellow}Stats file not found. Run build with 'ANALYZE=true npm run build'${colors.reset}`
    );

    // Try to analyze from the available information
    analyzeFromBuildFiles();
    return;
  }

  const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));

  // Find client chunks
  const clientChunks = stats.chunks
    .filter(
      (chunk) => chunk.names && chunk.names.length > 0 && !chunk.names[0].startsWith('server/')
    )
    .sort((a, b) => b.size - a.size);

  if (clientChunks.length === 0) {
    console.log(`${colors.yellow}No client chunks found in the stats file.${colors.reset}`);
    return;
  }

  console.log(`${colors.bold}Largest client bundles:${colors.reset}\n`);

  let largeChunksCount = 0;

  clientChunks.forEach((chunk) => {
    const size = chunk.size;
    const name = chunk.names[0];

    let color = colors.green;
    if (size > BUNDLE_THRESHOLD) {
      color = colors.red;
      largeChunksCount++;
    } else if (size > BUNDLE_THRESHOLD / 2) {
      color = colors.yellow;
    }

    console.log(`${color}${name}${colors.reset}: ${formatSize(size)}`);
  });

  if (largeChunksCount > 0) {
    console.log(`\n${colors.yellow}${colors.bold}Optimization suggestions:${colors.reset}\n`);
    console.log(`${colors.cyan}1. Use dynamic imports for large components`);
    console.log(`2. Reduce dependencies or use smaller alternatives`);
    console.log(`3. Split large components into smaller ones`);
    console.log(`4. Optimize images and assets${colors.reset}\n`);
  } else {
    console.log(
      `\n${colors.green}${colors.bold}All bundles are under the threshold of ${formatSize(BUNDLE_THRESHOLD)}. Good job!${colors.reset}\n`
    );
  }
}

function analyzeFromBuildFiles() {
  const buildId = fs.readFileSync(path.join(BUILD_DIR, 'BUILD_ID'), 'utf8').trim();
  const pagesDir = path.join(BUILD_DIR, 'static', buildId, 'pages');

  if (!fs.existsSync(pagesDir)) {
    console.error(
      `${colors.red}Pages directory not found. Build may be incomplete.${colors.reset}`
    );
    return;
  }

  const pageFiles = [];

  function scanDirectory(dir, basePath = '') {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        scanDirectory(filePath, path.join(basePath, file));
      } else if (file.endsWith('.js')) {
        pageFiles.push({
          name: path.join(basePath, file),
          size: stats.size,
        });
      }
    });
  }

  scanDirectory(pagesDir);

  const sortedFiles = pageFiles.sort((a, b) => b.size - a.size);

  console.log(`${colors.bold}Largest JS files (approximation):${colors.reset}\n`);

  let largeFilesCount = 0;

  sortedFiles.forEach((file) => {
    let color = colors.green;
    if (file.size > BUNDLE_THRESHOLD) {
      color = colors.red;
      largeFilesCount++;
    } else if (file.size > BUNDLE_THRESHOLD / 2) {
      color = colors.yellow;
    }

    console.log(`${color}${file.name}${colors.reset}: ${formatSize(file.size)}`);
  });

  if (largeFilesCount > 0) {
    console.log(`\n${colors.yellow}${colors.bold}Optimization suggestions:${colors.reset}\n`);
    console.log(`${colors.cyan}1. Use dynamic imports for large components`);
    console.log(`2. Reduce dependencies or use smaller alternatives`);
    console.log(`3. Split large components into smaller ones`);
    console.log(`4. Optimize images and assets${colors.reset}\n`);
  } else {
    console.log(
      `\n${colors.green}${colors.bold}All files are under the threshold of ${formatSize(BUNDLE_THRESHOLD)}. Good job!${colors.reset}\n`
    );
  }
}

try {
  analyzeBundles();
} catch (error) {
  console.error(`${colors.red}Error analyzing bundles:${colors.reset}`, error);
  process.exit(1);
}
