#!/bin/bash

# Database Backup Script
# Usage: ./backup-db.sh [options]
#
# Options:
#   --json-only         Create only JSON backup
#   --sql-only          Create only SQL backup
#   --no-schema         Don't include schema in SQL backup
#   --output=DIR        Specify output directory (default: backups)
#   --tables=t1,t2,t3   Specify tables to backup

# Make script exit on error
set -e

# Set colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Supabase Database Backup${NC}"
echo -e "${BLUE}=========================${NC}"

# Create backups directory if it doesn't exist
mkdir -p backups

# Get current timestamp for backup files
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
echo -e "${BLUE}📅 Timestamp: ${TIMESTAMP}${NC}"

# Pass all arguments to the TypeScript backup script
echo -e "${YELLOW}Starting backup process...${NC}"
npx ts-node scripts/backup-db.ts "$@"

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Backup completed successfully!${NC}"
  echo -e "${GREEN}📁 Backup files are available in the backups directory${NC}"
else
  echo -e "${RED}❌ Backup failed. Check error messages above.${NC}"
  exit 1
fi