import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SurveyAnswer {
  questionId: number;
  value: string;
  numericValue?: number;
  confidenceScore?: number;
}

export interface SurveyState {
  // Current survey info
  currentSurveyId: number | null;
  currentSection: string | null;
  currentQuestionIndex: number;
  sessionId: string | null;
  userRole: 'manager' | 'sales' | null;
  userId: number | null;
  isAnonymous: boolean;
  
  // Survey progress
  totalQuestions: number;
  completedQuestions: number;
  answers: Record<number, SurveyAnswer>;
  startTime: Date | null;
  
  // Validation
  errors: Record<number, string>;
  isValid: boolean;
  
  // Actions
  setUserRole: (role: 'manager' | 'sales') => void;
  setUserId: (userId: number | null) => void;
  setAnonymous: (anonymous: boolean) => void;
  startSurvey: (surveyId: number, totalQuestions: number) => void;
  setCurrentQuestion: (index: number, section: string) => void;
  setAnswer: (questionId: number, value: string, numericValue?: number, confidenceScore?: number) => void;
  setError: (questionId: number, error: string) => void;
  clearError: (questionId: number) => void;
  validateAnswers: () => boolean;
  resetSurvey: () => void;
  getProgress: () => number;
}

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSurveyId: null,
      currentSection: null,
      currentQuestionIndex: 0,
      sessionId: null,
      userRole: null,
      userId: null,
      isAnonymous: true,
      totalQuestions: 0,
      completedQuestions: 0,
      answers: {},
      startTime: null,
      errors: {},
      isValid: true,

      // Actions
      setUserRole: (role) => set({ userRole: role }),
      
      setUserId: (userId) => set({ userId }),
      
      setAnonymous: (anonymous) => set({ isAnonymous: anonymous }),
      
      startSurvey: (surveyId, totalQuestions) => {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        set({
          currentSurveyId: surveyId,
          sessionId,
          totalQuestions,
          currentQuestionIndex: 0,
          completedQuestions: 0,
          answers: {},
          startTime: new Date(),
          errors: {},
          isValid: true,
        });
      },
      
      setCurrentQuestion: (index, section) => set({
        currentQuestionIndex: index,
        currentSection: section,
      }),
      
      setAnswer: (questionId, value, numericValue, confidenceScore) => {
        const state = get();
        const newAnswers = {
          ...state.answers,
          [questionId]: {
            questionId,
            value,
            numericValue,
            confidenceScore,
          },
        };
        
        // Clear any existing error for this question
        const newErrors = { ...state.errors };
        delete newErrors[questionId];
        
        set({
          answers: newAnswers,
          errors: newErrors,
          completedQuestions: Object.keys(newAnswers).length,
        });
      },
      
      setError: (questionId, error) => {
        const state = get();
        set({
          errors: { ...state.errors, [questionId]: error },
          isValid: false,
        });
      },
      
      clearError: (questionId) => {
        const state = get();
        const newErrors = { ...state.errors };
        delete newErrors[questionId];
        set({
          errors: newErrors,
          isValid: Object.keys(newErrors).length === 0,
        });
      },
      
      validateAnswers: () => {
        const state = get();
        // Basic validation - can be enhanced based on question requirements
        const hasRequiredAnswers = state.completedQuestions > 0;
        const hasNoErrors = Object.keys(state.errors).length === 0;
        const isValid = hasRequiredAnswers && hasNoErrors;
        
        set({ isValid });
        return isValid;
      },
      
      resetSurvey: () => set({
        currentSurveyId: null,
        currentSection: null,
        currentQuestionIndex: 0,
        sessionId: null,
        totalQuestions: 0,
        completedQuestions: 0,
        answers: {},
        startTime: null,
        errors: {},
        isValid: true,
      }),
      
      getProgress: () => {
        const state = get();
        if (state.totalQuestions === 0) return 0;
        // Progress should be based on current question position, not just answered questions
        const positionProgress = ((state.currentQuestionIndex + 1) / state.totalQuestions) * 100;
        return Math.min(positionProgress, 100);
      },
    }),
    {
      name: 'survey-storage',
      // Only persist essential data, not temporary state
      partialize: (state) => ({
        userId: state.userId,
        isAnonymous: state.isAnonymous,
        currentSurveyId: state.currentSurveyId,
        currentQuestionIndex: state.currentQuestionIndex,
        currentSection: state.currentSection,
        sessionId: state.sessionId,
        answers: state.answers,
        startTime: state.startTime,
        totalQuestions: state.totalQuestions,
      }),
    }
  )
);

// Analytics store for dashboard data
export interface AnalyticsState {
  surveyResponses: any[];
  analyticsData: any;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadResponses: () => Promise<void>;
  loadAnalytics: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAnalyticsStore = create<AnalyticsState>()((set, get) => ({
  surveyResponses: [],
  analyticsData: {},
  isLoading: false,
  error: null,
  
  loadResponses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/analytics');
      if (!response.ok) throw new Error('Failed to load analytics data');
      const data = await response.json();
      set({ surveyResponses: data.responseTrends || [], isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },
  
  loadAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/analytics');
      if (!response.ok) throw new Error('Failed to load analytics data');
      const data = await response.json();
      set({ analyticsData: data, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Unknown error', isLoading: false });
    }
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));