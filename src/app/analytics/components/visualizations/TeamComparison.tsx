'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, ArrowRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface TeamMetric {
  category: string;
  description?: string;
  yourTeam: number;
  avgTeam: number;
  topTeam: number;
  benchmark?: number;
  tooltipText?: string;
}

interface TeamComparisonProps {
  metrics: TeamMetric[];
  title?: string;
  sourceQuestions: number[];
  responseCount: number;
  confidenceLevel: 'low' | 'medium' | 'high';
  insight?: string;
  teamName?: string;
}

/**
 * Team Comparison Visualization Component
 * Shows radar chart comparing team metrics against benchmarks
 * and provides detailed drill-down for each metric
 */
export default function TeamComparison({
  metrics,
  title = 'Team Performance Comparison',
  sourceQuestions,
  responseCount,
  confidenceLevel,
  insight,
  teamName = 'Your Team'
}: TeamComparisonProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  // Format data for radar chart
  const radarData = metrics.map(metric => ({
    subject: metric.category,
    [teamName]: metric.yourTeam,
    'Avg Team': metric.avgTeam,
    'Top Team': metric.topTeam,
    benchmark: metric.benchmark || 0,
    fullMark: 10
  }));

  // Get confidence color based on level
  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-700 bg-green-50';
      case 'medium': return 'text-yellow-700 bg-yellow-50';
      case 'low': return 'text-red-700 bg-red-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  // Get performance indicator color
  const getPerformanceColor = (value: number) => {
    if (value >= 8) return 'text-green-600';
    if (value >= 6) return 'text-blue-600';
    if (value >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Handle click on metric for drill-down
  const handleMetricClick = (metricName: string) => {
    setSelectedMetric(selectedMetric === metricName ? null : metricName);
  };

  return (
    <Card className="border-gray-200 bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <Info className="h-4 w-4 text-gray-400" />
                  <span className="sr-only">Source information</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click for source information</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {showDetails && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md text-xs">
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Data source:</span>
              <span className="font-medium">Questions {sourceQuestions.join(', ')}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Responses:</span>
              <span className="font-medium">{responseCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Confidence:</span>
              <span className={`font-medium px-2 py-0.5 rounded-full ${getConfidenceColor(confidenceLevel)}`}>
                {confidenceLevel}
              </span>
            </div>
          </div>
        )}

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart outerRadius={90} data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 10]} />
              
              <Radar
                name={teamName}
                dataKey={teamName}
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.4}
              />
              <Radar
                name="Avg Team"
                dataKey="Avg Team"
                stroke="#9333ea"
                fill="#9333ea"
                fillOpacity={0.3}
              />
              <Radar
                name="Top Team"
                dataKey="Top Team"
                stroke="#16a34a"
                fill="#16a34a"
                fillOpacity={0.3}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Metric Details (Click for more info)</h4>
          <div className="space-y-3">
            {metrics.map((metric) => (
              <div key={metric.category}>
                <div 
                  className={`p-3 border rounded-md cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedMetric === metric.category ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleMetricClick(metric.category)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-medium">{metric.category}</h5>
                      {selectedMetric !== metric.category && (
                        <div className="flex items-center space-x-3 mt-1">
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                            <span className={`text-sm ${getPerformanceColor(metric.yourTeam)}`}>
                              {metric.yourTeam.toFixed(1)}
                            </span>
                          </div>
                          <ArrowRight className="h-3 w-3 text-gray-400" />
                          <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                            <span className="text-sm text-gray-600">
                              {metric.topTeam.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${getPerformanceColor(metric.yourTeam)}`}>
                        {metric.yourTeam >= metric.avgTeam ? '+' : ''}
                        {((metric.yourTeam - metric.avgTeam) / metric.avgTeam * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">vs average</div>
                    </div>
                  </div>

                  {selectedMetric === metric.category && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {metric.description && (
                        <p className="text-sm text-gray-600 mb-3">{metric.description}</p>
                      )}
                      
                      <div className="grid grid-cols-4 gap-3 text-center">
                        <div className="p-2 bg-blue-50 rounded-md">
                          <div className={`text-lg font-bold ${getPerformanceColor(metric.yourTeam)}`}>
                            {metric.yourTeam.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-500">{teamName}</div>
                        </div>
                        <div className="p-2 bg-purple-50 rounded-md">
                          <div className="text-lg font-bold text-purple-600">
                            {metric.avgTeam.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-500">Avg Team</div>
                        </div>
                        <div className="p-2 bg-green-50 rounded-md">
                          <div className="text-lg font-bold text-green-600">
                            {metric.topTeam.toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-500">Top Team</div>
                        </div>
                        {metric.benchmark && (
                          <div className="p-2 bg-yellow-50 rounded-md">
                            <div className="text-lg font-bold text-yellow-600">
                              {metric.benchmark.toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-500">Benchmark</div>
                          </div>
                        )}
                      </div>
                      
                      {metric.tooltipText && (
                        <div className="mt-3 text-xs text-gray-500 italic">
                          {metric.tooltipText}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {insight && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">{insight}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}