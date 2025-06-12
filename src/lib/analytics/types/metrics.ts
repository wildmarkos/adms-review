/**
 * Analytics Metrics Type Definitions
 * Core data structures for the analytics dashboard
 */

// Source-tracked metric with confidence
export interface MetricWithSource<T> {
  value: T;
  sourceQuestions: number[];
  responseCount: number;
  confidence: {
    score: number; // 0-1 scale
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  trend?: {
    direction: 'improving' | 'stable' | 'declining';
    change: number;
    period: string;
  };
}

// Time allocation metrics
export interface TimeMetrics {
  adminTime: MetricWithSource<number>;
  salesTime: MetricWithSource<number>;
  strategicTime: MetricWithSource<number>;
  systemProblemTime: MetricWithSource<number>;
  timeEfficiencyScore: MetricWithSource<number>;
}

// System complexity metrics
export interface SystemComplexityMetrics {
  toolCount: MetricWithSource<number>;
  loginFragmentation: MetricWithSource<number>;
  workaroundPrevalence: MetricWithSource<number>;
  criticalWorkarounds: MetricWithSource<string[]>;
  overallComplexityScore: MetricWithSource<number>;
}

// Team collaboration metrics
export interface TeamCollaborationMetrics {
  informationSharingQuality: MetricWithSource<number>;
  handoffEffectiveness: MetricWithSource<number>;
  communicationGap: MetricWithSource<number>;
  pipelineReviewFrequency: MetricWithSource<number>;
  overallCollaborationScore: MetricWithSource<number>;
}

// Process bottleneck metrics
export interface ProcessBottleneckMetrics {
  leadLossFrequency: MetricWithSource<number>;
  primaryLossStage: MetricWithSource<string>;
  leadTrackingConfidence: MetricWithSource<number>;
  dataAccessTime: MetricWithSource<number>;
  overallBottleneckScore: MetricWithSource<number>;
}

// All metrics combined
export interface AnalyticsMetrics {
  timeMetrics: TimeMetrics;
  systemComplexityMetrics: SystemComplexityMetrics;
  teamCollaborationMetrics: TeamCollaborationMetrics;
  processBottleneckMetrics: ProcessBottleneckMetrics;
}