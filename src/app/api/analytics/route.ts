import { NextResponse } from 'next/server';
import { databaseAdapter, isUsingSupabase } from '@/lib/database-adapter';

interface ProcessIssue {
  section: string;
  question_text: string;
  severity_score: number;
  frequency: number;
  issue_category: string;
}

interface TeamStat {
  team: string;
  responses: number;
  total_score: number;
  completion_times: number[];
  low_scores: number;
  high_scores: number;
}

interface MonthlyStat {
  month: string;
  responses: number;
  total_performance: number;
  completion_times: number[];
  issues: number;
}

interface SectionStat {
  section: string;
  total_score: number;
  count: number;
  responses: Set<number>;
  low_scores: number;
  high_scores: number;
}

// Professional analytics insights specifically for coordinators and advisors
interface ProfessionalInsight {
  category: 'CRITICAL' | 'OPPORTUNITY' | 'SUCCESS' | 'RECOMMENDATION';
  title: string;
  description: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  actionRequired: boolean;
  metrics?: { [key: string]: number | string };
}

interface BusinessMetrics {
  systemEfficiency: {
    workflowEffectiveness: number;
    processOptimization: number;
    taskCompletion: number;
  };
  operationalEfficiency: {
    adminTimeRatio: number;
    systemComplexity: number;
    workflowEfficiency: number;
  };
  teamPerformance: {
    managerEffectiveness: number;
    salesProductivity: number;
    collaborationQuality: number;
  };
}

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

    // Enhanced Analytics - Get detailed survey and response data
    const detailedAnalytics = await getDetailedAnalytics();

    // Enhanced system health indicators based on real data
    const systemHealth = {
      overall_health_score: Math.round((safeImprovementMetrics.satisfaction_score || 5) * 10) / 10,
      efficiency_index: Math.round((safeImprovementMetrics.efficiency_score || 5) * 10) / 10,
      productivity_score: Math.round((safeImprovementMetrics.productivity_score || 5) * 10) / 10,
      critical_failure_rate: detailedAnalytics.criticalIssues.length,
      excellence_indicators: detailedAnalytics.excellenceAreas.length,
      health_status: (safeImprovementMetrics.satisfaction_score || 0) >= 7.5 ? 'Excelente' :
                    (safeImprovementMetrics.satisfaction_score || 0) >= 6 ? 'Bueno' :
                    (safeImprovementMetrics.satisfaction_score || 0) >= 4 ? 'Mejorable' : 'Requiere atención',
      trend_direction: detailedAnalytics.trendDirection
    };

    // Enhanced section performance based on real data
    const sectionPerformance = detailedAnalytics.sectionPerformance.length > 0
      ? detailedAnalytics.sectionPerformance
      : [
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

    // Enhanced efficiency metrics by team with real data analysis
    const efficiencyMetrics = detailedAnalytics.teamAnalysis.length > 0
      ? detailedAnalytics.teamAnalysis
      : [
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

    // Enhanced performance trends with historical data
    const performanceTrends = detailedAnalytics.performanceTrends.length > 0
      ? detailedAnalytics.performanceTrends
      : [
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

    // Enhanced Actionable Insights based on real data analysis
    const actionableInsights = generateActionableInsights(
      safeCompletionStats,
      safeImprovementMetrics,
      detailedAnalytics
    );

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
        narrative: `El sistema de retroalimentación está activo con ${safeCompletionStats.total_responses} respuestas recopiladas.`,
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
      data_confidence: safeCompletionStats.total_responses > 20 ? 'HIGH' : safeCompletionStats.total_responses > 10 ? 'MODERATE' : 'LIMITED'
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
      processIssues: detailedAnalytics.processIssues,
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
      // PROFESSIONAL ANALYTICS - Nuevas métricas para coordinadores y asesores
      businessMetrics: detailedAnalytics.businessMetrics,
      criticalIssues: detailedAnalytics.criticalIssues,
      excellenceAreas: detailedAnalytics.excellenceAreas,
      insights: {
        topConcern: detailedAnalytics.criticalIssues.length > 0
          ? `${detailedAnalytics.criticalIssues.length} problema(s) crítico(s) identificado(s)`
          : 'Sistema funcionando correctamente',
        improvementArea: sectionPerformance[0]?.section || 'Sistema estable',
        strongestArea: sectionPerformance[sectionPerformance.length - 1]?.section || 'Rendimiento general',
        motivationalMessage: safeCompletionStats.total_responses > 0
          ? `¡Excelente! Se han recopilado ${safeCompletionStats.total_responses} respuestas del equipo.`
          : 'Sistema listo para recopilar retroalimentación del equipo.',
        nextMilestone: `Próxima meta: Alcanzar ${gamificationProgress.next_badge_responses_needed} respuestas más para el siguiente badge`,
        teamStrength: efficiencyMetrics.reduce((prev, current) =>
          prev.performance_score > current.performance_score ? prev : current, efficiencyMetrics[0] || {})?.team || 'Ambos equipos'
      }
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

// PROFESSIONAL Analytics Function - Designed for coordinators and advisors
async function getDetailedAnalytics() {
  if (!isUsingSupabase) {
    // For SQLite, return basic structure
    return {
      sectionPerformance: [],
      teamAnalysis: [],
      performanceTrends: [],
      processIssues: [],
      criticalIssues: [],
      excellenceAreas: [],
      trendDirection: 'Estable',
      businessMetrics: {} as BusinessMetrics
    };
  }

  try {
    const { supabase } = await import('@/lib/supabase');
    
    // Get all responses with answers (real data), regardless of completion status
    const { data: responses, error: responsesError } = await supabase
      .from('responses')
      .select(`
        *,
        surveys(id, name, target_role),
        answers(
          *,
          questions(id, section, question_text, analysis_tags, question_type, options)
        )
      `);

    // Filter to only include responses that have actual answers
    const responsesWithData = responses?.filter(r => r.answers && r.answers.length > 0) || [];

    if (responsesError) throw responsesError;

    if (!responsesWithData || responsesWithData.length === 0) {
      return {
        sectionPerformance: [],
        teamAnalysis: [],
        performanceTrends: [],
        processIssues: [],
        criticalIssues: [],
        excellenceAreas: [],
        trendDirection: 'Sin datos',
        businessMetrics: {
          systemEfficiency: { workflowEffectiveness: 0, processOptimization: 0, taskCompletion: 0 },
          operationalEfficiency: { adminTimeRatio: 0, systemComplexity: 0, workflowEfficiency: 0 },
          teamPerformance: { managerEffectiveness: 0, salesProductivity: 0, collaborationQuality: 0 }
        }
      };
    }

    // Professional Analysis Categories
    const sectionStats = new Map();
    const teamStats = new Map();
    const monthlyStats = new Map();
    const processIssues: ProcessIssue[] = [];
    const businessMetrics: BusinessMetrics = {
      systemEfficiency: { workflowEffectiveness: 0, processOptimization: 0, taskCompletion: 0 },
      operationalEfficiency: { adminTimeRatio: 0, systemComplexity: 0, workflowEfficiency: 0 },
      teamPerformance: { managerEffectiveness: 0, salesProductivity: 0, collaborationQuality: 0 }
    };
    
    // Real Business Metrics Tracking from Survey Data
    let totalEffectivenessAnswers = 0;
    let totalProcessAnswers = 0;
    let totalTimeAllocationAnswers = 0;
    let totalSystemComplexityAnswers = 0;
    let totalManagerEffectivenessAnswers = 0;
    let totalSalesProductivityAnswers = 0;
    let totalCollaborationAnswers = 0;

    // Debug counters
    let debugCounts = {
      totalAnswers: 0,
      likertAnswers: 0,
      percentageAnswers: 0,
      multipleChoiceAnswers: 0,
      timeAllocationFound: 0,
      toolCountFound: 0
    };

    responsesWithData.forEach(response => {
      const role = response.surveys?.target_role || 'unknown';
      const month = new Date(response.completed_at!).toISOString().slice(0, 7);
      
      // Initialize team stats
      if (!teamStats.has(role)) {
        teamStats.set(role, {
          team: role,
          responses: 0,
          total_score: 0,
          completion_times: [],
          low_scores: 0,
          high_scores: 0,
          critical_pain_points: 0,
          workflow_efficiency: 0,
          collaboration_score: 0
        } as TeamStat & { critical_pain_points: number, workflow_efficiency: number, collaboration_score: number });
      }

      // Initialize monthly stats
      if (!monthlyStats.has(month)) {
        monthlyStats.set(month, {
          month,
          responses: 0,
          total_performance: 0,
          completion_times: [],
          issues: 0,
          business_impact: 0
        } as MonthlyStat & { business_impact: number });
      }

      const teamStat = teamStats.get(role)!;
      const monthlyStat = monthlyStats.get(month)!;
      
      teamStat.responses++;
      monthlyStat.responses++;
      
      if (response.response_time_seconds) {
        teamStat.completion_times.push(response.response_time_seconds);
        monthlyStat.completion_times.push(response.response_time_seconds);
      }

      // Professional Analysis of Answers
      if (response.answers && Array.isArray(response.answers)) {
        response.answers.forEach((answer: any) => {
          const question = answer.questions;
          if (!question) return;

          debugCounts.totalAnswers++;

          const section = question.section;
          const score = answer.answer_numeric;
          const textAnswer = answer.answer_value;
          const tags = question.analysis_tags || '';
          const questionText = question.question_text;
          const questionType = question.question_type;

          // Debug logging for key questions
          if (questionType === 'percentage' && tags.includes('time_allocation')) {
            debugCounts.timeAllocationFound++;
            console.log('Found time allocation question:', questionText, 'Answer:', textAnswer);
          }
          if (questionType === 'multiple_choice' && tags.includes('tool_count')) {
            debugCounts.toolCountFound++;
            console.log('Found tool count question:', questionText, 'Answer:', textAnswer);
          }
          
          // Initialize section stats
          if (!sectionStats.has(section)) {
            sectionStats.set(section, {
              section,
              total_score: 0,
              count: 0,
              responses: new Set(),
              low_scores: 0,
              high_scores: 0,
              critical_issues: 0,
              business_impact_score: 0
            } as SectionStat & { critical_issues: number, business_impact_score: number });
          }

          const sectionStat = sectionStats.get(section)!;

          // NUMERIC ANALYSIS
          if (score !== null) {
            sectionStat.total_score += score;
            sectionStat.count++;
            sectionStat.responses.add(response.id);
            
            teamStat.total_score += score;
            monthlyStat.total_performance += score;

          // CORRECTED SURVEY DATA ANALYSIS - Only use appropriate question types
          const lowerTags = tags.toLowerCase();
          const questionLower = questionText.toLowerCase();
          
          // Only process LIKERT scale questions (1-10) for numeric metrics
          if (questionType === 'likert' && score !== null) {
            debugCounts.likertAnswers++;
            
            // System Effectiveness Analysis - Only from Likert questions
            if (lowerTags.includes('effectiveness') || lowerTags.includes('alignment') ||
                lowerTags.includes('enrollment_support') || lowerTags.includes('lead_tracking_confidence') ||
                questionLower.includes('efectiv') || questionLower.includes('apoyo')) {
              businessMetrics.systemEfficiency.workflowEffectiveness += score;
              totalEffectivenessAnswers++;
              if (score <= 3) {
                sectionStat.critical_issues++;
                teamStat.critical_pain_points++;
              }
            }

            // Process Optimization - Only from Likert scale questions about data quality
            if (lowerTags.includes('data_quality') || lowerTags.includes('data_confidence') ||
                lowerTags.includes('excel_impact') || lowerTags.includes('automation_effectiveness')) {
              businessMetrics.systemEfficiency.processOptimization += score;
              totalProcessAnswers++;
            }

            // Manager Effectiveness - Only from relevant Likert questions
            if (lowerTags.includes('performance_monitoring') || lowerTags.includes('coaching_data') ||
                lowerTags.includes('visibility') || questionLower.includes('monitorear')) {
              businessMetrics.teamPerformance.managerEffectiveness += score;
              totalManagerEffectivenessAnswers++;
            }

            // Sales Productivity - From information accessibility and call preparation
            if (lowerTags.includes('information_accessibility') || lowerTags.includes('call_preparation') ||
                lowerTags.includes('interaction_quality') || lowerTags.includes('personalization')) {
              businessMetrics.teamPerformance.salesProductivity += score;
              totalSalesProductivityAnswers++;
              teamStat.workflow_efficiency += score;
            }

            // Collaboration Quality - From sharing and coordination questions
            if (lowerTags.includes('information_sharing') || lowerTags.includes('collaboration') ||
                lowerTags.includes('handoff_quality') || lowerTags.includes('team_coordination')) {
              businessMetrics.teamPerformance.collaborationQuality += score;
              totalCollaborationAnswers++;
              teamStat.collaboration_score += score;
            }
          }
            
            }
            
            // Handle PERCENTAGE questions for time allocation (separate from Likert processing)
            if (questionType === 'percentage' && textAnswer) {
              debugCounts.percentageAnswers++;
              console.log('Processing percentage question with tags:', tags);
              const lowerTags = tags.toLowerCase();
              if (lowerTags.includes('time_allocation') || lowerTags.includes('admin_burden')) {
                // Parse percentage data for time allocation metrics
                try {
                  const percentageData = JSON.parse(textAnswer);
                  if (percentageData && typeof percentageData === 'object') {
                    console.log('Parsing percentage data:', percentageData);
                    
                    // Handle the actual data format we're receiving
                    const dataEntryTime = percentageData['Data Entry'] || 0;
                    const ventaTime = percentageData['Venta'] || percentageData['Sales'] || 0;
                    const adminTime = percentageData['Admin'] || dataEntryTime; // Data Entry is admin time
                    
                    // Calculate sales time efficiency (what % is actual sales vs admin work)
                    const totalProductiveTime = ventaTime + adminTime;
                    if (totalProductiveTime > 0) {
                      const salesEfficiency = ventaTime / totalProductiveTime;
                      // Convert to 1-10 scale (higher sales % = better efficiency)
                      businessMetrics.operationalEfficiency.adminTimeRatio += salesEfficiency * 10;
                      totalTimeAllocationAnswers++;
                      console.log(`Sales efficiency calculated: ${salesEfficiency * 10} (${ventaTime}% sales vs ${adminTime}% admin)`);
                    }
                  }
                } catch (e) {
                  console.log('Error parsing percentage data:', e);
                }
              }
            }
            
            // Handle MULTIPLE CHOICE questions appropriately
            if (questionType === 'multiple_choice' && textAnswer) {
              debugCounts.multipleChoiceAnswers++;
              console.log('Processing multiple choice question with tags:', tags);
              const lowerTags = tags.toLowerCase();
              if (lowerTags.includes('tool_count') || lowerTags.includes('system_complexity')) {
                // Convert tool count to simplicity score (fewer tools = simpler = better)
                let simplicityScore = 5; // default
                if (textAnswer.includes('1-2')) simplicityScore = 9;
                else if (textAnswer.includes('3-4')) simplicityScore = 7;
                else if (textAnswer.includes('5-6')) simplicityScore = 5;
                else if (textAnswer.includes('7-8')) simplicityScore = 3;
                else if (textAnswer.includes('9+')) simplicityScore = 1;
                
                businessMetrics.operationalEfficiency.systemComplexity += simplicityScore;
                totalSystemComplexityAnswers++;
                console.log(`Tool complexity calculated: ${simplicityScore} for answer: ${textAnswer}`);
              }

            // Critical Issue Identification
            if (score <= 3) {
              sectionStat.low_scores++;
              teamStat.low_scores++;
              monthlyStat.issues++;
              
              // Critical business issues
              if (score <= 2) {
                let issueCategory = 'LOW_SATISFACTION';
                if (tags.includes('revenue_impact')) issueCategory = 'REVENUE_CRITICAL';
                else if (tags.includes('time_efficiency')) issueCategory = 'PRODUCTIVITY_CRITICAL';
                else if (tags.includes('system_reliability')) issueCategory = 'SYSTEM_CRITICAL';
                
                processIssues.push({
                  section,
                  question_text: questionText,
                  severity_score: score,
                  frequency: 1,
                  issue_category: issueCategory
                });
              }
            } else if (score >= 8) {
              sectionStat.high_scores++;
              teamStat.high_scores++;
            }

            // Business Impact Score
            if (tags.includes('revenue_impact') || tags.includes('productivity') || tags.includes('efficiency')) {
              sectionStat.business_impact_score += score;
              monthlyStat.business_impact += score;
            }
          }

          // TEXT ANALYSIS for additional insights
          if (textAnswer && textAnswer.length > 10) {
            const lowerText = textAnswer.toLowerCase();
            
            // Look for critical keywords that indicate serious issues
            const criticalKeywords = ['imposible', 'nunca', 'terrible', 'pérdida', 'frustración', 'problema', 'falla'];
            const hasCtiticalKeywords = criticalKeywords.some(keyword => lowerText.includes(keyword));
            
            if (hasCtiticalKeywords) {
              processIssues.push({
                section,
                question_text: questionText,
                severity_score: 1,
                frequency: 1,
                issue_category: 'TEXT_CRITICAL'
              });
            }
          }
        });
      }
    });

    // Calculate final business metrics averages from real survey data
    if (totalEffectivenessAnswers > 0) businessMetrics.systemEfficiency.workflowEffectiveness /= totalEffectivenessAnswers;
    if (totalProcessAnswers > 0) businessMetrics.systemEfficiency.processOptimization /= totalProcessAnswers;
    if (totalTimeAllocationAnswers > 0) businessMetrics.operationalEfficiency.adminTimeRatio /= totalTimeAllocationAnswers;
    if (totalSystemComplexityAnswers > 0) businessMetrics.operationalEfficiency.systemComplexity /= totalSystemComplexityAnswers;
    if (totalManagerEffectivenessAnswers > 0) businessMetrics.teamPerformance.managerEffectiveness /= totalManagerEffectivenessAnswers;
    if (totalSalesProductivityAnswers > 0) businessMetrics.teamPerformance.salesProductivity /= totalSalesProductivityAnswers;
    if (totalCollaborationAnswers > 0) businessMetrics.teamPerformance.collaborationQuality /= totalCollaborationAnswers;

    // Calculate workflow efficiency for operational metrics
    if (totalSalesProductivityAnswers > 0) {
      businessMetrics.operationalEfficiency.workflowEfficiency = businessMetrics.teamPerformance.salesProductivity;
    }

    // Calculate task completion score based on overall performance
    const allScores = [
      businessMetrics.systemEfficiency.workflowEffectiveness,
      businessMetrics.operationalEfficiency.workflowEfficiency,
      businessMetrics.teamPerformance.managerEffectiveness,
      businessMetrics.teamPerformance.salesProductivity
    ].filter(score => score > 0);
    
    if (allScores.length > 0) {
      businessMetrics.systemEfficiency.taskCompletion = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;
    }

    // Additional admission-specific calculations
    // Calculate admission process efficiency from workflow questions
    let admissionProcessScore = 0;
    let admissionQuestionCount = 0;
    
    responsesWithData.forEach(response => {
      if (response.answers && Array.isArray(response.answers)) {
        response.answers.forEach((answer: any) => {
          const question = answer.questions;
          const tags = question?.analysis_tags || '';
          const score = answer.answer_numeric;
          
          // Admission-specific workflow questions
          if (score !== null && (
            tags.includes('lead_management') ||
            tags.includes('conversion') ||
            tags.includes('sales_process') ||
            tags.includes('follow_up')
          )) {
            admissionProcessScore += score;
            admissionQuestionCount++;
          }
        });
      }
    });

    // Override workflow effectiveness with admission-specific calculation if available
    if (admissionQuestionCount > 0) {
      businessMetrics.systemEfficiency.workflowEffectiveness = admissionProcessScore / admissionQuestionCount;
    }

    // Convert to arrays and calculate comprehensive metrics
    const sectionPerformance = Array.from(sectionStats.values()).map(stat => ({
      section: stat.section,
      avg_score: Math.round((stat.total_score / Math.max(stat.count, 1)) * 10) / 10,
      response_count: stat.responses.size,
      problem_indicators: stat.low_scores,
      confidence_level: stat.count > 10 ? 8.5 : stat.count > 5 ? 7.0 : 5.0,
      business_impact: Math.round((stat.business_impact_score / Math.max(stat.count, 1)) * 10) / 10,
      critical_issues: stat.critical_issues
    })).sort((a, b) => a.avg_score - b.avg_score);

    const teamAnalysis = Array.from(teamStats.values()).map(stat => ({
      team: stat.team,
      performance_score: stat.responses > 0 ? Math.round((stat.total_score / (stat.responses * 10)) * 100) / 10 : 0,
      pain_points: stat.low_scores,
      strengths: stat.high_scores,
      sample_size: stat.responses,
      avg_completion_time: stat.completion_times.length > 0
        ? Math.round(stat.completion_times.reduce((a: number, b: number) => a + b, 0) / stat.completion_times.length)
        : 0,
      critical_pain_points: stat.critical_pain_points,
      workflow_efficiency: stat.workflow_efficiency / Math.max(stat.responses, 1),
      collaboration_quality: stat.collaboration_score / Math.max(stat.responses, 1)
    }));

    const performanceTrends = Array.from(monthlyStats.values())
      .sort((a, b) => a.month.localeCompare(b.month))
      .map(stat => ({
        month: stat.month,
        avg_performance: stat.responses > 0 ? Math.round((stat.total_performance / (stat.responses * 10)) * 100) / 10 : 0,
        response_count: stat.responses,
        issues_reported: stat.issues,
        avg_completion_time: stat.completion_times.length > 0
          ? Math.round(stat.completion_times.reduce((a: number, b: number) => a + b, 0) / stat.completion_times.length)
          : 0,
        business_impact: stat.business_impact / Math.max(stat.responses, 1)
      }));

    // Identify critical issues and excellence areas
    const criticalIssues = processIssues.filter(issue =>
      issue.severity_score <= 2 || issue.issue_category.includes('CRITICAL')
    ).slice(0, 5);
    
    const excellenceAreas = sectionPerformance.filter(section => section.avg_score >= 8);
    
    // Determine trend direction
    let trendDirection = 'Estable';
    if (performanceTrends.length > 1) {
      const recent = performanceTrends[performanceTrends.length - 1];
      const previous = performanceTrends[performanceTrends.length - 2];
      if (recent.avg_performance > previous.avg_performance + 0.5) {
        trendDirection = 'Mejorando';
      } else if (recent.avg_performance < previous.avg_performance - 0.5) {
        trendDirection = 'Declinando';
      }
    }

    return {
      sectionPerformance,
      teamAnalysis,
      performanceTrends,
      processIssues: processIssues.slice(0, 10),
      criticalIssues,
      excellenceAreas,
      trendDirection,
      businessMetrics
    };

  } catch (error) {
    console.error('Error in professional analytics:', error);
    return {
      sectionPerformance: [],
      teamAnalysis: [],
      performanceTrends: [],
      processIssues: [],
      criticalIssues: [],
      excellenceAreas: [],
      trendDirection: 'Error',
      businessMetrics: {
        systemEfficiency: { workflowEffectiveness: 0, processOptimization: 0, taskCompletion: 0 },
        operationalEfficiency: { adminTimeRatio: 0, systemComplexity: 0, workflowEfficiency: 0 },
        teamPerformance: { managerEffectiveness: 0, salesProductivity: 0, collaborationQuality: 0 }
      }
    };
  }
}

// Generate actionable insights based on real data
function generateActionableInsights(completionStats: any, improvementMetrics: any, detailedAnalytics: any) {
  const insights = {
    immediate_actions: [] as string[],
    strategic_recommendations: [] as string[],
    celebration_worthy: [] as string[],
    improvement_opportunities: [] as string[]
  };

  // Celebrate achievements
  if (completionStats.total_responses > 0) {
    insights.celebration_worthy.push(
      `¡Excelente! Se han recopilado ${completionStats.total_responses} respuestas del equipo`
    );
  }

  if (detailedAnalytics.excellenceAreas.length > 0) {
    insights.celebration_worthy.push(
      `${detailedAnalytics.excellenceAreas.length} área(s) con excelente rendimiento (8+/10)`
    );
  }

  // Identify improvement opportunities
  if (detailedAnalytics.criticalIssues.length > 0) {
    insights.immediate_actions.push(
      `Atender urgentemente ${detailedAnalytics.criticalIssues.length} problema(s) crítico(s) identificado(s)`
    );
  }

  if (completionStats.total_responses < 10) {
    insights.improvement_opportunities.push(
      "Aumentar la participación del equipo en las encuestas para obtener datos más representativos"
    );
  }

  // Team-specific insights
  if (detailedAnalytics.teamAnalysis.length > 0) {
    detailedAnalytics.teamAnalysis.forEach((team: any) => {
      if (team.pain_points > team.strengths) {
        insights.strategic_recommendations.push(
          `Equipo ${team.team}: Enfocar en resolver ${team.pain_points} área(s) problemática(s)`
        );
      }
    });
  }

  // Performance trends
  if (detailedAnalytics.trendDirection === 'Declinando') {
    insights.immediate_actions.push(
      "El rendimiento está declinando - investigar causas y implementar mejoras"
    );
  } else if (detailedAnalytics.trendDirection === 'Mejorando') {
    insights.celebration_worthy.push(
      "Tendencia positiva de mejora en el rendimiento del equipo"
    );
  }

  // Section-specific recommendations
  if (detailedAnalytics.sectionPerformance.length > 0) {
    const lowestSection = detailedAnalytics.sectionPerformance[0];
    if (lowestSection.avg_score < 6) {
      insights.strategic_recommendations.push(
        `Priorizar mejoras en "${lowestSection.section}" (puntuación: ${lowestSection.avg_score}/10)`
      );
    }
  }

  return insights;
}