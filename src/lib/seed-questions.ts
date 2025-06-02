import { db, dbHelpers } from './database';
import { allQuestions } from './questions';

export function seedQuestions() {
  const insertQuestion = db.prepare(`
    INSERT OR REPLACE INTO questions (
      survey_id, section, question_text, question_type, question_order,
      is_required, options, validation_rules, analysis_tags
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  console.log('Seeding questions...');
  
  for (const question of allQuestions) {
    insertQuestion.run(
      question.survey_id,
      question.section,
      question.question_text,
      question.question_type,
      question.question_order,
      question.is_required ? 1 : 0,
      question.options ? JSON.stringify(question.options) : null,
      question.validation_rules ? JSON.stringify(question.validation_rules) : null,
      question.analysis_tags || null
    );
  }

  console.log(`Successfully seeded ${allQuestions.length} questions`);
}

// Export for use in other modules
export default seedQuestions;