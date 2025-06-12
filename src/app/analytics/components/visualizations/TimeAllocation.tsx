'use client';

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TimeAllocationProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  sourceQuestions: number[];
  responseCount: number;
  confidenceLevel: 'low' | 'medium' | 'high';
  insight?: string;
}

/**
 * Time Allocation Visualization Component
 * Shows time distribution across different activities
 */
export default function TimeAllocation({
  data,
  sourceQuestions,
  responseCount,
  confidenceLevel,
  insight
}: TimeAllocationProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Get confidence color based on level
  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-700 bg-green-50';
      case 'medium': return 'text-yellow-700 bg-yellow-50';
      case 'low': return 'text-red-700 bg-red-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <Card className="border-gray-200 bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-gray-900">Time Allocation</h3>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setShowDetails(!showDetails)}>
                  <Info className="h-4 w-4 text-gray-400" />
                  <span className="sr-only">Source information</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Click for source information</p>
              </TooltipContent>
            </UITooltip>
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

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip formatter={(value) => [`${value}%`, 'Time spent']} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {insight && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">{insight}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}