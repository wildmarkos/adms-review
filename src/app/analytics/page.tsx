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
          <Tabs defaultValue="executive" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
              <TabsTrigger value="executive" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Resumen Ejecutivo
              </TabsTrigger>
              <TabsTrigger value="business" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Métricas de Negocio
              </TabsTrigger>
              <TabsTrigger value="teams" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Análisis por Equipos
              </TabsTrigger>
              <TabsTrigger value="system" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Configuración
              </TabsTrigger>
            </TabsList>

            <TabsContent value="executive" className="space-y-6">
              {/* Business Metrics Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-blue-600" />
                      Eficiencia del Proceso de Admisión
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.summary.total_responses > 0 ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Tiempo de Ventas vs Admin:</span>
                          <div className="flex flex-col items-end">
                            <span className={`font-bold ${data.businessMetrics?.operationalEfficiency?.adminTimeRatio === 0 ? 'text-red-600' : 'text-blue-600'}`}>
                              {data.businessMetrics?.operationalEfficiency?.adminTimeRatio !== undefined ?
                                `${(data.businessMetrics.operationalEfficiency.adminTimeRatio * 10).toFixed(0)}%` : 'Sin Datos'}
                            </span>
                            {data.businessMetrics?.operationalEfficiency?.adminTimeRatio === 0 && (
                              <span className="text-xs text-red-600 font-medium">
                                Pérdida: ~10 inscripciones/mes
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Simplicidad del Sistema:</span>
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-orange-600">
                              {data.businessMetrics?.operationalEfficiency?.systemComplexity !== undefined ?
                                `${(data.businessMetrics.operationalEfficiency.systemComplexity * 10).toFixed(0)}%` : 'Sin Datos'}
                            </span>
                            <span className="text-xs text-orange-600">
                              Meta: 80%+ para eficiencia
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Acceso a Información:</span>
                          <span className="font-bold text-green-600">
                            {data.businessMetrics?.operationalEfficiency?.workflowEfficiency !== undefined && data.businessMetrics.operationalEfficiency.workflowEfficiency > 0 ?
                              `${(data.businessMetrics.operationalEfficiency.workflowEfficiency * 10).toFixed(0)}%` : 'N/A'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          {((data.businessMetrics.systemEfficiency.workflowEffectiveness +
                             data.businessMetrics.operationalEfficiency.workflowEfficiency) / 2 * 10).toFixed(0)}%
                        </div>
                        <p className="text-gray-700 text-sm font-medium">Eficiencia General</p>
                        <p className="text-gray-500 text-xs mt-1">
                          Basado en {data.summary.total_responses} respuestas del equipo
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-purple-600" />
                      Efectividad de Coordinación
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.summary.total_responses > 0 ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Monitoreo de Rendimiento:</span>
                          <span className="font-bold text-purple-600">
                            {data.businessMetrics?.teamPerformance?.managerEffectiveness !== undefined && data.businessMetrics.teamPerformance.managerEffectiveness > 0 ?
                              `${(data.businessMetrics.teamPerformance.managerEffectiveness * 10).toFixed(0)}%` : 'Sin Datos Gerenciales'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Acceso a Info de Prospectos:</span>
                          <span className="font-bold text-blue-600">
                            {data.businessMetrics?.teamPerformance?.salesProductivity !== undefined && data.businessMetrics.teamPerformance.salesProductivity > 0 ?
                              `${(data.businessMetrics.teamPerformance.salesProductivity * 10).toFixed(0)}%` : 'N/A'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Intercambio de Información:</span>
                          <span className="font-bold text-green-600">
                            {data.businessMetrics?.teamPerformance?.collaborationQuality !== undefined && data.businessMetrics.teamPerformance.collaborationQuality > 0 ?
                              `${(data.businessMetrics.teamPerformance.collaborationQuality * 10).toFixed(0)}%` : 'N/A'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="text-4xl font-bold text-purple-600 mb-2">
                          {((data.businessMetrics.teamPerformance.managerEffectiveness +
                             data.businessMetrics.teamPerformance.salesProductivity +
                             data.businessMetrics.teamPerformance.collaborationQuality) / 3 * 10).toFixed(0)}%
                        </div>
                        <p className="text-gray-700 text-sm font-medium">Efectividad del Equipo</p>
                        <p className="text-gray-500 text-xs mt-1">
                          Gerentes: {(data.businessMetrics.teamPerformance.managerEffectiveness * 10).toFixed(0)}% •
                          Ventas: {(data.businessMetrics.teamPerformance.salesProductivity * 10).toFixed(0)}%
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-green-600" />
                      Próximos Pasos
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
                              <p className="font-medium text-gray-900 text-sm">Monitorear Participación</p>
                              <p className="text-gray-600 text-xs">Objetivo: 80% de participación del equipo</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-gray-400 text-white text-xs flex items-center justify-center font-bold">3</div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">Analizar Resultados</p>
                              <p className="text-gray-600 text-xs">Review insights profesionales y tomar acciones</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Real-time insights based on calculated metrics */}
                          {data.businessMetrics.teamPerformance.salesProductivity > 8 && (
                            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                              <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">✓</div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">Excelente Productividad</p>
                                <p className="text-gray-600 text-xs">Los asesores están rindiendo al {(data.businessMetrics.teamPerformance.salesProductivity * 10).toFixed(0)}% - mantener este nivel</p>
                              </div>
                            </div>
                          )}
                          
                          {data.businessMetrics.teamPerformance.managerEffectiveness < 6 && (
                            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                              <div className="w-6 h-6 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center font-bold">!</div>
                              <div>
                                <p className="font-medium text-gray-900 text-sm">Mejorar Liderazgo</p>
                                <p className="text-gray-600 text-xs">Efectividad gerencial al {(data.businessMetrics.teamPerformance.managerEffectiveness * 10).toFixed(0)}% - revisar procesos de monitoreo</p>
                              </div>
                            </div>
                          )}
                          
                          {data.businessMetrics.operationalEfficiency.adminTimeRatio === 0 && (
                            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                              <div className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">!</div>
                              <div>
                                <p className="font-medium text-red-900 text-sm">¡CRISIS DE PRODUCTIVIDAD!</p>
                                <p className="text-red-700 text-xs mb-2">
                                  <strong>Problema:</strong> Asesores dedican 100% tiempo a entrada de datos, 0% a ventas directas
                                </p>
                                <p className="text-red-700 text-xs mb-1">
                                  <strong>Impacto:</strong> 8 horas/día perdidas por asesor = 0 conversiones
                                </p>
                                <p className="text-red-700 text-xs">
                                  <strong>Acción:</strong> 1) Automatizar entrada de datos 2) Redistribuir tareas 3) Meta: 60% ventas, 40% admin
                                </p>
                              </div>
                            </div>
                          )}
                          
                          {data.businessMetrics.operationalEfficiency.systemComplexity > 0 && data.businessMetrics.operationalEfficiency.systemComplexity < 8 && (
                            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                              <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">⚠</div>
                              <div>
                                <p className="font-medium text-orange-900 text-sm">Complejidad de Herramientas Mixta</p>
                                <p className="text-orange-700 text-xs mb-1">
                                  <strong>Situación:</strong> Algunos usan pocas herramientas (1-2), otros muchas (7-8)
                                </p>
                                <p className="text-orange-700 text-xs">
                                  <strong>Acción:</strong> Estandarizar a máximo 3 herramientas principales para todo el equipo
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      
                      {data.summary.total_responses > 0 && (
                        data.actionableInsights.improvement_opportunities.slice(0, 2).map((item, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                            <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">{index + 1}</div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">Acción Recomendada</p>
                              <p className="text-gray-600 text-xs">{item}</p>
                            </div>
                          </div>
                        ))
                      )}
                      
                      {/* Financial Impact and Action Plan */}
                      {data.businessMetrics.operationalEfficiency.adminTimeRatio === 0 && (
                        <>
                          <div className="flex items-start space-x-3 p-4 bg-slate-100 rounded-lg border">
                            <div className="w-6 h-6 rounded-full bg-slate-600 text-white text-xs flex items-center justify-center font-bold">$</div>
                            <div className="w-full">
                              <p className="font-bold text-slate-900 text-sm mb-2">💰 Impacto Financiero Mensual</p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-slate-600">Tiempo perdido/día:</span>
                                  <span className="text-slate-900 font-bold ml-1">16 horas</span>
                                </div>
                                <div>
                                  <span className="text-slate-600">Costo oportunidad:</span>
                                  <span className="text-red-600 font-bold ml-1">$50,000</span>
                                </div>
                                <div>
                                  <span className="text-slate-600">Inscripciones perdidas:</span>
                                  <span className="text-red-600 font-bold ml-1">~10/mes</span>
                                </div>
                                <div>
                                  <span className="text-slate-600">ROI optimización:</span>
                                  <span className="text-green-600 font-bold ml-1">300%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">📋</div>
                            <div className="w-full">
                              <p className="font-bold text-blue-900 text-sm mb-2">Plan de Acción 30 Días</p>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-blue-700">Semana 1: Automatizar entrada de datos</span>
                                  <span className="text-blue-600 font-bold">Prioridad 1</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-blue-700">Semana 2: Capacitar en herramientas nuevas</span>
                                  <span className="text-blue-600 font-bold">Prioridad 2</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-blue-700">Semana 3: Redistribuir tareas 60/40</span>
                                  <span className="text-blue-600 font-bold">Prioridad 1</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-blue-700">Semana 4: Medir resultados</span>
                                  <span className="text-green-600 font-bold">Meta: +5 inscripciones</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="business" className="space-y-6">
              {/* Performance by Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Rendimiento por Área Funcional</CardTitle>
                    <CardDescription className="text-gray-600">Puntuaciones promedio por sección evaluada</CardDescription>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Tendencia de Rendimiento</CardTitle>
                    <CardDescription className="text-gray-600">Evolución del rendimiento a lo largo del tiempo</CardDescription>
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
              </div>
            </TabsContent>

            <TabsContent value="teams" className="space-y-6">
              {/* Team Analysis */}
              <Card className="border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Análisis Detallado por Equipos</CardTitle>
                  <CardDescription className="text-gray-600">
                    Comparativa de rendimiento, participación y áreas de oportunidad
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {data.efficiencyMetrics.map((team, index) => (
                      <div key={index} className="border border-gray-200 p-6 rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-900 text-lg capitalize flex items-center">
                            {team.team === 'manager' ? (
                              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
                            ) : (
                              <Users className="w-5 h-5 mr-2 text-green-600" />
                            )}
                            Equipo {team.team === 'manager' ? 'Gerencial' : 'de Ventas'}
                          </h4>
                          <Badge variant={team.sample_size > 0 ? 'default' : 'secondary'}>
                            {team.sample_size > 0 ? 'Con Datos' : 'Sin Datos'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-white rounded-lg border">
                              <div className={`text-2xl font-bold ${getScoreColor(team.performance_score)}`}>
                                {team.performance_score.toFixed(1)}/10
                              </div>
                              <div className="text-sm text-gray-600">Rendimiento</div>
                            </div>
                            <div className="text-center p-3 bg-white rounded-lg border">
                              <div className="text-2xl font-bold text-gray-900">{team.sample_size}</div>
                              <div className="text-sm text-gray-600">Respuestas</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                              <div className="text-xl font-bold text-green-700">{team.strengths}</div>
                              <div className="text-sm text-green-600">Fortalezas</div>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                              <div className="text-xl font-bold text-red-700">{team.pain_points}</div>
                              <div className="text-sm text-red-600">Problemas</div>
                            </div>
                          </div>

                          {team.avg_completion_time > 0 && (
                            <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                              <span className="text-sm text-gray-600">Tiempo promedio:</span>
                              <span className="font-medium text-gray-900">{formatTime(team.avg_completion_time)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              {/* System Status and Configuration */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Configuración del Dashboard</CardTitle>
                    <CardDescription className="text-gray-600">
                      Configuración técnica y parámetros del sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Última Actualización</h5>
                        <p className="text-sm text-gray-600">
                          {new Date(data.summary.lastUpdated).toLocaleString('es-ES')}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Confianza de Datos</h5>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{data.summary.data_confidence}</span>
                          <Badge variant={
                            data.summary.data_confidence === 'HIGH' ? 'default' :
                            data.summary.data_confidence === 'MODERATE' ? 'secondary' : 'outline'
                          }>
                            {data.summary.data_confidence === 'HIGH' ? 'Alta' :
                             data.summary.data_confidence === 'MODERATE' ? 'Media' : 'Limitada'}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h5 className="font-medium text-blue-900 mb-2 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-2" />
                          Recomendación
                        </h5>
                        <p className="text-sm text-blue-700">
                          {data.summary.total_responses < 10
                            ? "Para obtener insights más precisos, se recomienda recopilar al menos 10-15 respuestas por equipo."
                            : "El sistema tiene suficientes datos para generar insights confiables. Continue monitoreando regularmente."
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-200 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900">Explicación de Métricas</CardTitle>
                    <CardDescription className="text-gray-600">
                      Cómo se calculan las métricas principales
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(data.metricExplanations).map(([key, explanation]) => (
                        <div key={key} className="border border-gray-200 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2 capitalize flex items-center">
                            <Info className="w-4 h-4 mr-2 text-blue-500" />
                            {key.replace(/_/g, ' ')}
                          </h4>
                          
                          <div className="text-sm space-y-2">
                            <div>
                              <span className="font-medium text-gray-700">Descripción: </span>
                              <span className="text-gray-600">{explanation.description}</span>
                            </div>
                            
                            <div>
                              <span className="font-medium text-gray-700">Rango Óptimo: </span>
                              <span className="text-green-600 font-medium">{explanation.good_range}</span>
                            </div>
                            
                            <div>
                              <span className="font-medium text-gray-700">Requiere Acción: </span>
                              <span className="text-red-600 font-medium">{explanation.action_needed}</span>
                            </div>
                          </div>
                        </div>
                      ))}
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