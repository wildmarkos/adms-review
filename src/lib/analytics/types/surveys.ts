/**
 * Survey Data Type Definitions
 * Structures for raw survey data and responses
 */

// Survey response with validation status
export interface SurveyResponse {
  id: string;
  surveyId: string;
  userId?: string;
  role?: string;
  completedAt: string;
  responseTimeSeconds?: number;
  answers: SurveyAnswer[];
}

// Validated responses after data cleaning
export interface ValidatedResponses {
  responses: SurveyResponse[];
  validCount: number;
  invalidCount: number;
  validationIssues?: string[];
}

// Individual survey answer
export interface SurveyAnswer {
  questionId: number;
  answerValue: string;
  answerNumeric?: number;
  answerText?: string;
  answerJson?: any;
}

// Question metadata
export interface SurveyQuestion {
  id: number;
  section: string;
  questionText: string;
  questionType: 'likert' | 'multiple_choice' | 'text' | 'percentage' | 'rating';
  analysisTags: string[];
  options?: string[];
}

// Grouped responses by question
export interface QuestionGroups {
  [questionId: string]: {
    question: SurveyQuestion;
    answers: SurveyAnswer[];
    responseCount: number;
  };
}

// Confidence assessment
export interface ConfidenceScore {
  score: number; // 0-1 scale
  responseCount: number;
  questionCount: number;
  distributionQuality: number; // 0-1 scale
}

// Confidence level categorization
export type ConfidenceLevel = 'low' | 'medium' | 'high';

// Confidence factors explanation
export interface ConfidenceFactors {
  sampleSize: string;
  distribution: string;
  consistency: string;
  timeframe: string;
}