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

    // Historical comparison for growth tracking
    const previousPeriodStats = db.prepare(`
      SELECT
        COUNT(DISTINCT r.id) as prev_responses,
        AVG(a.answer_numeric) as prev_avg_score,
        COUNT(CASE WHEN a.answer_numeric <= 3 THEN 1 END) as prev_critical_issues
      FROM responses r
      JOIN answers a ON r.id = a.response_id
      WHERE r.is_complete = 1
        AND r.completed_at < datetime('now', '-30 days')
        AND a.answer_numeric IS NOT NULL
    `).get() as {
      prev_responses: number;
      prev_avg_score: number;
      prev_critical_issues: number;
    } || { prev_responses: 0, prev_avg_score: 0, prev_critical_issues: 0 };

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

    // Achievement System - Badges and Milestones
    const achievements = {
      participation_badges: {
        bronze: completionStats.total_responses >= 10,
        silver: completionStats.total_responses >= 20,
        gold: completionStats.total_responses >= 30,
        platinum: completionStats.total_responses >= 50
      },
      quality_badges: {
        data_quality_expert: (systemMetrics.data_quality_score || 0) >= 7.5,
        efficiency_champion: (systemMetrics.time_efficiency_score || 0) >= 7.5,
        productivity_master: (systemMetrics.productivity_score || 0) >= 8.0,
        lead_conversion_pro: (systemMetrics.lead_tracking_effectiveness || 0) >= 7.0
      },
      improvement_badges: {
        problem_solver: (previousPeriodStats.prev_critical_issues - (systemMetrics.critical_issues || 0)) > 0,
        growth_catalyst: (systemMetrics.overall_satisfaction || 0) > (previousPeriodStats.prev_avg_score || 0),
        engagement_booster: completionStats.total_responses > (previousPeriodStats.prev_responses || 0)
      }
    };

    // Progress Metrics with positive framing
    const progressMetrics = {
      overall_improvement: systemMetrics.overall_satisfaction > previousPeriodStats.prev_avg_score,
      improvement_percentage: previousPeriodStats.prev_avg_score > 0
        ? Math.round(((systemMetrics.overall_satisfaction - previousPeriodStats.prev_avg_score) / previousPeriodStats.prev_avg_score) * 100)
        : 0,
      issues_resolved: Math.max(0, (previousPeriodStats.prev_critical_issues || 0) - (systemMetrics.critical_issues || 0)),
      participation_growth: Math.max(0, completionStats.total_responses - (previousPeriodStats.prev_responses || 0)),
      excellence_areas: systemMetrics.high_performance_areas || 0,
      team_engagement_level: completionStats.total_responses > 15 ? 'Excelente' :
                            completionStats.total_responses > 8 ? 'Bueno' : 'En crecimiento'
    };

    // Actionable Insights with specific recommendations
    const actionableInsights = {
      immediate_actions: [],
      strategic_recommendations: [],
      celebration_worthy: [],
      improvement_opportunities: []
    } as {
      immediate_actions: string[];
      strategic_recommendations: string[];
      celebration_worthy: string[];
      improvement_opportunities: string[];
    };

    // Generate insights based on data
    if (systemMetrics.critical_issues > 0) {
      actionableInsights.immediate_actions.push(
        `Abordar ${systemMetrics.critical_issues} problemas críticos identificados en el sistema`
      );
    }

    if (systemMetrics.high_performance_areas > 0) {
      actionableInsights.celebration_worthy.push(
        `¡Excelente trabajo! ${systemMetrics.high_performance_areas} áreas están funcionando excepcionalmente bien`
      );
    }

    if (progressMetrics.overall_improvement) {
      actionableInsights.celebration_worthy.push(
        `Mejora continua: El sistema ha mejorado ${progressMetrics.improvement_percentage}% comparado con el período anterior`
      );
    }

    if ((systemMetrics.time_efficiency_score || 0) < 6) {
      actionableInsights.strategic_recommendations.push(
        "Implementar automatizaciones para mejorar la eficiencia temporal del equipo"
      );
    }

    if ((systemMetrics.lead_tracking_effectiveness || 0) < 7) {
      actionableInsights.improvement_opportunities.push(
        "Optimizar el proceso de seguimiento de leads para aumentar conversiones"
      );
    }

    // Team-specific insights
    const teamInsights = efficiencyMetrics.map(team => {
      const insights = [];
      if (team.strengths > team.pain_points) {
        insights.push(`Equipo ${team.team}: Más fortalezas (${team.strengths}) que problemas (${team.pain_points}) - ¡Excelente balance!`);
      }
      if (team.performance_score >= 7) {
        insights.push(`Equipo ${team.team}: Alto rendimiento con ${team.performance_score.toFixed(1)}/10`);
      }
      return { team: team.team, insights };
    });

    // System Health Indicators with contextual explanations
    const systemHealth = {
      overall_health_score: Math.round((systemMetrics.overall_satisfaction || 5) * 10) / 10,
      efficiency_index: Math.round((systemMetrics.time_efficiency_score || 5) * 10) / 10,
      data_reliability: Math.round((systemMetrics.data_quality_score || 5) * 10) / 10,
      user_productivity: Math.round((systemMetrics.productivity_score || 5) * 10) / 10,
      lead_management_score: Math.round((systemMetrics.lead_tracking_effectiveness || 5) * 10) / 10,
      critical_failure_rate: systemMetrics.critical_issues || 0,
      excellence_indicators: systemMetrics.high_performance_areas || 0,
      health_status: (systemMetrics.overall_satisfaction || 0) >= 7.5 ? 'Excelente' :
                    (systemMetrics.overall_satisfaction || 0) >= 6 ? 'Bueno' :
                    (systemMetrics.overall_satisfaction || 0) >= 4 ? 'Mejorable' : 'Requiere atención',
      trend_direction: progressMetrics.overall_improvement ? 'Ascendente' : 'Estable'
    };

    // Metric explanations for transparency
    const metricExplanations = {
      overall_health_score: {
        description: "Promedio general de todas las evaluaciones del sistema",
        calculation: "Suma de todas las puntuaciones numéricas ÷ número total de respuestas",
        good_range: "7.0-10.0",
        action_needed: "< 6.0"
      },
      efficiency_index: {
        description: "Mide qué tan eficientemente el equipo puede completar sus tareas",
        calculation: "Promedio de respuestas marcadas con tag 'time_efficiency'",
        good_range: "7.5-10.0",
        action_needed: "< 6.0"
      },
      data_reliability: {
        description: "Calidad y confiabilidad de los datos en el sistema",
        calculation: "Promedio de respuestas marcadas con tag 'data_quality'",
        good_range: "8.0-10.0",
        action_needed: "< 7.0"
      },
      critical_failure_rate: {
        description: "Número de problemas críticos que requieren atención inmediata",
        calculation: "Conteo de respuestas con puntuación ≤ 3.0",
        target: "0 problemas críticos",
        action_needed: "> 0"
      }
    };

    // Gamification Progress Calculations
    const gamificationProgress = {
      bronze_progress: Math.min(100, (completionStats.total_responses / 10) * 100),
      silver_progress: Math.min(100, (completionStats.total_responses / 20) * 100),
      gold_progress: Math.min(100, (completionStats.total_responses / 30) * 100),
      platinum_progress: Math.min(100, (completionStats.total_responses / 50) * 100),
      efficiency_goal_progress: Math.min(100, ((systemMetrics.time_efficiency_score || 0) / 7.5) * 100),
      quality_goal_progress: Math.min(100, ((systemMetrics.data_quality_score || 0) / 7.5) * 100),
      productivity_goal_progress: Math.min(100, ((systemMetrics.productivity_score || 0) / 8.0) * 100),
      next_badge_responses_needed: achievements.participation_badges.platinum ? 0 :
        achievements.participation_badges.gold ? 50 - completionStats.total_responses :
        achievements.participation_badges.silver ? 30 - completionStats.total_responses :
        achievements.participation_badges.bronze ? 20 - completionStats.total_responses : 10 - completionStats.total_responses
    };

    // Predictive Analytics
    const monthlyTrend = performanceTrends.length > 1 ?
      ((performanceTrends[0].avg_performance - performanceTrends[1].avg_performance) / performanceTrends[1].avg_performance) * 100 : 0;
    
    const predictiveInsights = {
      monthly_improvement_rate: monthlyTrend,
      projected_score_next_month: systemMetrics.overall_satisfaction + (systemMetrics.overall_satisfaction * (monthlyTrend / 100)),
      estimated_days_to_excellence: systemMetrics.overall_satisfaction >= 8 ? 0 :
        monthlyTrend > 0 ? Math.ceil(((8 - systemMetrics.overall_satisfaction) / (monthlyTrend / 100 / 30))) : null,
      participation_velocity: completionStats.total_responses > previousPeriodStats.prev_responses ?
        ((completionStats.total_responses - previousPeriodStats.prev_responses) / 30) : 0
    };

    // Quick Wins Analysis
    const quickWins = processIssues
      .filter(issue => issue.frequency <= 3 && issue.severity_score >= 2 && issue.severity_score <= 4)
      .slice(0, 3)
      .map(issue => ({
        title: `Mejorar: ${issue.section}`,
        impact: 'Alto',
        effort: 'Bajo',
        description: issue.question_text,
        category: issue.issue_category,
        estimated_improvement: Math.round((5 - issue.severity_score) * 2) // Points of improvement possible
      }));

    // Hall of Fame - Recent achievements
    const recentAchievements = [];
    if (progressMetrics.issues_resolved > 0) {
      recentAchievements.push({
        type: 'problem_solving',
        title: 'Problema Resuelto',
        description: `${progressMetrics.issues_resolved} problemas críticos resueltos`,
        date: new Date().toISOString(),
        impact: 'high'
      });
    }
    if (progressMetrics.overall_improvement) {
      recentAchievements.push({
        type: 'improvement',
        title: 'Mejora Continua',
        description: `Sistema mejorado ${progressMetrics.improvement_percentage}%`,
        date: new Date().toISOString(),
        impact: 'medium'
      });
    }
    if (achievements.participation_badges.gold && !achievements.participation_badges.platinum) {
      recentAchievements.push({
        type: 'participation',
        title: 'Gold Badge Alcanzado',
        description: 'Excelente nivel de participación del equipo',
        date: new Date().toISOString(),
        impact: 'high'
      });
    }

    // Story narratives based on data changes
    const dataStories = [];
    if (progressMetrics.overall_improvement) {
      dataStories.push({
        title: 'Historia de Mejora Continua',
        narrative: `En los últimos 30 días, el equipo ha logrado una mejora del ${progressMetrics.improvement_percentage}% en el rendimiento general. Este progreso se debe principalmente a ${progressMetrics.issues_resolved} problemas críticos que fueron resueltos exitosamente.`,
        trend: 'positive',
        key_metrics: {
          before: previousPeriodStats.prev_avg_score?.toFixed(1) || '0',
          after: systemMetrics.overall_satisfaction?.toFixed(1) || '0',
          change: `+${progressMetrics.improvement_percentage}%`
        }
      });
    }

    if (monthlyTrend > 0) {
      dataStories.push({
        title: 'Tendencia Ascendente Detectada',
        narrative: `Los datos muestran una tendencia positiva del ${monthlyTrend.toFixed(1)}% mensual. Si mantenemos este ritmo, alcanzaremos un nivel de excelencia (8.0+) en aproximadamente ${predictiveInsights.estimated_days_to_excellence || 60} días.`,
        trend: 'positive',
        key_metrics: {
          current_trend: `+${monthlyTrend.toFixed(1)}%`,
          projected_score: predictiveInsights.projected_score_next_month?.toFixed(1) || '0',
          target: '8.0'
        }
      });
    }

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
        lastUpdated: new Date().toISOString(),
        healthStatus: systemHealth.health_status,
        trendDirection: systemHealth.trend_direction
      },
      systemHealth,
      sectionPerformance,
      processIssues,
      efficiencyMetrics,
      performanceTrends: performanceTrends.reverse(),
      achievements,
      progressMetrics,
      actionableInsights,
      teamInsights,
      metricExplanations,
      // New gamification and motivational features
      gamificationProgress,
      predictiveInsights,
      quickWins,
      recentAchievements,
      dataStories,
      insights: {
        topConcern: processIssues[0]?.issue_category || 'No hay problemas críticos identificados',
        improvementArea: sectionPerformance[0]?.section || 'Sistema funcionando bien',
        strongestArea: sectionPerformance[sectionPerformance.length - 1]?.section || 'Múltiples áreas funcionando bien',
        motivationalMessage: progressMetrics.overall_improvement
          ? `¡Excelente progreso! El equipo ha mejorado ${progressMetrics.improvement_percentage}% comparado con el período anterior.`
          : `Sistema estable. ${progressMetrics.excellence_areas} áreas mantienen excelente rendimiento.`,
        nextMilestone: !achievements.participation_badges.platinum
          ? `Próxima meta: Alcanzar ${gamificationProgress.next_badge_responses_needed} respuestas más para el badge Platino`
          : "¡Felicitaciones! Has alcanzado el nivel máximo de participación.",
        teamStrength: efficiencyMetrics.reduce((prev, current) =>
          prev.performance_score > current.performance_score ? prev : current, efficiencyMetrics[0] || {})?.team || 'Ambos equipos'
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