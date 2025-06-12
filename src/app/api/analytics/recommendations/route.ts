import { NextRequest, NextResponse } from 'next/server';
import { databaseAdapter } from '@/lib/database-adapter';
import { dataService } from '@/lib/analytics/services/dataService';
import { metricService } from '@/lib/analytics/services/metricService';
import { insightService } from '@/lib/analytics/services/insightService';
import { recommendationService } from '@/lib/analytics/services/recommendationService';
import { AuthRole } from '@/lib/analytics/types/auth';

/**
 * Recommendations API
 * Provides prioritized recommendations and action plans based on insights
 */
export async function GET(request: NextRequest) {
  try {
    // Extract role from query parameter (if provided)
    const { searchParams } = new URL(request.url);
    const role = (searchParams.get('role') as AuthRole) || 'coordinator';
    const id = searchParams.get('id'); // Optional recommendation ID for detailed view
    
    // Basic authorization check
    const authorized = await authorizeRequest(request, ['admin', 'coordinator', 'assessor']);
    if (!authorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // If a specific recommendation ID is requested, return detailed information
    if (id) {
      return getRecommendationDetails(id, role);
    }
    
    // Get raw survey data
    const surveyData = await dataService.fetchSurveyData();
    
    // Validate and process survey data
    const validatedData = dataService.validateResponses(surveyData);
    
    // Calculate all metrics
    const timeMetrics = metricService.calculateTimeMetrics(validatedData);
    const systemMetrics = metricService.calculateSystemMetrics(validatedData);
    const teamMetrics = metricService.calculateCollaborationMetrics(validatedData);
    const processMetrics = metricService.calculateProcessMetrics(validatedData);
    
    // Generate insights for all categories
    const timeInsights = insightService.generateTimeInsights(timeMetrics);
    const systemInsights = insightService.generateSystemInsights(systemMetrics);
    const teamInsights = insightService.generateCollaborationInsights(teamMetrics);
    const processInsights = insightService.generateProcessInsights(processMetrics);
    
    // Combine all insights
    const allInsights = {
      timeInsights,
      systemInsights,
      collaborationInsights: teamInsights,
      processInsights
    };
    
    // Generate prioritized recommendations
    const recommendations = recommendationService.prioritizeRecommendations(allInsights);
    
    // Filter recommendations by role if needed
    const filteredRecommendations = filterRecommendationsByRole(recommendations, role);
    
    // Group recommendations by category
    const groupedRecommendations = groupRecommendationsByCategory(filteredRecommendations);
    
    // Calculate implementation metrics
    const implementationMetrics = calculateImplementationMetrics(filteredRecommendations);
    
    // Assemble response
    const response = {
      // Prioritized recommendations
      recommendations: filteredRecommendations.map(recommendation => ({
        ...recommendation,
        detailsUrl: `/api/analytics/recommendations?id=${recommendation.id}`
      })),
      
      // Grouped recommendations
      byCategory: groupedRecommendations,
      
      // Quick wins (high impact, low effort)
      quickWins: filteredRecommendations
        .filter(r => r.impact.magnitude === 'high' && r.effort.level === 'quick-win')
        .slice(0, 3),
      
      // Implementation metrics
      implementation: implementationMetrics,
      
      // Role-specific focus areas
      focusAreas: getFocusAreasByRole(role),
      
      // Metadata
      meta: {
        lastUpdated: new Date().toISOString(),
        role,
        totalRecommendations: filteredRecommendations.length,
        dataQuality: validatedData.validCount > 20 ? 'high' : 
                    validatedData.validCount > 10 ? 'medium' : 'low'
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load recommendations data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Authorization check for the API
 * @param request The incoming request
 * @param allowedRoles Roles allowed to access this endpoint
 * @returns True if authorized, false otherwise
 */
async function authorizeRequest(request: NextRequest, allowedRoles: string[]): Promise<boolean> {
  // In a production system, this would verify a JWT or session token
  // For Phase 1, we'll implement a basic check
  
  // Get authorization header
  const authHeader = request.headers.get('authorization');
  
  // If no auth header, check if we're in development mode
  if (!authHeader) {
    return process.env.NODE_ENV === 'development';
  }
  
  // Check for bearer token
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    // In a real implementation, this would verify the token
    // For now, just check if it's a non-empty string
    return token.length > 0;
  }
  
  return false;
}

/**
 * Get detailed information for a specific recommendation
 * @param id Recommendation ID
 * @param role User role
 * @returns Detailed recommendation information
 */
async function getRecommendationDetails(id: string, role: string) {
  // In a real implementation, this would fetch from a database
  // For Phase 1, we'll generate sample data
  
  // Get all recommendations
  const surveyData = await dataService.fetchSurveyData();
  const validatedData = dataService.validateResponses(surveyData);
  
  // Calculate all metrics
  const timeMetrics = metricService.calculateTimeMetrics(validatedData);
  const systemMetrics = metricService.calculateSystemMetrics(validatedData);
  const teamMetrics = metricService.calculateCollaborationMetrics(validatedData);
  const processMetrics = metricService.calculateProcessMetrics(validatedData);
  
  // Generate insights for all categories
  const timeInsights = insightService.generateTimeInsights(timeMetrics);
  const systemInsights = insightService.generateSystemInsights(systemMetrics);
  const teamInsights = insightService.generateCollaborationInsights(teamMetrics);
  const processInsights = insightService.generateProcessInsights(processMetrics);
  
  // Combine all insights
  const allInsights = {
    timeInsights,
    systemInsights,
    collaborationInsights: teamInsights,
    processInsights
  };
  
  // Generate all recommendations
  const recommendations = recommendationService.prioritizeRecommendations(allInsights);
  
  // Find the requested recommendation
  const recommendation = recommendations.find(r => r.id === id);
  
  if (!recommendation) {
    return NextResponse.json(
      { error: 'Recommendation not found' },
      { status: 404 }
    );
  }
  
  // Generate detailed action steps
  const actionSteps = recommendationService.generateActionSteps(recommendation);
  
  // Estimate impact
  const impactEstimate = recommendationService.estimateImpact(recommendation);
  
  // Get source insights
  const sourceInsights = getSourceInsights(recommendation.sourceInsights, allInsights);
  
  // Create implementation timeline
  const implementationTimeline = createImplementationTimeline(recommendation, actionSteps);
  
  // Create resource requirements
  const resourceRequirements = createResourceRequirements(recommendation);
  
  // Assemble detailed response
  const response = {
    // Base recommendation
    ...recommendation,
    
    // Enhanced fields
    detailedSteps: actionSteps,
    impact: {
      ...impactEstimate,
      keyMetricsAffected: getKeyMetricsAffected(recommendation.impact.area),
      timeToRealize: getTimeToRealize(recommendation.effort.level)
    },
    
    // Additional fields
    sourceInsights,
    implementationTimeline,
    resourceRequirements,
    
    // Role-specific adaptations
    roleSpecific: getRoleSpecificContent(recommendation, role),
    
    // Similar recommendations
    relatedRecommendations: getRelatedRecommendations(recommendation, recommendations)
  };
  
  return NextResponse.json(response);
}

/**
 * Filter recommendations based on user role
 * @param recommendations All recommendations
 * @param role User role
 * @returns Filtered recommendations
 */
function filterRecommendationsByRole(recommendations: any[], role: string) {
  if (role === 'admin') {
    // Admins see all recommendations
    return recommendations;
  }
  
  if (role === 'coordinator') {
    // Coordinators see team and process recommendations, plus high-impact time/system recommendations
    return recommendations.filter(r => 
      r.impact.area.includes('Team') || 
      r.impact.area.includes('Communication') ||
      r.impact.area.includes('Process') ||
      r.impact.area.includes('Conversion') ||
      r.impact.area.includes('Pipeline') ||
      r.impact.magnitude === 'high'
    );
  }
  
  if (role === 'assessor') {
    // Assessors see recommendations relevant to their daily work
    return recommendations.filter(r => 
      !r.impact.area.includes('Management') && 
      !r.impact.area.includes('Strategic') &&
      (r.effort.level === 'quick-win' || r.priority >= 7)
    );
  }
  
  // Default fallback
  return recommendations;
}

/**
 * Group recommendations by category
 * @param recommendations Recommendations to group
 * @returns Grouped recommendations
 */
function groupRecommendationsByCategory(recommendations: any[]) {
  const groups: Record<string, any[]> = {
    'Time Allocation': [],
    'System Efficiency': [],
    'Team Collaboration': [],
    'Process Improvement': []
  };
  
  // Group recommendations
  recommendations.forEach(recommendation => {
    const area = recommendation.impact.area;
    
    if (area.includes('Time') || area.includes('Productivity')) {
      groups['Time Allocation'].push(recommendation);
    } else if (area.includes('System') || area.includes('User Experience')) {
      groups['System Efficiency'].push(recommendation);
    } else if (area.includes('Team') || area.includes('Communication') || area.includes('Collaboration')) {
      groups['Team Collaboration'].push(recommendation);
    } else if (area.includes('Process') || area.includes('Conversion') || area.includes('Stage')) {
      groups['Process Improvement'].push(recommendation);
    } else {
      // Default to process improvement if no match
      groups['Process Improvement'].push(recommendation);
    }
  });
  
  return groups;
}

/**
 * Calculate implementation metrics
 * @param recommendations Filtered recommendations
 * @returns Implementation metrics
 */
function calculateImplementationMetrics(recommendations: any[]) {
  // Count by effort level
  const quickWinsCount = recommendations.filter(r => r.effort.level === 'quick-win').length;
  const mediumEffortCount = recommendations.filter(r => r.effort.level === 'medium').length;
  const significantEffortCount = recommendations.filter(r => r.effort.level === 'significant').length;
  
  // Count by impact magnitude
  const highImpactCount = recommendations.filter(r => r.impact.magnitude === 'high').length;
  const mediumImpactCount = recommendations.filter(r => r.impact.magnitude === 'medium').length;
  const lowImpactCount = recommendations.filter(r => r.impact.magnitude === 'low').length;
  
  // Calculate implementation waves
  const wave1 = recommendations.filter(r => r.priority >= 8).length;
  const wave2 = recommendations.filter(r => r.priority >= 5 && r.priority < 8).length;
  const wave3 = recommendations.filter(r => r.priority < 5).length;
  
  // Calculate estimated timeline (in weeks)
  const totalEffort = 
    (quickWinsCount * 1.5) + // 1.5 weeks per quick win
    (mediumEffortCount * 4) + // 4 weeks per medium effort
    (significantEffortCount * 8); // 8 weeks per significant effort
  
  // Adjust for parallel implementation (assume 3 parallel streams)
  const adjustedTimeline = Math.ceil(totalEffort / 3);
  
  return {
    effortDistribution: {
      quickWins: quickWinsCount,
      mediumEffort: mediumEffortCount,
      significantEffort: significantEffortCount
    },
    impactDistribution: {
      highImpact: highImpactCount,
      mediumImpact: mediumImpactCount,
      lowImpact: lowImpactCount
    },
    implementationWaves: {
      wave1,
      wave2,
      wave3,
      totalRecommendations: recommendations.length
    },
    timeline: {
      totalEffortWeeks: totalEffort,
      estimatedTimelineWeeks: adjustedTimeline,
      earliestCompletionDate: new Date(Date.now() + (adjustedTimeline * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
    }
  };
}

/**
 * Get focus areas based on user role
 * @param role User role
 * @returns Focus areas for the role
 */
function getFocusAreasByRole(role: string) {
  if (role === 'admin') {
    return [
      {
        area: 'Strategic Planning',
        description: 'Focus on long-term improvements with the highest organizational impact',
        keyMetrics: ['timeEfficiencyScore', 'overallBottleneckScore', 'overallCollaborationScore']
      },
      {
        area: 'Resource Allocation',
        description: 'Optimize resource allocation across the admissions process',
        keyMetrics: ['adminTime', 'systemProblemTime', 'leadLossFrequency']
      },
      {
        area: 'System Architecture',
        description: 'Address fundamental system limitations and integration opportunities',
        keyMetrics: ['toolCount', 'loginFragmentation', 'workaroundPrevalence']
      }
    ];
  }
  
  if (role === 'coordinator') {
    return [
      {
        area: 'Team Effectiveness',
        description: 'Improve communication and handoff processes between team members',
        keyMetrics: ['handoffEffectiveness', 'informationSharingQuality', 'communicationGap']
      },
      {
        area: 'Process Optimization',
        description: 'Identify and address bottlenecks in the application process',
        keyMetrics: ['leadLossFrequency', 'primaryLossStage', 'dataAccessTime']
      },
      {
        area: 'Workload Balance',
        description: 'Ensure efficient allocation of time and tasks across the team',
        keyMetrics: ['adminTime', 'salesTime', 'timeEfficiencyScore']
      }
    ];
  }
  
  if (role === 'assessor') {
    return [
      {
        area: 'Daily Efficiency',
        description: 'Improve your daily workflow and reduce administrative burden',
        keyMetrics: ['adminTime', 'salesTime', 'dataAccessTime']
      },
      {
        area: 'Tool Usability',
        description: 'Address workarounds and system limitations that affect your work',
        keyMetrics: ['workaroundPrevalence', 'toolCount', 'loginFragmentation']
      },
      {
        area: 'Communication',
        description: 'Enhance information sharing and collaboration with team members',
        keyMetrics: ['informationSharingQuality', 'handoffEffectiveness', 'communicationGap']
      }
    ];
  }
  
  // Default fallback
  return [
    {
      area: 'Process Improvement',
      description: 'General process improvement opportunities',
      keyMetrics: ['timeEfficiencyScore', 'overallBottleneckScore', 'overallCollaborationScore']
    }
  ];
}

/**
 * Get source insights for a recommendation
 * @param insightIds Source insight IDs
 * @param allInsights All insights
 * @returns Source insights
 */
function getSourceInsights(insightIds: string[], allInsights: any) {
  // Combine all insights into a single array
  const combinedInsights = [
    ...allInsights.timeInsights,
    ...allInsights.systemInsights,
    ...allInsights.collaborationInsights,
    ...allInsights.processInsights
  ];
  
  // Filter by source insight IDs
  return combinedInsights.filter(insight => insightIds.includes(insight.id));
}

/**
 * Create implementation timeline for a recommendation
 * @param recommendation Recommendation
 * @param actionSteps Action steps
 * @returns Implementation timeline
 */
function createImplementationTimeline(recommendation: any, actionSteps: string[]) {
  // Determine total duration based on effort level
  let totalWeeks = 0;
  
  if (recommendation.effort.level === 'quick-win') {
    totalWeeks = 1 + Math.floor(Math.random() * 2); // 1-2 weeks
  } else if (recommendation.effort.level === 'medium') {
    totalWeeks = 3 + Math.floor(Math.random() * 4); // 3-6 weeks
  } else {
    totalWeeks = 6 + Math.floor(Math.random() * 6); // 6-12 weeks
  }
  
  // Create phases
  const phases = [];
  
  // Planning phase (always first)
  phases.push({
    name: 'Planning',
    duration: Math.max(1, Math.floor(totalWeeks * 0.2)), // 20% of total time, minimum 1 week
    steps: ['Define scope and objectives', 'Identify stakeholders', 'Create detailed implementation plan'],
    startWeek: 1
  });
  
  // Implementation phase
  const implementationStart = phases[0].duration + 1;
  const implementationDuration = Math.max(1, Math.floor(totalWeeks * 0.6)); // 60% of total time, minimum 1 week
  
  phases.push({
    name: 'Implementation',
    duration: implementationDuration,
    steps: actionSteps.slice(0, 3), // First 3 action steps or all if less than 3
    startWeek: implementationStart
  });
  
  // Validation phase
  const validationStart = implementationStart + implementationDuration;
  const validationDuration = Math.max(1, totalWeeks - (phases[0].duration + implementationDuration)); // Remaining time, minimum 1 week
  
  phases.push({
    name: 'Validation',
    duration: validationDuration,
    steps: ['Verify implementation', 'Measure impact', 'Adjust as needed'],
    startWeek: validationStart
  });
  
  return {
    totalWeeks,
    startDate: new Date().toISOString().split('T')[0],
    estimatedCompletionDate: new Date(Date.now() + (totalWeeks * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    phases
  };
}

/**
 * Create resource requirements for a recommendation
 * @param recommendation Recommendation
 * @returns Resource requirements
 */
function createResourceRequirements(recommendation: any) {
  // Base requirements on effort level
  let staffTime = 0;
  let itResources = false;
  let trainingRequired = false;
  let externalSupport = false;
  
  if (recommendation.effort.level === 'quick-win') {
    staffTime = 4 + Math.floor(Math.random() * 8); // 4-12 hours
    itResources = Math.random() > 0.7;
    trainingRequired = Math.random() > 0.8;
    externalSupport = false;
  } else if (recommendation.effort.level === 'medium') {
    staffTime = 16 + Math.floor(Math.random() * 24); // 16-40 hours
    itResources = Math.random() > 0.4;
    trainingRequired = Math.random() > 0.5;
    externalSupport = Math.random() > 0.8;
  } else {
    staffTime = 40 + Math.floor(Math.random() * 80); // 40-120 hours
    itResources = Math.random() > 0.2;
    trainingRequired = Math.random() > 0.3;
    externalSupport = Math.random() > 0.5;
  }
  
  // Determine roles involved based on impact area
  const rolesInvolved = [];
  
  if (recommendation.impact.area.includes('Management') || 
      recommendation.impact.area.includes('Strategic')) {
    rolesInvolved.push('Manager');
  }
  
  if (recommendation.impact.area.includes('Team') || 
      recommendation.impact.area.includes('Process') ||
      recommendation.impact.area.includes('Pipeline')) {
    rolesInvolved.push('Coordinator');
  }
  
  if (recommendation.impact.area.includes('User Experience') ||
      recommendation.impact.area.includes('Operational') ||
      recommendation.impact.area.includes('Time Allocation')) {
    rolesInvolved.push('Assessor');
  }
  
  // Add IT if technical resources are needed
  if (itResources) {
    rolesInvolved.push('IT Support');
  }
  
  // Ensure at least one role is involved
  if (rolesInvolved.length === 0) {
    rolesInvolved.push('Coordinator');
  }
  
  return {
    staffTimeHours: staffTime,
    primaryOwner: rolesInvolved[0],
    rolesInvolved: [...new Set(rolesInvolved)], // Remove duplicates
    technicalResources: itResources,
    trainingRequired,
    externalSupport,
    budgetImpact: externalSupport ? 'Medium' : (itResources ? 'Low' : 'Minimal')
  };
}

/**
 * Get key metrics affected by a recommendation
 * @param impactArea Impact area
 * @returns Key metrics affected
 */
function getKeyMetricsAffected(impactArea: string) {
  // Map impact areas to metrics
  const metricsByArea: Record<string, string[]> = {
    'Time Allocation': ['adminTime', 'salesTime', 'timeEfficiencyScore'],
    'Management Effectiveness': ['strategicTime', 'systemProblemTime', 'timeEfficiencyScore'],
    'Productivity': ['adminTime', 'salesTime', 'timeEfficiencyScore'],
    'System Efficiency': ['toolCount', 'loginFragmentation', 'workaroundPrevalence'],
    'User Experience': ['workaroundPrevalence', 'dataAccessTime', 'leadTrackingConfidence'],
    'Process Efficiency': ['leadLossFrequency', 'primaryLossStage', 'dataAccessTime'],
    'Team Collaboration': ['informationSharingQuality', 'handoffEffectiveness', 'communicationGap'],
    'Process Continuity': ['handoffEffectiveness', 'communicationGap', 'leadTrackingConfidence'],
    'Management Oversight': ['pipelineReviewFrequency', 'informationSharingQuality'],
    'Conversion Rate': ['leadLossFrequency', 'primaryLossStage', 'overallBottleneckScore'],
    'Stage Conversion': ['leadLossFrequency', 'primaryLossStage'],
    'Pipeline Visibility': ['leadTrackingConfidence', 'pipelineReviewFrequency'],
    'Operational Efficiency': ['adminTime', 'dataAccessTime', 'toolCount']
  };
  
  // Find matching area
  for (const [area, metrics] of Object.entries(metricsByArea)) {
    if (impactArea.includes(area)) {
      return metrics;
    }
  }
  
  // Default metrics if no match
  return ['timeEfficiencyScore', 'overallBottleneckScore', 'overallCollaborationScore'];
}

/**
 * Get time to realize benefits based on effort level
 * @param effortLevel Effort level
 * @returns Time to realize benefits
 */
function getTimeToRealize(effortLevel: string) {
  if (effortLevel === 'quick-win') {
    return '2-4 weeks';
  } else if (effortLevel === 'medium') {
    return '1-3 months';
  } else {
    return '3-6 months';
  }
}

/**
 * Get role-specific content for a recommendation
 * @param recommendation Recommendation
 * @param role User role
 * @returns Role-specific content
 */
function getRoleSpecificContent(recommendation: any, role: string) {
  if (role === 'admin') {
    return {
      focusAreas: ['Strategic impact', 'Resource allocation', 'Long-term benefits'],
      keyConsiderations: ['Budget implications', 'Organizational alignment', 'Change management'],
      successMetrics: ['Process efficiency improvement', 'Staff productivity increase', 'Cost savings']
    };
  }
  
  if (role === 'coordinator') {
    return {
      focusAreas: ['Team coordination', 'Process standardization', 'Information flow'],
      keyConsiderations: ['Team adoption', 'Training requirements', 'Implementation schedule'],
      successMetrics: ['Handoff quality improvement', 'Bottleneck reduction', 'Lead conversion increase']
    };
  }
  
  if (role === 'assessor') {
    return {
      focusAreas: ['Daily workflow impact', 'Usability improvement', 'Time savings'],
      keyConsiderations: ['Learning curve', 'Process changes', 'Tool adjustments'],
      successMetrics: ['Administrative time reduction', 'Faster data access', 'Fewer workarounds']
    };
  }
  
  // Default fallback
  return {
    focusAreas: ['Process improvement', 'Efficiency', 'Collaboration'],
    keyConsiderations: ['Implementation requirements', 'Team impact', 'Timeline'],
    successMetrics: ['Efficiency improvement', 'Quality improvement', 'Time savings']
  };
}

/**
 * Get related recommendations
 * @param recommendation Current recommendation
 * @param allRecommendations All recommendations
 * @returns Related recommendations
 */
function getRelatedRecommendations(recommendation: any, allRecommendations: any[]) {
  // Filter out current recommendation
  const otherRecommendations = allRecommendations.filter(r => r.id !== recommendation.id);
  
  // Find recommendations with similar impact area
  const similarAreaRecommendations = otherRecommendations.filter(r => 
    r.impact.area === recommendation.impact.area ||
    (r.impact.area.includes(recommendation.impact.area.split(' ')[0]) || 
     recommendation.impact.area.includes(r.impact.area.split(' ')[0]))
  );
  
  // Find recommendations with shared source insights
  const sharedInsightRecommendations = otherRecommendations.filter(r => 
    r.sourceInsights.some((insight: string) => recommendation.sourceInsights.includes(insight))
  );
  
  // Combine and deduplicate
  const related = [...new Set([...similarAreaRecommendations, ...sharedInsightRecommendations])];
  
  // Return top 3 most relevant (highest priority)
  return related
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3)
    .map(r => ({
      id: r.id,
      title: r.title,
      impact: r.impact,
      priority: r.priority,
      detailsUrl: `/api/analytics/recommendations?id=${r.id}`
    }));
}