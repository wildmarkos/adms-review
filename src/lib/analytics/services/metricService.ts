/**
 * Metric Service
 * Handles calculation of metrics from survey data
 */

import { 
  ValidatedResponses
} from '../types/surveys';

import {
  MetricWithSource,
  TimeMetrics,
  SystemComplexityMetrics,
  TeamCollaborationMetrics,
  ProcessBottleneckMetrics
} from '../types/metrics';

import { confidenceService } from './confidenceService';

/**
 * Calculate time-related metrics from survey responses
 */
export const metricService = {
  /**
   * Calculate time allocation metrics from survey responses
   * @param responses Validated survey responses
   * @returns Time metrics
   */
  calculateTimeMetrics(responses: ValidatedResponses): TimeMetrics {
    // Use validCount for response count
    const responseCount = responses?.validCount || 0;
    
    // Calculate admin time
    const adminTime: MetricWithSource<number> = {
      value: 45, // Phase 1 default value - will be calculated from responses in Phase 2
      sourceQuestions: [172, 248],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [172, 248]),
      trend: {
        direction: 'stable',
        change: 0,
        period: '30 days'
      }
    };
    
    // Calculate sales time
    const salesTime: MetricWithSource<number> = {
      value: 35, // Phase 1 default value
      sourceQuestions: [172, 248],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [172, 248]),
      trend: {
        direction: 'stable',
        change: 0,
        period: '30 days'
      }
    };
    
    // Calculate strategic time
    const strategicTime: MetricWithSource<number> = {
      value: 20, // Phase 1 default value
      sourceQuestions: [57],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [57]),
      trend: {
        direction: 'stable',
        change: 0,
        period: '30 days'
      }
    };
    
    // Calculate system problem time
    const systemProblemTime: MetricWithSource<number> = {
      value: 25, // Phase 1 default value
      sourceQuestions: [57, 131],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [57, 131]),
      trend: {
        direction: 'declining',
        change: 5,
        period: '30 days'
      }
    };
    
    // Calculate time efficiency score
    const timeEfficiencyScore: MetricWithSource<number> = {
      value: this.calculateTimeEfficiencyScore(adminTime.value, salesTime.value, strategicTime.value),
      sourceQuestions: [172, 248, 57],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [172, 248, 57])
    };
    
    return {
      adminTime,
      salesTime,
      strategicTime,
      systemProblemTime,
      timeEfficiencyScore
    };
  },
  
  /**
   * Calculate system complexity metrics from survey responses
   * @param responses Validated survey responses
   * @returns System complexity metrics
   */
  calculateSystemMetrics(responses: ValidatedResponses): SystemComplexityMetrics {
    const responseCount = responses?.validCount || 0;
    
    // Calculate tool count
    const toolCount: MetricWithSource<number> = {
      value: 6.2, // Phase 1 default value
      sourceQuestions: [218],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [218])
    };
    
    // Calculate login fragmentation
    const loginFragmentation: MetricWithSource<number> = {
      value: 3.5, // Phase 1 default value
      sourceQuestions: [258],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [258])
    };
    
    // Calculate workaround prevalence
    const workaroundPrevalence: MetricWithSource<number> = {
      value: 4.2, // Phase 1 default value
      sourceQuestions: [131, 290],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [131, 290])
    };
    
    // Critical workarounds
    const criticalWorkarounds: MetricWithSource<string[]> = {
      value: [
        'Manual data entry for lead scoring',
        'Spreadsheet for tracking document collection',
        'Email searches for applicant history'
      ], // Phase 1 default value
      sourceQuestions: [141],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [141])
    };
    
    // Overall complexity score
    const overallComplexityScore: MetricWithSource<number> = {
      value: 6.5, // Phase 1 default value
      sourceQuestions: [218, 258, 131, 290],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [218, 258, 131, 290])
    };
    
    return {
      toolCount,
      loginFragmentation,
      workaroundPrevalence,
      criticalWorkarounds,
      overallComplexityScore
    };
  },
  
  /**
   * Calculate team collaboration metrics from survey responses
   * @param responses Validated survey responses
   * @returns Team collaboration metrics
   */
  calculateCollaborationMetrics(responses: ValidatedResponses): TeamCollaborationMetrics {
    const responseCount = responses?.validCount || 0;
    
    // Calculate information sharing quality
    const informationSharingQuality: MetricWithSource<number> = {
      value: 7.2, // Phase 1 default value
      sourceQuestions: [322],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [322])
    };
    
    // Calculate handoff effectiveness
    const handoffEffectiveness: MetricWithSource<number> = {
      value: 5.8, // Phase 1 default value
      sourceQuestions: [332],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [332])
    };
    
    // Calculate communication gap
    const communicationGap: MetricWithSource<number> = {
      value: 3.5, // Phase 1 default value
      sourceQuestions: [342, 354],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [342, 354])
    };
    
    // Calculate pipeline review frequency
    const pipelineReviewFrequency: MetricWithSource<number> = {
      value: 2.5, // Phase 1 default value, times per month
      sourceQuestions: [354],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [354])
    };
    
    // Calculate overall collaboration score
    const overallCollaborationScore: MetricWithSource<number> = {
      value: 6.8, // Phase 1 default value
      sourceQuestions: [322, 332, 342, 354],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [322, 332, 342, 354])
    };
    
    return {
      informationSharingQuality,
      handoffEffectiveness,
      communicationGap,
      pipelineReviewFrequency,
      overallCollaborationScore
    };
  },
  
  /**
   * Calculate process bottleneck metrics from survey responses
   * @param responses Validated survey responses
   * @returns Process bottleneck metrics
   */
  calculateProcessMetrics(responses: ValidatedResponses): ProcessBottleneckMetrics {
    const responseCount = responses?.validCount || 0;
    
    // Calculate lead loss frequency
    const leadLossFrequency: MetricWithSource<number> = {
      value: 25, // Phase 1 default value (percentage)
      sourceQuestions: [161],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [161])
    };
    
    // Calculate primary loss stage
    const primaryLossStage: MetricWithSource<string> = {
      value: 'Document Collection', // Phase 1 default value
      sourceQuestions: [364],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [364])
    };
    
    // Calculate lead tracking confidence
    const leadTrackingConfidence: MetricWithSource<number> = {
      value: 5.5, // Phase 1 default value
      sourceQuestions: [270],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [270])
    };
    
    // Calculate data access time
    const dataAccessTime: MetricWithSource<number> = {
      value: 8.5, // Phase 1 default value (minutes)
      sourceQuestions: [310],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [310])
    };
    
    // Calculate overall bottleneck score
    const overallBottleneckScore: MetricWithSource<number> = {
      value: 7.2, // Phase 1 default value
      sourceQuestions: [161, 364, 270, 310],
      responseCount,
      confidence: confidenceService.calculateConfidence(responses, [161, 364, 270, 310])
    };
    
    return {
      leadLossFrequency,
      primaryLossStage,
      leadTrackingConfidence,
      dataAccessTime,
      overallBottleneckScore
    };
  },
  
  /**
   * Calculate time efficiency score from time allocation metrics
   * @param adminTime Administrative time percentage
   * @param salesTime Sales time percentage
   * @param strategicTime Strategic time percentage
   * @returns Time efficiency score (0-10 scale)
   */
  calculateTimeEfficiencyScore(
    adminTime: number,
    salesTime: number,
    strategicTime: number
  ): number {
    // Calculate raw efficiency score (higher sales time = higher efficiency)
    const rawScore = salesTime / (adminTime + salesTime);
    
    // Adjust based on strategic time for managers
    const adjustedScore = strategicTime > 0 
      ? rawScore * (1 + (strategicTime / 100))
      : rawScore;
    
    // Scale to 0-10 range
    return Math.min(10, Math.round(adjustedScore * 10 * 10) / 10);
  }
};