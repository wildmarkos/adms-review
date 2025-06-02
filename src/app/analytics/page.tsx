'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { TrendingUp, TrendingDown, Users, AlertTriangle, Download, RefreshCw, Target, Clock, Activity, CheckCircle } from 'lucide-react';

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
  };
  systemHealth: {
    overall_health_score: number;
    efficiency_index: number;
    data_reliability: number;
    user_productivity: number;
    lead_management_score: number;
    critical_failure_rate: number;
    excellence_indicators: number;
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
  insights: {
    topConcern: string;
    improvementArea: string;
    strongestArea: string;
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
    if (score >= 7) return 'text-green-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 7) return 'bg-green-100 text-green-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'EFFICIENCY': return 'bg-blue-100 text-blue-800';
      case 'DATA_QUALITY': return 'bg-purple-100 text-purple-800';
      case 'LEAD_MANAGEMENT': return 'bg-green-100 text-green-800';
      case 'PRODUCTIVITY': return 'bg-orange-100 text-orange-800';
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
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
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
            <h1 className="text-2xl font-bold text-gray-900">Análisis de Retroalimentación Eduscore</h1>
            <p className="text-gray-600">
              {data.summary.total_responses} respuestas • Participación {data.summary.participation_rate} • 
              Confianza de datos: {data.summary.data_confidence}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm" onClick={loadAnalytics} disabled={loading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
            <Button size="sm" onClick={handleExportData}>
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Salud del Sistema</p>
                  <p className={`text-2xl font-bold ${getScoreColor(data.systemHealth.overall_health_score)}`}>
                    {data.systemHealth.overall_health_score}/10
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Índice de Eficiencia</p>
                  <p className={`text-2xl font-bold ${getScoreColor(data.systemHealth.efficiency_index)}`}>
                    {data.systemHealth.efficiency_index}/10
                  </p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Calidad de Datos</p>
                  <p className={`text-2xl font-bold ${getScoreColor(data.systemHealth.data_reliability)}`}>
                    {data.systemHealth.data_reliability}/10
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Problemas Críticos</p>
                  <p className="text-2xl font-bold text-red-600">
                    {data.systemHealth.critical_failure_rate}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tiempo Promedio</p>
                  <p className="text-2xl font-bold text-gray-700">
                    {formatTime(data.summary.avg_completion_time)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights Alert */}
        <div className="mb-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Activity className="h-4 w-4" />
            <AlertDescription className="text-blue-800">
              <strong>Insights Clave:</strong> Área de mayor preocupación: {data.insights.topConcern} • 
              Requiere mejora: {data.insights.improvementArea} • 
              Área más fuerte: {data.insights.strongestArea}
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Section Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rendimiento por Sección</CardTitle>
              <CardDescription>Puntuaciones promedio por área evaluada</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.sectionPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="section" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    fontSize={11}
                  />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Bar dataKey="avg_score" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tendencia de Rendimiento</CardTitle>
              <CardDescription>Evolución del sistema en los últimos meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data.performanceTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="avg_performance" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Team Efficiency */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Análisis por Equipo</CardTitle>
            <CardDescription>Comparación de rendimiento entre gerentes y equipo de ventas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.efficiencyMetrics.map((team, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 capitalize">{team.team}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Puntuación General:</span>
                      <span className={`font-medium ${getScoreColor(team.performance_score)}`}>
                        {team.performance_score.toFixed(1)}/10
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Puntos de Dolor:</span>
                      <span className="font-medium text-red-600">{team.pain_points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Fortalezas:</span>
                      <span className="font-medium text-green-600">{team.strengths}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Participación:</span>
                      <span className="font-medium">{team.sample_size} respuestas</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Critical Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Problemas Críticos Identificados</CardTitle>
            <CardDescription>Áreas que requieren atención prioritaria</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.processIssues.slice(0, 6).map((issue, index) => (
                <div key={index} className="border border-gray-200 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
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
                      <p className="text-xs text-gray-500">{issue.frequency} respuestas</p>
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{issue.section}</h4>
                  <p className="text-sm text-gray-600">{issue.question_text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-500 text-sm py-4">
          Última actualización: {new Date(data.summary.lastUpdated).toLocaleString('es-ES')} • 
          Datos basados en {data.summary.total_responses} respuestas de retroalimentación
        </div>
      </div>
    </div>
  );
}