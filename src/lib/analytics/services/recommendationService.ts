/**
 * Recommendation Service
 * Generates and prioritizes action recommendations based on insights
 */

import {
  Insight,
  Recommendation,
  AllInsights,
  PrioritizedRecommendations,
  ActionSteps,
  ImpactEstimate
} from '../types/insights';

/**
 * Service for generating and prioritizing recommendations
 */
export const recommendationService = {
  /**
   * Prioritize recommendations based on all insights
   * @param insights All insights from different categories
   * @returns Prioritized list of recommendations
   */
  prioritizeRecommendations(insights: AllInsights): PrioritizedRecommendations {
    const allRecommendations: Recommendation[] = [
      ...this.generateTimeRecommendations(insights.timeInsights),
      ...this.generateSystemRecommendations(insights.systemInsights),
      ...this.generateCollaborationRecommendations(insights.collaborationInsights),
      ...this.generateProcessRecommendations(insights.processInsights)
    ];
    
    // Calculate combined priority scores
    const scoredRecommendations = allRecommendations.map(recommendation => {
      // Get source insights for priority calculation
      const sourceInsights = this.getSourceInsights(recommendation.sourceInsights, insights);
      
      // Calculate priority based on insight severity, confidence, and recommendation impact/effort
      const priorityScore = this.calculatePriorityScore(sourceInsights, recommendation);
      
      return {
        ...recommendation,
        priority: priorityScore
      };
    });
    
    // Sort by priority (highest first)
    return scoredRecommendations.sort((a, b) => b.priority - a.priority);
  },
  
  /**
   * Generate detailed action steps for a recommendation
   * @param recommendation Recommendation to generate steps for
   * @returns Detailed action steps
   */
  generateActionSteps(recommendation: Recommendation): ActionSteps {
    // In a full implementation, this would generate custom steps based on the recommendation
    // For Phase 1, we'll return the existing steps with some additional detail
    return recommendation.steps.map(step => {
      // Add more detail to each step
      if (step.includes('Document')) {
        return `${step} - Gather input from all stakeholders and create a comprehensive inventory`;
      } else if (step.includes('Identify')) {
        return `${step} - Use data-driven analysis to find the highest-impact opportunities`;
      } else if (step.includes('Implement')) {
        return `${step} - Create a phased implementation plan with clear success metrics`;
      } else if (step.includes('Configure')) {
        return `${step} - Ensure all settings are optimized for the specific workflow`;
      } else if (step.includes('Create')) {
        return `${step} - Design with user experience as the primary consideration`;
      } else {
        return `${step} - Ensure alignment with organizational goals and measure outcomes`;
      }
    });
  },
  
  /**
   * Estimate the impact of implementing a recommendation
   * @param recommendation Recommendation to estimate impact for
   * @returns Detailed impact estimate
   */
  estimateImpact(recommendation: Recommendation): ImpactEstimate {
    // In a full implementation, this would calculate specific ROI metrics
    // For Phase 1, we'll provide a more detailed version of the existing impact
    
    // Extract base impact
    const { area, magnitude, description } = recommendation.impact;
    
    // Calculate numeric value based on magnitude
    const numericValue = 
      magnitude === 'high' ? 8 + Math.random() * 2 :
      magnitude === 'medium' ? 5 + Math.random() * 3 :
      2 + Math.random() * 3;
    
    return {
      area,
      magnitude,
      description: this.enhanceImpactDescription(description, area, magnitude),
      numericValue
    };
  },
  
  /**
   * Generate time-related recommendations from insights
   * @param insights Time-related insights
   * @returns Recommendations for time improvement
   */
  generateTimeRecommendations(insights: Insight[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Administrative time recommendation
    if (insights.some(i => i.id === 'high-admin-time')) {
      recommendations.push({
        id: 'reduce-admin-time',
        title: 'Reduce Administrative Burden',
        description: 'Implement automation for repetitive administrative tasks to reduce time burden',
        steps: [
          'Document most time-consuming administrative processes',
          'Identify automation opportunities in each process',
          'Implement templates and standardized workflows',
          'Configure automated reminders and notifications'
        ],
        impact: {
          area: 'Time Allocation',
          magnitude: 'high',
          description: 'Could reduce administrative time by 15-20%'
        },
        effort: {
          level: 'medium',
          description: '2-4 weeks with IT resources',
          timeEstimate: '2-4 weeks'
        },
        priority: 8,
        sourceInsights: ['high-admin-time']
      });
    }
    
    // Strategic time recommendation
    if (insights.some(i => i.id === 'low-strategic-time')) {
      recommendations.push({
        id: 'increase-strategic-time',
        title: 'Increase Strategic Planning Time',
        description: 'Allocate dedicated time for strategic planning and process improvement',
        steps: [
          'Schedule regular strategic planning sessions',
          'Delegate system problem resolution to appropriate team members',
          'Create decision-making framework for prioritizing system issues',
          'Implement strategic planning templates and processes'
        ],
        impact: {
          area: 'Management Effectiveness',
          magnitude: 'high',
          description: 'Could increase strategic planning time by 10-15%'
        },
        effort: {
          level: 'quick-win',
          description: 'Primarily requires scheduling changes',
          timeEstimate: '1-2 weeks'
        },
        priority: 7,
        sourceInsights: ['low-strategic-time']
      });
    }
    
    // Poor time allocation recommendation
    if (insights.some(i => i.id === 'poor-time-allocation')) {
      recommendations.push({
        id: 'optimize-time-allocation',
        title: 'Optimize Time Allocation Balance',
        description: 'Rebalance time allocation to focus more on core sales activities',
        steps: [
          'Audit daily activities and identify administrative time sinks',
          'Create standard operating procedures for common tasks',
          'Implement time tracking for key activities',
          'Train staff on time management techniques'
        ],
        impact: {
          area: 'Productivity',
          magnitude: 'high',
          description: 'Could improve sales/admin time ratio by 30-40%'
        },
        effort: {
          level: 'medium',
          description: 'Requires process changes and training',
          timeEstimate: '3-4 weeks'
        },
        priority: 9,
        sourceInsights: ['poor-time-allocation']
      });
    }
    
    return recommendations;
  },
  
  /**
   * Generate system-related recommendations from insights
   * @param insights System-related insights
   * @returns Recommendations for system improvement
   */
  generateSystemRecommendations(insights: Insight[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Tool count recommendation
    if (insights.some(i => i.id === 'high-tool-count')) {
      recommendations.push({
        id: 'consolidate-tools',
        title: 'Consolidate System Tools',
        description: 'Reduce the number of separate tools by consolidating functionality',
        steps: [
          'Create comprehensive tool inventory',
          'Map functionality overlap between tools',
          'Identify primary systems for key functions',
          'Create migration plan for consolidated system'
        ],
        impact: {
          area: 'System Efficiency',
          magnitude: 'high',
          description: 'Could reduce tool count by 20-30%'
        },
        effort: {
          level: 'significant',
          description: 'Requires system integration work',
          timeEstimate: '2-3 months'
        },
        priority: 7,
        sourceInsights: ['high-tool-count']
      });
    }
    
    // Login fragmentation recommendation
    if (insights.some(i => i.id === 'high-login-fragmentation')) {
      recommendations.push({
        id: 'implement-sso',
        title: 'Implement Single Sign-On',
        description: 'Reduce login friction by implementing single sign-on across systems',
        steps: [
          'Inventory all systems requiring separate authentication',
          'Select SSO provider compatible with existing systems',
          'Implement authentication service integration',
          'Roll out SSO solution with user training'
        ],
        impact: {
          area: 'User Experience',
          magnitude: 'medium',
          description: 'Could save 5-10 minutes per user per day'
        },
        effort: {
          level: 'medium',
          description: 'Requires IT resources for implementation',
          timeEstimate: '4-6 weeks'
        },
        priority: 6,
        sourceInsights: ['high-login-fragmentation']
      });
    }
    
    // Workaround prevalence recommendation
    if (insights.some(i => i.id === 'high-workaround-prevalence') || 
        insights.some(i => i.id === 'critical-workarounds-identified')) {
      recommendations.push({
        id: 'address-workarounds',
        title: 'Address Critical Workarounds',
        description: 'Implement system improvements to eliminate the need for common workarounds',
        steps: [
          'Document all current workarounds and their root causes',
          'Prioritize workarounds based on frequency and impact',
          'Develop system enhancements to address top workarounds',
          'Create transition plan to new processes'
        ],
        impact: {
          area: 'Process Efficiency',
          magnitude: 'high',
          description: 'Could eliminate 70-80% of workarounds'
        },
        effort: {
          level: 'significant',
          description: 'Requires system development and process changes',
          timeEstimate: '2-3 months'
        },
        priority: 8,
        sourceInsights: ['high-workaround-prevalence', 'critical-workarounds-identified']
      });
    }
    
    return recommendations;
  },
  
  /**
   * Generate collaboration-related recommendations from insights
   * @param insights Collaboration-related insights
   * @returns Recommendations for collaboration improvement
   */
  generateCollaborationRecommendations(insights: Insight[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Information sharing recommendation
    if (insights.some(i => i.id === 'poor-information-sharing')) {
      recommendations.push({
        id: 'improve-information-sharing',
        title: 'Improve Information Sharing',
        description: 'Implement structured information sharing processes and tools',
        steps: [
          'Create centralized information repository',
          'Define standard information sharing protocols',
          'Implement regular team knowledge sharing sessions',
          'Create role-specific dashboards for key information'
        ],
        impact: {
          area: 'Team Collaboration',
          magnitude: 'high',
          description: 'Could improve information sharing quality by 30-40%'
        },
        effort: {
          level: 'medium',
          description: 'Requires process changes and tool configuration',
          timeEstimate: '4-6 weeks'
        },
        priority: 8,
        sourceInsights: ['poor-information-sharing']
      });
    }
    
    // Handoff effectiveness recommendation
    if (insights.some(i => i.id === 'poor-handoff-effectiveness')) {
      recommendations.push({
        id: 'standardize-handoffs',
        title: 'Standardize Process Handoffs',
        description: 'Create structured handoff processes between team members and stages',
        steps: [
          'Document current handoff processes and pain points',
          'Create standardized handoff templates for each transition',
          'Implement handoff checklists in workflow',
          'Train team on new handoff protocols'
        ],
        impact: {
          area: 'Process Continuity',
          magnitude: 'medium',
          description: 'Could improve handoff effectiveness by 25-35%'
        },
        effort: {
          level: 'quick-win',
          description: 'Primarily requires process standardization',
          timeEstimate: '2-3 weeks'
        },
        priority: 7,
        sourceInsights: ['poor-handoff-effectiveness']
      });
    }
    
    // Pipeline review recommendation
    if (insights.some(i => i.id === 'infrequent-pipeline-reviews')) {
      recommendations.push({
        id: 'increase-pipeline-reviews',
        title: 'Increase Pipeline Review Frequency',
        description: 'Implement more frequent and structured pipeline reviews',
        steps: [
          'Schedule regular pipeline review sessions',
          'Create standardized pipeline review template',
          'Define clear action items from each review',
          'Implement follow-up tracking system'
        ],
        impact: {
          area: 'Management Oversight',
          magnitude: 'medium',
          description: 'Could improve pipeline visibility and management'
        },
        effort: {
          level: 'quick-win',
          description: 'Primarily requires scheduling changes',
          timeEstimate: '1-2 weeks'
        },
        priority: 6,
        sourceInsights: ['infrequent-pipeline-reviews']
      });
    }
    
    return recommendations;
  },
  
  /**
   * Generate process-related recommendations from insights
   * @param insights Process-related insights
   * @returns Recommendations for process improvement
   */
  generateProcessRecommendations(insights: Insight[]): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Lead loss recommendation
    if (insights.some(i => i.id === 'high-lead-loss')) {
      recommendations.push({
        id: 'reduce-lead-loss',
        title: 'Reduce Lead Loss Rate',
        description: 'Implement processes to reduce lead losses during the application process',
        steps: [
          'Analyze detailed lead loss reasons',
          'Create stage-specific retention strategies',
          'Implement lead nurturing automation',
          'Define service level agreements for follow-up'
        ],
        impact: {
          area: 'Conversion Rate',
          magnitude: 'high',
          description: 'Could reduce lead loss rate by 20-30%'
        },
        effort: {
          level: 'medium',
          description: 'Requires process changes and automation',
          timeEstimate: '4-6 weeks'
        },
        priority: 9,
        sourceInsights: ['high-lead-loss']
      });
    }
    
    // Primary loss stage recommendation
    if (insights.some(i => i.id === 'primary-loss-stage')) {
      // Find the specific insight to get the stage name
      const stageInsight = insights.find(i => i.id === 'primary-loss-stage');
      const stageName = stageInsight?.description.match(/"([^"]+)"/) ? 
        stageInsight.description.match(/"([^"]+)"/)![1] : 'identified stage';
      
      recommendations.push({
        id: 'optimize-loss-stage',
        title: `Optimize ${stageName} Stage`,
        description: `Improve processes specifically in the ${stageName} stage to reduce lead losses`,
        steps: [
          `Document detailed ${stageName} stage workflow`,
          'Identify specific friction points in the process',
          'Implement targeted improvements for key friction points',
          'Create tracking metrics for stage-specific performance'
        ],
        impact: {
          area: 'Stage Conversion',
          magnitude: 'high',
          description: `Could reduce losses in ${stageName} stage by 30-40%`
        },
        effort: {
          level: 'medium',
          description: 'Requires focused process improvements',
          timeEstimate: '3-4 weeks'
        },
        priority: 8,
        sourceInsights: ['primary-loss-stage']
      });
    }
    
    // Lead tracking confidence recommendation
    if (insights.some(i => i.id === 'low-lead-tracking-confidence')) {
      recommendations.push({
        id: 'improve-lead-tracking',
        title: 'Improve Lead Tracking Visibility',
        description: 'Enhance lead tracking systems to improve pipeline visibility',
        steps: [
          'Audit current lead tracking process and gaps',
          'Implement standardized lead status definitions',
          'Create comprehensive lead tracking dashboard',
          'Train team on consistent tracking procedures'
        ],
        impact: {
          area: 'Pipeline Visibility',
          magnitude: 'medium',
          description: 'Could improve lead tracking confidence by 30-40%'
        },
        effort: {
          level: 'medium',
          description: 'Requires system and process changes',
          timeEstimate: '4-5 weeks'
        },
        priority: 7,
        sourceInsights: ['low-lead-tracking-confidence']
      });
    }
    
    // Data access time recommendation
    if (insights.some(i => i.id === 'slow-data-access')) {
      recommendations.push({
        id: 'improve-data-access',
        title: 'Improve Data Access Speed',
        description: 'Optimize data access systems to reduce time spent searching for information',
        steps: [
          'Identify most frequently accessed data types',
          'Create role-specific quick access interfaces',
          'Implement search optimization and indexing',
          'Create favorite/recent items functionality'
        ],
        impact: {
          area: 'Operational Efficiency',
          magnitude: 'medium',
          description: 'Could reduce data access time by 40-60%'
        },
        effort: {
          level: 'medium',
          description: 'Requires interface and system optimization',
          timeEstimate: '4-6 weeks'
        },
        priority: 6,
        sourceInsights: ['slow-data-access']
      });
    }
    
    return recommendations;
  },
  
  /**
   * Get source insights for priority calculation
   * @param insightIds IDs of source insights
   * @param allInsights All available insights
   * @returns Array of matching insights
   */
  getSourceInsights(insightIds: string[], allInsights: AllInsights): Insight[] {
    const allInsightArrays = [
      ...allInsights.timeInsights,
      ...allInsights.systemInsights,
      ...allInsights.collaborationInsights,
      ...allInsights.processInsights
    ];
    
    return allInsightArrays.filter(insight => insightIds.includes(insight.id));
  },
  
  /**
   * Calculate priority score for a recommendation
   * @param sourceInsights Source insights for this recommendation
   * @param recommendation Recommendation to score
   * @returns Priority score (1-10)
   */
  calculatePriorityScore(sourceInsights: Insight[], recommendation: Recommendation): number {
    // Start with a base score
    let score = 5;
    
    // Adjust based on insight severity
    sourceInsights.forEach(insight => {
      if (insight.severity === 'critical') score += 1.5;
      if (insight.severity === 'warning') score += 0.75;
      if (insight.severity === 'info') score += 0.25;
    });
    
    // Adjust based on confidence (average of source insights)
    const avgConfidence = sourceInsights.reduce((sum, insight) => sum + insight.confidence, 0) / 
      (sourceInsights.length || 1);
    score = score * (0.75 + avgConfidence * 0.5); // Scale factor based on confidence
    
    // Adjust based on impact magnitude
    if (recommendation.impact.magnitude === 'high') score += 1.5;
    if (recommendation.impact.magnitude === 'medium') score += 0.75;
    if (recommendation.impact.magnitude === 'low') score += 0.25;
    
    // Adjust based on effort level (quick wins get higher priority)
    if (recommendation.effort.level === 'quick-win') score += 1;
    if (recommendation.effort.level === 'significant') score -= 0.5;
    
    // Cap at 1-10 range
    return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
  },
  
  /**
   * Enhance impact description with more details
   * @param baseDescription Base description from recommendation
   * @param area Impact area
   * @param magnitude Impact magnitude
   * @returns Enhanced description
   */
  enhanceImpactDescription(baseDescription: string, area: string, magnitude: string): string {
    const enhancements = {
      'Time Allocation': 'This would free up staff time for higher-value activities and improve overall productivity.',
      'Management Effectiveness': 'This would improve strategic direction and long-term planning capabilities.',
      'Productivity': 'This would directly improve key performance metrics and staff satisfaction.',
      'System Efficiency': 'This would reduce system complexity and maintenance costs.',
      'User Experience': 'This would improve staff satisfaction and reduce training requirements.',
      'Process Efficiency': 'This would streamline operations and reduce errors.',
      'Team Collaboration': 'This would improve information flow and reduce communication gaps.',
      'Process Continuity': 'This would reduce errors during handoffs and improve accountability.',
      'Management Oversight': 'This would improve decision-making and resource allocation.',
      'Conversion Rate': 'This would directly impact revenue and growth metrics.',
      'Stage Conversion': 'This would address a critical bottleneck in the application process.',
      'Pipeline Visibility': 'This would improve forecasting accuracy and resource planning.',
      'Operational Efficiency': 'This would improve daily productivity across all team members.'
    };
    
    // Get area-specific enhancement
    const areaEnhancement = enhancements[area as keyof typeof enhancements] || 
      'This would improve overall system performance.';
    
    // Add ROI indication based on magnitude
    const roiIndication = 
      magnitude === 'high' ? 'Expected ROI is significant, with benefits likely to exceed implementation costs by 3-5x.' :
      magnitude === 'medium' ? 'Expected ROI is positive, with benefits likely to exceed implementation costs by 2-3x.' :
      'Expected ROI is moderate, with benefits likely to match implementation costs.';
    
    // Combine all elements
    return `${baseDescription}. ${areaEnhancement} ${roiIndication}`;
  }
};