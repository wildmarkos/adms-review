/**
 * Insight Service
 * Generates insights from metrics data
 */

import {
  TimeMetrics,
  SystemComplexityMetrics,
  TeamCollaborationMetrics,
  ProcessBottleneckMetrics
} from '../types/metrics';

import {
  Insight,
  TimeInsights,
  SystemInsights,
  CollaborationInsights,
  ProcessInsights
} from '../types/insights';

/**
 * Service for generating insights from metrics data
 */
export const insightService = {
  /**
   * Generate time allocation insights
   * @param metrics Time allocation metrics
   * @returns Array of insights
   */
  generateTimeInsights(metrics: TimeMetrics): TimeInsights {
    const insights: Insight[] = [];
    
    // Admin time insight
    if (metrics.adminTime.value > 40) {
      insights.push({
        id: 'high-admin-time',
        title: 'High Administrative Time Burden',
        description: `Staff spend ${metrics.adminTime.value.toFixed(0)}% of time on administrative tasks, which is significantly above the optimal range (20-30%)`,
        severity: 'warning',
        sourceMetrics: ['adminTime'],
        confidence: metrics.adminTime.confidence.score
      });
    } else if (metrics.adminTime.value < 20) {
      insights.push({
        id: 'low-admin-time',
        title: 'Excellent Administrative Efficiency',
        description: `Staff spend only ${metrics.adminTime.value.toFixed(0)}% of time on administrative tasks, which is within the optimal range`,
        severity: 'positive',
        sourceMetrics: ['adminTime'],
        confidence: metrics.adminTime.confidence.score
      });
    }
    
    // Strategic time insight for managers
    if (metrics.strategicTime.value < 20 && metrics.systemProblemTime.value > 30) {
      insights.push({
        id: 'low-strategic-time',
        title: 'Low Strategic Planning Time',
        description: 'Managers spend significantly more time addressing system problems than on strategic planning',
        severity: 'critical',
        sourceMetrics: ['strategicTime', 'systemProblemTime'],
        confidence: Math.min(
          metrics.strategicTime.confidence.score,
          metrics.systemProblemTime.confidence.score
        )
      });
    }
    
    // Sales vs Admin time balance
    const salesAdminRatio = metrics.salesTime.value / metrics.adminTime.value;
    if (salesAdminRatio < 0.8) {
      insights.push({
        id: 'poor-time-allocation',
        title: 'Poor Time Allocation Balance',
        description: `Staff spend more time on administrative tasks than core sales activities (ratio: ${salesAdminRatio.toFixed(1)}:1)`,
        severity: 'warning',
        sourceMetrics: ['salesTime', 'adminTime'],
        confidence: Math.min(
          metrics.salesTime.confidence.score,
          metrics.adminTime.confidence.score
        )
      });
    } else if (salesAdminRatio > 2) {
      insights.push({
        id: 'excellent-time-allocation',
        title: 'Excellent Time Allocation Balance',
        description: `Staff spend significantly more time on core sales activities than administrative tasks (ratio: ${salesAdminRatio.toFixed(1)}:1)`,
        severity: 'positive',
        sourceMetrics: ['salesTime', 'adminTime'],
        confidence: Math.min(
          metrics.salesTime.confidence.score,
          metrics.adminTime.confidence.score
        )
      });
    }
    
    // Time efficiency score insight
    if (metrics.timeEfficiencyScore.value < 5) {
      insights.push({
        id: 'low-time-efficiency',
        title: 'Low Overall Time Efficiency',
        description: `The overall time efficiency score of ${metrics.timeEfficiencyScore.value.toFixed(1)}/10 indicates significant opportunities for process improvement`,
        severity: 'critical',
        sourceMetrics: ['timeEfficiencyScore'],
        confidence: metrics.timeEfficiencyScore.confidence.score
      });
    } else if (metrics.timeEfficiencyScore.value >= 8) {
      insights.push({
        id: 'high-time-efficiency',
        title: 'High Overall Time Efficiency',
        description: `The overall time efficiency score of ${metrics.timeEfficiencyScore.value.toFixed(1)}/10 indicates excellent process optimization`,
        severity: 'positive',
        sourceMetrics: ['timeEfficiencyScore'],
        confidence: metrics.timeEfficiencyScore.confidence.score
      });
    }
    
    return insights;
  },
  
  /**
   * Generate system complexity insights
   * @param metrics System complexity metrics
   * @returns Array of insights
   */
  generateSystemInsights(metrics: SystemComplexityMetrics): SystemInsights {
    const insights: Insight[] = [];
    
    // Tool count insight
    if (metrics.toolCount.value > 5) {
      insights.push({
        id: 'high-tool-count',
        title: 'Excessive Tool Count',
        description: `Staff use ${metrics.toolCount.value.toFixed(1)} different tools on average, which is above the recommended maximum of 5`,
        severity: 'warning',
        sourceMetrics: ['toolCount'],
        confidence: metrics.toolCount.confidence.score
      });
    }
    
    // Login fragmentation insight
    if (metrics.loginFragmentation.value > 3) {
      insights.push({
        id: 'high-login-fragmentation',
        title: 'Multiple Login Requirements',
        description: `Staff must log into ${metrics.loginFragmentation.value.toFixed(1)} different systems on average, creating friction in workflows`,
        severity: 'warning',
        sourceMetrics: ['loginFragmentation'],
        confidence: metrics.loginFragmentation.confidence.score
      });
    }
    
    // Workaround prevalence insight
    if (metrics.workaroundPrevalence.value > 3) {
      insights.push({
        id: 'high-workaround-prevalence',
        title: 'High Reliance on Workarounds',
        description: 'Staff frequently use workarounds to compensate for system limitations',
        severity: 'critical',
        sourceMetrics: ['workaroundPrevalence'],
        confidence: metrics.workaroundPrevalence.confidence.score
      });
    }
    
    // Critical workarounds insight
    if (metrics.criticalWorkarounds.value.length > 0) {
      insights.push({
        id: 'critical-workarounds-identified',
        title: 'Critical Workarounds Identified',
        description: `${metrics.criticalWorkarounds.value.length} critical workarounds were identified, including: ${metrics.criticalWorkarounds.value.join(', ')}`,
        severity: 'critical',
        sourceMetrics: ['criticalWorkarounds'],
        confidence: metrics.criticalWorkarounds.confidence.score
      });
    }
    
    // Overall complexity score insight
    if (metrics.overallComplexityScore.value > 6) {
      insights.push({
        id: 'high-system-complexity',
        title: 'High Overall System Complexity',
        description: `The system complexity score of ${metrics.overallComplexityScore.value.toFixed(1)}/10 indicates significant opportunities for simplification`,
        severity: 'warning',
        sourceMetrics: ['overallComplexityScore'],
        confidence: metrics.overallComplexityScore.confidence.score
      });
    } else if (metrics.overallComplexityScore.value <= 3) {
      insights.push({
        id: 'low-system-complexity',
        title: 'Excellent System Simplicity',
        description: `The system complexity score of ${metrics.overallComplexityScore.value.toFixed(1)}/10 indicates a well-optimized system architecture`,
        severity: 'positive',
        sourceMetrics: ['overallComplexityScore'],
        confidence: metrics.overallComplexityScore.confidence.score
      });
    }
    
    return insights;
  },
  
  /**
   * Generate team collaboration insights
   * @param metrics Team collaboration metrics
   * @returns Array of insights
   */
  generateCollaborationInsights(metrics: TeamCollaborationMetrics): CollaborationInsights {
    const insights: Insight[] = [];
    
    // Information sharing quality insight
    if (metrics.informationSharingQuality.value < 6) {
      insights.push({
        id: 'poor-information-sharing',
        title: 'Poor Information Sharing',
        description: `Information sharing quality score of ${metrics.informationSharingQuality.value.toFixed(1)}/10 indicates significant communication barriers`,
        severity: 'critical',
        sourceMetrics: ['informationSharingQuality'],
        confidence: metrics.informationSharingQuality.confidence.score
      });
    } else if (metrics.informationSharingQuality.value >= 8) {
      insights.push({
        id: 'excellent-information-sharing',
        title: 'Excellent Information Sharing',
        description: `Information sharing quality score of ${metrics.informationSharingQuality.value.toFixed(1)}/10 indicates strong team communication`,
        severity: 'positive',
        sourceMetrics: ['informationSharingQuality'],
        confidence: metrics.informationSharingQuality.confidence.score
      });
    }
    
    // Handoff effectiveness insight
    if (metrics.handoffEffectiveness.value < 6) {
      insights.push({
        id: 'poor-handoff-effectiveness',
        title: 'Poor Process Handoffs',
        description: `Handoff effectiveness score of ${metrics.handoffEffectiveness.value.toFixed(1)}/10 indicates significant friction in process transitions`,
        severity: 'warning',
        sourceMetrics: ['handoffEffectiveness'],
        confidence: metrics.handoffEffectiveness.confidence.score
      });
    }
    
    // Communication gap insight
    if (metrics.communicationGap.value > 5) {
      insights.push({
        id: 'large-communication-gap',
        title: 'Large Communication Gap',
        description: `Communication gap score of ${metrics.communicationGap.value.toFixed(1)}/10 indicates misalignment between team members`,
        severity: 'critical',
        sourceMetrics: ['communicationGap'],
        confidence: metrics.communicationGap.confidence.score
      });
    }
    
    // Pipeline review frequency insight
    if (metrics.pipelineReviewFrequency.value < 2) {
      insights.push({
        id: 'infrequent-pipeline-reviews',
        title: 'Infrequent Pipeline Reviews',
        description: `Pipeline reviews occur only ${metrics.pipelineReviewFrequency.value.toFixed(1)} times per month, which is below the recommended minimum of 2`,
        severity: 'warning',
        sourceMetrics: ['pipelineReviewFrequency'],
        confidence: metrics.pipelineReviewFrequency.confidence.score
      });
    } else if (metrics.pipelineReviewFrequency.value >= 4) {
      insights.push({
        id: 'frequent-pipeline-reviews',
        title: 'Frequent Pipeline Reviews',
        description: `Pipeline reviews occur ${metrics.pipelineReviewFrequency.value.toFixed(1)} times per month, which indicates strong management engagement`,
        severity: 'positive',
        sourceMetrics: ['pipelineReviewFrequency'],
        confidence: metrics.pipelineReviewFrequency.confidence.score
      });
    }
    
    // Overall collaboration score insight
    if (metrics.overallCollaborationScore.value < 6) {
      insights.push({
        id: 'poor-team-collaboration',
        title: 'Poor Overall Team Collaboration',
        description: `The overall collaboration score of ${metrics.overallCollaborationScore.value.toFixed(1)}/10 indicates significant team alignment issues`,
        severity: 'critical',
        sourceMetrics: ['overallCollaborationScore'],
        confidence: metrics.overallCollaborationScore.confidence.score
      });
    } else if (metrics.overallCollaborationScore.value >= 8) {
      insights.push({
        id: 'excellent-team-collaboration',
        title: 'Excellent Team Collaboration',
        description: `The overall collaboration score of ${metrics.overallCollaborationScore.value.toFixed(1)}/10 indicates strong team cohesion`,
        severity: 'positive',
        sourceMetrics: ['overallCollaborationScore'],
        confidence: metrics.overallCollaborationScore.confidence.score
      });
    }
    
    return insights;
  },
  
  /**
   * Generate process bottleneck insights
   * @param metrics Process bottleneck metrics
   * @returns Array of insights
   */
  generateProcessInsights(metrics: ProcessBottleneckMetrics): ProcessInsights {
    const insights: Insight[] = [];
    
    // Lead loss frequency insight
    if (metrics.leadLossFrequency.value > 20) {
      insights.push({
        id: 'high-lead-loss',
        title: 'High Lead Loss Rate',
        description: `${metrics.leadLossFrequency.value.toFixed(0)}% of leads are lost during the application process, which is above the acceptable threshold`,
        severity: 'critical',
        sourceMetrics: ['leadLossFrequency'],
        confidence: metrics.leadLossFrequency.confidence.score
      });
    } else if (metrics.leadLossFrequency.value <= 10) {
      insights.push({
        id: 'low-lead-loss',
        title: 'Excellent Lead Retention',
        description: `Only ${metrics.leadLossFrequency.value.toFixed(0)}% of leads are lost during the application process, which is below the industry average`,
        severity: 'positive',
        sourceMetrics: ['leadLossFrequency'],
        confidence: metrics.leadLossFrequency.confidence.score
      });
    }
    
    // Primary loss stage insight
    insights.push({
      id: 'primary-loss-stage',
      title: 'Primary Lead Loss Stage Identified',
      description: `The "${metrics.primaryLossStage.value}" stage accounts for the highest percentage of lead losses`,
      severity: 'warning',
      sourceMetrics: ['primaryLossStage'],
      confidence: metrics.primaryLossStage.confidence.score
    });
    
    // Lead tracking confidence insight
    if (metrics.leadTrackingConfidence.value < 6) {
      insights.push({
        id: 'low-lead-tracking-confidence',
        title: 'Low Lead Tracking Confidence',
        description: `Lead tracking confidence score of ${metrics.leadTrackingConfidence.value.toFixed(1)}/10 indicates uncertainty in pipeline visibility`,
        severity: 'warning',
        sourceMetrics: ['leadTrackingConfidence'],
        confidence: metrics.leadTrackingConfidence.confidence.score
      });
    }
    
    // Data access time insight
    if (metrics.dataAccessTime.value > 5) {
      insights.push({
        id: 'slow-data-access',
        title: 'Slow Data Access',
        description: `Staff spend an average of ${metrics.dataAccessTime.value.toFixed(1)} minutes accessing required data, which creates process friction`,
        severity: 'warning',
        sourceMetrics: ['dataAccessTime'],
        confidence: metrics.dataAccessTime.confidence.score
      });
    } else if (metrics.dataAccessTime.value <= 2) {
      insights.push({
        id: 'fast-data-access',
        title: 'Excellent Data Access Speed',
        description: `Staff spend an average of only ${metrics.dataAccessTime.value.toFixed(1)} minutes accessing required data, which indicates efficient information systems`,
        severity: 'positive',
        sourceMetrics: ['dataAccessTime'],
        confidence: metrics.dataAccessTime.confidence.score
      });
    }
    
    // Overall bottleneck score insight
    if (metrics.overallBottleneckScore.value > 6) {
      insights.push({
        id: 'significant-process-bottlenecks',
        title: 'Significant Process Bottlenecks',
        description: `The overall bottleneck score of ${metrics.overallBottleneckScore.value.toFixed(1)}/10 indicates major process flow issues`,
        severity: 'critical',
        sourceMetrics: ['overallBottleneckScore'],
        confidence: metrics.overallBottleneckScore.confidence.score
      });
    } else if (metrics.overallBottleneckScore.value <= 3) {
      insights.push({
        id: 'minimal-process-bottlenecks',
        title: 'Minimal Process Bottlenecks',
        description: `The overall bottleneck score of ${metrics.overallBottleneckScore.value.toFixed(1)}/10 indicates smooth process flows`,
        severity: 'positive',
        sourceMetrics: ['overallBottleneckScore'],
        confidence: metrics.overallBottleneckScore.confidence.score
      });
    }
    
    return insights;
  }
};