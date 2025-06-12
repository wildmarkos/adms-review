/**
 * Analytics Insights Type Definitions
 * Structures for derived insights and recommendations
 */

// Insight model
export interface Insight {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical' | 'positive';
  sourceMetrics: string[];
  confidence: number;
}

// Recommendation model
export interface Recommendation {
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
  priority: number; // 1-10 scale
  sourceInsights: string[];
}

// Dashboard section model
export interface DashboardSection {
  id: string;
  title: string;
  metrics: any[]; // MetricWithSource<any>[] - using any for flexibility
  insights: Insight[];
  recommendations: Recommendation[];
  isExpandable: boolean;
  defaultExpanded: boolean;
  roleVisibility: {
    assessor: boolean;
    coordinator: boolean;
    manager: boolean;
  };
}

// Time-related insights
export interface TimeInsights extends Array<Insight> {}

// System complexity insights
export interface SystemInsights extends Array<Insight> {}

// Team collaboration insights
export interface CollaborationInsights extends Array<Insight> {}

// Process insights
export interface ProcessInsights extends Array<Insight> {}

// All insights combined
export interface AllInsights {
  timeInsights: TimeInsights;
  systemInsights: SystemInsights;
  collaborationInsights: CollaborationInsights;
  processInsights: ProcessInsights;
}

// Prioritized recommendations
export interface PrioritizedRecommendations extends Array<Recommendation> {}

// Action steps for a recommendation
export interface ActionSteps extends Array<string> {}

// Impact estimate for a recommendation
export interface ImpactEstimate {
  area: string;
  magnitude: 'low' | 'medium' | 'high';
  description: string;
  numericValue?: number;
}