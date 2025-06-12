'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Download, 
  BarChart3, 
  PieChart,
  LineChart, 
  Table, 
  Info, 
  Share2,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Define interfaces for data drill-down
export type DrillDownViewType = 'chart' | 'table' | 'details' | 'source';

export interface DrillDownMetric {
  id: string;
  label: string;
  value: number;
  percentage: number;
  change: number;
  changeDirection: 'up' | 'down' | 'neutral';
  color?: string;
}

export interface DrillDownLevel {
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

interface DataDrillDownProps {
  initialData: DrillDownLevel;
  onExport: (data: any, format: 'csv' | 'pdf' | 'json') => void;
  onShare: (id: string) => void;
  onFetchDrillDown: (parentId: string, itemId: string) => Promise<DrillDownLevel>;
}

/**
 * Data Drill-Down Component
 * Provides interactive data exploration with drill-down capabilities,
 * multiple view types, and export options.
 */
export default function DataDrillDown({
  initialData,
  onExport,
  onShare,
  onFetchDrillDown
}: DataDrillDownProps) {
  const [currentLevel, setCurrentLevel] = useState<DrillDownLevel>(initialData);
  const [history, setHistory] = useState<DrillDownLevel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<DrillDownViewType>(initialData.viewType);
  const [showSourceInfo, setShowSourceInfo] = useState(false);

  // Get confidence color based on level
  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-700 bg-green-50';
      case 'medium': return 'text-yellow-700 bg-yellow-50';
      case 'low': return 'text-red-700 bg-red-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  // Handle navigation to a child drill-down level
  const handleDrillDown = async (metricId: string) => {
    if (!currentLevel.childrenMap || !currentLevel.childrenMap[metricId]) return;
    
    setIsLoading(true);
    try {
      const childData = await onFetchDrillDown(currentLevel.id, metricId);
      
      // Add current level to history
      setHistory(prev => [...prev, currentLevel]);
      
      // Set new current level
      setCurrentLevel(childData);
      setCurrentView(childData.viewType || 'chart');
    } catch (error) {
      console.error('Error fetching drill-down data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle navigation back to parent level
  const handleNavigateBack = () => {
    if (history.length === 0) return;
    
    // Get last item from history
    const lastItem = history[history.length - 1];
    
    // Remove last item from history
    setHistory(prev => prev.slice(0, prev.length - 1));
    
    // Set current level to last history item
    setCurrentLevel(lastItem);
    setCurrentView(lastItem.viewType || 'chart');
  };

  // Get icon for change direction
  const getChangeIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <ArrowUp className="h-3 w-3 text-green-500" />;
      case 'down': return <ArrowDown className="h-3 w-3 text-red-500" />;
      default: return <Minus className="h-3 w-3 text-gray-400" />;
    }
  };

  // Render appropriate visualization based on chart type
  const renderChart = () => {
    if (!currentLevel.chartType || currentLevel.chartType === 'bar') {
      return (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={currentLevel.metrics}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <RechartsTooltip 
                formatter={(value: any, name: any, props: any) => [`${value}%`, props.payload.label]}
                labelFormatter={(label) => `Category: ${label}`}
              />
              <Bar dataKey="percentage" name="Percentage">
                {currentLevel.metrics.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || `#${Math.floor(Math.random()*16777215).toString(16)}`} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    } else if (currentLevel.chartType === 'pie') {
      return (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={currentLevel.metrics}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="label"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {currentLevel.metrics.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color || `#${Math.floor(Math.random()*16777215).toString(16)}`} 
                  />
                ))}
              </Pie>
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      );
    }
    
    return <div className="p-8 text-center text-gray-500">No chart data available</div>;
  };

