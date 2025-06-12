/**
 * Analytics Components Barrel File
 * Centralizes component exports to simplify imports
 */

// Layout components
export { default as DashboardContainer } from './layout/DashboardContainer';
export { default as TabNavigation } from './layout/TabNavigation';

// Common components
export { default as LoadingState } from './common/LoadingState';
export { default as ErrorState } from './common/ErrorState';

// Auth components
export { default as AuthenticationForm } from './auth/AuthenticationForm';

// Tab content components
export { default as ApplicationProcessTab } from './tabs/ApplicationProcessTab';
export { default as TeamCollaborationTab } from './tabs/TeamCollaborationTab';
export { default as SystemEfficiencyTab } from './tabs/SystemEfficiencyTab';
export { default as ImprovementActionsTab } from './tabs/ImprovementActionsTab';

// Metric components
export { default as MetricCard } from './metrics/MetricCard';

// Visualization components
export { default as TimeAllocation } from './visualizations/TimeAllocation';
export { default as FunnelChart } from './visualizations/FunnelChart';
export { default as TeamComparison } from './visualizations/TeamComparison';
export { default as SystemComplexity } from './visualizations/SystemComplexity';

// Advanced interactive components
export { default as DataDrillDown } from './drill-down/DataDrillDown';
export { default as FilterPanel } from './filters/FilterPanel';

// Integration components
export { default as DashboardIntegration } from './integration/DashboardIntegration';

// Section components
export { default as CollapsibleSection } from './sections/CollapsibleSection';

// Recommendation components
export { default as RecommendationCard } from './recommendations/RecommendationCard';
export { default as RecommendationsSection } from './recommendations/RecommendationsSection';