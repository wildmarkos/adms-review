'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { AuthRole } from '@/lib/analytics/types/auth';
import FunnelChart from '../visualizations/FunnelChart';
import DataDrillDown from '../drill-down/DataDrillDown';
import { Button } from '@/components/ui/button';

// Define types for funnel data
interface FunnelStageDetail {
  avgTimeInStage?: string;
  completionRate?: number;
  topReasons?: Array<{
    reason: string;
    percentage: number;
  }>;
}

interface FunnelStage {
  id: string;
  name: string;
  count: number;
  percentage: number;
  dropoffPercentage?: number;
  previousCount?: number;
  bottleneckSeverity?: 'low' | 'medium' | 'high' | 'none';
  details?: FunnelStageDetail;
}

interface FunnelData {
  stages: FunnelStage[];
  sourceQuestions: number[];
  responseCount: number;
  confidenceLevel: 'low' | 'medium' | 'high';
  insight: string;
}

export interface ApplicationProcessTabProps {
  data?: any;
  isLoading?: boolean;
  error?: string;
  role: AuthRole;
}

/**
 * Application Process Tab
 * Displays metrics and insights about the application process workflow
 */
export default function ApplicationProcessTab({
  data,
  isLoading = false,
  error,
  role
}: ApplicationProcessTabProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading application process data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Card className="my-4">
        <CardHeader>
          <CardTitle>Application Process</CardTitle>
          <CardDescription>No data available yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Get real funnel data from the API response
  const funnelData: FunnelData = {
    stages: data.stages || data.funnel?.stages || [],
    sourceQuestions: data.sourceQuestions || data.meta?.sourceQuestions ||
      (data.questions ? Object.keys(data.questions).map(Number) : []),
    responseCount: data.responseCount || data.meta?.responseCount || 0,
    confidenceLevel: data.confidenceLevel || data.meta?.dataQuality || 'medium',
    insight: data.insight || (data.insights && data.insights[0]?.description) ||
             'Application process analysis shows the flow of applicants through each stage.'
  };
  
  // Log data for debugging purposes
  console.log("ApplicationProcessTab received data:", data);
  console.log("Using funnel data with source questions:", funnelData.sourceQuestions);
  
  // Ensure percentages are calculated relative to total applicants
  if (funnelData.stages.length > 0) {
    const totalApplicants = funnelData.stages[0].count;
    
    // Recalculate percentages based on total applicants
    funnelData.stages = funnelData.stages.map(stage => ({
      ...stage,
      percentage: Math.round((stage.count / totalApplicants) * 100)
    }));
    
    console.log("Recalculated percentages relative to total applicants:",
      funnelData.stages.map(s => `${s.name}: ${s.percentage}%`));
  }

  // Use real insights from the API data or generate them dynamically
  const getProcessInsights = (): string[] => {
    // If we have insights from the API, use those
    if (data.insights && Array.isArray(data.insights) && data.insights.length > 0) {
      return data.insights.map((insight: any) =>
        typeof insight === 'string' ? insight : insight.description || ''
      ).filter(Boolean);
    }
    
    // Otherwise, generate insights based on the funnel data
    const insights: string[] = [];
    const stages = funnelData.stages;
    
    // If no stages, return empty insights
    if (!stages || stages.length === 0) {
      return ['No process data available for analysis.'];
    }
    
    // Find stage with highest dropoff
    let highestDropoffStage = null;
    let highestDropoffValue = 0;
    
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      if (stage.dropoffPercentage && stage.dropoffPercentage > highestDropoffValue) {
        highestDropoffValue = stage.dropoffPercentage;
        highestDropoffStage = stage;
      }
    }
    
    if (highestDropoffStage) {
      insights.push(
        `${highestDropoffStage.name} represents the most significant bottleneck, with ${highestDropoffStage.dropoffPercentage}% drop-off.`
      );
    }
    
    // Find efficient stages (low dropoff)
    const efficientStages = [];
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      if (stage.dropoffPercentage !== undefined &&
          stage.dropoffPercentage < 15 &&
          stage.name !== 'Initial Inquiry') {
        efficientStages.push(stage);
      }
    }
    
    if (efficientStages.length > 0) {
      const stageNames = efficientStages.map(s => s.name).join(' and ');
      const verb = efficientStages.length === 1 ? 'has' : 'have';
      insights.push(`${stageNames} ${verb} relatively low drop-off rates, showing efficiency in these stages.`);
    }
    
    // Add overall conversion insight
    const firstStage = stages[0];
    const lastStage = stages[stages.length - 1];
    
    if (firstStage && lastStage) {
      const overallConversion = Math.round((lastStage.count / firstStage.count) * 100);
      insights.push(
        `Overall conversion from initial inquiry to ${lastStage.name.toLowerCase()} is ${overallConversion}%.`
      );
      
      // Add total applicants insight
      insights.push(
        `Total applicants in process: ${firstStage.count.toLocaleString()}. Final stage reached: ${lastStage.count.toLocaleString()}.`
      );
    }
    
    // Add data source insight if we have source questions
    if (funnelData.sourceQuestions && funnelData.sourceQuestions.length > 0) {
      insights.push(
        `Analysis based on ${funnelData.responseCount} responses to Process Questions (${funnelData.sourceQuestions.length}).`
      );
    }
    
    return insights;
  };

  // Create dynamic drill-down data from API data
  const drillDownData = {
    id: 'application-process',
    title: 'Application Process Analysis',
    description: 'Detailed breakdown of application process stages and bottlenecks',
    breadcrumb: ['Dashboard', 'Application Process'],
    viewType: 'chart' as 'chart' | 'table' | 'details' | 'source',
    metrics: funnelData.stages.map((stage: FunnelStage) => ({
      id: stage.id,
      label: stage.name,
      value: stage.count,
      percentage: stage.percentage,
      change: stage.dropoffPercentage ? -stage.dropoffPercentage : 0,
      changeDirection: stage.dropoffPercentage && stage.dropoffPercentage > 0 ? 'down' as const : 'neutral' as const
    })),
    insights: getProcessInsights(),
    sourceQuestions: funnelData.sourceQuestions,
    responseCount: funnelData.responseCount,
    confidenceLevel: funnelData.confidenceLevel,
    chartType: 'bar' as 'bar' | 'pie' | 'line' | 'area',
    columns: [
      { key: 'label', label: 'Stage' },
      { key: 'value', label: 'Applicants' },
      { key: 'percentage', label: 'Percentage' }
    ],
    childrenMap: funnelData.stages.reduce((map: Record<string, string>, stage) => {
      map[stage.id] = `${stage.id}-details`;
      return map;
    }, {})
  };

  const [showDrillDown, setShowDrillDown] = useState(false);

  // Use real data for drill-down analysis
  const handleFetchDrillDown = async (parentId: string, itemId: string) => {
    console.log(`Fetching drill-down for ${parentId}, item ${itemId}`);
    
    // Find the stage data
    const stage = funnelData.stages.find((s: FunnelStage) => s.id === itemId);
    if (!stage) return drillDownData;
    
    // Small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get timing data from API if available
    const stageTiming = data.stageTiming?.averageDaysInStage?.find(
      (timing: any) => timing.stage === stage.name
    );
    
    // Get bottleneck data from API if available
    const bottleneckInfo = data.bottlenecks?.indicators?.find(
      (indicator: any) => indicator.stage === stage.name
    );
    
    // Find stage index and adjacent stages
    const stageIndex = funnelData.stages.findIndex(s => s.id === stage.id);
    const previousStage = stageIndex > 0 ? funnelData.stages[stageIndex - 1] : null;
    const nextStage = stageIndex < funnelData.stages.length - 1 ? funnelData.stages[stageIndex + 1] : null;
    
    // Calculate conversion metrics
    const previousConversion = previousStage ?
      Math.round((stage.count / previousStage.count) * 100) : 100;
    
    const nextConversion = nextStage ?
      Math.round((nextStage.count / stage.count) * 100) : 0;
    
    // Calculate completion rate
    const completionRate = stage.details?.completionRate ||
      (stage.dropoffPercentage ? 100 - stage.dropoffPercentage : 100);
    
    // Get time in stage data
    const timeInStage = stageTiming?.days ||
      (stage.details?.avgTimeInStage ?
       parseInt(stage.details.avgTimeInStage) : 0);
    
    // Generate dynamic insights based on actual data
    const stageInsights: string[] = [];
    
    // Add completion rate insight
    stageInsights.push(`${stage.name} has a completion rate of ${completionRate}%.`);
    
    // Add time insight
    if (timeInStage) {
      stageInsights.push(`Average time spent in this stage is ${timeInStage} days.`);
    }
    
    // Add conversion insights
    if (previousStage) {
      stageInsights.push(
        `${previousConversion}% of applicants from the ${previousStage.name} stage progress to ${stage.name}.`
      );
    }
    
    if (nextStage) {
      stageInsights.push(
        `${nextConversion}% of applicants in ${stage.name} progress to ${nextStage.name}.`
      );
    }
    
    // Add top reason for dropoff if available
    if (stage.details?.topReasons && stage.details.topReasons.length > 0) {
      stageInsights.push(
        `The top reason for drop-off is "${stage.details.topReasons[0].reason}" (${stage.details.topReasons[0].percentage}%).`
      );
    }
    
    // Add bottleneck insight if available
    const bottleneckSeverity = bottleneckInfo?.level || stage.bottleneckSeverity;
    if (bottleneckSeverity && bottleneckSeverity !== 'none') {
      stageInsights.push(
        `This stage is identified as a ${bottleneckSeverity.toLowerCase()} bottleneck in the process.`
      );
    }
    
    // Build raw data with real information
    const rawData: any[] = [];
    
    // Add top reasons if available
    if (stage.details?.topReasons) {
      stage.details.topReasons.forEach(reason => {
        rawData.push({
          reason: reason.reason,
          percentage: reason.percentage,
          impact: stage.dropoffPercentage ?
            `${((reason.percentage / 100) * stage.dropoffPercentage).toFixed(1)}%` : 'N/A'
        });
      });
    }
    
    // Add timing data if available
    if (stageTiming) {
      rawData.push({
        reason: 'Average days in stage',
        percentage: stageTiming.days,
        impact: stageTiming.days > 5 ? 'Potential delay' : 'On target'
      });
    }
    
    // Add bottleneck data if available
    if (data.stageTiming?.bottlenecks) {
      const stageBottleneck = data.stageTiming.bottlenecks.find(
        (b: any) => b.stage === stage.name
      );
      
      if (stageBottleneck) {
        rawData.push({
          reason: 'Time variance from target',
          percentage: Math.round(stageBottleneck.variance * 10) / 10,
          impact: stageBottleneck.severity
        });
      }
    }
    
    return {
      id: `${itemId}-details`,
      title: `${stage.name} Details`,
      description: `Detailed analysis of the ${stage.name.toLowerCase()} stage`,
      parentId: parentId,
      breadcrumb: ['Dashboard', 'Application Process', stage.name],
      viewType: 'details' as 'chart' | 'table' | 'details' | 'source',
      metrics: [
        {
          id: `${itemId}-completion`,
          label: 'Completion Rate',
          value: completionRate,
          percentage: completionRate,
          change: 0,
          changeDirection: 'neutral' as const
        },
        {
          id: `${itemId}-time`,
          label: 'Avg Time in Stage',
          value: timeInStage,
          percentage: 0,
          change: 0,
          changeDirection: 'neutral' as const
        },
        {
          id: `${itemId}-conversion-in`,
          label: 'Conversion In',
          value: previousConversion,
          percentage: previousConversion,
          change: 0,
          changeDirection: 'neutral' as const
        },
        {
          id: `${itemId}-conversion-out`,
          label: 'Conversion Out',
          value: nextConversion,
          percentage: nextConversion,
          change: 0,
          changeDirection: 'neutral' as const
        }
      ],
      insights: stageInsights,
      sourceQuestions: funnelData.sourceQuestions,
      responseCount: funnelData.responseCount,
      confidenceLevel: funnelData.confidenceLevel,
      rawData: rawData.length > 0 ? rawData : [
        { reason: 'No detailed data available', percentage: 0, impact: 'Unknown' }
      ]
    };
  };

  return (
    <div className="space-y-6">
      {!showDrillDown ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Application Process Funnel</CardTitle>
              <CardDescription>
                Interactive visualization of applicant progression through each stage
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Display analytics data source information without showing IDs */}
              <div className="bg-blue-50 p-3 rounded-md mb-4 text-xs">
                <p className="font-medium text-blue-800">Data Sources</p>
                <p className="text-blue-600">
                  Data dynamically retrieved from admissions process analytics
                </p>
                <p className="text-blue-600 mt-1">
                  Based on {funnelData.responseCount} responses ({funnelData.confidenceLevel} confidence)
                </p>
                <p className="text-blue-600 mt-1">
                  <span className="font-medium">Source:</span> Application process survey responses
                </p>
              </div>
              
              <FunnelChart {...funnelData} />
              <div className="mt-4 text-right">
                <Button onClick={() => setShowDrillDown(true)}>
                  Explore Detailed Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Process Optimization Opportunities</CardTitle>
              <CardDescription>Recommendations for improving conversion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0 ? (
                  // Use recommendations from API
                  data.recommendations.slice(0, 3).map((recommendation: any, index: number) => {
                    const title = recommendation.title || `Recommendation ${index + 1}`;
                    const description = recommendation.description || recommendation;
                    
                    // Determine background color based on priority or index
                    const bgColors = [
                      'bg-yellow-50 border-yellow-200 text-yellow-800 text-yellow-700',
                      'bg-blue-50 border-blue-200 text-blue-800 text-blue-700',
                      'bg-green-50 border-green-200 text-green-800 text-green-700'
                    ];
                    const colorIndex = index % bgColors.length;
                    const [bgColor, borderColor, textColor, textColorLight] = bgColors[colorIndex].split(' ');
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 ${bgColor} border ${borderColor} rounded-md`}
                      >
                        <h3 className={`font-medium ${textColor}`}>{title}</h3>
                        <p className={`text-sm ${textColorLight} mt-1`}>
                          {description}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  // Generate recommendations based on funnel data
                  funnelData.stages
                    .filter((stage, idx) => stage.dropoffPercentage && stage.dropoffPercentage > 15 && idx > 0)
                    .slice(0, 2)
                    .map((stage, index) => {
                      // Generate recommendation based on stage name and dropoff
                      let title = '';
                      let description = '';
                      
                      if (stage.name.includes('Document') || stage.name.includes('Collection')) {
                        title = 'Document Collection Optimization';
                        description = `The ${stage.name.toLowerCase()} phase shows a ${stage.dropoffPercentage}% drop-off rate. Consider implementing a guided document checklist and progress tracker to improve completion rates.`;
                      } else if (stage.name.includes('Initial') || stage.name.includes('Inquiry')) {
                        title = 'Initial Engagement Strategy';
                        description = `${stage.dropoffPercentage}% of initial inquiries do not progress further. Implementing an automated follow-up sequence could significantly improve conversion at this stage.`;
                      } else if (stage.name.includes('Application') || stage.name.includes('Started')) {
                        title = 'Application Process Simplification';
                        description = `${stage.dropoffPercentage}% of users who start applications don't complete them. Simplifying the form and reducing required fields could improve completion rates.`;
                      } else {
                        title = `${stage.name} Optimization`;
                        description = `This stage shows a ${stage.dropoffPercentage}% drop-off rate. Analyze user behavior and feedback to identify and address specific friction points.`;
                      }
                      
                      const bgColors = [
                        'bg-yellow-50 border-yellow-200 text-yellow-800 text-yellow-700',
                        'bg-blue-50 border-blue-200 text-blue-800 text-blue-700'
                      ];
                      const colorIndex = index % bgColors.length;
                      const [bgColor, borderColor, textColor, textColorLight] = bgColors[colorIndex].split(' ');
                      
                      return (
                        <div
                          key={index}
                          className={`p-4 ${bgColor} border ${borderColor} rounded-md`}
                        >
                          <h3 className={`font-medium ${textColor}`}>{title}</h3>
                          <p className={`text-sm ${textColorLight} mt-1`}>
                            {description}
                          </p>
                        </div>
                      );
                    })
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="mb-4">
            <Button variant="outline" onClick={() => setShowDrillDown(false)}>
              ← Back to Funnel View
            </Button>
          </div>
          
          <DataDrillDown
            initialData={drillDownData}
            onFetchDrillDown={handleFetchDrillDown}
            onExport={(data, format) => console.log(`Exporting ${format}:`, data)}
            onShare={(id) => console.log(`Sharing view: ${id}`)}
          />
        </>
      )}
    </div>
  );
}