  // Render table view
  const renderTable = () => {
    if (!currentLevel.columns || !currentLevel.metrics) {
      return <div className="p-8 text-center text-gray-500">No table data available</div>;
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {currentLevel.columns.map(col => (
                <th
                  key={col.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentLevel.metrics.map((metric, idx) => (
              <tr 
                key={metric.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  if (currentLevel.childrenMap && currentLevel.childrenMap[metric.id]) {
                    handleDrillDown(metric.id);
                  }
                }}
              >
                {currentLevel.columns?.map(col => {
                  const key = col.key as keyof typeof metric;
                  let cellContent: React.ReactNode = metric[key];
                  
                  if (key === 'change') {
                    cellContent = (
                      <div className="flex items-center">
                        {getChangeIcon(metric.changeDirection)}
                        <span className="ml-1">{Math.abs(metric.change)}%</span>
                      </div>
                    );
                  }
                  
                  if (key === 'percentage') {
                    cellContent = `${metric.percentage}%`;
                  }
                  
                  return (
                    <td key={`${metric.id}-${col.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render source data view
  const renderSourceView = () => {
    return (
      <div className="p-4">
        <h4 className="text-sm font-medium mb-3">Source Information</h4>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="text-xs text-gray-500 mb-1">Data source:</div>
            <div className="font-medium">Questions {currentLevel.sourceQuestions.join(', ')}</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="text-xs text-gray-500 mb-1">Responses:</div>
            <div className="font-medium">{currentLevel.responseCount}</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="text-xs text-gray-500 mb-1">Confidence:</div>
            <div className="font-medium">
              <span className={`px-2 py-0.5 rounded-full ${getConfidenceColor(currentLevel.confidenceLevel)}`}>
                {currentLevel.confidenceLevel}
              </span>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-md">
            <div className="text-xs text-gray-500 mb-1">View type:</div>
            <div className="font-medium">{currentLevel.viewType.charAt(0).toUpperCase() + currentLevel.viewType.slice(1)}</div>
          </div>
        </div>
        
        {currentLevel.rawData && currentLevel.rawData.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Raw Data Sample</h4>
            <div className="overflow-x-auto border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(currentLevel.rawData[0]).map(key => (
                      <th
                        key={key}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentLevel.rawData.map((item, idx) => (
                    <tr key={idx}>
                      {Object.entries(item).map(([key, value]) => (
                        <td key={`${idx}-${key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render details view
  const renderDetailsView = () => {
    return (
      <div className="p-4">
        <h4 className="text-sm font-medium mb-3">Metric Details</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {currentLevel.metrics.map(metric => (
            <div 
              key={metric.id}
              className="p-4 border rounded-md hover:border-blue-300 cursor-pointer"
              onClick={() => {
                if (currentLevel.childrenMap && currentLevel.childrenMap[metric.id]) {
                  handleDrillDown(metric.id);
                }
              }}
            >
              <div className="font-medium mb-1">{metric.label}</div>
              <div className="text-2xl font-bold mb-2">
                {metric.value}
                <span className="text-sm text-gray-500 ml-1">({metric.percentage}%)</span>
              </div>
              
              <div className="flex items-center text-sm">
                <span className="mr-1">Change:</span>
                <div className="flex items-center">
                  {getChangeIcon(metric.changeDirection)}
                  <span className="ml-1">{Math.abs(metric.change)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {currentLevel.insights.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Insights</h4>
            <div className="space-y-2">
              {currentLevel.insights.map((insight, idx) => (
                <div key={idx} className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm">
                  {insight}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="border-gray-200 bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              {history.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleNavigateBack}
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              
              <h2 className="text-xl font-semibold text-gray-900">{currentLevel.title}</h2>
            </div>
            
            {currentLevel.breadcrumb.length > 0 && (
              <div className="flex items-center text-xs text-gray-500">
                {currentLevel.breadcrumb.map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    {idx > 0 && <span className="mx-1">›</span>}
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowSourceInfo(!showSourceInfo)}
                  >
                    <Info className="h-4 w-4 mr-1" />
                    Source
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View source information</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onExport(currentLevel, 'csv')}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export data as CSV</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onShare(currentLevel.id)}
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share this view</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {showSourceInfo && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md text-xs">
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Data source:</span>
              <span className="font-medium">Questions {currentLevel.sourceQuestions.join(', ')}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="text-gray-500">Responses:</span>
              <span className="font-medium">{currentLevel.responseCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Confidence:</span>
              <span className={`font-medium px-2 py-0.5 rounded-full ${getConfidenceColor(currentLevel.confidenceLevel)}`}>
                {currentLevel.confidenceLevel}
              </span>
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">{currentLevel.description}</p>
        </div>
        
        <div className="mb-4 flex space-x-2">
          <Button
            variant={currentView === 'chart' ? 'default' : 'outline'}
            onClick={() => setCurrentView('chart')}
            size="sm"
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Chart
          </Button>
          
          <Button
            variant={currentView === 'table' ? 'default' : 'outline'}
            onClick={() => setCurrentView('table')}
            size="sm"
          >
            <Table className="h-4 w-4 mr-1" />
            Table
          </Button>
          
          <Button
            variant={currentView === 'details' ? 'default' : 'outline'}
            onClick={() => setCurrentView('details')}
            size="sm"
          >
            <Info className="h-4 w-4 mr-1" />
            Details
          </Button>
          
          <Button
            variant={currentView === 'source' ? 'default' : 'outline'}
            onClick={() => setCurrentView('source')}
            size="sm"
          >
            <Table className="h-4 w-4 mr-1" />
            Source
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-md">
            {currentView === 'chart' && renderChart()}
            {currentView === 'table' && renderTable()}
            {currentView === 'details' && renderDetailsView()}
            {currentView === 'source' && renderSourceView()}
          </div>
        )}
        
        <div className="mt-4">
          {currentLevel.insights.length > 0 && currentView !== 'details' && (
            <div>
              <h4 className="text-sm font-medium mb-2">Key Insights</h4>
              <div className="space-y-2">
                {currentLevel.insights.slice(0, 2).map((insight, idx) => (
                  <div key={idx} className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm">
                    {insight}
                  </div>
                ))}
                {currentLevel.insights.length > 2 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setCurrentView('details')}
                  >
                    View all {currentLevel.insights.length} insights
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}