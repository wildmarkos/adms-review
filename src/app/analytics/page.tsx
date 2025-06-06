'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import {
  TrendingUp, TrendingDown, Users, AlertTriangle, Download, RefreshCw, Target, Clock, Activity, CheckCircle,
  Award, Trophy, Star, Zap, Lightbulb, Heart, Rocket, Crown, Medal, DollarSign, Brain, Gauge,
  Info, HelpCircle, ChevronRight, ThumbsUp, Flag, BarChart3, AlertCircle, TrendingDown as TrendDown,
  Building2, UserCheck, Briefcase, MessageSquare, FileText, Eye, ArrowUp, ArrowDown, Minus, Lock
} from 'lucide-react';

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
    data_reliability?: number;
    user_productivity?: number;
    lead_management_score?: number;
    critical_failure_rate: number;
    excellence_indicators: number;
    health_status: string;
    trend_direction: string;
  };
  businessMetrics: BusinessMetrics;
  criticalIssues: Array<{
    section: string;
    question_text: string;
    severity_score: number;
    frequency: number;
    issue_category: string;
  }>;
  excellenceAreas: Array<{
    section: string;
    avg_score: number;
    response_count: number;
    problem_indicators: number;
    confidence_level: number;
  }>;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if already authenticated (using localStorage)
  useEffect(() => {
    const authStatus = localStorage.getItem('analytics_auth');
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'uniat') {
      setIsAuthenticated(true);
      localStorage.setItem('analytics_auth', 'authenticated');
      setAuthError('');
      loadAnalytics();
    } else {
      setAuthError('Contraseña incorrecta');
    }
  };

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
    if (isAuthenticated) {
      loadAnalytics();
    }
  }, [isAuthenticated]);

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
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
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

  // Authentication screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Acceso a Analytics</CardTitle>
            <CardDescription>
              Ingresa la contraseña para acceder al dashboard de analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
              {authError && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Acceder
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Analytics</h1>
                <p className="text-gray-600 mb-4">
                  Sistema de monitoreo para coordinadores y asesores
                </p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${data.summary.total_responses > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                    <span className="font-medium">{data.summary.total_responses} respuestas recopiladas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>Gerentes: {data.summary.manager_participation} | Ventas: {data.summary.sales_participation}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>Actualizado: {new Date(data.summary.lastUpdated).toLocaleString('es-ES', {
                      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm" onClick={loadAnalytics} disabled={loading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
                <Button size="sm" onClick={handleExportData} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Reporte
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setIsAuthenticated(false);
                    localStorage.removeItem('analytics_auth');
                  }}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </div>

          {/* EXECUTIVE SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* System Effectiveness */}
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Proceso de Admisión</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {data.businessMetrics?.systemEfficiency?.workflowEffectiveness !== undefined ?
                        `${(data.businessMetrics.systemEfficiency.workflowEffectiveness * 10).toFixed(0)}%`
                        : `${(data.systemHealth.overall_health_score * 10).toFixed(0)}%`}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {data.businessMetrics?.systemEfficiency?.workflowEffectiveness > 0 ?
                        'Sistema apoya objetivos bien' : 'Pendiente datos de efectividad'}
                    </p>
                    <p className="text-xs text-green-600 font-medium mt-1">
                      ✓ Fortaleza clave del sistema
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Activity className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Salud del Sistema</p>
                    <p className={`text-2xl font-bold ${getScoreColor(data.systemHealth.overall_health_score)}`}>
                      {data.systemHealth.overall_health_score.toFixed(1)}/10
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{data.systemHealth.health_status}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Gauge className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical Issues */}
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Problemas Críticos</p>
                    <p className="text-2xl font-bold text-red-600">
                      {data.criticalIssues?.length || 0}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Requieren atención inmediata</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Team Performance */}
            <Card className="border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Coordinación de Equipos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {data.businessMetrics?.teamPerformance &&
                       (data.businessMetrics.teamPerformance.salesProductivity > 0 ||
                        data.businessMetrics.teamPerformance.collaborationQuality > 0) ?
                        Math.round(((data.businessMetrics.teamPerformance.salesProductivity || 0) +
                                   (data.businessMetrics.teamPerformance.collaborationQuality || 0)) / 2 * 10) / 10
                        : data.systemHealth.efficiency_index.toFixed(1)}/10
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {data.businessMetrics?.teamPerformance?.salesProductivity > 0 ?
                        'Acceso a info y colaboración' : 'Pendiente datos de equipos'}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MAIN ANALYTICS TABS */}
          <Tabs defaultValue="resumen" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
              <TabsTrigger value="resumen" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Resumen Simple
              </TabsTrigger>
              <TabsTrigger value="areas" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Áreas Principales
              </TabsTrigger>
              <TabsTrigger value="eficiencia" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Eficiencia del Equipo
              </TabsTrigger>
              <TabsTrigger value="recomendaciones" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Recomendaciones
              </TabsTrigger>
            </TabsList>

            <TabsContent value="resumen" className="space-y-6">
              {/* Simple Summary - Basic completion stats and response counts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      Participación
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          {data.summary.total_responses}
                        </div>
                        <p className="text-gray-700 text-sm font-medium">Respuestas Completadas</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-bold text-gray-900">{data.summary.manager_participation}</div>
                          <div className="text-gray-600">Gerentes</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-bold text-gray-900">{data.summary.sales_participation}</div>
                          <div className="text-gray-600">Ventas</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-green-600" />
                      Tiempo de Respuesta
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {Math.round(data.summary.avg_completion_time / 60)}m
                      </div>
                      <p className="text-gray-700 text-sm font-medium">Tiempo Promedio</p>
                      <p className="text-gray-500 text-xs mt-1">
                        {data.summary.avg_completion_time < 300 ? 'Muy eficiente' :
                         data.summary.avg_completion_time < 600 ? 'Eficiente' : 'Puede mejorar'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-purple-600" />
                      Estado General
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {data.systemHealth.overall_health_score.toFixed(1)}/10
                      </div>
                      <p className="text-gray-700 text-sm font-medium">Puntuación General</p>
                      <p className="text-gray-500 text-xs mt-1">{data.systemHealth.health_status}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Real Metrics from Survey Data */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-blue-600" />
                      Métricas del Proceso de Admisión
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Eficiencia de Ventas:</span>
                        <span className={`font-bold ${data.businessMetrics?.operationalEfficiency?.adminTimeRatio && data.businessMetrics.operationalEfficiency.adminTimeRatio > 0 ? 'text-blue-600' : 'text-gray-500'}`}>
                          {data.businessMetrics?.operationalEfficiency?.adminTimeRatio !== undefined && data.businessMetrics.operationalEfficiency.adminTimeRatio > 0 ?
                            `${(data.businessMetrics.operationalEfficiency.adminTimeRatio * 10).toFixed(0)}%` : 'Pendiente datos'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Simplicidad del Sistema:</span>
                        <span className={`font-bold ${data.businessMetrics?.operationalEfficiency?.systemComplexity && data.businessMetrics.operationalEfficiency.systemComplexity > 0 ? 'text-orange-600' : 'text-gray-500'}`}>
                          {data.businessMetrics?.operationalEfficiency?.systemComplexity !== undefined && data.businessMetrics.operationalEfficiency.systemComplexity > 0 ?
                            `${(data.businessMetrics.operationalEfficiency.systemComplexity * 10).toFixed(0)}%` : 'Pendiente datos'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Efectividad del Workflow:</span>
                        <span className={`font-bold ${data.businessMetrics?.systemEfficiency?.workflowEffectiveness && data.businessMetrics.systemEfficiency.workflowEffectiveness > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                          {data.businessMetrics?.systemEfficiency?.workflowEffectiveness !== undefined && data.businessMetrics.systemEfficiency.workflowEffectiveness > 0 ?
                            `${(data.businessMetrics.systemEfficiency.workflowEffectiveness * 10).toFixed(0)}%` : 'Pendiente datos'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-green-600" />
                      Próximos Pasos Basados en Datos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.summary.total_responses === 0 ? (
                        <>
                          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">1</div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">Iniciar Recopilación de Datos</p>
                              <p className="text-gray-600 text-xs">Dirigir a los equipos a completar las encuestas</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center font-bold">2</div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">Objetivo de Participación</p>
                              <p className="text-gray-600 text-xs">Meta: Al menos 10 respuestas por equipo</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {data.businessMetrics.operationalEfficiency.adminTimeRatio < 5 && data.businessMetrics.operationalEfficiency.adminTimeRatio > 0 && (
                            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                              <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">!</div>
                              <div>
                                <p className="font-medium text-orange-900 text-sm">Optimizar Distribución de Tiempo</p>
                                <p className="text-orange-700 text-xs">
                                  Eficiencia de ventas: {(data.businessMetrics.operationalEfficiency.adminTimeRatio * 10).toFixed(0)}% - Revisar balance admin/ventas
                                </p>
                              </div>
                            </div>
                          )}
                          {data.businessMetrics.operationalEfficiency.systemComplexity > 0 && data.businessMetrics.operationalEfficiency.systemComplexity < 8 && (
                            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                              <div className="w-6 h-6 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center font-bold">⚠</div>
                              <div>
                                <p className="font-medium text-yellow-900 text-sm">Simplificar Herramientas</p>
                                <p className="text-yellow-700 text-xs">
                                  Simplicidad: {(data.businessMetrics.operationalEfficiency.systemComplexity * 10).toFixed(0)}% - Considerar estandarización
                                </p>
                              </div>
                            </div>
                          )}
                          {data.businessMetrics.teamPerformance.salesProductivity > 7 && (
                            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                              <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">✓</div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">Buen Rendimiento</p>
                                <p className="text-gray-600 text-xs">Productividad: {(data.businessMetrics.teamPerformance.salesProductivity * 10).toFixed(0)}% - Mantener nivel</p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="areas" className="space-y-6">
              {/* Top Issues from Survey Responses */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Rendimiento por Área</CardTitle>
                    <CardDescription className="text-gray-600">Puntuaciones promedio de las secciones evaluadas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {data.sectionPerformance.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.sectionPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
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
                          <Tooltip
                            formatter={(value, name) => [`${value}/10`, 'Puntuación']}
                            labelFormatter={(label) => `Área: ${label}`}
                          />
                          <Bar dataKey="avg_score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-gray-500 mb-2">
                          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        </div>
                        <p className="text-gray-600">No hay datos suficientes para mostrar el gráfico</p>
                        <p className="text-gray-500 text-sm">Se necesitan al menos 3 respuestas</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Problemas Identificados</CardTitle>
                    <CardDescription className="text-gray-600">Issues detectados en las respuestas del equipo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.criticalIssues && data.criticalIssues.length > 0 ? (
                        data.criticalIssues.slice(0, 5).map((issue, index) => (
                          <div key={index} className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 text-sm">{issue.section}</p>
                                <p className="text-gray-600 text-xs mt-1 line-clamp-2">{issue.question_text}</p>
                              </div>
                              <div className="ml-3 flex flex-col items-end">
                                <div className={`px-2 py-1 rounded text-xs font-medium ${
                                  issue.severity_score <= 2 ? 'bg-red-100 text-red-700' :
                                  issue.severity_score <= 4 ? 'bg-orange-100 text-orange-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {issue.severity_score}/10
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{issue.issue_category}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                          <p className="text-gray-600">No se han detectado problemas críticos</p>
                          <p className="text-gray-500 text-sm">El sistema está funcionando bien</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Excellence Areas */}
              {data.excellenceAreas && data.excellenceAreas.length > 0 && (
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <Star className="w-5 h-5 mr-2 text-yellow-500" />
                      Áreas de Excelencia
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Secciones con puntuaciones superiores a 8/10
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {data.excellenceAreas.map((area, index) => (
                        <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-green-900">{area.section}</h4>
                            <div className="text-xl font-bold text-green-700">
                              {area.avg_score.toFixed(1)}/10
                            </div>
                          </div>
                          <p className="text-sm text-green-600">
                            {area.response_count} respuesta{area.response_count !== 1 ? 's' : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="eficiencia" className="space-y-6">
              {/* Team Efficiency Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.efficiencyMetrics.map((team, index) => (
                  <Card key={index} className="border-gray-200 bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg text-gray-900 flex items-center">
                        {team.team === 'manager' ? (
                          <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                        ) : (
                          <Users className="w-5 h-5 mr-2 text-green-600" />
                        )}
                        Equipo {team.team === 'manager' ? 'Gerencial' : 'de Ventas'}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Métricas de eficiencia basadas en {team.sample_size} respuesta{team.sample_size !== 1 ? 's' : ''}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Performance Score */}
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className={`text-3xl font-bold ${getScoreColor(team.performance_score)} mb-1`}>
                            {team.performance_score.toFixed(1)}/10
                          </div>
                          <p className="text-sm text-gray-600">Rendimiento General</p>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-3 bg-green-50 rounded border border-green-200">
                            <div className="text-lg font-bold text-green-700">{team.strengths}</div>
                            <div className="text-xs text-green-600">Fortalezas</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded border border-red-200">
                            <div className="text-lg font-bold text-red-700">{team.pain_points}</div>
                            <div className="text-xs text-red-600">Problemas</div>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded border border-blue-200">
                            <div className="text-lg font-bold text-blue-700">{team.sample_size}</div>
                            <div className="text-xs text-blue-600">Respuestas</div>
                          </div>
                        </div>

                        {/* Completion Time */}
                        {team.avg_completion_time > 0 && (
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded border">
                            <span className="text-sm text-gray-600">Tiempo de encuesta:</span>
                            <span className="font-medium text-gray-900">{formatTime(team.avg_completion_time)}</span>
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="text-center">
                          <Badge variant={team.sample_size > 5 ? 'default' : team.sample_size > 0 ? 'secondary' : 'outline'}>
                            {team.sample_size > 5 ? 'Datos Suficientes' :
                             team.sample_size > 0 ? 'Datos Limitados' : 'Sin Datos'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Team Performance Trends */}
              {data.performanceTrends && data.performanceTrends.length > 0 && (
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Tendencia de Rendimiento del Equipo</CardTitle>
                    <CardDescription className="text-gray-600">
                      Evolución del rendimiento a lo largo del tiempo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={data.performanceTrends} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" fontSize={11} stroke="#6b7280" />
                        <YAxis domain={[0, 10]} stroke="#6b7280" />
                        <Tooltip
                          formatter={(value, name) => [`${value}/10`, 'Rendimiento Promedio']}
                          labelFormatter={(label) => `Mes: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="avg_performance"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 7, fill: '#1d4ed8' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}

              {/* Team Coordination Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Coordinación</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">
                        {data.businessMetrics?.teamPerformance?.managerEffectiveness !== undefined && data.businessMetrics.teamPerformance.managerEffectiveness > 0 ?
                          `${(data.businessMetrics.teamPerformance.managerEffectiveness * 10).toFixed(0)}%` : 'N/A'}
                      </div>
                      <p className="text-sm text-gray-600">Efectividad Gerencial</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Productividad</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {data.businessMetrics?.teamPerformance?.salesProductivity !== undefined && data.businessMetrics.teamPerformance.salesProductivity > 0 ?
                          `${(data.businessMetrics.teamPerformance.salesProductivity * 10).toFixed(0)}%` : 'N/A'}
                      </div>
                      <p className="text-sm text-gray-600">Productividad de Ventas</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Colaboración</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {data.businessMetrics?.teamPerformance?.collaborationQuality !== undefined && data.businessMetrics.teamPerformance.collaborationQuality > 0 ?
                          `${(data.businessMetrics.teamPerformance.collaborationQuality * 10).toFixed(0)}%` : 'N/A'}
                      </div>
                      <p className="text-sm text-gray-600">Calidad de Colaboración</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recomendaciones" className="space-y-6">
              {/* Actionable Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-red-600" />
                      Acciones Inmediatas
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Problemas que requieren atención urgente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.actionableInsights.immediate_actions && data.actionableInsights.immediate_actions.length > 0 ? (
                        data.actionableInsights.immediate_actions.map((action, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                              !
                            </div>
                            <p className="text-sm text-red-800">{action}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                          <p className="text-gray-600">No hay acciones urgentes pendientes</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-orange-600" />
                      Oportunidades de Mejora
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Sugerencias para optimizar el proceso
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.actionableInsights.improvement_opportunities && data.actionableInsights.improvement_opportunities.length > 0 ? (
                        data.actionableInsights.improvement_opportunities.map((opportunity, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-sm text-orange-800">{opportunity}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <ThumbsUp className="w-12 h-12 mx-auto mb-4 text-green-400" />
                          <p className="text-gray-600">El sistema está optimizado</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Strategic Recommendations and Celebrations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-blue-600" />
                      Recomendaciones Estratégicas
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Mejoras a largo plazo basadas en análisis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.actionableInsights.strategic_recommendations && data.actionableInsights.strategic_recommendations.length > 0 ? (
                        data.actionableInsights.strategic_recommendations.map((recommendation, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                              📋
                            </div>
                            <p className="text-sm text-blue-800">{recommendation}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <Flag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600">No hay recomendaciones estratégicas pendientes</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
                      Logros y Fortalezas
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Aspectos que funcionan bien y deben mantenerse
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.actionableInsights.celebration_worthy && data.actionableInsights.celebration_worthy.length > 0 ? (
                        data.actionableInsights.celebration_worthy.map((achievement, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                              ✓
                            </div>
                            <p className="text-sm text-green-800">{achievement}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <Award className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-gray-600">Completa más encuestas para identificar fortalezas</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* System Configuration and Data Quality */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Calidad de Datos</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {data.summary.data_confidence === 'HIGH' ? 'Alta' :
                       data.summary.data_confidence === 'MODERATE' ? 'Media' : 'Limitada'}
                    </div>
                    <p className="text-sm text-gray-600">
                      Basado en {data.summary.total_responses} respuesta{data.summary.total_responses !== 1 ? 's' : ''}
                    </p>
                    <div className="mt-3">
                      <Badge variant={
                        data.summary.data_confidence === 'HIGH' ? 'default' :
                        data.summary.data_confidence === 'MODERATE' ? 'secondary' : 'outline'
                      }>
                        {data.summary.total_responses >= 15 ? 'Datos suficientes' :
                         data.summary.total_responses >= 5 ? 'Datos moderados' : 'Necesita más datos'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Próxima Revisión</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {data.summary.total_responses >= 10 ? '1 semana' : '3 días'}
                    </div>
                    <p className="text-sm text-gray-600">Recomendado</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {data.summary.total_responses >= 10 ?
                        'Datos suficientes para análisis semanal' :
                        'Recopilar más respuestas primero'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Estado del Sistema</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {data.systemHealth.health_status}
                    </div>
                    <p className="text-sm text-gray-600">
                      Puntuación: {data.systemHealth.overall_health_score.toFixed(1)}/10
                    </p>
                    <div className="mt-3">
                      <Badge variant={data.systemHealth.overall_health_score >= 7 ? 'default' : 'secondary'}>
                        {data.systemHealth.overall_health_score >= 7 ? 'Funcionando bien' : 'Necesita atención'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* FOOTER */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">
                Dashboard de Analytics • Sistema de Retroalimentación
              </p>
              <p className="text-gray-500 text-xs">
                Última actualización: {new Date(data.summary.lastUpdated).toLocaleString('es-ES')} •
                Basado en {data.summary.total_responses} respuesta{data.summary.total_responses !== 1 ? 's' : ''} •
                Confianza: {data.summary.data_confidence === 'HIGH' ? 'Alta' : 
                           data.summary.data_confidence === 'MODERATE' ? 'Media' : 'Limitada'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}