'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import {
  TrendingUp, TrendingDown, Users, AlertTriangle, Download, RefreshCw, Target, Clock, Activity, CheckCircle,
  Award, Trophy, Star, Zap, Lightbulb, Heart, Rocket, Crown, Medal,
  Info, HelpCircle, ChevronRight, ThumbsUp, Flag, BarChart3
} from 'lucide-react';

interface AnalyticsData {
  summary: {
    total_responses: number;
    participation_rate: string;
    avg_completion_time: number;
    manager_participation: number;
    sales_participation: number;
    data_confidence: string;
    systemHealth: number;
    criticalIssues: number;
    lastUpdated: string;
    healthStatus: string;
    trendDirection: string;
  };
  systemHealth: {
    overall_health_score: number;
    efficiency_index: number;
    data_reliability: number;
    user_productivity: number;
    lead_management_score: number;
    critical_failure_rate: number;
    excellence_indicators: number;
    health_status: string;
    trend_direction: string;
  };
  achievements: {
    participation_badges: {
      bronze: boolean;
      silver: boolean;
      gold: boolean;
      platinum: boolean;
    };
    quality_badges: {
      data_quality_expert: boolean;
      efficiency_champion: boolean;
      productivity_master: boolean;
      lead_conversion_pro: boolean;
    };
    improvement_badges: {
      problem_solver: boolean;
      growth_catalyst: boolean;
      engagement_booster: boolean;
    };
  };
  progressMetrics: {
    overall_improvement: boolean;
    improvement_percentage: number;
    issues_resolved: number;
    participation_growth: number;
    excellence_areas: number;
    team_engagement_level: string;
  };
  actionableInsights: {
    immediate_actions: string[];
    strategic_recommendations: string[];
    celebration_worthy: string[];
    improvement_opportunities: string[];
  };
  teamInsights: Array<{
    team: string;
    insights: string[];
  }>;
  metricExplanations: {
    [key: string]: {
      description: string;
      calculation: string;
      good_range: string;
      action_needed: string;
      target?: string;
    };
  };
  sectionPerformance: Array<{
    section: string;
    avg_score: number;
    response_count: number;
    problem_indicators: number;
    confidence_level: number;
  }>;
  processIssues: Array<{
    section: string;
    question_text: string;
    severity_score: number;
    frequency: number;
    issue_category: string;
  }>;
  efficiencyMetrics: Array<{
    team: string;
    performance_score: number;
    pain_points: number;
    strengths: number;
    sample_size: number;
    avg_completion_time: number;
  }>;
  performanceTrends: Array<{
    month: string;
    avg_performance: number;
    response_count: number;
    issues_reported: number;
  }>;
  quickWins?: Array<{
    title: string;
    impact: string;
    effort: string;
    description: string;
    category: string;
    estimated_improvement: number;
  }>;
  insights: {
    topConcern: string;
    improvementArea: string;
    strongestArea: string;
    motivationalMessage: string;
    nextMilestone: string;
    teamStrength: string;
  };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/analytics');
      if (!response.ok) throw new Error('Failed to load analytics');
      const analyticsData = await response.json();
      setData(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleExportData = () => {
    if (!data) return;
    const exportData = {
      generated: new Date().toISOString(),
      summary: data.summary,
      systemHealth: data.systemHealth,
      topIssues: data.processIssues.slice(0, 5),
      insights: data.insights
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eduscore-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-gray-900';
    if (score >= 5) return 'text-gray-700';
    return 'text-gray-600';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'EFFICIENCY': return 'bg-gray-100 text-gray-800';
      case 'DATA_QUALITY': return 'bg-gray-100 text-gray-800';
      case 'LEAD_MANAGEMENT': return 'bg-gray-100 text-gray-800';
      case 'PRODUCTIVITY': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return '0m';
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-500" />
            <p className="text-gray-600">Cargando análisis...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Error al cargar analytics: {error || 'Sin datos disponibles'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Analytics</h1>
            <p className="text-gray-600 mt-1">
              {data.summary.total_responses} respuestas • {data.summary.healthStatus} • 
              {data.summary.participation_rate === 'HIGH' ? 'Alta' : data.summary.participation_rate === 'MODERATE' ? 'Media' : 'Baja'} participación
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" onClick={loadAnalytics} disabled={loading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
            <Button size="sm" onClick={handleExportData} className="bg-gray-900 hover:bg-gray-800">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Salud del Sistema</p>
                  <p className={`text-2xl font-bold ${getScoreColor(data.systemHealth.overall_health_score)}`}>
                    {data.systemHealth.overall_health_score}/10
                  </p>
                  <p className="text-xs text-gray-500">{data.systemHealth.health_status}</p>
                </div>
                <Target className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Eficiencia</p>
                  <p className={`text-2xl font-bold ${getScoreColor(data.systemHealth.efficiency_index)}`}>
                    {data.systemHealth.efficiency_index}/10
                  </p>
                  <p className="text-xs text-gray-500">Productividad</p>
                </div>
                <Activity className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Problemas Críticos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.systemHealth.critical_failure_rate}
                  </p>
                  <p className="text-xs text-gray-500">Requieren atención</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Participación</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {data.summary.total_responses}
                  </p>
                  <p className="text-xs text-gray-500">{data.progressMetrics.team_engagement_level}</p>
                </div>
                <Users className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Alert */}
        {data.progressMetrics.overall_improvement && (
          <Alert className="mb-6 border-gray-200 bg-gray-50">
            <TrendingUp className="h-4 w-4 text-gray-600" />
            <AlertDescription className="text-gray-700">
              Sistema mejoró {data.progressMetrics.improvement_percentage}% vs período anterior.
              {data.progressMetrics.issues_resolved > 0 && ` ${data.progressMetrics.issues_resolved} problemas resueltos.`}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100">
            <TabsTrigger value="overview" className="text-gray-700">Vista General</TabsTrigger>
            <TabsTrigger value="issues" className="text-gray-700">Problemas</TabsTrigger>
            <TabsTrigger value="metrics" className="text-gray-700">Métricas</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance by Section */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Rendimiento por Sección</CardTitle>
                  <CardDescription className="text-gray-600">Puntuaciones promedio</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={data.sectionPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="section"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={11}
                        stroke="#6b7280"
                      />
                      <YAxis domain={[0, 10]} stroke="#6b7280" />
                      <Tooltip />
                      <Bar dataKey="avg_score" fill="#6b7280" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance Trends */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Tendencia de Rendimiento</CardTitle>
                  <CardDescription className="text-gray-600">Últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data.performanceTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" fontSize={11} stroke="#6b7280" />
                      <YAxis domain={[0, 10]} stroke="#6b7280" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="avg_performance"
                        stroke="#374151"
                        strokeWidth={2}
                        dot={{ fill: '#374151', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Team Analysis */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Análisis por Equipo</CardTitle>
                <CardDescription className="text-gray-600">Rendimiento y participación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.efficiencyMetrics.map((team, index) => (
                    <div key={index} className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                      <h4 className="font-semibold text-gray-900 mb-3 capitalize">
                        Equipo {team.team}
                      </h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Rendimiento:</span>
                          <span className={`font-bold ${getScoreColor(team.performance_score)}`}>
                            {team.performance_score.toFixed(1)}/10
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{team.strengths}</div>
                            <div className="text-gray-600">Fortalezas</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{team.pain_points}</div>
                            <div className="text-gray-600">Problemas</div>
                          </div>
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Respuestas:</span>
                          <span className="font-medium text-gray-900">{team.sample_size}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="space-y-6">
            {/* Critical Issues */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Problemas Críticos</CardTitle>
                <CardDescription className="text-gray-600">Requieren atención prioritaria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.processIssues.slice(0, 5).map((issue, index) => (
                    <div key={index} className="border border-gray-200 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs border-gray-300">
                            #{index + 1}
                          </Badge>
                          <Badge className={`text-xs ${getCategoryColor(issue.issue_category)}`}>
                            {issue.issue_category}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getScoreColor(issue.severity_score)}`}>
                            {issue.severity_score.toFixed(1)}/10
                          </div>
                          <p className="text-xs text-gray-500">{issue.frequency} reportes</p>
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-2">{issue.section}</h4>
                      <p className="text-sm text-gray-600">{issue.question_text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actionable Insights */}
            {data.actionableInsights.immediate_actions.length > 0 && (
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Acciones Recomendadas</CardTitle>
                  <CardDescription className="text-gray-600">Basadas en el análisis de datos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {data.actionableInsights.immediate_actions.map((action, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            {/* Metric Explanations */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Explicación de Métricas</CardTitle>
                <CardDescription className="text-gray-600">Cómo se calculan las puntuaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(data.metricExplanations).map(([key, explanation]) => (
                    <div key={key} className="border border-gray-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2 capitalize">
                        {key.replace(/_/g, ' ')}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="font-medium text-gray-700 mb-1">Descripción:</div>
                          <div className="text-gray-600 mb-3">{explanation.description}</div>
                          
                          <div className="font-medium text-gray-700 mb-1">Cálculo:</div>
                          <div className="text-gray-600 font-mono text-xs bg-gray-100 p-2 rounded">
                            {explanation.calculation}
                          </div>
                        </div>
                        
                        <div>
                          <div className="font-medium text-gray-700 mb-1">Rango Bueno:</div>
                          <div className="text-gray-900 font-medium mb-3">{explanation.good_range}</div>
                          
                          <div className="font-medium text-gray-700 mb-1">Requiere Acción:</div>
                          <div className="text-gray-900 font-medium">{explanation.action_needed}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm py-4 border-t border-gray-200">
          <p>
            Actualizado: {new Date(data.summary.lastUpdated).toLocaleString('es-ES')} • 
            Basado en {data.summary.total_responses} respuestas
          </p>
        </div>
      </div>
    </div>
  );
}