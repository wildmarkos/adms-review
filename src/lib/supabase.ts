import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Database tables interface for TypeScript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          email: string;
          role: 'admin' | 'manager' | 'sales';
          name: string;
          department: string | null;
          hire_date: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          email: string;
          role: 'admin' | 'manager' | 'sales';
          name: string;
          department?: string | null;
          hire_date?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          email?: string;
          role?: 'admin' | 'manager' | 'sales';
          name?: string;
          department?: string | null;
          hire_date?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      surveys: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          target_role: string;
          version: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          target_role: string;
          version?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          description?: string | null;
          target_role?: string;
          version?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      questions: {
        Row: {
          id: number;
          survey_id: number;
          section: string;
          question_text: string;
          question_type: 'likert' | 'multiple_choice' | 'text' | 'ranking' | 'percentage' | 'checkbox';
          question_order: number;
          is_required: boolean;
          options: string | null;
          validation_rules: string | null;
          analysis_tags: string | null;
        };
        Insert: {
          id?: number;
          survey_id: number;
          section: string;
          question_text: string;
          question_type: 'likert' | 'multiple_choice' | 'text' | 'ranking' | 'percentage' | 'checkbox';
          question_order: number;
          is_required?: boolean;
          options?: string | null;
          validation_rules?: string | null;
          analysis_tags?: string | null;
        };
        Update: {
          id?: number;
          survey_id?: number;
          section?: string;
          question_text?: string;
          question_type?: 'likert' | 'multiple_choice' | 'text' | 'ranking' | 'percentage' | 'checkbox';
          question_order?: number;
          is_required?: boolean;
          options?: string | null;
          validation_rules?: string | null;
          analysis_tags?: string | null;
        };
      };
      responses: {
        Row: {
          id: number;
          survey_id: number;
          user_id: number | null;
          session_id: string;
          is_anonymous: boolean;
          started_at: string;
          completed_at: string | null;
          is_complete: boolean;
          response_time_seconds: number | null;
        };
        Insert: {
          id?: number;
          survey_id: number;
          user_id?: number | null;
          session_id: string;
          is_anonymous?: boolean;
          started_at?: string;
          completed_at?: string | null;
          is_complete?: boolean;
          response_time_seconds?: number | null;
        };
        Update: {
          id?: number;
          survey_id?: number;
          user_id?: number | null;
          session_id?: string;
          is_anonymous?: boolean;
          started_at?: string;
          completed_at?: string | null;
          is_complete?: boolean;
          response_time_seconds?: number | null;
        };
      };
      answers: {
        Row: {
          id: number;
          response_id: number;
          question_id: number;
          answer_value: string | null;
          answer_numeric: number | null;
          confidence_score: number | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          response_id: number;
          question_id: number;
          answer_value?: string | null;
          answer_numeric?: number | null;
          confidence_score?: number | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          response_id?: number;
          question_id?: number;
          answer_value?: string | null;
          answer_numeric?: number | null;
          confidence_score?: number | null;
          created_at?: string;
        };
      };
    };
  };
}

// Supabase database helpers
export const supabaseHelpers = {
  // User operations
  async getUser(id: number) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Survey operations
  async getSurvey(id: number) {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getSurveysByRole(role: string) {
    const { data, error } = await supabase
      .from('surveys')
      .select('*')
      .eq('target_role', role)
      .eq('is_active', true);
    
    if (error) throw error;
    return data;
  },

  async getQuestionsBySurvey(surveyId: number) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('survey_id', surveyId)
      .order('question_order');
    
    if (error) throw error;
    return data;
  },

  // Response operations
  async insertResponse(surveyId: number, userId: number | null, sessionId: string, isAnonymous: boolean, startedAt: string) {
    const { data, error } = await supabase
      .from('responses')
      .insert({
        survey_id: surveyId,
        user_id: userId,
        session_id: sessionId,
        is_anonymous: isAnonymous,
        started_at: startedAt
      })
      .select();
    
    if (error) throw error;
    return data?.[0];
  },

  async updateResponse(responseId: number, responseTimeSeconds: number) {
    const { data, error } = await supabase
      .from('responses')
      .update({
        completed_at: new Date().toISOString(),
        is_complete: true,
        response_time_seconds: responseTimeSeconds
      })
      .eq('id', responseId)
      .select();
    
    if (error) throw error;
    return data?.[0];
  },

  // Answer operations
  async insertAnswer(responseId: number, questionId: number, answerValue: string | null, answerNumeric: number | null, confidenceScore: number | null) {
    const { data, error } = await supabase
      .from('answers')
      .insert({
        response_id: responseId,
        question_id: questionId,
        answer_value: answerValue,
        answer_numeric: answerNumeric,
        confidence_score: confidenceScore
      })
      .select();
    
    if (error) throw error;
    return data?.[0];
  },

  async getResponsesBySurvey(surveyId: number) {
    const { data, error } = await supabase
      .from('responses')
      .select('*')
      .eq('survey_id', surveyId)
      .eq('is_complete', true);
    
    if (error) throw error;
    return data;
  },

  async getAnswersByResponse(responseId: number) {
    const { data, error } = await supabase
      .from('answers')
      .select('*')
      .eq('response_id', responseId);
    
    if (error) throw error;
    return data;
  }
};

// Initialize Supabase database schema
export async function initSupabaseDatabase() {
  console.log('Initializing Supabase database schema...');
  
  // Note: These SQL commands need to be run in Supabase SQL Editor
  // or they can be created using Supabase migrations
  const sqlCommands = `
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
  options TEXT, -- JSON string for multiple choice and ranking questions
  validation_rules TEXT, -- JSON string
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

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Public read access" ON surveys FOR SELECT USING (true);
CREATE POLICY "Public read access" ON questions FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert access" ON answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read access" ON responses FOR SELECT USING (true);
CREATE POLICY "Public read access" ON answers FOR SELECT USING (true);
  `;

  console.log('SQL commands for Supabase setup:');
  console.log(sqlCommands);
  console.log('\nRun these commands in your Supabase SQL Editor to create the tables.');
  
  return sqlCommands;
}