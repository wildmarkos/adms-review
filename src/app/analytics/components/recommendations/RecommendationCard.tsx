import { ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecommendationCardProps {
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
  className?: string;
}

/**
 * Recommendation card component that displays actionable recommendations
 * with impact, effort, and implementation steps
 */
export default function RecommendationCard({
  title,
  description,
  steps,
  impact,
  effort,
  priority,
  className = ''
}: RecommendationCardProps) {
  // Get impact color based on magnitude
  const getImpactColor = (magnitude: string) => {
    switch (magnitude) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get effort color based on level
  const getEffortColor = (level: string) => {
    switch (level) {
      case 'quick-win': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'significant': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get priority indicator
  const getPriorityIndicator = (priority: number) => {
    if (priority >= 8) return 'Critical';
    if (priority >= 6) return 'High';
    if (priority >= 4) return 'Medium';
    return 'Low';
  };

  return (
    <Card className={`border-gray-200 bg-white ${className}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <Badge
            variant={priority >= 8 ? 'destructive' : priority >= 6 ? 'default' : 'secondary'}
          >
            {getPriorityIndicator(priority)} Priority
          </Badge>
        </div>
        
        <p className="text-gray-600 mb-4">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getImpactColor(impact.magnitude)}`}>
            {impact.magnitude.charAt(0).toUpperCase() + impact.magnitude.slice(1)} Impact
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getEffortColor(effort.level)}`}>
            {effort.level.charAt(0).toUpperCase() + effort.level.slice(1).replace('-', ' ')} Effort
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
            {impact.area}
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Implementation Steps</h4>
          <ul className="space-y-2">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start">
                <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-600">{step}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Expected Impact</h4>
            <p className="text-sm text-gray-600">{impact.description}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Estimated Effort</h4>
            <p className="text-sm text-gray-600">{effort.description}</p>
            <p className="text-sm text-gray-500 mt-1">Time: {effort.timeEstimate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}