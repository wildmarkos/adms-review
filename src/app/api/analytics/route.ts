import { NextResponse } from 'next/server';
import { databaseAdapter, isUsingSupabase } from '@/lib/database-adapter';

export async function GET() {
  try {
    // Core System Metrics using database adapter
    const completionStats = await databaseAdapter.getCompletionStats();
    const improvementMetrics = await databaseAdapter.getImprovementMetrics();

    // Ensure we have default values
    const safeCompletionStats = {
      total_responses: completionStats?.total_responses || 0,
      avg_response_time: completionStats?.avg_response_time || 0,
      manager_responses: completionStats?.manager_responses || 0,
      sales_responses: completionStats?.sales_responses || 0
    };

    const safeImprovementMetrics = {
      efficiency_score: improvementMetrics?.efficiency_score || 0,
      productivity_score: improvementMetrics?.productivity_score || 0,
      satisfaction_score: improvementMetrics?.satisfaction_score || 0
    };

    // Basic system health indicators
    const systemHealth = {
      overall_health_score: Math.round((safeImprovementMetrics.satisfaction_score || 5) * 10) / 10,
      efficiency_index: Math.round((safeImprovementMetrics.efficiency_score || 5) * 10) / 10,
      productivity_score: Math.round((safeImprovementMetrics.productivity_score || 5) * 10) / 10,
      critical_failure_rate: 0, // Will be calculated based on actual data
      excellence_indicators: 0, // Will be calculated based on actual data
      health_status: (safeImprovementMetrics.satisfaction_score || 0) >= 7.5 ? 'Excelente' :
                    (safeImprovementMetrics.satisfaction_score || 0) >= 6 ? 'Bueno' :
                    (safeImprovementMetrics.satisfaction_score || 0) >= 4 ? 'Mejorable' : 'Requiere atención',
      trend_direction: 'Estable' // Default, can be enhanced with more data
    };

    // Simplified section performance - would need enhancement for full functionality
    const sectionPerformance = [
      {
        section: 'Sistema General',
        avg_score: safeImprovementMetrics.satisfaction_score || 5,
        response_count: safeCompletionStats.total_responses,
        problem_indicators: 0,
        confidence_level: 7.5
      },
      {
        section: 'Eficiencia',
        avg_score: safeImprovementMetrics.efficiency_score || 5,
        response_count: safeCompletionStats.total_responses,
        problem_indicators: 0,
        confidence_level: 7.0
      },
      {
        section: 'Productividad',
        avg_score: safeImprovementMetrics.productivity_score || 5,
        response_count: safeCompletionStats.total_responses,
        problem_indicators: 0,
        confidence_level: 7.2
      }
    ].sort((a, b) => a.avg_score - b.avg_score);

    // Basic efficiency metrics by team
    const efficiencyMetrics = [
      {
        team: 'manager',
        performance_score: safeImprovementMetrics.satisfaction_score || 5,
        pain_points: 0,
        strengths: safeCompletionStats.manager_responses > 0 ? 1 : 0,
        sample_size: safeCompletionStats.manager_responses,
        avg_completion_time: safeCompletionStats.avg_response_time
      },
      {
        team: 'sales',
        performance_score: safeImprovementMetrics.satisfaction_score || 5,
        pain_points: 0,
        strengths: safeCompletionStats.sales_responses > 0 ? 1 : 0,
        sample_size: safeCompletionStats.sales_responses,
        avg_completion_time: safeCompletionStats.avg_response_time
      }
    ];

    // Basic performance trends (simplified)
    const performanceTrends = [
      {
        month: new Date().toISOString().slice(0, 7),
        avg_performance: safeImprovementMetrics.satisfaction_score || 5,
        response_count: safeCompletionStats.total_responses,
        issues_reported: 0,
        avg_completion_time: safeCompletionStats.avg_response_time
      }
    ];

    // Achievement System - Badges and Milestones
    const achievements = {
      participation_badges: {
        bronze: safeCompletionStats.total_responses >= 10,
        silver: safeCompletionStats.total_responses >= 20,
        gold: safeCompletionStats.total_responses >= 30,
        platinum: safeCompletionStats.total_responses >= 50
      },
      quality_badges: {
        data_quality_expert: false, // Would need more detailed data
        efficiency_champion: (safeImprovementMetrics.efficiency_score || 0) >= 7.5,
        productivity_master: (safeImprovementMetrics.productivity_score || 0) >= 8.0,
        lead_conversion_pro: false // Would need more detailed data
      },
      improvement_badges: {
        problem_solver: false, // Would need historical comparison
        growth_catalyst: (safeImprovementMetrics.satisfaction_score || 0) > 6,
        engagement_booster: safeCompletionStats.total_responses > 10
      }
    };

    // Progress Metrics
    const progressMetrics = {
      overall_improvement: true, // Simplified
      improvement_percentage: 5, // Simplified
      issues_resolved: 0,
      participation_growth: Math.max(0, safeCompletionStats.total_responses - 5),
      excellence_areas: Object.values(safeImprovementMetrics).filter(score => score >= 8).length,
      team_engagement_level: safeCompletionStats.total_responses > 15 ? 'Excelente' :
                            safeCompletionStats.total_responses > 8 ? 'Bueno' : 'En crecimiento'
    };

    // Actionable Insights
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

    // Generate basic insights
    if (safeCompletionStats.total_responses > 0) {
      actionableInsights.celebration_worthy.push(
        `¡Excelente! Se han recopilado ${safeCompletionStats.total_responses} respuestas del equipo`
      );
    }

    if ((safeImprovementMetrics.efficiency_score || 0) >= 7.5) {
      actionableInsights.celebration_worthy.push(
        `El equipo mantiene un excelente nivel de eficiencia (${safeImprovementMetrics.efficiency_score.toFixed(1)}/10)`
      );
    }

    if ((safeImprovementMetrics.efficiency_score || 0) < 6) {
      actionableInsights.strategic_recommendations.push(
        "Considerar implementar mejoras en los procesos para aumentar la eficiencia del equipo"
      );
    }

    if (safeCompletionStats.total_responses < 10) {
      actionableInsights.improvement_opportunities.push(
        "Aumentar la participación del equipo en las encuestas para obtener datos más representativos"
      );
    }

    // Team insights
    const teamInsights = efficiencyMetrics.map(team => ({
      team: team.team,
      insights: team.sample_size > 0 
        ? [`Equipo ${team.team}: ${team.sample_size} respuestas recopiladas con rendimiento de ${team.performance_score.toFixed(1)}/10`]
        : [`Equipo ${team.team}: Sin datos suficientes para análisis`]
    }));

    // Gamification Progress
    const gamificationProgress = {
      bronze_progress: Math.min(100, (safeCompletionStats.total_responses / 10) * 100),
      silver_progress: Math.min(100, (safeCompletionStats.total_responses / 20) * 100),
      gold_progress: Math.min(100, (safeCompletionStats.total_responses / 30) * 100),
      platinum_progress: Math.min(100, (safeCompletionStats.total_responses / 50) * 100),
      efficiency_goal_progress: Math.min(100, ((safeImprovementMetrics.efficiency_score || 0) / 7.5) * 100),
      quality_goal_progress: Math.min(100, ((safeImprovementMetrics.satisfaction_score || 0) / 7.5) * 100),
      productivity_goal_progress: Math.min(100, ((safeImprovementMetrics.productivity_score || 0) / 8.0) * 100),
      next_badge_responses_needed: achievements.participation_badges.platinum ? 0 :
        achievements.participation_badges.gold ? 50 - safeCompletionStats.total_responses :
        achievements.participation_badges.silver ? 30 - safeCompletionStats.total_responses :
        achievements.participation_badges.bronze ? 20 - safeCompletionStats.total_responses : 10 - safeCompletionStats.total_responses
    };

    // Predictive insights (simplified)
    const predictiveInsights = {
      monthly_improvement_rate: 2.5, // Simplified
      projected_score_next_month: (safeImprovementMetrics.satisfaction_score || 5) + 0.1,
      estimated_days_to_excellence: (safeImprovementMetrics.satisfaction_score || 0) >= 8 ? 0 : 30,
      participation_velocity: safeCompletionStats.total_responses / 30
    };

    // Quick wins
    const quickWins = [
      {
        title: 'Mejorar: Participación del equipo',
        impact: 'Alto',
        effort: 'Bajo',
        description: 'Incrementar la participación en encuestas para obtener datos más precisos',
        category: 'ENGAGEMENT',
        estimated_improvement: 2
      }
    ];

    // Recent achievements
    const recentAchievements = [];
    if (achievements.participation_badges.bronze) {
      recentAchievements.push({
        type: 'participation',
        title: 'Bronze Badge Alcanzado',
        description: 'Buena participación del equipo alcanzada',
        date: new Date().toISOString(),
        impact: 'medium'
      });
    }

    // Data stories
    const dataStories = [
      {
        title: 'Inicio del Sistema de Retroalimentación',
        narrative: `El sistema de retroalimentación está activo con ${safeCompletionStats.total_responses} respuestas recopiladas. ${isUsingSupabase ? 'Datos almacenados en Supabase para acceso remoto.' : 'Datos almacenados localmente en SQLite.'}`,
        trend: 'positive',
        key_metrics: {
          before: '0',
          after: safeCompletionStats.total_responses.toString(),
          change: `+${safeCompletionStats.total_responses}`
        }
      }
    ];

    // Operational insights
    const operationalInsights = {
      total_responses: safeCompletionStats.total_responses,
      participation_rate: safeCompletionStats.total_responses > 15 ? 'HIGH' : safeCompletionStats.total_responses > 8 ? 'MODERATE' : 'LOW',
      avg_completion_time: Math.round(safeCompletionStats.avg_response_time || 0),
      manager_participation: safeCompletionStats.manager_responses,
      sales_participation: safeCompletionStats.sales_responses,
      data_confidence: safeCompletionStats.total_responses > 20 ? 'HIGH' : safeCompletionStats.total_responses > 10 ? 'MODERATE' : 'LIMITED',
      database_type: isUsingSupabase ? 'Supabase (Remote)' : 'SQLite (Local)'
    };

    // Metric explanations
    const metricExplanations = {
      overall_health_score: {
        description: "Promedio general de todas las evaluaciones del sistema",
        calculation: "Promedio de puntuaciones de satisfacción",
        good_range: "7.0-10.0",
        action_needed: "< 6.0"
      },
      efficiency_index: {
        description: "Mide qué tan eficientemente el equipo puede completar sus tareas",
        calculation: "Promedio de respuestas relacionadas con eficiencia",
        good_range: "7.5-10.0",
        action_needed: "< 6.0"
      },
      database_connection: {
        description: `Usando ${isUsingSupabase ? 'Supabase (PostgreSQL remoto)' : 'SQLite (Base de datos local)'}`,
        calculation: "Configurado via variable de entorno DATABASE_TYPE",
        good_range: "Conexión estable",
        action_needed: "Errores de conexión"
      }
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
      processIssues: [], // Simplified for now
      efficiencyMetrics,
      performanceTrends,
      achievements,
      progressMetrics,
      actionableInsights,
      teamInsights,
      metricExplanations,
      gamificationProgress,
      predictiveInsights,
      quickWins,
      recentAchievements,
      dataStories,
      insights: {
        topConcern: 'Sistema funcionando correctamente',
        improvementArea: sectionPerformance[0]?.section || 'Sistema estable',
        strongestArea: sectionPerformance[sectionPerformance.length - 1]?.section || 'Rendimiento general',
        motivationalMessage: safeCompletionStats.total_responses > 0
          ? `¡Excelente! Se han recopilado ${safeCompletionStats.total_responses} respuestas del equipo.`
          : 'Sistema listo para recopilar retroalimentación del equipo.',
        nextMilestone: `Próxima meta: Alcanzar ${gamificationProgress.next_badge_responses_needed} respuestas más para el siguiente badge`,
        teamStrength: efficiencyMetrics.reduce((prev, current) =>
          prev.performance_score > current.performance_score ? prev : current, efficiencyMetrics[0] || {})?.team || 'Ambos equipos',
        databaseStatus: `✅ Conectado a ${isUsingSupabase ? 'Supabase (remoto)' : 'SQLite (local)'}`
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to load analytics data',
        details: error instanceof Error ? error.message : 'Unknown error',
        databaseType: isUsingSupabase ? 'Supabase' : 'SQLite'
      },
      { status: 500 }
    );
  }
}