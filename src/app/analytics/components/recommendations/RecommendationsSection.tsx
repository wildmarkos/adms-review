'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Funnel, Plus, Filter } from 'lucide-react';
import RecommendationCard from './RecommendationCard';

interface RecommendationData {
  id: string;
  title: string;
  description: string;
  steps: string[];
  impact: {
    area: string;
    magnitude: 'low' | 'medium' | 'high';
    description: string;
  };
  effort: {
    level: 'quick-win' | 'medium' | 'significant';
    description: string;
    timeEstimate: string;
  };
  priority: number;
  sourceInsights: string[];
}

interface RecommendationsSectionProps {
  recommendations: RecommendationData[];
  isLoading?: boolean;
}

/**
 * Recommendations Section component
 * Displays actionable recommendations with filtering options
 */
export default function RecommendationsSection({
  recommendations,
  isLoading = false
}: RecommendationsSectionProps) {
  const [filter, setFilter] = useState<string | null>(null);
  
  // Filter options
  const filterOptions = [
    { value: null, label: 'All Recommendations' },
    { value: 'high-priority', label: 'High Priority' },
    { value: 'quick-win', label: 'Quick Wins' },
    { value: 'time-allocation', label: 'Time Allocation' },
    { value: 'system-complexity', label: 'System Complexity' }
  ];
  
  // Filter recommendations based on selected filter
  const filteredRecommendations = recommendations.filter(rec => {
    if (!filter) return true;
    if (filter === 'high-priority') return rec.priority >= 7;
    if (filter === 'quick-win') return rec.effort.level === 'quick-win';
    if (filter === 'time-allocation') return rec.impact.area === 'Time Allocation';
    if (filter === 'system-complexity') return rec.impact.area === 'System Complexity';
    return true;
  });
  
  // Sort recommendations by priority (highest first)
  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => b.priority - a.priority);
  
  return (
    <div className="space-y-6">
      {/* Filter controls */}
      <Card className="bg-white border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Funnel className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            
            {filterOptions.map(option => (
              <Button
                key={option.value || 'all'}
                variant={filter === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </Button>
            ))}
            
            {filter && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setFilter(null)}
                className="ml-auto"
              >
                Clear filter
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Recommendations count */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          {sortedRecommendations.length} {filter ? 'Filtered' : ''} Recommendations
        </h3>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-1" />
          Add Custom Action
        </Button>
      </div>
      
      {/* No results message */}
      {sortedRecommendations.length === 0 && (
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6 text-center">
            <Filter className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h4 className="text-lg font-medium text-gray-900 mb-1">No matching recommendations</h4>
            <p className="text-gray-600">Try adjusting your filter or creating a custom action.</p>
          </CardContent>
        </Card>
      )}
      
      {/* Recommendations list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedRecommendations.map(recommendation => (
          <RecommendationCard
            key={recommendation.id}
            title={recommendation.title}
            description={recommendation.description}
            steps={recommendation.steps}
            impact={recommendation.impact}
            effort={recommendation.effort}
            priority={recommendation.priority}
          />
        ))}
      </div>
    </div>
  );
}