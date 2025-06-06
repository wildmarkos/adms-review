/**
 * Database Adapter - Unified interface for SQLite and Supabase
 * Switch between databases using DATABASE_TYPE environment variable
 */

import { supabaseHelpers, initSupabaseDatabase } from './supabase';

// Import SQLite database components
let sqliteDb: any = null;
let sqliteHelpers: any = null;

// Dynamically import SQLite only when needed
async function loadSQLite() {
  if (!sqliteDb) {
    const dbModule = await import('./database');
    sqliteDb = dbModule.db;
    sqliteHelpers = dbModule.dbHelpers;
  }
  return { db: sqliteDb, helpers: sqliteHelpers };
}

// Database type configuration
const DATABASE_TYPE = process.env.DATABASE_TYPE || 'sqlite'; // 'sqlite' or 'supabase'

export const isUsingSupabase = DATABASE_TYPE === 'supabase';

// Unified interface for database operations
export interface DatabaseAdapter {
  // User operations
  getUser(id: number): Promise<any>;
  getUserByEmail(email: string): Promise<any>;
  
  // Survey operations
  getSurvey(id: number): Promise<any>;
  getSurveysByRole(role: string): Promise<any[]>;
  getQuestionsBySurvey(surveyId: number): Promise<any[]>;
  
  // Response operations
  insertResponse(surveyId: number, userId: number | null, sessionId: string, isAnonymous: boolean, startedAt: string): Promise<any>;
  updateResponse(responseId: number, responseTimeSeconds: number): Promise<any>;
  
  // Answer operations
  insertAnswer(responseId: number, questionId: number, answerValue: string | null, answerNumeric: number | null, confidenceScore: number | null): Promise<any>;
  getResponsesBySurvey(surveyId: number): Promise<any[]>;
  getAnswersByResponse(responseId: number): Promise<any[]>;
  
  // Validation
  validateQuestionIds(questionIds: number[], surveyId: number): Promise<{ valid: boolean; missingIds?: number[] }>;
  
  // Analytics
  getCompletionStats(): Promise<any>;
  getImprovementMetrics(): Promise<any>;
  getQuestionCount(surveyId: number): Promise<number>;
}

// SQLite adapter implementation
class SQLiteAdapter implements DatabaseAdapter {
  private db: any = null;
  private helpers: any = null;

  private async ensureLoaded() {
    if (!this.db) {
      const { db, helpers } = await loadSQLite();
      this.db = db;
      this.helpers = helpers;
    }
  }

  async getUser(id: number): Promise<any> {
    await this.ensureLoaded();
    return this.helpers.getUser.get(id);
  }

  async getUserByEmail(email: string): Promise<any> {
    await this.ensureLoaded();
    return this.helpers.getUserByEmail.get(email);
  }

  async getSurvey(id: number): Promise<any> {
    await this.ensureLoaded();
    return this.helpers.getSurvey.get(id);
  }

  async getSurveysByRole(role: string): Promise<any[]> {
    await this.ensureLoaded();
    return this.helpers.getSurveysByRole.all(role);
  }

  async getQuestionsBySurvey(surveyId: number): Promise<any[]> {
    await this.ensureLoaded();
    return this.helpers.getQuestionsBySurvey.all(surveyId);
  }

  async insertResponse(surveyId: number, userId: number | null, sessionId: string, isAnonymous: boolean, startedAt: string): Promise<any> {
    await this.ensureLoaded();
    const result = this.helpers.insertResponse.run(surveyId, userId, sessionId, isAnonymous ? 1 : 0, startedAt);
    return { id: result.lastInsertRowid };
  }

  async updateResponse(responseId: number, responseTimeSeconds: number): Promise<any> {
    await this.ensureLoaded();
    return this.helpers.updateResponse.run(responseTimeSeconds, responseId);
  }

  async insertAnswer(responseId: number, questionId: number, answerValue: string | null, answerNumeric: number | null, confidenceScore: number | null): Promise<any> {
    await this.ensureLoaded();
    return this.helpers.insertAnswer.run(responseId, questionId, answerValue, answerNumeric, confidenceScore);
  }

  async getResponsesBySurvey(surveyId: number): Promise<any[]> {
    await this.ensureLoaded();
    return this.helpers.getResponsesBySurvey.all(surveyId);
  }

  async getAnswersByResponse(responseId: number): Promise<any[]> {
    await this.ensureLoaded();
    return this.helpers.getAnswersByResponse.all(responseId);
  }

  async validateQuestionIds(questionIds: number[], surveyId: number): Promise<{ valid: boolean; missingIds?: number[] }> {
    await this.ensureLoaded();
    const placeholders = questionIds.map(() => '?').join(',');
    const existingQuestions = this.db.prepare(`
      SELECT id FROM questions WHERE id IN (${placeholders}) AND survey_id = ?
    `).all(...questionIds, surveyId);

    const existingIds = existingQuestions.map((q: any) => q.id);
    const missingIds = questionIds.filter(id => !existingIds.includes(id));

    return {
      valid: missingIds.length === 0,
      missingIds: missingIds.length > 0 ? missingIds : undefined
    };
  }

  async getCompletionStats(): Promise<any> {
    await this.ensureLoaded();
    return this.helpers.getCompletionStats.get();
  }

  async getImprovementMetrics(): Promise<any> {
    await this.ensureLoaded();
    return this.helpers.getImprovementMetrics.get();
  }

  async getQuestionCount(surveyId: number): Promise<number> {
    await this.ensureLoaded();
    const result = this.helpers.getQuestionCount.get(surveyId);
    return result.count;
  }
}

// Supabase adapter implementation
class SupabaseAdapter implements DatabaseAdapter {
  async getUser(id: number): Promise<any> {
    return await supabaseHelpers.getUser(id);
  }

