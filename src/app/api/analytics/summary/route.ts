import { NextRequest, NextResponse } from 'next/server';
import { databaseAdapter } from '@/lib/database-adapter';
import { dataService } from '@/lib/analytics/services/dataService';
import { metricService } from '@/lib/analytics/services/metricService';
import { insightService } from '@/lib/analytics/services/insightService';
import { AuthRole } from '@/lib/analytics/types/auth';

/**
 * Analytics Summary API
 * Provides overview metrics and insights for the analytics dashboard
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
    
    // Get base statistics
    const completionStats = await databaseAdapter.getCompletionStats();
    
    // Get raw survey data
    const surveyData = await dataService.fetchSurveyData();
    
    // Validate and process survey data
    const validatedData = dataService.validateResponses(surveyData);
    
    // Calculate metrics
    const timeMetrics = metricService.calculateTimeMetrics(validatedData);
    const systemMetrics = metricService.calculateSystemMetrics(validatedData);
    const teamMetrics = metricService.calculateCollaborationMetrics(validatedData);
    const processMetrics = metricService.calculateProcessMetrics(validatedData);
    
    // Generate key insights
    const timeInsights = insightService.generateTimeInsights(timeMetrics);
    const systemInsights = insightService.generateSystemInsights(systemMetrics);
    const teamInsights = insightService.generateCollaborationInsights(teamMetrics);
    const processInsights = insightService.generateProcessInsights(processMetrics);
    
    // Filter insights by severity and role
    const criticalInsights = [
      ...timeInsights.filter(i => i.severity === 'critical'),
      ...systemInsights.filter(i => i.severity === 'critical'),
      ...teamInsights.filter(i => i.severity === 'critical'),
      ...processInsights.filter(i => i.severity === 'critical')
    ];
    
    // Filter warning insights (limit to top 3)
    const warningInsights = [
      ...timeInsights.filter(i => i.severity === 'warning'),
      ...systemInsights.filter(i => i.severity === 'warning'),
      ...teamInsights.filter(i => i.severity === 'warning'),
      ...processInsights.filter(i => i.severity === 'warning')
    ].sort((a, b) => b.confidence - a.confidence).slice(0, 3);
    
    // Filter positive insights (limit to top 2)
    const positiveInsights = [
      ...timeInsights.filter(i => i.severity === 'positive'),
      ...systemInsights.filter(i => i.severity === 'positive'),
      ...teamInsights.filter(i => i.severity === 'positive'),
      ...processInsights.filter(i => i.severity === 'positive')
    ].sort((a, b) => b.confidence - a.confidence).slice(0, 2);
    
    // Calculate an overall health score (0-10)
    const systemHealth = calculateSystemHealth(
      timeMetrics, systemMetrics, teamMetrics, processMetrics
    );
    
    // Determine health status
    const healthStatus = 
      systemHealth >= 7.5 ? 'Good' :
      systemHealth >= 5 ? 'Fair' :
      'Needs Attention';
    
    // Determine trend direction (in a real implementation, this would compare to historical data)
    const trendDirection = 'Stable';
    
    // Last updated time
    const lastUpdated = new Date().toISOString();
    
    // Build the summary response
    const summary = {
      // Participation statistics
      participation: {
        total_responses: completionStats?.total_responses || 0,
        participation_rate: getConfidenceLevel(completionStats?.total_responses || 0),
        avg_completion_time: completionStats?.avg_response_time || 0,
        manager_responses: completionStats?.manager_responses || 0,
        sales_responses: completionStats?.sales_responses || 0,
      },
      
      // System health overview
      health: {
        score: systemHealth,
        status: healthStatus,
        trend: trendDirection,
      },
      
      // Key metrics by category
      keyMetrics: {
        time: {
          adminTime: timeMetrics.adminTime,
          salesTime: timeMetrics.salesTime,
          timeEfficiencyScore: timeMetrics.timeEfficiencyScore
        },
        system: {
          toolCount: systemMetrics.toolCount,
          overallComplexityScore: systemMetrics.overallComplexityScore
        },
        team: {
          informationSharingQuality: teamMetrics.informationSharingQuality,
          overallCollaborationScore: teamMetrics.overallCollaborationScore
        },
        process: {
          leadLossFrequency: processMetrics.leadLossFrequency,
          primaryLossStage: processMetrics.primaryLossStage
        }
      },
      
      // Top insights by severity
      insights: {
        critical: criticalInsights,
        warnings: warningInsights,
        positive: positiveInsights
      },
      
      // Metadata
      meta: {
        lastUpdated,
        role,
        dataQuality: validatedData.validCount > 20 ? 'high' : 
                    validatedData.validCount > 10 ? 'medium' : 'low'
      }
    };
    
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Analytics Summary API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load analytics summary data',
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
 * Get confidence level based on response count
 * @param responseCount Number of responses
 * @returns Confidence level string
 */
function getConfidenceLevel(responseCount: number): string {
  if (responseCount >= 20) return 'HIGH';
  if (responseCount >= 10) return 'MEDIUM';
  return 'LOW';
}

/**
 * Calculate overall system health score
 * @param timeMetrics Time allocation metrics
 * @param systemMetrics System complexity metrics
 * @param teamMetrics Team collaboration metrics
 * @param processMetrics Process bottleneck metrics
 * @returns System health score (0-10)
 */
function calculateSystemHealth(
  timeMetrics: any,
  systemMetrics: any,
  teamMetrics: any,
  processMetrics: any
): number {
  // Calculate time efficiency component (0-10)
  const timeScore = timeMetrics.timeEfficiencyScore.value;
  
  // Calculate system component (0-10, inverted from complexity)
  const systemScore = 10 - systemMetrics.overallComplexityScore.value;
  
  // Calculate team component (0-10)
  const teamScore = teamMetrics.overallCollaborationScore.value;
  
  // Calculate process component (0-10, inverted from bottleneck score)
  const processScore = 10 - processMetrics.overallBottleneckScore.value;
  
  // Weighted average (time and process have higher weight)
  const weightedScore = (
    (timeScore * 0.3) +
    (systemScore * 0.2) +
    (teamScore * 0.2) +
    (processScore * 0.3)
  );
  
  // Round to one decimal place
  return Math.round(weightedScore * 10) / 10;
}