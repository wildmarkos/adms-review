import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface BackupOptions {
  format: 'json' | 'sql' | 'both';
  includeSchema: boolean;
  outputDir: string;
  tables?: string[];
}

class DatabaseBackup {
  private supabase;
  private timestamp: string;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration. Please check your environment variables.');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  }

  async createBackup(options: BackupOptions = {
    format: 'both',
    includeSchema: true,
    outputDir: 'backups'
  }) {
    console.log('🔄 Starting database backup...');
    console.log(`📅 Timestamp: ${this.timestamp}`);

    // Create backup directory
    if (!existsSync(options.outputDir)) {
      mkdirSync(options.outputDir, { recursive: true });
    }

    const tables = options.tables || ['users', 'surveys', 'questions', 'responses', 'answers'];
    const backupData: Record<string, any[]> = {};

    try {
      // Export data from each table
      for (const table of tables) {
        console.log(`📊 Backing up table: ${table}`);
        const { data, error } = await this.supabase
          .from(table as any)
          .select('*');

        if (error) {
          console.error(`❌ Error backing up table ${table}:`, error);
          continue;
        }

        backupData[table] = data || [];
        console.log(`✅ Backed up ${data?.length || 0} records from ${table}`);
      }

      // Generate backup files
      if (options.format === 'json' || options.format === 'both') {
        await this.saveJsonBackup(backupData, options.outputDir);
      }

      if (options.format === 'sql' || options.format === 'both') {
        await this.saveSqlBackup(backupData, options.outputDir, options.includeSchema);
      }

      // Create backup metadata
      await this.saveBackupMetadata(backupData, options.outputDir);

      console.log('✅ Database backup completed successfully!');
      console.log(`📁 Backup files saved in: ${options.outputDir}`);

    } catch (error) {
      console.error('❌ Backup failed:', error);
      throw error;
    }
  }

  private async saveJsonBackup(data: Record<string, any[]>, outputDir: string) {
    const filename = `backup-${this.timestamp}.json`;
    const filepath = join(outputDir, filename);

    const backupObject = {
      metadata: {
        timestamp: this.timestamp,
        version: '1.0',
        format: 'json',
        tables: Object.keys(data),
        totalRecords: Object.values(data).reduce((sum, records) => sum + records.length, 0)
      },
      data
    };

    writeFileSync(filepath, JSON.stringify(backupObject, null, 2));
    console.log(`💾 JSON backup saved: ${filename}`);
  }

  private async saveSqlBackup(data: Record<string, any[]>, outputDir: string, includeSchema: boolean) {
    const filename = `backup-${this.timestamp}.sql`;
    const filepath = join(outputDir, filename);

    let sqlContent = `-- Database Backup\n-- Generated: ${new Date().toISOString()}\n-- Format: SQL\n\n`;

    if (includeSchema) {
      sqlContent += this.generateSchemaSQL();
    }

    // Generate INSERT statements for each table
    for (const [tableName, records] of Object.entries(data)) {
      if (records.length === 0) continue;

      sqlContent += `\n-- Data for table: ${tableName}\n`;
      sqlContent += `TRUNCATE TABLE ${tableName} CASCADE;\n`;

      for (const record of records) {
        const columns = Object.keys(record);
        const values = columns.map(col => {
          const value = record[col];
          if (value === null) return 'NULL';
          if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
          if (typeof value === 'boolean') return value ? 'true' : 'false';
          if (value instanceof Date) return `'${value.toISOString()}'`;
          return value;
        });

        sqlContent += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`;
      }
    }

    writeFileSync(filepath, sqlContent);
    console.log(`💾 SQL backup saved: ${filename}`);
  }

  private generateSchemaSQL(): string {
    return `
-- Schema creation (run these in Supabase SQL Editor if restoring to new instance)

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'sales')),
  name TEXT NOT NULL,
  department TEXT,
  hire_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Surveys table
CREATE TABLE IF NOT EXISTS surveys (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  target_role TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id BIGSERIAL PRIMARY KEY,
  survey_id BIGINT NOT NULL REFERENCES surveys(id),
  section TEXT NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('likert', 'multiple_choice', 'text', 'ranking', 'percentage', 'checkbox')),
  question_order INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT true,
  options TEXT,
  validation_rules TEXT,
  analysis_tags TEXT,
  UNIQUE(survey_id, question_order)
);

-- Responses table
CREATE TABLE IF NOT EXISTS responses (
  id BIGSERIAL PRIMARY KEY,
  survey_id BIGINT NOT NULL REFERENCES surveys(id),
  user_id BIGINT REFERENCES users(id),
  session_id TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  is_complete BOOLEAN DEFAULT false,
  response_time_seconds INTEGER
);

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
  id BIGSERIAL PRIMARY KEY,
  response_id BIGINT NOT NULL REFERENCES responses(id),
  question_id BIGINT NOT NULL REFERENCES questions(id),
  answer_value TEXT,
  answer_numeric REAL,
  confidence_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_responses_survey_date ON responses(survey_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_answers_response_question ON answers(response_id, question_id);
CREATE INDEX IF NOT EXISTS idx_users_role_active ON users(role, is_active);

`;
  }

  private async saveBackupMetadata(data: Record<string, any[]>, outputDir: string) {
    const filename = `backup-metadata-${this.timestamp}.json`;
    const filepath = join(outputDir, filename);

    const metadata = {
      timestamp: this.timestamp,
      date: new Date().toISOString(),
      tables: Object.keys(data).map(table => ({
        name: table,
        recordCount: data[table].length
      })),
      totalRecords: Object.values(data).reduce((sum, records) => sum + records.length, 0),
      backupSize: 'calculated_after_save',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      version: '1.0'
    };

    writeFileSync(filepath, JSON.stringify(metadata, null, 2));
    console.log(`📋 Metadata saved: ${filename}`);
  }

  async testConnection() {
    try {
      const { data, error } = await this.supabase
        .from('surveys')
        .select('*')
        .limit(1);

      if (error) {
        throw error;
      }

      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const format = args.includes('--json-only') ? 'json' : 
                args.includes('--sql-only') ? 'sql' : 'both';
  const includeSchema = !args.includes('--no-schema');
  const outputDir = args.find(arg => arg.startsWith('--output='))?.split('=')[1] || 'backups';
  const tables = args.find(arg => arg.startsWith('--tables='))?.split('=')[1]?.split(',');

  const backup = new DatabaseBackup();

  // Test connection first
  const connected = await backup.testConnection();
  if (!connected) {
    process.exit(1);
  }

  try {
    await backup.createBackup({
      format: format as 'json' | 'sql' | 'both',
      includeSchema,
      outputDir,
      tables
    });

    console.log('\n🎉 Backup completed successfully!');
    console.log('\nBackup files created:');
    console.log(`📁 Directory: ${outputDir}/`);
    console.log(`📄 Files: backup-${backup['timestamp']}.json, backup-${backup['timestamp']}.sql, backup-metadata-${backup['timestamp']}.json`);

  } catch (error) {
    console.error('\n❌ Backup failed:', error);
    process.exit(1);
  }
}

// Export for programmatic use - fixed TypeScript export
export { DatabaseBackup };
export type { BackupOptions };

// Run if called directly
main().catch(console.error);