  async getUserByEmail(email: string): Promise<any> {
    return await supabaseHelpers.getUserByEmail(email);
  }

  async getSurvey(id: number): Promise<any> {
    return await supabaseHelpers.getSurvey(id);
  }

  async getSurveysByRole(role: string): Promise<any[]> {
    return await supabaseHelpers.getSurveysByRole(role);
  }

  async getQuestionsBySurvey(surveyId: number): Promise<any[]> {
    return await supabaseHelpers.getQuestionsBySurvey(surveyId);
  }

  async insertResponse(surveyId: number, userId: number | null, sessionId: string, isAnonymous: boolean, startedAt: string): Promise<any> {
    return await supabaseHelpers.insertResponse(surveyId, userId, sessionId, isAnonymous, startedAt);
  }

  async updateResponse(responseId: number, responseTimeSeconds: number): Promise<any> {
    return await supabaseHelpers.updateResponse(responseId, responseTimeSeconds);
  }

  async insertAnswer(responseId: number, questionId: number, answerValue: string | null, answerNumeric: number | null, confidenceScore: number | null): Promise<any> {
    return await supabaseHelpers.insertAnswer(responseId, questionId, answerValue, answerNumeric, confidenceScore);
  }

  async getResponsesBySurvey(surveyId: number): Promise<any[]> {
    return await supabaseHelpers.getResponsesBySurvey(surveyId);
  }

  async getAnswersByResponse(responseId: number): Promise<any[]> {
    return await supabaseHelpers.getAnswersByResponse(responseId);
  }

  async validateQuestionIds(questionIds: number[], surveyId: number): Promise<{ valid: boolean; missingIds?: number[] }> {
    const { supabase } = await import('./supabase');
    
    const { data: existingQuestions, error } = await supabase
      .from('questions')
      .select('id')
      .in('id', questionIds)
      .eq('survey_id', surveyId);

    if (error) throw error;

    const existingIds = existingQuestions?.map(q => q.id) || [];
    const missingIds = questionIds.filter(id => !existingIds.includes(id));

    return {
      valid: missingIds.length === 0,
      missingIds: missingIds.length > 0 ? missingIds : undefined
    };
  }

  async getCompletionStats(): Promise<any> {
    const { supabase } = await import('./supabase');
    
    // Get completion stats from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data, error } = await supabase
      .from('responses')
      .select(`
        *,
        surveys(target_role)
      `)
      .eq('is_complete', true)
      .gte('completed_at', thirtyDaysAgo.toISOString());

    if (error) throw error;

    const totalResponses = data?.length || 0;
    const avgResponseTime = data?.reduce((sum, r) => sum + (r.response_time_seconds || 0), 0) / totalResponses || 0;
    const managerResponses = data?.filter(r => r.surveys?.target_role === 'manager').length || 0;
    const salesResponses = data?.filter(r => r.surveys?.target_role === 'sales').length || 0;

    return {
      total_responses: totalResponses,
      avg_response_time: avgResponseTime,
      manager_responses: managerResponses,
      sales_responses: salesResponses
    };
  }

  async getImprovementMetrics(): Promise<any> {
    const { supabase } = await import('./supabase');
    
    // Get improvement metrics from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data, error } = await supabase
      .from('answers')
      .select(`
        answer_numeric,
        questions!inner(analysis_tags),
        responses!inner(completed_at)
      `)
      .not('answer_numeric', 'is', null)
      .gte('responses.completed_at', thirtyDaysAgo.toISOString());

    if (error) throw error;

    const metrics = {
      efficiency_score: 0,
      productivity_score: 0,
      satisfaction_score: 0
    };

    if (data && data.length > 0) {
      // Cast to any to handle Supabase query result types
      const typedData = data as any[];
      
      const efficiency = typedData.filter((a: any) => {
        const tags = a.questions?.analysis_tags;
        return tags && typeof tags === 'string' && tags.includes('efficiency');
      });
      
      const productivity = typedData.filter((a: any) => {
        const tags = a.questions?.analysis_tags;
        return tags && typeof tags === 'string' && tags.includes('productivity');
      });
      
      const satisfaction = typedData.filter((a: any) => {
        const tags = a.questions?.analysis_tags;
        return tags && typeof tags === 'string' && tags.includes('satisfaction');
      });

      metrics.efficiency_score = efficiency.length > 0
        ? efficiency.reduce((sum: number, a: any) => sum + (a.answer_numeric || 0), 0) / efficiency.length
        : 0;
      metrics.productivity_score = productivity.length > 0
        ? productivity.reduce((sum: number, a: any) => sum + (a.answer_numeric || 0), 0) / productivity.length
        : 0;
      metrics.satisfaction_score = satisfaction.length > 0
        ? satisfaction.reduce((sum: number, a: any) => sum + (a.answer_numeric || 0), 0) / satisfaction.length
        : 0;
    }

    return metrics;
  }

  async getQuestionCount(surveyId: number): Promise<number> {
    const { supabase } = await import('./supabase');
    
    const { count, error } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('survey_id', surveyId);

    if (error) throw error;
    return count || 0;
  }
}

// Create and export the appropriate database adapter
export const databaseAdapter: DatabaseAdapter = isUsingSupabase 
  ? new SupabaseAdapter() 
  : new SQLiteAdapter();

// Initialize database based on type
export async function initDatabase() {
  if (isUsingSupabase) {
    console.log('Using Supabase database');
    return await initSupabaseDatabase();
  } else {
    console.log('Using SQLite database');
    const { initDatabase: initSQLite } = await import('./database');
    return initSQLite();
  }
}

// Export for logging/debugging
export function getDatabaseType(): string {
  return DATABASE_TYPE;
}