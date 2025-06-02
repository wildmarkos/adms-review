import { seedQuestions } from '../src/lib/seed-questions';

console.log('Reseeding questions with updated analysis tags...');

try {
  seedQuestions();
  console.log('Questions reseeded successfully!');
} catch (error) {
  console.error('Error reseeding questions:', error);
}