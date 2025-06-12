/**
 * Analytics Services
 * Service interfaces for analytics processing
 */

import { 
  SurveyResponse, 
  ValidatedResponses, 
  QuestionGroups, 
  ConfidenceScore, 
  ConfidenceLevel, 
  ConfidenceFactors 
} from '../types/surveys';

import {
  TimeMetrics,
  SystemComplexityMetrics,
  TeamCollaborationMetrics,
  ProcessBottleneckMetrics
} from '../types/metrics';

import {
  TimeInsights,
  SystemInsights,
  CollaborationInsights,
  ProcessInsights,
  AllInsights,
  PrioritizedRecommendations,
  ActionSteps,
  ImpactEstimate,
  Recommendation
} from '../types/insights';

// Core analytics services interface
export interface AnalyticsServices {
  // Data acquisition and processing
  dataService: {
    fetchSurveyData(): Promise<SurveyResponse[]>;
    validateResponses(responses: SurveyResponse[]): ValidatedResponses;
    groupByQuestion(responses: ValidatedResponses): QuestionGroups;
  };
  
  // Metric calculation
  metricService: {
    calculateTimeMetrics(responses: ValidatedResponses): TimeMetrics;
    calculateCollaborationMetrics(responses: ValidatedResponses): TeamCollaborationMetrics;
    calculateSystemMetrics(responses: ValidatedResponses): SystemComplexityMetrics;
    calculateProcessMetrics(responses: ValidatedResponses): ProcessBottleneckMetrics;
  };
  
  // Insight generation
  insightService: {
    generateTimeInsights(metrics: TimeMetrics): TimeInsights;
    generateCollaborationInsights(metrics: TeamCollaborationMetrics): CollaborationInsights;
    generateSystemInsights(metrics: SystemComplexityMetrics): SystemInsights;
    generateProcessInsights(metrics: ProcessBottleneckMetrics): ProcessInsights;
  };
  
  // Recommendation engine
  recommendationService: {
    prioritizeRecommendations(insights: AllInsights): PrioritizedRecommendations;
    generateActionSteps(recommendation: Recommendation): ActionSteps;
    estimateImpact(recommendation: Recommendation): ImpactEstimate;
  };
  
  // Confidence assessment
  confidenceService: {
    calculateConfidence(responses: ValidatedResponses, questionIds: number[]): ConfidenceScore;
    getConfidenceLevel(score: ConfidenceScore): ConfidenceLevel;
    getConfidenceFactors(score: ConfidenceScore): ConfidenceFactors;
  };
}