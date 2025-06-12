import { NextRequest, NextResponse } from 'next/server';
import { databaseAdapter } from '@/lib/database-adapter';
import { dataService } from '@/lib/analytics/services/dataService';
import { metricService } from '@/lib/analytics/services/metricService';
import { insightService } from '@/lib/analytics/services/insightService';
import { recommendationService } from '@/lib/analytics/services/recommendationService';
import { AuthRole } from '@/lib/analytics/types/auth';

/**
 * Team Collaboration API
 * Provides detailed metrics and insights about team collaboration and communication
 */
export async function GET(request: NextRequest) {
  try {
    // Extract role from query parameter (if provided)
    const { searchParams } = new URL(request.url);
    const role = (searchParams.get('role') as AuthRole) || 'coordinator';
    
    // Basic authorization check (in a real implementation, this would verify a token)
    const authorized = await authorizeRequest(request, ['admin', 'coordinator', 'assessor']);
    if (!authorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get raw survey data
    const surveyData = await dataService.fetchSurveyData();
    
    // Validate and process survey data
    const validatedData = dataService.validateResponses(surveyData);
    
    // Calculate team collaboration metrics
    const teamMetrics = metricService.calculateCollaborationMetrics(validatedData);
    
    // Generate team collaboration insights
    const teamInsights = insightService.generateCollaborationInsights(teamMetrics);
    
    // Generate team-specific recommendations
    const recommendations = recommendationService.prioritizeRecommendations({ 
      timeInsights: [], 
      systemInsights: [], 
      collaborationInsights: teamInsights, 
      processInsights: [] 
    }).filter(r => r.impact.area.includes('Team') || 
                   r.impact.area.includes('Communication') ||
                   r.impact.area.includes('Collaboration'));
    
    // Calculate role communication data
    const roleCommunicationData = calculateRoleCommunicationData();
    
    // Calculate handoff efficiency data
    const handoffEfficiencyData = calculateHandoffEfficiencyData();
    
    // Calculate team meeting effectiveness
    const meetingEffectivenessData = calculateMeetingEffectivenessData();
    
    // Assemble response
    const response = {
      // Core team metrics
      metrics: {
        informationSharingQuality: teamMetrics.informationSharingQuality,
        handoffEffectiveness: teamMetrics.handoffEffectiveness,
        communicationGap: teamMetrics.communicationGap,
        pipelineReviewFrequency: teamMetrics.pipelineReviewFrequency,
        overallCollaborationScore: teamMetrics.overallCollaborationScore
      },
      
      // Communication between roles
      roleCommunication: {
        matrix: roleCommunicationData.matrix,
        strongestLinks: roleCommunicationData.strongestLinks,
        weakestLinks: roleCommunicationData.weakestLinks,
        improvementOpportunities: roleCommunicationData.improvementOpportunities
      },
      
      // Handoff efficiency
      handoffs: {
        stageTransitions: handoffEfficiencyData.stageTransitions,
        handoffQuality: handoffEfficiencyData.handoffQuality,
        documentationQuality: handoffEfficiencyData.documentationQuality,
        keyIssues: handoffEfficiencyData.keyIssues
      },
      
      // Meeting effectiveness
      meetings: {
        types: meetingEffectivenessData.types,
        frequency: meetingEffectivenessData.frequency,
        effectiveness: meetingEffectivenessData.effectiveness,
        suggestions: meetingEffectivenessData.suggestions
      },
      
      // Top challenges
      challenges: [
        {
          name: 'Unclear expectations',
          percentage: 68,
          impactLevel: 'high',
          affectedRoles: ['Assessors', 'Coordinators']
        },
        {
          name: 'Conflicting priorities',
          percentage: 57,
          impactLevel: 'medium',
          affectedRoles: ['All roles']
        },
        {
          name: 'Limited feedback',
          percentage: 54,
          impactLevel: 'medium',
          affectedRoles: ['Assessors']
        },
        {
          name: 'Information silos',
          percentage: 49,
          impactLevel: 'high',
          affectedRoles: ['Coordinators', 'Managers']
        },
        {
          name: 'Inconsistent processes',
          percentage: 41,
          impactLevel: 'medium',
          affectedRoles: ['All roles']
        }
      ],
      
      // Team-specific insights
      insights: teamInsights,
      
      // Team-specific recommendations
      recommendations: recommendations.slice(0, 3), // Top 3 recommendations
      
      // Metadata
      meta: {
        lastUpdated: new Date().toISOString(),
        role,
        dataQuality: validatedData.validCount > 20 ? 'high' : 
                    validatedData.validCount > 10 ? 'medium' : 'low'
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Team Collaboration API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load team collaboration data',
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
 * Calculate role communication data
 * @returns Object with role communication metrics
 */
function calculateRoleCommunicationData() {
  // In a real implementation, this would use actual data
  // For Phase 1, we'll use sample data
  
  // Communication quality matrix (0-10 scale)
  const matrix = [
    {
      from: 'Manager',
      to: 'Coordinator',
      score: 7.2,
      issues: ['Infrequent communication', 'Unclear expectations']
    },
    {
      from: 'Manager',
      to: 'Assessor',
      score: 5.8,
      issues: ['Limited direct communication', 'Unclear priorities']
    },
    {
      from: 'Coordinator',
      to: 'Manager',
      score: 6.9,
      issues: ['Insufficient reporting', 'Delayed updates']
    },
    {
      from: 'Coordinator',
      to: 'Assessor',
      score: 7.5,
      issues: ['Inconsistent handoffs', 'Process variability']
    },
    {
      from: 'Assessor',
      to: 'Manager',
      score: 5.2,
      issues: ['Limited visibility', 'Unclear decision criteria']
    },
    {
      from: 'Assessor',
      to: 'Coordinator',
      score: 6.8,
      issues: ['Documentation quality', 'Status update frequency']
    }
  ];
  
  // Calculate strongest links
  const strongestLinks = [...matrix]
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(link => ({
      from: link.from,
      to: link.to,
      score: link.score,
      strengths: getStrengthsForLink(link.from, link.to)
    }));
  
  // Calculate weakest links
  const weakestLinks = [...matrix]
    .sort((a, b) => a.score - b.score)
    .slice(0, 2)
    .map(link => ({
      from: link.from,
      to: link.to,
      score: link.score,
      issues: link.issues
    }));
  
  // Generate improvement opportunities
  const improvementOpportunities = weakestLinks.map(link => ({
    relationshipPath: `${link.from} → ${link.to}`,
    currentScore: link.score,
    targetScore: Math.min(10, link.score + 2),
    actions: getImprovementActionsForLink(link.from, link.to)
  }));
  
  return {
    matrix,
    strongestLinks,
    weakestLinks,
    improvementOpportunities
  };
}

/**
 * Get strengths for a communication link
 * @param from Source role
 * @param to Target role
 * @returns Array of strengths
 */
function getStrengthsForLink(from: string, to: string): string[] {
  // In a real implementation, this would be based on survey data
  // For Phase 1, we'll use sample data
  
  const strengths: Record<string, Record<string, string[]>> = {
    'Manager': {
      'Coordinator': ['Clear strategic direction', 'Regular check-ins'],
      'Assessor': ['Clear performance expectations', 'Recognition of achievements']
    },
    'Coordinator': {
      'Manager': ['Detailed status reporting', 'Proactive problem identification'],
      'Assessor': ['Clear task assignment', 'Process documentation']
    },
    'Assessor': {
      'Manager': ['Detailed application information', 'Performance metrics reporting'],
      'Coordinator': ['Timely status updates', 'Quality application processing']
    }
  };
  
  return strengths[from]?.[to] || ['Good communication frequency'];
}

/**
 * Get improvement actions for a communication link
 * @param from Source role
 * @param to Target role
 * @returns Array of improvement actions
 */
function getImprovementActionsForLink(from: string, to: string): string[] {
  // In a real implementation, this would be based on survey data
  // For Phase 1, we'll use sample data
  
  const actions: Record<string, Record<string, string[]>> = {
    'Manager': {
      'Coordinator': ['Implement weekly 1:1 meetings', 'Create clear responsibility matrix'],
      'Assessor': ['Schedule monthly team meetings', 'Develop clear performance expectations']
    },
    'Coordinator': {
      'Manager': ['Create standardized status reports', 'Schedule regular briefings'],
      'Assessor': ['Document handoff procedures', 'Create task assignment checklists']
    },
    'Assessor': {
      'Manager': ['Implement direct feedback channel', 'Create application processing dashboards'],
      'Coordinator': ['Standardize status update format', 'Implement regular check-in calls']
    }
  };
  
  return actions[from]?.[to] || ['Improve communication frequency', 'Create communication guidelines'];
}

/**
 * Calculate handoff efficiency data
 * @returns Object with handoff efficiency metrics
 */
function calculateHandoffEfficiencyData() {
  // In a real implementation, this would use actual data
  // For Phase 1, we'll use sample data
  
  // Stage transitions
  const stageTransitions = [
    {
      fromStage: 'Initial Inquiry',
      toStage: 'Application Started',
      handoffScore: 7.8,
      keyIssues: ['Contact information validation', 'Initial requirements clarity']
    },
    {
      fromStage: 'Application Started',
      toStage: 'Document Collection',
      handoffScore: 5.2,
      keyIssues: ['Document requirements clarity', 'Status tracking gaps']
    },
    {
      fromStage: 'Document Collection',
      toStage: 'Review Process',
      handoffScore: 6.5,
      keyIssues: ['Document completeness verification', 'Handoff delays']
    },
    {
      fromStage: 'Review Process',
      toStage: 'Decision Stage',
      handoffScore: 7.2,
      keyIssues: ['Evaluation criteria consistency', 'Decision documentation']
    }
  ];
  
  // Handoff quality by role
  const handoffQuality = [
    {
      role: 'Manager',
      score: 7.4,
      strengths: ['Clear priorities', 'Decision documentation'],
      opportunities: ['Process standardization', 'Team alignment']
    },
    {
      role: 'Coordinator',
      score: 6.8,
      strengths: ['Task tracking', 'Applicant communication'],
      opportunities: ['Handoff documentation', 'Process consistency']
    },
    {
      role: 'Assessor',
      score: 6.2,
      strengths: ['Technical accuracy', 'Attention to detail'],
      opportunities: ['Status communication', 'Handoff clarity']
    }
  ];
  
  // Documentation quality
  const documentationQuality = {
    overallScore: 6.5,
    byDocumentType: [
      { type: 'Process Documentation', score: 5.8 },
      { type: 'Handoff Checklists', score: 4.2 },
      { type: 'Status Reports', score: 7.3 },
      { type: 'Decision Records', score: 6.9 }
    ],
    improvementPriorities: [
      'Standardize handoff checklists',
      'Create process documentation templates',
      'Implement decision record requirements'
    ]
  };
  
  // Key issues
  const keyIssues = [
    {
      issue: 'Inconsistent handoff procedures',
      impact: 'High',
      affectedStages: ['Document Collection', 'Review Process'],
      recommendation: 'Implement standardized handoff checklists'
    },
    {
      issue: 'Missing status updates',
      impact: 'Medium',
      affectedStages: ['All stages'],
      recommendation: 'Create status update requirements with templates'
    },
    {
      issue: 'Incomplete documentation',
      impact: 'High',
      affectedStages: ['Document Collection'],
      recommendation: 'Implement document completeness verification step'
    }
  ];
  
  return {
    stageTransitions,
    handoffQuality,
    documentationQuality,
    keyIssues
  };
}

/**
 * Calculate meeting effectiveness data
 * @returns Object with meeting effectiveness metrics
 */
function calculateMeetingEffectivenessData() {
  // In a real implementation, this would use actual data
  // For Phase 1, we'll use sample data
  
  // Meeting types
  const types = [
    {
      name: 'Pipeline Review',
      frequency: 'Weekly',
      participants: ['Manager', 'Coordinator'],
      effectivenessScore: 7.2,
      keyIssues: ['Preparation time', 'Action item tracking']
    },
    {
      name: 'Team Status Update',
      frequency: 'Daily',
      participants: ['Coordinator', 'Assessors'],
      effectivenessScore: 6.8,
      keyIssues: ['Meeting length', 'Focus maintenance']
    },
    {
      name: 'Process Improvement',
      frequency: 'Monthly',
      participants: ['All roles'],
      effectivenessScore: 5.5,
      keyIssues: ['Follow-through', 'Decision implementation']
    },
    {
      name: 'Application Review',
      frequency: 'As needed',
      participants: ['Coordinator', 'Assessors'],
      effectivenessScore: 8.1,
      keyIssues: ['Scheduling challenges', 'Documentation']
    }
  ];
  
  // Meeting frequency
  const frequency = {
    averageMeetingsPerWeek: 4.5,
    averageMeetingLength: 45, // minutes
    totalMeetingTimePerWeek: 203, // minutes
    optimalMeetingTimePerWeek: 180, // minutes
    reduction: {
      recommended: true,
      targetReduction: 15, // percent
      strategies: [
        'Combine related meetings',
        'Implement 30-minute default length',
        'Create standing meetings with clear agendas'
      ]
    }
  };
  
  // Meeting effectiveness
  const effectiveness = {
    overallScore: 6.5,
    byComponent: [
      { component: 'Preparation', score: 5.8 },
      { component: 'Agenda Clarity', score: 6.2 },
      { component: 'Discussion Quality', score: 7.3 },
      { component: 'Decision Making', score: 6.5 },
      { component: 'Action Item Tracking', score: 4.9 }
    ]
  };
  
  // Improvement suggestions
  const suggestions = [
    {
      area: 'Preparation',
      suggestion: 'Implement pre-meeting agenda distribution with reading materials',
      expectedImpact: 'High'
    },
    {
      area: 'Action Item Tracking',
      suggestion: 'Create standardized action item template and tracking system',
      expectedImpact: 'High'
    },
    {
      area: 'Meeting Schedule',
      suggestion: 'Consolidate similar meetings and implement meeting-free days',
      expectedImpact: 'Medium'
    },
    {
      area: 'Decision Making',
      suggestion: 'Implement RAPID decision-making framework (Recommend, Agree, Perform, Input, Decide)',
      expectedImpact: 'Medium'
    }
  ];
  
  return {
    types,
    frequency,
    effectiveness,
    suggestions
  };
}