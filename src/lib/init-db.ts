import { initDatabase, seedDatabase } from './database';
import { seedQuestions } from './seed-questions';

export function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Initialize database schema and seed basic data
    initDatabase();
    seedDatabase();
    
    // Seed survey questions
    seedQuestions();
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
}

// Auto-initialize when this module is imported in a Node.js environment
if (typeof window === 'undefined') {
  initializeDatabase();
}