#!/usr/bin/env node

import { initDatabase, seedDatabase } from '../src/lib/database';
import { seedQuestions } from '../src/lib/seed-questions';

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing Eduscore Feedback System Database...');
    
    // Initialize database schema
    console.log('📋 Creating database schema...');
    initDatabase();
    
    // Seed basic data
    console.log('👥 Seeding user data...');
    seedDatabase();
    
    // Seed survey questions
    console.log('❓ Seeding survey questions...');
    seedQuestions();
    
    console.log('✅ Database initialization completed successfully!');
    console.log('🌐 You can now start the application with: npm run dev');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();