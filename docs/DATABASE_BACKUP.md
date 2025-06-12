# Database Backup System

This document describes how to use the database backup system for the ADMS Review application.

## Overview

The backup system exports all data from your Supabase database into multiple formats:
- **JSON format**: Structured data with metadata
- **SQL format**: INSERT statements for restoration
- **Metadata**: Backup information and statistics

## Usage

### Basic Backup (Recommended)

```bash
npm run backup-db
```

This creates both JSON and SQL backups with schema information in the `backups/` directory.

### Command Line Options

You can customize the backup process with these options:

```bash
# JSON format only
npm run backup-db -- --json-only

# SQL format only  
npm run backup-db -- --sql-only

# Skip schema in SQL backup
npm run backup-db -- --no-schema

# Custom output directory
npm run backup-db -- --output=my-backups

# Backup specific tables only
npm run backup-db -- --tables=users,surveys,responses
```

### Programmatic Usage

You can also use the backup system in your code:

```typescript
import { DatabaseBackup } from './scripts/backup-db';

const backup = new DatabaseBackup();

await backup.createBackup({
  format: 'both',
  includeSchema: true,
  outputDir: 'backups',
  tables: ['users', 'surveys', 'questions', 'responses', 'answers']
});
```

## Output Files

Each backup creates three files with timestamps:

1. **`backup-YYYY-MM-DDTHH-MM-SS.json`** - Complete data export in JSON format
2. **`backup-YYYY-MM-DDTHH-MM-SS.sql`** - SQL INSERT statements for restoration
3. **`backup-metadata-YYYY-MM-DDTHH-MM-SS.json`** - Backup information and statistics

## File Structure

### JSON Backup Format
```json
{
  "metadata": {
    "timestamp": "2025-01-11T19-25-00",
    "version": "1.0",
    "format": "json",
    "tables": ["users", "surveys", "questions", "responses", "answers"],
    "totalRecords": 1234
  },
  "data": {
    "users": [...],
    "surveys": [...],
    "questions": [...],
    "responses": [...],
    "answers": [...]
  }
}
```

### SQL Backup Format
```sql
-- Database Backup
-- Generated: 2025-01-11T19:25:00.000Z
-- Format: SQL

-- Schema creation (if --no-schema not used)
CREATE TABLE IF NOT EXISTS users (...);
-- ... other tables

-- Data for table: users
TRUNCATE TABLE users CASCADE;
INSERT INTO users (...) VALUES (...);
-- ... more inserts
```

## Restoration

### From JSON Backup
You can write a custom script to restore from JSON, or use the data for analysis.

### From SQL Backup
1. Create a new Supabase project or database
2. Run the schema creation commands (if included)
3. Execute the INSERT statements

```sql
-- In Supabase SQL Editor or psql
\i backup-2025-01-11T19-25-00.sql
```

## Security Considerations

- **Backup files contain sensitive data** - store them securely
- **Environment variables** - Ensure `.env` is configured properly
- **Access permissions** - Use appropriate Supabase RLS policies
- **Encryption** - Consider encrypting backup files for production

## Troubleshooting

### Connection Issues
```
❌ Database connection failed
```
- Check your `.env` file has correct Supabase credentials
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Ensure Supabase project is running

### Permission Issues
```
❌ Error backing up table: permission denied
```
- Check your Supabase RLS (Row Level Security) policies
- Ensure the anon key has SELECT permissions on tables
- Consider using a service role key for backups

### Large Database Performance
For large databases (>100MB), consider:
- Using `--tables=` to backup specific tables
- Running backups during low-traffic periods
- Using pagination for very large tables

## Automation

### Scheduled Backups
Add to your deployment pipeline or use cron jobs:

```bash
# Daily backup at 2 AM
0 2 * * * cd /path/to/project && npm run backup-db
```

### CI/CD Integration
```yaml
# In your GitHub Actions or similar
- name: Backup Database
  run: npm run backup-db -- --output=backups/$(date +%Y-%m-%d)
```

## Best Practices

1. **Regular Backups**: Schedule daily or weekly backups
2. **Version Control**: Don't commit backup files to git (they're in `.gitignore`)
3. **Multiple Locations**: Store backups in multiple locations
4. **Test Restoration**: Regularly test that backups can be restored
5. **Retention Policy**: Delete old backups according to your needs
6. **Monitoring**: Monitor backup success/failure in production

## Tables Backed Up

The system backs up these tables by default:
- `users` - User accounts and profiles
- `surveys` - Survey definitions and metadata
- `questions` - Survey questions and configuration
- `responses` - Survey response sessions
- `answers` - Individual question answers

## Support

If you encounter issues with the backup system:
1. Check the console output for specific error messages
2. Verify your Supabase connection with `npm run test-db`
3. Review the troubleshooting section above
4. Check Supabase dashboard for any service issues