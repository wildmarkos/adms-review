import { Info, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  sourceQuestions: number[];
  responseCount: number;
  confidence: {
    score: number;
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  insight?: string;
  recommendation?: {
    title: string;
    description: string;
    impact: string;
  };
  trend?: {
    direction: 'improving' | 'stable' | 'declining';
    period: string;
  };
  className?: string;
}

/**
 * Source-transparent metric card component
 * Shows data sources and confidence levels for each metric
 */
export default function MetricCard({
  title,
  value,
  sourceQuestions,
  responseCount,
  confidence,
  insight,
  recommendation,
  trend,
  className = ''
}: MetricCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Determine confidence level styling
  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-700 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  // Determine trend icon and styling
  const renderTrendIcon = (direction: string) => {
    switch (direction) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className={`border-gray-200 bg-white ${className}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowDetails(!showDetails)}>
                  <Info className="h-4 w-4 text-gray-400" />
                  <span className="sr-only">More info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click for source information</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="text-2xl font-bold text-gray-900 mb-2">
          {value}
          {trend && (
            <span className="ml-2 inline-flex items-center">
              {renderTrendIcon(trend.direction)}
            </span>
          )}
        </div>
        
        {insight && (
          <p className="text-xs text-gray-500 mb-2">{insight}</p>
        )}
        
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Data source:</span>
              <span className="font-medium">Questions {sourceQuestions.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Responses:</span>
              <span className="font-medium">{responseCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Confidence:</span>
              <span className={`font-medium px-2 py-0.5 rounded-full ${getConfidenceColor(confidence.level)}`}>
                {confidence.level}
              </span>
            </div>
            {trend && (
              <div className="flex justify-between">
                <span className="text-gray-500">Trend:</span>
                <span className="font-medium">{trend.direction} ({trend.period})</span>
              </div>
            )}
            {confidence.factors.length > 0 && (
              <div className="mt-2">
                <span className="text-gray-500 block mb-1">Confidence factors:</span>
                <ul className="list-disc pl-4 text-gray-600">
                  {confidence.factors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {recommendation && showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <h4 className="text-xs font-medium text-gray-700 mb-1">Recommendation:</h4>
            <p className="text-xs text-gray-600">{recommendation.title}</p>
            <p className="text-xs text-gray-500 mt-1">Impact: {recommendation.impact}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}