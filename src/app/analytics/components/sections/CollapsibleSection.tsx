'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CollapsibleSectionProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  sourceInfo?: {
    questions: number[];
    responseCount: number;
    confidence: 'low' | 'medium' | 'high';
  };
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  };
  className?: string;
}

/**
 * Collapsible section component with source information
 * Used to organize dashboard content into expandable sections
 */
export default function CollapsibleSection({
  id,
  title,
  icon,
  children,
  defaultExpanded = true,
  sourceInfo,
  badge,
  className = '',
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Determine confidence color based on level
  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-700';
      case 'medium': return 'text-yellow-700';
      case 'low': return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <Card className={`border-gray-200 bg-white mb-6 ${className}`}>
      <CardHeader className="py-4 px-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0 hover:bg-transparent flex items-center"
          >
            <div className="mr-2">
              {isExpanded ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
            </div>
            <div className="flex items-center">
              {icon && <span className="mr-2">{icon}</span>}
              <CardTitle className="text-lg text-gray-900">{title}</CardTitle>
            </div>
          </Button>
          
          <div className="flex items-center space-x-3">
            {sourceInfo && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs text-gray-500">
                      <Info className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      <span className="hidden sm:inline">Sources: Q{sourceInfo.questions.join(', ')} | </span>
                      <span>Responses: {sourceInfo.responseCount} | </span>
                      <span className={`font-medium ${getConfidenceColor(sourceInfo.confidence)}`}>
                        {sourceInfo.confidence.charAt(0).toUpperCase() + sourceInfo.confidence.slice(1)} confidence
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Data sourced from questions {sourceInfo.questions.join(', ')}</p>
                    <p>Based on {sourceInfo.responseCount} responses</p>
                    <p>{sourceInfo.confidence.charAt(0).toUpperCase() + sourceInfo.confidence.slice(1)} confidence level</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {badge && (
              <Badge variant={badge.variant || 'default'}>
                {badge.text}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0 px-6 pb-6">
          {children}
        </CardContent>
      )}
    </Card>
  );
}