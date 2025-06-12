/**
 * Data Service Adapter
 * This adapter extends the core database adapter with analytics-specific methods
 */

import { databaseAdapter, DatabaseAdapter } from '@/lib/database-adapter';

// Extended interface for analytics data requirements
export interface AnalyticsDataAdapter extends DatabaseAdapter {
  // Survey response methods
  getSurveyResponses(): Promise<any[]>;
  getQuestions(): Promise<any[]>;
}

// Create adapter that implements missing methods
class AnalyticsDataAdapterImpl implements AnalyticsDataAdapter {
  // Delegate core methods to the original adapter
  getUser = databaseAdapter.getUser.bind(databaseAdapter);
  getUserByEmail = databaseAdapter.getUserByEmail.bind(databaseAdapter);
  getSurvey = databaseAdapter.getSurvey.bind(databaseAdapter);
  getSurveysByRole = databaseAdapter.getSurveysByRole.bind(databaseAdapter);
  getQuestionsBySurvey = databaseAdapter.getQuestionsBySurvey.bind(databaseAdapter);
  insertResponse = databaseAdapter.insertResponse.bind(databaseAdapter);
  updateResponse = databaseAdapter.updateResponse.bind(databaseAdapter);
  insertAnswer = databaseAdapter.insertAnswer.bind(databaseAdapter);
  getResponsesBySurvey = databaseAdapter.getResponsesBySurvey.bind(databaseAdapter);
  getAnswersByResponse = databaseAdapter.getAnswersByResponse.bind(databaseAdapter);
  validateQuestionIds = databaseAdapter.validateQuestionIds.bind(databaseAdapter);
  getCompletionStats = databaseAdapter.getCompletionStats.bind(databaseAdapter);
  getImprovementMetrics = databaseAdapter.getImprovementMetrics.bind(databaseAdapter);
  getQuestionCount = databaseAdapter.getQuestionCount.bind(databaseAdapter);

  // Add new methods for analytics
  async getSurveyResponses(): Promise<any[]> {
    try {
      // This is a mock implementation - in production this would query the database
      // Check if we can use existing methods
      const surveys = await databaseAdapter.getSurveysByRole('all');
      
      let allResponses: any[] = [];
      for (const survey of surveys) {
        const responses = await databaseAdapter.getResponsesBySurvey(survey.id);
        for (const response of responses) {
          // Get answers for each response
          const answers = await databaseAdapter.getAnswersByResponse(response.id);
          // Add answers to response object
          response.answers = answers;
        }
        allResponses = [...allResponses, ...responses];
      }
      
      return allResponses;
    } catch (error) {
      console.error('Error in getSurveyResponses:', error);
      return [];
    }
  }

  async getQuestions(): Promise<any[]> {
    try {
      // This is a mock implementation - in production this would query the database
      // For now, we'll collect questions from all surveys
      const surveys = await databaseAdapter.getSurveysByRole('all');
      
      let allQuestions: any[] = [];
      for (const survey of surveys) {
        const questions = await databaseAdapter.getQuestionsBySurvey(survey.id);
        allQuestions = [...allQuestions, ...questions];
      }
      
      return allQuestions;
    } catch (error) {
      console.error('Error in getQuestions:', error);
      return [];
    }
  }
}

// Export the extended adapter
export const analyticsDataAdapter = new AnalyticsDataAdapterImpl();