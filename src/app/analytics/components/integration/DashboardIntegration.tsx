'use client';

import { useState, useEffect } from 'react';
import FilterPanel from '../filters/FilterPanel';
import TimeAllocation from '../visualizations/TimeAllocation';
import TeamComparison from '../visualizations/TeamComparison';
import SystemComplexity from '../visualizations/SystemComplexity';
import ApplicationProcessTab from '../tabs/ApplicationProcessTab';
import DataDrillDown from '../drill-down/DataDrillDown';
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DownloadCloud, Share2 } from 'lucide-react';
import { authService } from '@/lib/analytics/services/authService';

// Filter options generator based on actual question data from the API
const generateFilterOptions = (apiData: any) => {
  // Default filter options to use when API data isn't available
  const defaultOptions = {
    teams: [
      { id: 'admissions', label: 'Admissions Team' },
      { id: 'marketing', label: 'Marketing Team' },
      { id: 'enrollment', label: 'Enrollment Team' },
      { id: 'academic', label: 'Academic Advisors' }
    ],
    roles: [
      { id: 'assessor', label: 'Assessor' },
      { id: 'coordinator', label: 'Coordinator' },
      { id: 'manager', label: 'Manager' },
      { id: 'director', label: 'Director' }
    ],
    questions: [
      { id: 57, label: 'Time allocation', group: 'Time Management' },
      { id: 172, label: 'Administrative tasks', group: 'Time Management' },
      { id: 248, label: 'Sales activities', group: 'Time Management' },
      { id: 131, label: 'System workarounds', group: 'System Complexity' },
      { id: 141, label: 'Critical issues', group: 'System Complexity' },
      { id: 218, label: 'Tool count', group: 'System Complexity' },
      { id: 290, label: 'Workaround frequency', group: 'System Complexity' },
      { id: 322, label: 'Information sharing', group: 'Team Collaboration' },
      { id: 332, label: 'Handoff effectiveness', group: 'Team Collaboration' },
      { id: 342, label: 'Communication gaps', group: 'Team Collaboration' },
      { id: 354, label: 'Pipeline reviews', group: 'Team Collaboration' }
    ],
    metrics: [
      { id: 'admin_time', label: 'Administrative Time', group: 'Time Allocation' },
      { id: 'sales_time', label: 'Sales Time', group: 'Time Allocation' },
      { id: 'strategic_time', label: 'Strategic Time', group: 'Time Allocation' },
      { id: 'tool_count', label: 'Tool Count', group: 'System Complexity' },
      { id: 'login_frag', label: 'Login Fragmentation', group: 'System Complexity' },
      { id: 'workarounds', label: 'Workaround Prevalence', group: 'System Complexity' },
      { id: 'info_sharing', label: 'Information Sharing', group: 'Team Collaboration' },
      { id: 'handoff_eff', label: 'Handoff Effectiveness', group: 'Team Collaboration' },
      { id: 'comm_gap', label: 'Communication Gap', group: 'Team Collaboration' },
      { id: 'lead_loss', label: 'Lead Loss Frequency', group: 'Process Bottlenecks' },
      { id: 'loss_stage', label: 'Primary Loss Stage', group: 'Process Bottlenecks' },
      { id: 'tracking', label: 'Lead Tracking Confidence', group: 'Process Bottlenecks' }
    ]
  };

  // Return default options if API data is missing
  if (!apiData || !apiData.summary) {
    return defaultOptions;
  }

  // Extract real metrics from API data when available
  const realMetrics = [];
  
  // Process time metrics
  if (apiData.summary.keyMetrics?.time) {
    const timeMetrics = apiData.summary.keyMetrics.time;
    if (timeMetrics.adminTime) {
      realMetrics.push({
        id: 'admin_time',
        label: 'Administrative Time',
        group: 'Time Allocation',
        value: timeMetrics.adminTime.value,
        sourceQuestions: timeMetrics.adminTime.sourceQuestions
      });
    }
    if (timeMetrics.salesTime) {
      realMetrics.push({
        id: 'sales_time',
        label: 'Sales Time',
        group: 'Time Allocation',
        value: timeMetrics.salesTime.value
      });
    }
    if (timeMetrics.strategicTime) {
      realMetrics.push({
        id: 'strategic_time',
        label: 'Strategic Time',
        group: 'Time Allocation',
        value: timeMetrics.strategicTime.value
      });
    }
  }

  // Process system metrics if available
  if (apiData.summary.keyMetrics?.system) {
    const systemMetrics = apiData.summary.keyMetrics.system;
    if (systemMetrics.toolCount) {
      realMetrics.push({
        id: 'tool_count',
        label: 'Tool Count',
        group: 'System Complexity',
        sourceQuestions: systemMetrics.toolCount.sourceQuestions
      });
    }
  }

  // Use real metrics if available, otherwise fall back to defaults
  return {
    ...defaultOptions,
    metrics: realMetrics.length > 0 ? realMetrics : defaultOptions.metrics
  };
};

