/**
 * Data Service
 * Handles data acquisition and processing for analytics
 */

import { databaseAdapter } from '@/lib/database-adapter';
import { 
  SurveyResponse, 
  ValidatedResponses, 
  QuestionGroups,
  SurveyQuestion,
  SurveyAnswer
} from '../types/surveys';

// Define types for raw database responses
interface DatabaseResponse {
  id: number;
  survey_id: number;
  user_id?: number;
  session_id: string;
  is_anonymous: boolean | number;
  started_at: string;
  completed_at?: string;
  response_time_seconds?: number;
  role?: string;
}

interface DatabaseAnswer {
  id: number;
  response_id: number;
  question_id: number;
  answer_value: string | null;
  answer_numeric: number | null;
  confidence_score: number | null;
}

/**
 * Service for fetching and processing survey data
 */
export const dataService = {
  /**
   * Fetch survey response data from the database
   * @returns Array of survey responses
   */
  async fetchSurveyData(): Promise<SurveyResponse[]> {
    try {
      // Get completion stats for basic information
      const stats = await databaseAdapter.getCompletionStats();
      
      // Get all surveys (we'll use id: 1 as a default for Phase 1)
      const surveyId = 1;
      
      // Get responses for the survey
      const responseData = await databaseAdapter.getResponsesBySurvey(surveyId);
      
      // Process responses to our internal format
      const responses: SurveyResponse[] = [];
      
      // Process each response
      for (const response of responseData) {
        // Get answers for this response
        const answerData = await databaseAdapter.getAnswersByResponse(response.id);
        
        // Map answers to our format
        const answers: SurveyAnswer[] = answerData.map((answer: DatabaseAnswer) => ({
          questionId: answer.question_id,
          answerValue: answer.answer_value || '',
          answerNumeric: answer.answer_numeric !== null ? answer.answer_numeric : undefined,
          answerText: typeof answer.answer_value === 'string' ? answer.answer_value : '',
          answerJson: answer.answer_value
        }));
        
        // Add the response with its answers
        responses.push({
          id: String(response.id),
          surveyId: String(response.survey_id),
          userId: response.user_id ? String(response.user_id) : undefined,
          role: response.role,
          completedAt: response.completed_at || response.started_at,
          responseTimeSeconds: response.response_time_seconds,
          answers
        });
      }
      
      return responses;
    } catch (error) {
      console.error('Error fetching survey data:', error);
      return [];
    }
  },
  
  /**
   * Validate and clean survey responses
   * @param responses Raw survey responses
   * @returns Validated responses
   */
  validateResponses(responses: SurveyResponse[]): ValidatedResponses {
    const validationIssues: string[] = [];
    let validCount = 0;
    let invalidCount = 0;
    
    // Filter out invalid responses
    const validatedResponses = responses.filter(response => {
      // Check for basic required fields
      if (!response.id || !response.surveyId || !response.completedAt) {
        validationIssues.push(`Response ${response.id || 'unknown'} missing required fields`);
        invalidCount++;
        return false;
      }
      
      // Check for minimum answers
      if (!response.answers || response.answers.length < 10) {
        validationIssues.push(`Response ${response.id} has insufficient answers (${response.answers?.length || 0})`);
        invalidCount++;
        return false;
      }
      
      validCount++;
      return true;
    });
    
    return {
      responses: validatedResponses,
      validCount,
      invalidCount,
      validationIssues
    };
  },
  
  /**
   * Group responses by question for analysis
   * @param responses Validated survey responses
   * @returns Responses grouped by question
   */
  groupByQuestion(responses: ValidatedResponses): QuestionGroups {
    const groups: QuestionGroups = {};
    
    // Get all questions for metadata
    const questions = this.getQuestionMetadata();
    
    // Create a mapping for faster lookup
    const questionMap: Record<number, SurveyQuestion> = {};
    questions.forEach(question => {
      questionMap[question.id] = question;
    });
    
    // Process all responses and group by question
    responses.responses.forEach(response => {
      response.answers.forEach(answer => {
        const questionId = String(answer.questionId);
        
        // Initialize group if needed
        if (!groups[questionId]) {
          groups[questionId] = {
            question: questionMap[answer.questionId] || {
              id: answer.questionId,
              section: 'Unknown',
              questionText: `Question ${answer.questionId}`,
              questionType: 'text',
              analysisTags: []
            },
            answers: [],
            responseCount: 0
          };
        }
        
        // Add answer to group
        groups[questionId].answers.push(answer);
        groups[questionId].responseCount = groups[questionId].answers.length;
      });
    });
    
    return groups;
  },
  
  /**
   * Get question metadata for analysis
   * @returns Array of survey questions with metadata
   */
  getQuestionMetadata(): SurveyQuestion[] {
    // In a full implementation, this would fetch from the database
    // For Phase 1, we'll return a simplified set of hardcoded questions
    return [
      {
        id: 57,
        section: 'Time Allocation',
        questionText: 'How much time do you spend on strategic planning vs. system problem-solving?',
        questionType: 'percentage',
        analysisTags: ['time', 'management', 'strategic']
      },
      {
        id: 131,
        section: 'System Complexity',
        questionText: 'How often do you need to use workarounds for system limitations?',
        questionType: 'likert',
        analysisTags: ['system', 'workarounds', 'complexity']
      },
      {
        id: 141,
        section: 'System Complexity',
        questionText: 'What are the most critical workarounds you regularly use?',
        questionType: 'text',
        analysisTags: ['system', 'workarounds', 'critical']
      },
      {
        id: 161,
        section: 'Process Bottlenecks',
        questionText: 'What percentage of leads are lost during the application process?',
        questionType: 'percentage',
        analysisTags: ['process', 'leads', 'conversion']
      },
      {
        id: 172,
        section: 'Time Allocation',
        questionText: 'What percentage of your time is spent on administrative tasks?',
        questionType: 'percentage',
        analysisTags: ['time', 'administrative']
      },
      {
        id: 218,
        section: 'System Complexity',
        questionText: 'How many different tools do you use in your daily work?',
        questionType: 'rating',
        analysisTags: ['system', 'tools', 'complexity']
      },
      {
        id: 248,
        section: 'Time Allocation',
        questionText: 'What percentage of your time is spent on sales activities?',
        questionType: 'percentage',
        analysisTags: ['time', 'sales']
      },
      {
        id: 258,
        section: 'System Complexity',
        questionText: 'How many separate logins do you use during a typical day?',
        questionType: 'rating',
        analysisTags: ['system', 'logins', 'complexity']
      },
      {
        id: 270,
        section: 'Process Bottlenecks',
        questionText: 'How confident are you in the accuracy of lead tracking?',
        questionType: 'likert',
        analysisTags: ['process', 'tracking', 'confidence']
      },
      {
        id: 290,
        section: 'System Complexity',
        questionText: 'Rate the prevalence of workarounds in your daily work',
        questionType: 'likert',
        analysisTags: ['system', 'workarounds', 'frequency']
      },
      {
        id: 310,
        section: 'Process Bottlenecks',
        questionText: 'How many minutes does it typically take to access needed information?',
        questionType: 'rating',
        analysisTags: ['process', 'data', 'access']
      },
      {
        id: 322,
        section: 'Team Collaboration',
        questionText: 'How would you rate information sharing quality in your team?',
        questionType: 'likert',
        analysisTags: ['team', 'information', 'sharing']
      },
      {
        id: 332,
        section: 'Team Collaboration',
        questionText: 'How effective are handoffs between team members?',
        questionType: 'likert',
        analysisTags: ['team', 'handoffs', 'effectiveness']
      },
      {
        id: 342,
        section: 'Team Collaboration',
        questionText: 'How significant is the communication gap between roles?',
        questionType: 'likert',
        analysisTags: ['team', 'communication', 'gaps']
      },
      {
        id: 354,
        section: 'Team Collaboration',
        questionText: 'How often do you review the pipeline as a team?',
        questionType: 'rating',
        analysisTags: ['team', 'pipeline', 'reviews']
      },
      {
        id: 364,
        section: 'Process Bottlenecks',
        questionText: 'At which stage do most leads drop out of the process?',
        questionType: 'multiple_choice',
        analysisTags: ['process', 'leads', 'stages'],
        options: [
          'Initial Inquiry',
          'Application Started',
          'Document Collection',
          'Review Process',
          'Decision Stage'
        ]
      }
    ];
  },
  
  /**
   * Extract numeric value from answer value
   * @param value Answer value (could be string, number, or complex object)
   * @returns Numeric value if available, undefined otherwise
   */
  extractNumericValue(value: any): number | undefined {
    if (typeof value === 'number') {
      return value;
    }
    
    if (typeof value === 'string') {
      // Try to parse as number
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        return parsed;
      }
      
      // Check for percentage strings
      if (value.includes('%')) {
        const percentValue = parseFloat(value.replace('%', ''));
        if (!isNaN(percentValue)) {
          return percentValue / 100; // Convert to decimal
        }
      }
    }
    
    return undefined;
  }
};