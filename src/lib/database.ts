import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'feedback.db');
export const db = new Database(dbPath);

// Enable foreign key constraints
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initDatabase() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'sales')),
      name TEXT NOT NULL,
      department TEXT,
      hire_date DATE,
      is_active BOOLEAN DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Surveys table
  db.exec(`
    CREATE TABLE IF NOT EXISTS surveys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      target_role TEXT NOT NULL,
      version INTEGER DEFAULT 1,
      is_active BOOLEAN DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Questions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      survey_id INTEGER NOT NULL,
      section TEXT NOT NULL,
      question_text TEXT NOT NULL,
      question_type TEXT NOT NULL CHECK (question_type IN ('likert', 'multiple_choice', 'text', 'ranking', 'percentage', 'checkbox')),
      question_order INTEGER NOT NULL,
      is_required BOOLEAN DEFAULT 1,
      options TEXT, -- JSON string for multiple choice and ranking questions
      validation_rules TEXT, -- JSON string
      analysis_tags TEXT,
      FOREIGN KEY (survey_id) REFERENCES surveys(id),
      UNIQUE(survey_id, question_order)
    );
  `);

  // Responses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      survey_id INTEGER NOT NULL,
      user_id INTEGER,
      session_id TEXT NOT NULL,
      is_anonymous BOOLEAN DEFAULT 0,
      started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completed_at TIMESTAMP,
      is_complete BOOLEAN DEFAULT 0,
      response_time_seconds INTEGER,
      FOREIGN KEY (survey_id) REFERENCES surveys(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // Answers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      response_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      answer_value TEXT,
      answer_numeric REAL,
      confidence_score INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (response_id) REFERENCES responses(id),
      FOREIGN KEY (question_id) REFERENCES questions(id)
    );
  `);

  // Analytics cache table
  db.exec(`
    CREATE TABLE IF NOT EXISTS analytics_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      metric_name TEXT NOT NULL,
      metric_value TEXT NOT NULL, -- JSON string
      filters TEXT, -- JSON string
      computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP
    );
  `);

  // Action items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS action_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
      category TEXT,
      assigned_to INTEGER,
      status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
      due_date DATE,
      created_from_response_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (assigned_to) REFERENCES users(id),
      FOREIGN KEY (created_from_response_id) REFERENCES responses(id)
    );
  `);

  // Create indexes for performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_responses_survey_date ON responses(survey_id, completed_at);
    CREATE INDEX IF NOT EXISTS idx_answers_response_question ON answers(response_id, question_id);
    CREATE INDEX IF NOT EXISTS idx_users_role_active ON users(role, is_active);
    CREATE INDEX IF NOT EXISTS idx_analytics_metric_date ON analytics_cache(metric_name, computed_at);
    CREATE INDEX IF NOT EXISTS idx_action_items_status_priority ON action_items(status, priority);
  `);

  console.log('Database initialized successfully');
}

// Initialize database on module load
try {
  initDatabase();
  
  // Only seed if database is empty
  const existingSurveys = db.prepare('SELECT COUNT(*) as count FROM surveys').get() as { count: number };
  if (existingSurveys.count === 0) {
    console.log('Database is empty, seeding...');
    seedDatabase();
    
    // Also seed questions
    import('./seed-questions').then(({ seedQuestions }) => {
      seedQuestions();
    }).catch(console.error);
  } else {
    console.log('Database already has data, skipping seeding');
  }
} catch (error) {
  console.error('Failed to initialize database:', error);
}

// Seed data function
export function seedDatabase() {
  // Insert sample users
  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (email, role, name, department, hire_date, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const users = [
    ['admin@company.com', 'admin', 'Admin User', 'IT', '2023-01-15', 1],
    ['manager1@company.com', 'manager', 'Sarah Johnson', 'Admissions', '2022-03-10', 1],
    ['manager2@company.com', 'manager', 'Michael Chen', 'Admissions', '2021-09-15', 1],
    ['sales1@company.com', 'sales', 'Emma Williams', 'Sales', '2023-02-20', 1],
    ['sales2@company.com', 'sales', 'David Rodriguez', 'Sales', '2023-01-08', 1],
    ['sales3@company.com', 'sales', 'Lisa Brown', 'Sales', '2022-11-12', 1],
  ];

  users.forEach(user => insertUser.run(...user));

  // Insert surveys
  const insertSurvey = db.prepare(`
    INSERT OR IGNORE INTO surveys (id, name, description, target_role, version, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertSurvey.run(1, 'Manager Feedback Survey', 'Strategic feedback from managers on platform system effectiveness', 'manager', 1, 1);
  insertSurvey.run(2, 'Admissions Team Feedback Survey', 'Tactical feedback from admissions advisors on daily workflow', 'sales', 1, 1);

  console.log('Database seeded successfully');
}

// Helper functions for database operations
export const dbHelpers = {
  getUser: db.prepare('SELECT * FROM users WHERE id = ?'),
  getUserByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  getSurvey: db.prepare('SELECT * FROM surveys WHERE id = ?'),
  getSurveysByRole: db.prepare('SELECT * FROM surveys WHERE target_role = ? AND is_active = 1'),
  getQuestionsBySurvey: db.prepare('SELECT * FROM questions WHERE survey_id = ? ORDER BY question_order'),
  insertResponse: db.prepare(`
    INSERT INTO responses (survey_id, user_id, session_id, is_anonymous, started_at)
    VALUES (?, ?, ?, ?, ?)
  `),
  updateResponse: db.prepare(`
    UPDATE responses SET completed_at = CURRENT_TIMESTAMP, is_complete = 1, response_time_seconds = ?
    WHERE id = ?
  `),
  insertAnswer: db.prepare(`
    INSERT INTO answers (response_id, question_id, answer_value, answer_numeric, confidence_score)
    VALUES (?, ?, ?, ?, ?)
  `),
  getResponsesBySurvey: db.prepare('SELECT * FROM responses WHERE survey_id = ? AND is_complete = 1'),
  getAnswersByResponse: db.prepare('SELECT * FROM answers WHERE response_id = ?'),
  
  // Analytics functions for dynamic statistics
  getCompletionStats: db.prepare(`
    SELECT
      COUNT(*) as total_responses,
      AVG(response_time_seconds) as avg_response_time,
      COUNT(CASE WHEN target_role = 'manager' THEN 1 END) as manager_responses,
      COUNT(CASE WHEN target_role = 'sales' THEN 1 END) as sales_responses
    FROM responses r
    JOIN surveys s ON r.survey_id = s.id
    WHERE r.is_complete = 1
      AND r.completed_at >= datetime('now', '-30 days')
  `),
  
  getImprovementMetrics: db.prepare(`
    SELECT
      AVG(CASE WHEN a.answer_numeric IS NOT NULL AND q.analysis_tags LIKE '%efficiency%' THEN a.answer_numeric END) as efficiency_score,
      AVG(CASE WHEN a.answer_numeric IS NOT NULL AND q.analysis_tags LIKE '%productivity%' THEN a.answer_numeric END) as productivity_score,
      AVG(CASE WHEN a.answer_numeric IS NOT NULL AND q.analysis_tags LIKE '%satisfaction%' THEN a.answer_numeric END) as satisfaction_score
    FROM answers a
    JOIN questions q ON a.question_id = q.id
    JOIN responses r ON a.response_id = r.id
    WHERE r.is_complete = 1
      AND r.completed_at >= datetime('now', '-30 days')
  `),
  
  getQuestionCount: db.prepare('SELECT COUNT(*) as count FROM questions WHERE survey_id = ?'),
};

// Functions are already exported above