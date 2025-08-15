/**
 * Database backup and restore utilities
 * Provides automated backup creation and restoration capabilities
 */

import { db } from '../src/lib/db'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

interface BackupData {
  timestamp: string
  version: string
  schema: string
  tables: {
    [tableName: string]: any[]
  }
  metadata: {
    totalRecords: number
    tableCount: number
    backupSize: string
  }
}

async function createDatabaseBackup(): Promise<string> {
  console.log('💾 Creating database backup...')
  
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupData: BackupData = {
      timestamp,
      version: '1.0.0',
      schema: 'public',
      tables: {},
      metadata: {
        totalRecords: 0,
        tableCount: 0,
        backupSize: '0MB'
      }
    }
    
    // Define tables to backup in dependency order
    const tables = [
      'authors',
      'categories',
      'tags',
      'post_series',
      'blog_posts',
      'post_tags',
      'post_relations',
      'series_posts',
      'post_versions',
      'post_views',
      'post_interactions',
      'seo_events',
      'seo_keywords',
      'sitemap_entries'
    ]
    
    console.log(`🔄 Backing up ${tables.length} tables...`)
    
    for (const tableName of tables) {
      try {
        console.log(`🔄 Backing up table: ${tableName}`)
        
        // Use raw query to get all data from each table
        const tableData = await db.$queryRawUnsafe(`SELECT * FROM "${tableName}"`)
        
        if (Array.isArray(tableData)) {
          backupData.tables[tableName] = tableData
          backupData.metadata.totalRecords += tableData.length
          console.log(`✅ Backed up ${tableData.length} records from ${tableName}`)
        } else {
          console.log(`⚠️  No data found in table: ${tableName}`)
          backupData.tables[tableName] = []
        }
        
      } catch (error: any) {
        console.error(`❌ Failed to backup table ${tableName}:`, error.message.split('\n')[0])
        backupData.tables[tableName] = []
      }
    }
    
    backupData.metadata.tableCount = Object.keys(backupData.tables).length
    
    // Create backup directory if it doesn't exist
    const backupDir = join(process.cwd(), 'backups')
    if (!existsSync(backupDir)) {
      mkdirSync(backupDir, { recursive: true })
    }
    
    // Save backup to file
    const backupFileName = `backup-${timestamp}.json`
    const backupFilePath = join(backupDir, backupFileName)
    
    const backupJson = JSON.stringify(backupData, null, 2)
    backupData.metadata.backupSize = `${(backupJson.length / 1024 / 1024).toFixed(2)}MB`
    
    writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2))
    
    console.log(`✅ Backup created successfully:`)
    console.log(`   📁 File: ${backupFilePath}`)
    console.log(`   📊 Records: ${backupData.metadata.totalRecords}`)
    console.log(`   📦 Tables: ${backupData.metadata.tableCount}`)
    console.log(`   💾 Size: ${backupData.metadata.backupSize}`)
    
    return backupFilePath
    
  } catch (error) {
    console.error('❌ Failed to create database backup:', error)
    throw error
  }
}

async function restoreDatabaseBackup(backupFilePath: string): Promise<void> {
  console.log(`🔄 Restoring database from backup: ${backupFilePath}`)
  
  try {
    if (!existsSync(backupFilePath)) {
      throw new Error(`Backup file not found: ${backupFilePath}`)
    }
    
    // Read backup data
    const backupJson = readFileSync(backupFilePath, 'utf-8')
    const backupData: BackupData = JSON.parse(backupJson)
    
    console.log(`📊 Backup info:`)
    console.log(`   🕐 Timestamp: ${backupData.timestamp}`)
    console.log(`   📊 Records: ${backupData.metadata.totalRecords}`)
    console.log(`   📦 Tables: ${backupData.metadata.tableCount}`)
    
    // Clear existing data in reverse dependency order
    const clearOrder = [
      'sitemap_entries',
      'seo_keywords',
      'seo_events',
      'post_interactions',
      'post_views',
      'post_versions',
      'series_posts',
      'post_relations',
      'post_tags',
      'blog_posts',
      'post_series',
      'tags',
      'categories',
      'authors'
    ]
    
    console.log('🧹 Clearing existing data...')
    for (const tableName of clearOrder) {
      try {
        await db.$executeRawUnsafe(`DELETE FROM "${tableName}"`)
        console.log(`✅ Cleared table: ${tableName}`)
      } catch (error: any) {
        console.error(`❌ Failed to clear table ${tableName}:`, error.message.split('\n')[0])
      }
    }
    
    // Restore data in dependency order
    const restoreOrder = [
      'authors',
      'categories', 
      'tags',
      'post_series',
      'blog_posts',
      'post_tags',
      'post_relations',
      'series_posts',
      'post_versions',
      'post_views',
      'post_interactions',
      'seo_events',
      'seo_keywords',
      'sitemap_entries'
    ]
    
    console.log('📥 Restoring data...')
    
    for (const tableName of restoreOrder) {
      const tableData = backupData.tables[tableName]
      
      if (!tableData || tableData.length === 0) {
        console.log(`⏭️  Skipping empty table: ${tableName}`)
        continue
      }
      
      try {
        console.log(`🔄 Restoring ${tableData.length} records to ${tableName}`)
        
        // Insert data in batches to avoid memory issues
        const batchSize = 100
        let inserted = 0
        
        for (let i = 0; i < tableData.length; i += batchSize) {
          const batch = tableData.slice(i, i + batchSize)
          
          for (const record of batch) {
            // Build INSERT statement dynamically
            const columns = Object.keys(record)
            const values = Object.values(record)
            const placeholders = values.map((_, index) => `$${index + 1}`).join(', ')
            
            const insertSQL = `INSERT INTO "${tableName}" (${columns.map(col => `"${col}"`).join(', ')}) VALUES (${placeholders})`
            
            try {
              await db.$executeRawUnsafe(insertSQL, ...values)
              inserted++
            } catch (error: any) {
              console.error(`❌ Failed to insert record into ${tableName}:`, error.message.split('\n')[0])
            }
          }
        }
        
        console.log(`✅ Restored ${inserted}/${tableData.length} records to ${tableName}`)
        
      } catch (error: any) {
        console.error(`❌ Failed to restore table ${tableName}:`, error.message.split('\n')[0])
      }
    }
    
    // Update sequences for tables with auto-incrementing IDs
    console.log('🔄 Updating sequences...')
    try {
      // This will reset sequences to the correct values
      await db.$executeRaw`
        SELECT setval(pg_get_serial_sequence('"' || schemaname || '"."' || tablename || '"', 'id'), 
                     COALESCE(max(id), 1), max(id) IS NOT null) 
        FROM information_schema.tables t
        JOIN pg_namespace n ON n.nspname = t.table_schema
        JOIN pg_class c ON c.relname = t.table_name AND c.relnamespace = n.oid
        JOIN information_schema.columns col ON col.table_name = t.table_name AND col.column_name = 'id'
        WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
        AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = t.table_name AND column_name = 'id')
      `
      console.log('✅ Sequences updated')
    } catch (error: any) {
      console.log('⚠️  Could not update sequences automatically:', error.message.split('\n')[0])
    }
    
    console.log('✅ Database restore completed successfully!')
    
  } catch (error) {
    console.error('❌ Failed to restore database backup:', error)
    throw error
  }
}

