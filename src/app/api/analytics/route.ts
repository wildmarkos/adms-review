import { NextResponse } from 'next/server';
import { databaseAdapter } from '@/lib/database-adapter';
import { MetricWithSource } from '@/lib/analytics/types/metrics';

/**
 * Analytics API Route
 * This is a simplified version for Phase 1
 * In later phases, this will be refactored into multiple focused endpoints
 */
export async function GET() {
  try {
    // Get core data
    const completionStats = await databaseAdapter.getCompletionStats();
    
    // Ensure we have default values
    const safeCompletionStats = {
      total_responses: completionStats?.total_responses || 0,
      avg_response_time: completionStats?.avg_response_time || 0,
      manager_responses: completionStats?.manager_responses || 0,
      sales_responses: completionStats?.sales_responses || 0
    };
    
    // Calculate confidence level based on response count
    const confidenceLevel = 
      safeCompletionStats.total_responses >= 20 ? 'high' :
      safeCompletionStats.total_responses >= 10 ? 'medium' : 'low';
    
    // Create source-transparent metrics
    const adminTime: MetricWithSource<number> = {
      value: 45, // Default value for Phase 1
      sourceQuestions: [172, 248],
      responseCount: safeCompletionStats.total_responses,
      confidence: {
        score: 0.7,
        level: confidenceLevel,
        factors: ['Based on time allocation questions']
      },
      trend: {
        direction: 'stable',
        change: 0,
        period: '30 days'
      }
    };
    
    const salesTime: MetricWithSource<number> = {
      value: 35, // Default value for Phase 1
      sourceQuestions: [172, 248],
      responseCount: safeCompletionStats.total_responses,
      confidence: {
        score: 0.7,
        level: confidenceLevel,
        factors: ['Based on time allocation questions']
      },
      trend: {
        direction: 'stable',
        change: 0,
        period: '30 days'
      }
    };
    
    // Calculate time efficiency score
    const timeEfficiencyScore: MetricWithSource<number> = {
      value: Math.round((salesTime.value / (adminTime.value + salesTime.value)) * 10) / 10,
      sourceQuestions: [172, 248, 57],
      responseCount: safeCompletionStats.total_responses,
      confidence: {
        score: 0.65,
        level: confidenceLevel,
        factors: ['Derived from time allocation metrics']
      }
    };
    
    // System complexity metrics
    const toolCount: MetricWithSource<number> = {
      value: 6.2, // Default value for Phase 1
      sourceQuestions: [218],
      responseCount: safeCompletionStats.total_responses,
      confidence: {
        score: 0.6,
        level: confidenceLevel,
        factors: ['Based on tool usage questions']
      }
    };
    
    // Team collaboration metrics
    const collaborationQuality: MetricWithSource<number> = {
      value: 6.8, // Default value for Phase 1
      sourceQuestions: [322, 332, 342],
      responseCount: safeCompletionStats.total_responses,
      confidence: {
        score: 0.65,
        level: confidenceLevel,
        factors: ['Based on team collaboration questions']
      }
    };
    
    // Last updated time
    const lastUpdated = new Date().toISOString();
    
    return NextResponse.json({
      summary: {
        total_responses: safeCompletionStats.total_responses,
        participation_rate: confidenceLevel.toUpperCase(),
        avg_completion_time: safeCompletionStats.avg_response_time || 0,
        manager_participation: safeCompletionStats.manager_responses,
        sales_participation: safeCompletionStats.sales_responses,
        data_confidence: confidenceLevel.toUpperCase(),
        lastUpdated,
        systemHealth: 7.2,
        healthStatus: 'Good',
        trendDirection: 'Stable'
      },
      timeMetrics: {
        adminTime,
        salesTime,
        timeEfficiencyScore
      },
      systemComplexityMetrics: {
        toolCount,
        overallComplexityScore: {
          value: 6.5,
          sourceQuestions: [218, 258, 131, 290],
          responseCount: safeCompletionStats.total_responses,
          confidence: {
            score: 0.65,
            level: confidenceLevel,
            factors: ['Derived from multiple system metrics']
          }
        }
      },
      teamCollaborationMetrics: {
        collaborationQuality,
        informationSharingQuality: {
          value: 7.2,
          sourceQuestions: [322],
          responseCount: safeCompletionStats.total_responses,
          confidence: {
            score: 0.6,
            level: confidenceLevel,
            factors: ['Based on information sharing questions']
          }
        }
      },
      // Phase 1 simple insights
      insights: [
        {
          id: 'time-allocation',
          title: 'Time Allocation Analysis',
          description: 'Staff spend a significant portion of time on administrative tasks.',
          severity: 'warning',
          sourceMetrics: ['adminTime', 'salesTime'],
          confidence: 0.7
        },
        {
          id: 'system-complexity',
          title: 'System Complexity',
          description: 'The current system utilizes more tools than optimal.',
          severity: 'info',
          sourceMetrics: ['toolCount'],
          confidence: 0.6
        }
      ],
      // Phase 1 simple recommendations
      recommendations: [
        {
          id: 'optimize-admin-time',
          title: 'Reduce Administrative Burden',
          description: 'Implement automation for repetitive administrative tasks',
          steps: [
            'Identify most time-consuming administrative tasks',
            'Evaluate automation possibilities',
            'Implement templates and standardized workflows'
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
          sourceInsights: ['time-allocation']
        }
      ]
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load analytics data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}