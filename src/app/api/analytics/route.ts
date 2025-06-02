import { NextResponse } from 'next/server';
import { dbHelpers, db } from '@/lib/database';

export async function GET() {
  try {
    // Core System Metrics
    const completionStats = dbHelpers.getCompletionStats.get() as {
      total_responses: number;
      avg_response_time: number;
      manager_responses: number;
      sales_responses: number;
    } || {
      total_responses: 0,
      avg_response_time: 0,
      manager_responses: 0,
      sales_responses: 0
    };

    // Performance & Efficiency Analysis
    const systemMetrics = db.prepare(`
      SELECT 
        AVG(CASE WHEN q.analysis_tags LIKE '%lead_conversion%' THEN a.answer_numeric END) as lead_tracking_effectiveness,
        AVG(CASE WHEN q.analysis_tags LIKE '%data_quality%' THEN a.answer_numeric END) as data_quality_score,
        AVG(CASE WHEN q.analysis_tags LIKE '%time_efficiency%' THEN a.answer_numeric END) as time_efficiency_score,
        AVG(CASE WHEN q.analysis_tags LIKE '%productivity%' THEN a.answer_numeric END) as productivity_score,
        COUNT(CASE WHEN a.answer_numeric <= 3 THEN 1 END) as critical_issues,
        COUNT(CASE WHEN a.answer_numeric >= 8 THEN 1 END) as high_performance_areas,
        AVG(a.answer_numeric) as overall_satisfaction
      FROM answers a
      JOIN questions q ON a.question_id = q.id
      JOIN responses r ON a.response_id = r.id
      WHERE r.is_complete = 1 AND a.answer_numeric IS NOT NULL
    `).get() as {
      lead_tracking_effectiveness: number;
      data_quality_score: number;
      time_efficiency_score: number;
      productivity_score: number;
      critical_issues: number;
      high_performance_areas: number;
      overall_satisfaction: number;
    } || {};

    // Section Performance Analysis
    const sectionPerformance = db.prepare(`
      SELECT 
        q.section,
        AVG(a.answer_numeric) as avg_score,
        COUNT(DISTINCT a.response_id) as response_count,
        COUNT(CASE WHEN a.answer_numeric <= 4 THEN 1 END) as problem_indicators,
        AVG(CASE WHEN a.confidence_score IS NOT NULL THEN a.confidence_score END) as confidence_level
      FROM answers a
      JOIN questions q ON a.question_id = q.id
      JOIN responses r ON a.response_id = r.id
      WHERE r.is_complete = 1 AND a.answer_numeric IS NOT NULL
      GROUP BY q.section
      ORDER BY avg_score ASC
    `).all() as Array<{
      section: string;
      avg_score: number;
      response_count: number;
      problem_indicators: number;
      confidence_level: number;
    }>;

    // Critical Process Issues
    const processIssues = db.prepare(`
      SELECT 
        q.section,
        q.question_text,
        AVG(a.answer_numeric) as severity_score,
        COUNT(a.id) as frequency,
        q.analysis_tags,
        CASE 
          WHEN q.analysis_tags LIKE '%time_efficiency%' THEN 'EFFICIENCY'
          WHEN q.analysis_tags LIKE '%data_quality%' THEN 'DATA_QUALITY'
          WHEN q.analysis_tags LIKE '%lead_conversion%' THEN 'LEAD_MANAGEMENT'
          WHEN q.analysis_tags LIKE '%productivity%' THEN 'PRODUCTIVITY'
          ELSE 'SYSTEM_USABILITY'
        END as issue_category
      FROM answers a
      JOIN questions q ON a.question_id = q.id
      JOIN responses r ON a.response_id = r.id
      WHERE r.is_complete = 1 
        AND a.answer_numeric IS NOT NULL
        AND a.answer_numeric <= 4.5
      GROUP BY q.id
      ORDER BY severity_score ASC, frequency DESC
      LIMIT 10
    `).all() as Array<{
      section: string;
      question_text: string;
      severity_score: number;
      frequency: number;
      analysis_tags: string;
      issue_category: string;
    }>;

    // Team Efficiency Insights
    const efficiencyMetrics = db.prepare(`
      SELECT 
        s.target_role as team,
        AVG(a.answer_numeric) as performance_score,
        COUNT(CASE WHEN a.answer_numeric <= 3 THEN 1 END) as pain_points,
        COUNT(CASE WHEN a.answer_numeric >= 8 THEN 1 END) as strengths,
        COUNT(DISTINCT r.id) as sample_size,
        AVG(r.response_time_seconds) as avg_completion_time
      FROM responses r
      JOIN surveys s ON r.survey_id = s.id
      JOIN answers a ON r.id = a.response_id
      WHERE r.is_complete = 1 AND a.answer_numeric IS NOT NULL
      GROUP BY s.target_role
    `).all() as Array<{
      team: string;
      performance_score: number;
      pain_points: number;
      strengths: number;
      sample_size: number;
      avg_completion_time: number;
    }>;

    // Performance Trends (last 6 months)
    const performanceTrends = db.prepare(`
      SELECT 
        strftime('%Y-%m', r.completed_at) as month,
        AVG(a.answer_numeric) as avg_performance,
        COUNT(DISTINCT r.id) as response_count,
        COUNT(CASE WHEN a.answer_numeric <= 3 THEN 1 END) as issues_reported,
        AVG(r.response_time_seconds) as avg_completion_time
      FROM responses r
      JOIN answers a ON r.id = a.response_id
      WHERE r.is_complete = 1 
        AND r.completed_at >= datetime('now', '-6 months')
        AND a.answer_numeric IS NOT NULL
      GROUP BY strftime('%Y-%m', r.completed_at)
      ORDER BY month DESC
      LIMIT 6
    `).all() as Array<{
      month: string;
      avg_performance: number;
      response_count: number;
      issues_reported: number;
      avg_completion_time: number;
    }>;

    // System Health Indicators
    const systemHealth = {
      overall_health_score: Math.round((systemMetrics.overall_satisfaction || 5) * 10) / 10,
      efficiency_index: Math.round((systemMetrics.time_efficiency_score || 5) * 10) / 10,
      data_reliability: Math.round((systemMetrics.data_quality_score || 5) * 10) / 10,
      user_productivity: Math.round((systemMetrics.productivity_score || 5) * 10) / 10,
      lead_management_score: Math.round((systemMetrics.lead_tracking_effectiveness || 5) * 10) / 10,
      critical_failure_rate: systemMetrics.critical_issues || 0,
      excellence_indicators: systemMetrics.high_performance_areas || 0
    };

    // Operational Insights
    const operationalInsights = {
      total_responses: completionStats.total_responses,
      participation_rate: completionStats.total_responses > 15 ? 'HIGH' : completionStats.total_responses > 8 ? 'MODERATE' : 'LOW',
      avg_completion_time: Math.round(completionStats.avg_response_time || 0),
      manager_participation: completionStats.manager_responses,
      sales_participation: completionStats.sales_responses,
      data_confidence: completionStats.total_responses > 20 ? 'HIGH' : completionStats.total_responses > 10 ? 'MODERATE' : 'LIMITED'
    };

    return NextResponse.json({
      summary: {
        ...operationalInsights,
        systemHealth: systemHealth.overall_health_score,
        criticalIssues: systemHealth.critical_failure_rate,
        lastUpdated: new Date().toISOString()
      },
      systemHealth,
      sectionPerformance,
      processIssues,
      efficiencyMetrics,
      performanceTrends: performanceTrends.reverse(),
      insights: {
        topConcern: processIssues[0]?.issue_category || 'No major issues identified',
        improvementArea: sectionPerformance[0]?.section || 'System performing well',
        strongestArea: sectionPerformance[sectionPerformance.length - 1]?.section || 'Multiple areas performing well'
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to load analytics data' },
      { status: 500 }
    );
  }
}