async function listBackups(): Promise<string[]> {
  const backupDir = join(process.cwd(), 'backups')
  
  if (!existsSync(backupDir)) {
    console.log('📁 No backup directory found')
    return []
  }
  
  try {
    const fs = await import('fs')
    const files = fs.readdirSync(backupDir)
    const backupFiles = files
      .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
      .sort()
      .reverse() // Most recent first
    
    console.log(`📁 Found ${backupFiles.length} backup files:`)
    backupFiles.forEach((file, index) => {
      const filePath = join(backupDir, file)
      const stats = fs.statSync(filePath)
      const size = (stats.size / 1024 / 1024).toFixed(2)
      console.log(`   ${index + 1}. ${file} (${size}MB) - ${stats.mtime.toISOString()}`)
    })
    
    return backupFiles.map(file => join(backupDir, file))
    
  } catch (error) {
    console.error('❌ Failed to list backups:', error)
    return []
  }
}

async function validateBackup(backupFilePath: string): Promise<boolean> {
  console.log(`🔍 Validating backup: ${backupFilePath}`)
  
  try {
    if (!existsSync(backupFilePath)) {
      console.error('❌ Backup file does not exist')
      return false
    }
    
    const backupJson = readFileSync(backupFilePath, 'utf-8')
    const backupData: BackupData = JSON.parse(backupJson)
    
    // Validate backup structure
    if (!backupData.timestamp || !backupData.tables || !backupData.metadata) {
      console.error('❌ Invalid backup structure')
      return false
    }
    
    // Validate essential tables exist
    const essentialTables = ['authors', 'blog_posts', 'categories']
    for (const table of essentialTables) {
      if (!backupData.tables[table]) {
        console.error(`❌ Missing essential table: ${table}`)
        return false
      }
    }
    
    // Check for data consistency
    const totalRecords = Object.values(backupData.tables).reduce((sum, table) => sum + table.length, 0)
    if (totalRecords !== backupData.metadata.totalRecords) {
      console.error('❌ Record count mismatch in backup metadata')
      return false
    }
    
    console.log('✅ Backup validation passed')
    return true
    
  } catch (error) {
    console.error('❌ Backup validation failed:', error)
    return false
  }
}

// Command line interface
async function main() {
  const command = process.argv[2]
  const argument = process.argv[3]
  
  try {
    switch (command) {
      case 'create':
        await createDatabaseBackup()
        break
        
      case 'restore':
        if (!argument) {
          console.error('❌ Please provide backup file path')
          process.exit(1)
        }
        await restoreDatabaseBackup(argument)
        break
        
      case 'list':
        await listBackups()
        break
        
      case 'validate':
        if (!argument) {
          console.error('❌ Please provide backup file path')
          process.exit(1)
        }
        const isValid = await validateBackup(argument)
        process.exit(isValid ? 0 : 1)
        break
        
      default:
        console.log('📖 Database Backup Utility')
        console.log('')
        console.log('Available commands:')
        console.log('  create                    - Create a new backup')
        console.log('  restore <backup-file>     - Restore from backup')
        console.log('  list                      - List available backups')
        console.log('  validate <backup-file>    - Validate backup file')
        console.log('')
        console.log('Examples:')
        console.log('  npx tsx scripts/database-backup.ts create')
        console.log('  npx tsx scripts/database-backup.ts restore backups/backup-2025-01-01.json')
        console.log('  npx tsx scripts/database-backup.ts list')
        break
    }
    
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  } finally {
    await db.$disconnect()
  }
}

// Export functions for use in other scripts
export {
  createDatabaseBackup,
  restoreDatabaseBackup,
  listBackups,
  validateBackup
}

// Run if called directly (ES modules check)
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}