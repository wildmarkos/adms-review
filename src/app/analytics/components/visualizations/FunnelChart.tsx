'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface FunnelStage {
  id: string;
  name: string;
  count: number;
  percentage: number;
  previousCount?: number;
  dropoffPercentage?: number;
  bottleneckSeverity?: 'low' | 'medium' | 'high' | 'none';
  details?: {
    topReasons?: { reason: string; percentage: number }[];
    avgTimeInStage?: string;
    completionRate?: number;
  };
}

interface FunnelChartProps {
  stages: FunnelStage[];
  title?: string;
  sourceQuestions: number[];
  responseCount: number;
  confidenceLevel: 'low' | 'medium' | 'high';
  insight?: string;
}

/**
 * Funnel Chart Visualization Component
 * Displays application process stages with conversion rates, bottlenecks,
 * and supports drill-down capabilities for detailed stage analysis
 */
export default function FunnelChart({
  stages,
  title = 'Application Process Funnel',
  sourceQuestions,
  responseCount,
  confidenceLevel,
  insight
}: FunnelChartProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  const toggleStageExpansion = (stageId: string) => {
    if (expandedStage === stageId) {
      setExpandedStage(null);
    } else {
      setExpandedStage(stageId);
    }
  };

  // Get confidence color based on level
  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-700 bg-green-50';
      case 'medium': return 'text-yellow-700 bg-yellow-50';
      case 'low': return 'text-red-700 bg-red-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  // Get bottleneck severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-200';
      case 'medium': return 'bg-yellow-100 border-yellow-200';
      case 'low': return 'bg-blue-100 border-blue-200';
      case 'none': return 'bg-green-100 border-green-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  // Get bottleneck severity indicator
  const getSeverityIndicator = (severity: string) => {
    const count = severity === 'high' ? 10 : severity === 'medium' ? 5 : severity === 'low' ? 2 : 0;
    return Array(10)
      .fill(0)
      .map((_, i) => (
        <div
          key={i}
          className={`h-2 w-2 rounded-sm ${i < count ? 'bg-current' : 'bg-gray-200'}`}
        />
      ));
  };

  // Maximum width for the funnel visualization
  const maxWidth = 100;

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
              <span className="font-medium">Process Questions ({sourceQuestions.length})</span>
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

        <div className="mt-6 space-y-4">
          {stages.map((stage, index) => (
            <div key={stage.id} className="relative">
              <div 
                className={`flex flex-col p-3 border rounded-md transition-all ${getSeverityColor(stage.bottleneckSeverity || 'none')}`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <div className="font-medium">{stage.name}</div>
                    <div className="text-sm text-gray-500">
                      {stage.count.toLocaleString()} applicants
                      {index > 0 && stage.dropoffPercentage !== undefined && (
                        <span className="ml-2 text-red-600">
                          (-{stage.dropoffPercentage}% from previous)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Percentage display */}
                    <div className="text-right">
                      <div className="font-bold">{stage.percentage}%</div>
                      <div className="text-xs text-gray-500">of total</div>
                    </div>
                    
                    {/* Bottleneck indicator if applicable */}
                    {stage.bottleneckSeverity && stage.bottleneckSeverity !== 'none' && (
                      <div className="flex flex-col items-end">
                        <Badge 
                          className={`mb-1 ${
                            stage.bottleneckSeverity === 'high' 
                              ? 'bg-red-100 text-red-800 hover:bg-red-100'
                              : stage.bottleneckSeverity === 'medium'
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                          }`}
                        >
                          {stage.bottleneckSeverity.toUpperCase()} BOTTLENECK
                        </Badge>
                        <div className="flex space-x-0.5 text-red-600">
                          {getSeverityIndicator(stage.bottleneckSeverity)}
                        </div>
                      </div>
                    )}
                    
                    {/* Expand/collapse button */}
                    {stage.details && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStageExpansion(stage.id)}
                        className="h-8 w-8 p-0"
                      >
                        {expandedStage === stage.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progress bar representation */}
                <div className="mt-2 h-6 w-full bg-gray-100 rounded-md overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-md"
                    style={{ width: `${(stage.percentage / 100) * maxWidth}%` }}
                  ></div>
                </div>

                {/* Expanded details section */}
                {expandedStage === stage.id && stage.details && (
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <h4 className="font-medium mb-2">Stage Details</h4>
                    
                    {stage.details.avgTimeInStage && (
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Average time in stage:</span>
                        <span className="text-sm font-medium">{stage.details.avgTimeInStage}</span>
                      </div>
                    )}
                    
                    {stage.details.completionRate !== undefined && (
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Completion rate:</span>
                        <span className="text-sm font-medium">{stage.details.completionRate}%</span>
                      </div>
                    )}
                    
                    {stage.details.topReasons && stage.details.topReasons.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-sm font-medium mb-2">Top reasons for dropoff:</h5>
                        <ul className="text-sm space-y-1">
                          {stage.details.topReasons.map((reason, i) => (
                            <li key={i} className="flex justify-between">
                              <span className="text-gray-600">{reason.reason}</span>
                              <span className="font-medium">{reason.percentage}%</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Connector line between stages */}
              {index < stages.length - 1 && (
                <div className="h-4 w-0.5 bg-gray-300 absolute left-1/2 -bottom-4 transform -translate-x-1/2"></div>
              )}
            </div>
          ))}
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