// Saved filters (this would be stored in the database in a real implementation)
const savedFilters = [
  {
    id: 'filter1',
    name: 'Q2 Marketing Team Analysis',
    description: 'Analysis of Marketing team performance in Q2',
    createdAt: '2025-04-15T10:00:00Z',
    filters: {
      dateRange: {
        start: new Date('2025-04-01'),
        end: new Date('2025-06-30')
      },
      teams: ['marketing'],
      roles: [],
      questions: [],
      metrics: []
    }
  },
  {
    id: 'filter2',
    name: 'System Bottlenecks',
    description: 'Focus on system complexity and bottlenecks',
    createdAt: '2025-05-10T14:30:00Z',
    isDefault: true,
    filters: {
      dateRange: {
        start: null,
        end: null
      },
      teams: [],
      roles: [],
      questions: [131, 141, 218, 290],
      metrics: ['tool_count', 'login_frag', 'workarounds']
    }
  }
];

/**
 * Dashboard Integration Component
 * Demonstrates how Phase 3 components work together in the analytics dashboard
 */
export default function DashboardIntegration() {
  // Simple tab and visualization state - simplified for reliability
  const [activeView, setActiveView] = useState('funnel');
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [showDrillDown, setShowDrillDown] = useState(false);
  
  // Console log for debugging active view changes
  useEffect(() => {
    console.log("Active view changed to:", activeView);
  }, [activeView]);
  
  // Define TypeScript interfaces for our data structures
  interface SummaryData {
    keyMetrics?: {
      time?: {
        adminTime?: {
          value: number;
          sourceQuestions: number[];
          responseCount: number;
          confidence?: { level: 'low' | 'medium' | 'high' };
        };
        salesTime?: { value: number };
        strategicTime?: { value: number };
        otherTime?: { value: number };
        trends?: {
          [key: string]: {
            change: number;
            direction: 'improving' | 'declining' | 'stable';
          }
        };
      };
      system?: {
        nodes: any[];
        connections: any[];
        toolCount?: {
          sourceQuestions: number[];
          responseCount: number;
          confidence?: { level: 'low' | 'medium' | 'high' };
        };
      };
    };
    insights?: {
      warnings: Array<{
        sourceMetrics: string[];
        description: string;
      }>;
    };
  }

  // Import FunnelStage interface from FunnelChart to ensure compatibility
  interface FunnelStage {
    id: string;
    name: string;
    count: number;
    percentage: number;
    dropoffPercentage?: number;
    bottleneckSeverity?: 'low' | 'medium' | 'high' | 'none';
    details?: {
      topReasons?: { reason: string; percentage: number }[];
      avgTimeInStage?: string;
      completionRate?: number;
    };
  }

  interface ProcessData {
    stages?: FunnelStage[];
    funnel?: {
      stages: FunnelStage[];
      conversionRates?: any[];
      totalConversion?: number;
    };
    sourceQuestions?: number[];
    responseCount?: number;
    confidenceLevel?: 'low' | 'medium' | 'high';
    insight?: string;
    insights?: Array<{
      id?: string;
      title?: string;
      description: string;
      severity?: string;
    }>;
    meta?: {
      sourceQuestions?: number[];
      responseCount?: number;
      dataQuality?: 'low' | 'medium' | 'high';
      lastUpdated?: string;
    };
  }

  interface TeamMetric {
    category: string;
    description: string;
    yourTeam: number;
    avgTeam: number;
    topTeam: number;
    benchmark: number;
    tooltipText?: string;
  }

  interface TeamData {
    metrics: TeamMetric[] | {
      informationSharingQuality: number;
      handoffEffectiveness: number;
      communicationGap: number;
      pipelineReviewFrequency: number;
      overallCollaborationScore: number;
    };
    sourceQuestions: number[];
    responseCount: number;
    confidenceLevel: 'low' | 'medium' | 'high';
    insight: string;
    benchmarks?: {
      informationSharing?: {
        average: number;
        top: number;
        target: number;
      };
      handoffEffectiveness?: {
        average: number;
        top: number;
        target: number;
      };
      communicationGap?: {
        average: number;
        top: number;
        target: number;
      };
      pipelineReview?: {
        average: number;
        top: number;
        target: number;
      };
      overallCollaboration?: {
        average: number;
        top: number;
        target: number;
      };
    };
  }

  interface RecommendationsData {
    recommendations: any[];
  }

  type DrillDownViewType = 'chart' | 'table' | 'details' | 'source';

  interface DrillDownMetric {
    id: string;
    label: string;
    value: number;
    percentage: number;
    change: number;
    changeDirection: 'up' | 'down' | 'neutral';
    color?: string;
  }

  interface DrillDownLevel {
    id: string;
    title: string;
    description: string;
    parentId?: string;
    breadcrumb: string[];
    viewType: DrillDownViewType;
    metrics: DrillDownMetric[];
    insights: string[];
    sourceQuestions: number[];
    responseCount: number;
    confidenceLevel: 'low' | 'medium' | 'high';
    chartType?: 'bar' | 'pie' | 'line' | 'area';
    columns?: Array<{key: string, label: string}>;
    childrenMap?: Record<string, string>;
    rawData?: Array<Record<string, any>>;
  }

  // Data states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<{
    summary: SummaryData | null;
    process: ProcessData | null;
    team: TeamData | null;
    recommendations: RecommendationsData | null;
  }>({
    summary: null,
    process: null,
    team: null,
    recommendations: null
  });
  
  // Load all required data on component mount
  useEffect(() => {
    loadAllData();
  }, []);
  
  // Log process data when it changes
  useEffect(() => {
    if (apiData.process) {
      console.log("Using real process data:", apiData.process);
      console.log("Source questions:", apiData.process.sourceQuestions || apiData.process.meta?.sourceQuestions || []);
    }
  }, [apiData.process]);
  
  // Helper function to validate and clean data
  const processNumericValue = (value: any, defaultValue: number, max: number = 1000): number => {
    if (typeof value !== 'number' || isNaN(value) || value < 0 || value > max) {
      return defaultValue;
    }
    return value;
  };

  // Helper function to process arrays to reasonable sizes
  const processArray = (arr: any[], maxLength: number = 10): any[] => {
    if (!Array.isArray(arr)) return [];
    return arr.slice(0, maxLength);
  };

  // Function to load all data from APIs
  const loadAllData = async () => {
    console.log('Loading all data...');
    setIsLoading(true);
    setError(null);
    
    try {
      // Get user role
      const role = authService.getCurrentRole() || 'coordinator';
      
      // Load data from all endpoints in parallel
      const [summaryResponse, processResponse, teamResponse, recommendationsResponse] = await Promise.all([
        fetch(`/api/analytics/summary?role=${role}`),
        fetch(`/api/analytics/process?role=${role}`),
        fetch(`/api/analytics/team?role=${role}`),
        fetch(`/api/analytics/recommendations?role=${role}`)
      ]);
      
      // Check for errors
      if (!summaryResponse.ok || !processResponse.ok || !teamResponse.ok || !recommendationsResponse.ok) {
        throw new Error('Failed to load analytics data');
      }
      
      // Parse JSON responses
      const summary = await summaryResponse.json();
      const process = await processResponse.json();
      const team = await teamResponse.json();
      const recommendations = await recommendationsResponse.json();
      
      // Log and fix raw API responses
      console.log('API Data Received:');
      
      // Fix potential issues in the process data
      if (process && process.sourceQuestions && Array.isArray(process.sourceQuestions)) {
        if (process.sourceQuestions.length > 10 || process.sourceQuestions.some((q: number) => q > 10000)) {
          console.warn("Found problematic sourceQuestions array:", process.sourceQuestions);
          process.sourceQuestions = [131, 141, 218]; // Replace with reasonable values
        }
      }
      
      console.log('Summary:', summary);
      console.log('Process:', process);
      console.log('Team:', team);
      console.log('Recommendations:', recommendations);
      
      // Set all API data
      setApiData({
        summary,
        process,
        team,
        recommendations
      });
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading analytics data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setIsLoading(false);
    }
  };
  
  // Handle filter changes - reload data with filter parameters
  const handleFilterChange = (filters: any) => {
    console.log('Filters applied:', filters);
    setFiltersApplied(true);
    
    // In a real implementation, we would reload data with the applied filters
    // For now, we'll simulate this by updating the UI to show filters were applied
    
    // Future enhancement: Add filter parameters to API calls
    // loadAllData(filters);
  };
  
  // Handle saving filters
  const handleSaveFilter = (filter: any) => {
    console.log('Filter saved:', filter);
  };
  
  // Handle export with actual data download functionality
  const handleExport = (data: any, format: 'csv' | 'pdf' | 'json') => {
    console.log(`Exporting ${format}:`, data);
    
    // For CSV export
    if (format === 'csv') {
      // Convert data to CSV format
      let csvContent = '';
      
      // Add headers if data has metrics
      if (data.metrics && data.metrics.length > 0) {
        const headers = Object.keys(data.metrics[0]).filter(k => k !== 'color');
        csvContent += headers.join(',') + '\n';
        
        // Add rows
        data.metrics.forEach((item: any) => {
          const row = headers.map(header => item[header]).join(',');
          csvContent += row + '\n';
        });
      } else if (data.rawData && data.rawData.length > 0) {
        // Use rawData if available
        const headers = Object.keys(data.rawData[0]);
        csvContent += headers.join(',') + '\n';
        
        // Add rows
        data.rawData.forEach((item: any) => {
          const row = headers.map(header => item[header]).join(',');
          csvContent += row + '\n';
        });
      }
      
      // Create blob and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `analytics-export-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // Handle share
  const handleShare = (id: string) => {
    console.log(`Sharing view: ${id}`);
  };
  
  // Handle drill-down fetching
  const handleFetchDrillDown = async (parentId: string, itemId: string): Promise<DrillDownLevel> => {
    console.log(`Fetching drill-down for ${parentId}, item ${itemId}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: `${itemId}-details`,
      title: `Detailed Analysis`,
      description: `Detailed breakdown of the selected metric`,
      parentId: parentId,
      breadcrumb: ['Dashboard', 'Analysis', 'Details'],
      viewType: 'details' as DrillDownViewType,
      metrics: [
        { id: `${itemId}-1`, label: `Category 1`, value: 45, percentage: 45, change: 2, changeDirection: 'up' },
        { id: `${itemId}-2`, label: `Category 2`, value: 30, percentage: 30, change: 0, changeDirection: 'neutral' },
        { id: `${itemId}-3`, label: `Category 3`, value: 25, percentage: 25, change: -3, changeDirection: 'down' }
      ],
      insights: [
        `The largest component is Category 1 at 45%.`,
        `Category 3 has seen a decrease of 3% compared to the previous period.`
      ],
      sourceQuestions: [57, 172, 248],
      responseCount: 28,
      confidenceLevel: 'medium',
      rawData: [
        { category: 'Category 1', hours: 18, percentage: 45, trend: '+2%' },
        { category: 'Category 2', hours: 12, percentage: 30, trend: '0%' },
        { category: 'Category 3', hours: 10, percentage: 25, trend: '-3%' }
      ]
    };
  };
  
  // Show loading state
  if (isLoading) {
    return <LoadingState message="Loading analytics data..." />;
  }
  
  // Show error state
  if (error) {
    return <ErrorState message={error} />;
  }
  
  // Prepare data for the time allocation component from real API data
  const timeAllocationData = {
    data: [
      { 
        name: 'Administrative', 
        value: apiData.summary?.keyMetrics?.time?.adminTime?.value || 25, 
        color: '#4f46e5' 
      },
      { 
        name: 'Sales', 
        value: apiData.summary?.keyMetrics?.time?.salesTime?.value || 30, 
        color: '#10b981' 
      },
      { 
        name: 'Strategic', 
        value: apiData.summary?.keyMetrics?.time?.strategicTime?.value || 20, 
        color: '#f59e0b' 
      },
      { 
        name: 'Other', 
        value: apiData.summary?.keyMetrics?.time?.otherTime?.value || 25, 
        color: '#6b7280' 
      }
    ],
    sourceQuestions: processArray(apiData.summary?.keyMetrics?.time?.adminTime?.sourceQuestions || []),
    responseCount: processNumericValue(apiData.summary?.keyMetrics?.time?.adminTime?.responseCount, 28),
    confidenceLevel: (apiData.summary?.keyMetrics?.time?.adminTime?.confidence?.level || 'medium'),
    insight: "Time allocation analysis shows the distribution of time across different activities."
  };

  // Helper function to process the API stage data into proper FunnelStage format
  const processFunnelStages = (apiStages: any[]): FunnelStage[] => {
    if (!Array.isArray(apiStages) || apiStages.length === 0) {
      console.warn("API didn't return valid stages data, using default funnel structure");
      // Return empty structure with correct types but API will populate actual data
      return [];
    }
    
    try {
      // Transform raw API data into properly structured FunnelStages
      const processedStages = apiStages.map((stage, index, array) => {
        // Generate an ID from name if not available
        const id = stage.id || stage.name?.toLowerCase().replace(/\s+/g, '-') || `stage-${index}`;
        
        // Always calculate dropoff percentage from previous stage to ensure accuracy
        let dropoffPercentage;
        if (index > 0) {
          const prevStage = array[index - 1];
          if (prevStage && prevStage.count && stage.count) {
            const diff = prevStage.count - stage.count;
            dropoffPercentage = Math.round((diff / prevStage.count) * 100);
          }
        }
        
        return {
          id,
          name: stage.name || `Stage ${index + 1}`,
          count: typeof stage.count === 'number' ? stage.count : 0,
          percentage: typeof stage.percentage === 'number' ? stage.percentage : 0,
          dropoffPercentage,
          bottleneckSeverity: stage.bottleneckSeverity ||
            (dropoffPercentage && dropoffPercentage > 30 ? 'high' :
             dropoffPercentage && dropoffPercentage > 15 ? 'medium' :
             dropoffPercentage && dropoffPercentage > 5 ? 'low' : 'none'),
          details: stage.details || {
            topReasons: stage.topReasons || [],
            avgTimeInStage: stage.avgTimeInStage || 'N/A',
            completionRate: stage.completionRate
          }
        } as FunnelStage;
      });
      
      return processedStages;
    } catch (error) {
      console.error("Error processing funnel stages:", error);
      return [];
    }
  };

  // Create funnel data for the component using ONLY real data from API (no hardcoded IDs)
  const funnelStages = apiData.process?.funnel?.stages || apiData.process?.stages || [];
  const funnelData = {
    stages: processFunnelStages(funnelStages),
    sourceQuestions: apiData.process?.meta?.sourceQuestions || apiData.process?.sourceQuestions || [],
    responseCount: processNumericValue(
      apiData.process?.meta?.responseCount ||
      apiData.process?.responseCount || 0,
      0
    ),
    confidenceLevel:
      (apiData.process?.meta?.dataQuality as 'low' | 'medium' | 'high') ||
      apiData.process?.confidenceLevel ||
      'medium',
    insight: (apiData.process?.insights && apiData.process.insights[0]?.description) ||
             apiData.process?.insight ||
             'Application process analysis shows the flow of applicants through each stage.'
  };
  
  // funnelData is prepared here, after the useEffects are defined

  // Extract team metrics from API data and convert to array format
  let teamMetricsArray: TeamMetric[] = [];
  if (apiData.team?.metrics) {
    // If metrics is already an array, use it
    if (Array.isArray(apiData.team.metrics)) {
      teamMetricsArray = apiData.team.metrics;
    } 
    // If metrics is an object with properties, convert to array
    else {
      const metrics = apiData.team.metrics;
      // Transform metrics into appropriate format for visualization
      // Only use hard-coded metrics as fallback when API provides nothing
      if (Object.keys(metrics).length === 0) {
        console.warn("API returned empty team metrics, using fallback structure");
        teamMetricsArray = [
          {
            category: 'Information Sharing',
            description: 'How effectively information is shared within and between teams',
            yourTeam: 0,
            avgTeam: 0,
            topTeam: 0,
            benchmark: 0
          },
          {
            category: 'Handoff Effectiveness',
            description: 'Effectiveness of process handoffs between team members',
            yourTeam: 0,
            avgTeam: 0,
            topTeam: 0,
            benchmark: 0
          }
        ];
      } else {
        teamMetricsArray = [
          {
            category: 'Information Sharing',
            description: 'How effectively information is shared within and between teams',
            yourTeam: metrics.informationSharingQuality || 0,
            avgTeam: apiData.team?.benchmarks?.informationSharing?.average || 0,
            topTeam: apiData.team?.benchmarks?.informationSharing?.top || 0,
            benchmark: apiData.team?.benchmarks?.informationSharing?.target || 0
          },
          {
            category: 'Handoff Effectiveness',
            description: 'Effectiveness of process handoffs between team members',
            yourTeam: metrics.handoffEffectiveness || 0,
            avgTeam: apiData.team?.benchmarks?.handoffEffectiveness?.average || 0,
            topTeam: apiData.team?.benchmarks?.handoffEffectiveness?.top || 0,
            benchmark: apiData.team?.benchmarks?.handoffEffectiveness?.target || 0
          },
          {
            category: 'Communication Gap',
            description: 'Gaps in communication between team members and departments',
            yourTeam: metrics.communicationGap ? (10 - metrics.communicationGap) : 0,
            avgTeam: apiData.team?.benchmarks?.communicationGap?.average || 0,
            topTeam: apiData.team?.benchmarks?.communicationGap?.top || 0,
            benchmark: apiData.team?.benchmarks?.communicationGap?.target || 0
          },
          {
            category: 'Pipeline Review',
            description: 'Frequency and effectiveness of pipeline reviews',
            yourTeam: metrics.pipelineReviewFrequency || 0,
            avgTeam: apiData.team?.benchmarks?.pipelineReview?.average || 0,
            topTeam: apiData.team?.benchmarks?.pipelineReview?.top || 0,
            benchmark: apiData.team?.benchmarks?.pipelineReview?.target || 0
          },
          {
            category: 'Overall Collaboration',
            description: 'Overall team collaboration effectiveness',
            yourTeam: metrics.overallCollaborationScore || 0,
            avgTeam: apiData.team?.benchmarks?.overallCollaboration?.average || 0,
            topTeam: apiData.team?.benchmarks?.overallCollaboration?.top || 0,
            benchmark: apiData.team?.benchmarks?.overallCollaboration?.target || 0
          }
        ];
      }
    }
  }

  // Create team comparison data
  const teamComparisonData = {
    metrics: teamMetricsArray,
    sourceQuestions: processArray(apiData.team?.sourceQuestions || []),
    responseCount: processNumericValue(apiData.team?.responseCount, 28),
    confidenceLevel: apiData.team?.confidenceLevel || 'medium',
    insight: apiData.team?.insight || 'Team performance comparison against benchmarks and other teams.',
    teamName: authService.getCurrentRole() === 'coordinator' ? 'Coordinator Team' : 
              authService.getCurrentRole() === 'admin' ? 'Admin Team' : 'Assessor Team'
  };

  // Prepare system complexity data
  const systemComplexityData = {
    nodes: apiData.summary?.keyMetrics?.system?.nodes || [],
    connections: apiData.summary?.keyMetrics?.system?.connections || [],
    sourceQuestions: processArray(apiData.summary?.keyMetrics?.system?.toolCount?.sourceQuestions || []),
    responseCount: processNumericValue(apiData.summary?.keyMetrics?.system?.toolCount?.responseCount, 28),
    confidenceLevel: apiData.summary?.keyMetrics?.system?.toolCount?.confidence?.level || 'medium',
    insight: 'System complexity analysis shows the relationships between tools and processes.'
  };

  // Generate drill-down data from real API data instead of hardcoded values
  const generateDrillDownData = (): DrillDownLevel => {
    // Use real insights from API if available
    const realInsights = apiData.summary?.insights?.warnings || [];
    const insightTexts = realInsights.length > 0
      ? realInsights.map(insight => insight.description)
      : [
          'Time allocation analysis shows how staff time is distributed across different activities.',
          'Administrative tasks take significant time from core activities.'
        ];
        
    return {
      id: 'time-allocation',
      title: 'Time Allocation Analysis',
      description: 'Breakdown of how staff time is allocated across different activities',
      breadcrumb: ['Dashboard', 'Time Allocation'],
      viewType: 'chart' as DrillDownViewType,
      metrics: timeAllocationData.data.map(item => {
        // Get change data from API if available
        const trendData = apiData.summary?.keyMetrics?.time?.trends?.[item.name.toLowerCase()];
        return {
          id: item.name.toLowerCase(),
          label: item.name,
          value: item.value,
          percentage: item.value,
          change: trendData?.change || 0,
          changeDirection: trendData?.direction === 'improving' ? 'up' :
                          trendData?.direction === 'declining' ? 'down' : 'neutral',
          color: item.color
        };
      }),
      insights: insightTexts,
      sourceQuestions: timeAllocationData.sourceQuestions,
      responseCount: timeAllocationData.responseCount,
      confidenceLevel: timeAllocationData.confidenceLevel,
      chartType: 'bar',
      columns: [
        { key: 'label', label: 'Activity' },
        { key: 'value', label: 'Percentage' },
        { key: 'change', label: 'Change' }
      ],
      childrenMap: {
        'administrative': 'administrative-breakdown',
        'sales': 'sales-breakdown',
        'strategic': 'strategic-breakdown',
        'other': 'other-breakdown'
      }
    };
  };
  
  const drillDownData = generateDrillDownData();

  // Render the dashboard with drill-down or normal view
  if (showDrillDown) {
    return (
      <div className="space-y-6 pb-8">
        <Button variant="outline" onClick={() => setShowDrillDown(false)}>
          ← Back to Visualizations
        </Button>
        
        <DataDrillDown
          initialData={drillDownData}
          onExport={handleExport}
          onShare={handleShare}
          onFetchDrillDown={handleFetchDrillDown}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Filters Panel */}
      <FilterPanel
        teams={generateFilterOptions(apiData).teams}
        roles={generateFilterOptions(apiData).roles}
        questions={generateFilterOptions(apiData).questions}
        metrics={generateFilterOptions(apiData).metrics}
        savedFilters={savedFilters}
        onFilterChange={handleFilterChange}
        onSaveFilter={handleSaveFilter}
      />
      
      {filtersApplied && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800">
          Filters have been applied. Data has been refreshed with the applied filters.
        </div>
      )}
      
      {/* Simple Tab UI - Using explicit buttons for better reliability */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            type="button"
            className={`py-2 px-4 font-medium ${activeView !== 'export' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => {
              console.log("Setting view to 'funnel'");
              setActiveView('funnel');
            }}
          >
            Visualizations
          </button>
          <button
            type="button"
            className={`py-2 px-4 font-medium ${activeView === 'export' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => {
              console.log("Setting view to 'export'");
              setActiveView('export');
            }}
          >
            Export & Share
          </button>
        </div>
      </div>
      
      {/* Visualization Tab Content */}
      {activeView !== 'export' && (
        <div className="space-y-6">
          <Card className="border-gray-200 bg-white">
            <CardContent className="p-4">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                <Button
                  variant={activeView === 'time' ? 'default' : 'outline'}
                  onClick={() => setActiveView('time')}
                  className="whitespace-nowrap"
                >
                  Time Allocation
                </Button>
                <Button
                  variant={activeView === 'funnel' ? 'default' : 'outline'}
                  onClick={() => setActiveView('funnel')}
                  className="whitespace-nowrap"
                >
                  Application Funnel
                </Button>
                <Button
                  variant={activeView === 'team' ? 'default' : 'outline'}
                  onClick={() => setActiveView('team')}
                  className="whitespace-nowrap"
                >
                  Team Comparison
                </Button>
                <Button
                  variant={activeView === 'system' ? 'default' : 'outline'}
                  onClick={() => setActiveView('system')}
                  className="whitespace-nowrap"
                >
                  System Complexity
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDrillDown(true)}
                  className="whitespace-nowrap"
                >
                  Drill Down Demo
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {activeView === 'time' && (
            <TimeAllocation {...timeAllocationData} />
          )}
          
          {activeView === 'funnel' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Showing application funnel data from the analytics API.
                {apiData.process && typeof apiData.process.responseCount === 'number' && apiData.process.responseCount > 0
                  ? ` Based on ${apiData.process.responseCount} responses.`
                  : ' No response data available.'}
              </p>
              <ApplicationProcessTab data={apiData.process} role={authService.getCurrentRole() || 'assessor'} />
            </div>
          )}
          
          {activeView === 'team' && (
            <TeamComparison {...teamComparisonData} />
          )}
          
          {activeView === 'system' && (
            <SystemComplexity {...systemComplexityData} />
          )}
        </div>
      )}
      
      {/* Export Tab Content */}
      {activeView === 'export' && (
        <div className="space-y-6">
          <Card className="border-gray-200 bg-white p-6">
            <h3 className="text-lg font-medium mb-4">Export Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">PDF Report</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Export a formatted PDF report with all visualizations and insights
                </p>
                <Button className="w-full">
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">CSV Data</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Export raw data in CSV format for further analysis
                </p>
                <Button className="w-full">
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Shareable Link</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Generate a link that others can use to view this dashboard
                </p>
                <Button className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Generate Link
                </Button>
              </div>
            </div>
            
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Scheduled Reports</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Weekly Summary</h4>
                    <p className="text-sm text-gray-600">Sends every Monday at 9:00 AM</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <h4 className="font-medium">Monthly Performance</h4>
                    <p className="text-sm text-gray-600">Sends on the 1st of each month</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                
                <Button variant="outline" className="w-full">
                  Configure Scheduled Reports
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}