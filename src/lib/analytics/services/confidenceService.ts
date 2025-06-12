/**
 * Confidence Service
 * Calculates confidence levels for metrics based on response data
 */

import { 
  ValidatedResponses, 
  ConfidenceScore, 
  ConfidenceLevel, 
  ConfidenceFactors 
} from '../types/surveys';

/**
 * Service for calculating confidence in metrics based on responses
 */
export const confidenceService = {
  /**
   * Calculate confidence score for a metric based on responses to specific questions
   * @param responses Validated survey responses
   * @param questionIds Question IDs used for the metric
   * @returns Confidence score object and derived level and factors
   */
  calculateConfidence(responses: ValidatedResponses, questionIds: number[]): {
    score: number;
    level: 'low' | 'medium' | 'high';
    factors: string[];
  } {
    // Calculate detailed confidence score
    const confidenceScore = this.calculateConfidenceScore(responses, questionIds);
    
    // Determine confidence level
    const level = this.getConfidenceLevel(confidenceScore);
    
    // Generate factors affecting confidence
    const confidenceFactors = this.getConfidenceFactors(confidenceScore);
    
    // Convert confidence factors to string array for UI display
    const factors = [
      confidenceFactors.sampleSize,
      confidenceFactors.distribution,
      confidenceFactors.consistency,
      confidenceFactors.timeframe
    ].filter(factor => factor !== ''); // Remove empty factors
    
    return { 
      score: confidenceScore.score,
      level, 
      factors 
    };
  },
  
  /**
   * Calculate detailed confidence score based on responses and question IDs
   * @param responses Validated survey responses
   * @param questionIds Question IDs used for the metric
   * @returns Detailed confidence score
   */
  calculateConfidenceScore(responses: ValidatedResponses, questionIds: number[]): ConfidenceScore {
    // Get response count - in a real implementation, this would filter responses by question ID
    const responseCount = responses.validCount;
    
    // Calculate normalized score (0-1 scale)
    // Simple sigmoid function that approaches 1 as response count increases
    const normalizedScore = 1 - (1 / (1 + Math.exp(responseCount / 10 - 3)));
    
    // Adjust score based on question count (more questions = slightly lower confidence)
    const questionAdjustment = Math.max(0.7, 1 - (questionIds.length - 1) * 0.05);
    
    // For Phase 1, we'll use a simplified distribution quality
    const distributionQuality = 0.8; // Placeholder
    
    return {
      score: normalizedScore * questionAdjustment,
      responseCount,
      questionCount: questionIds.length,
      distributionQuality
    };
  },
  
  /**
   * Convert confidence score to a level
   * @param score Confidence score object
   * @returns Confidence level
   */
  getConfidenceLevel(score: ConfidenceScore): ConfidenceLevel {
    if (score.score >= 0.7) return 'high';
    if (score.score >= 0.4) return 'medium';
    return 'low';
  },
  
  /**
   * Generate factors affecting confidence
   * @param score Confidence score object
   * @returns Structured confidence factors
   */
  getConfidenceFactors(score: ConfidenceScore): ConfidenceFactors {
    // Generate sample size factor
    let sampleSize = '';
    if (score.responseCount < 10) {
      sampleSize = 'Limited sample size';
    } else if (score.responseCount < 30) {
      sampleSize = 'Moderate sample size';
    } else {
      sampleSize = 'Strong sample size';
    }
    
    // Generate distribution factor
    let distribution = '';
    if (score.distributionQuality < 0.5) {
      distribution = 'Uneven response distribution';
    } else if (score.distributionQuality >= 0.8) {
      distribution = 'Well-distributed responses';
    }
    
    // Generate consistency factor
    const consistency = score.questionCount > 1 
      ? 'Based on multiple related questions'
      : 'Based on a single question';
    
    // For Phase 1, we'll use a placeholder timeframe
    const timeframe = 'Data from the past 30 days';
    
    return {
      sampleSize,
      distribution,
      consistency,
      timeframe
    };
  }
};