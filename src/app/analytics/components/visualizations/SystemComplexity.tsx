'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, AlertCircle, PlusSquare, MinusSquare } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface SystemNode {
  id: string;
  name: string;
  category: 'tool' | 'process' | 'role' | 'data';
  complexity: number; // 1-10 scale
  bottleneck: boolean;
  bottleneckSeverity?: 'low' | 'medium' | 'high';
  impactedProcesses?: string[];
  userFriction?: number; // 1-10 scale
  details?: {
    description?: string;
    workarounds?: number;
    avgTimeImpact?: string;
    failureRate?: number;
  };
}

interface SystemConnection {
  source: string;
  target: string;
  strength: number; // 1-10 scale
  bottleneck: boolean;
}

interface SystemComplexityProps {
  nodes: SystemNode[];
  connections: SystemConnection[];
  title?: string;
  sourceQuestions: number[];
  responseCount: number;
  confidenceLevel: 'low' | 'medium' | 'high';
  insight?: string;
}

/**
 * System Complexity Visualization Component
 * Displays a system dependency graph highlighting bottlenecks,
 * complexity areas, and allows drilling into specific nodes
 */
export default function SystemComplexity({
  nodes,
  connections,
  title = 'System Complexity Map',
  sourceQuestions,
  responseCount,
  confidenceLevel,
  insight
}: SystemComplexityProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  // Get confidence color based on level
  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-700 bg-green-50';
      case 'medium': return 'text-yellow-700 bg-yellow-50';
      case 'low': return 'text-red-700 bg-red-50';
      default: return 'text-gray-700 bg-gray-50';
    }
  };

  // Get node color based on category
  const getNodeColor = (category: string, isBottleneck: boolean) => {
    if (isBottleneck) return 'bg-red-100 border-red-300';
    
    switch (category) {
      case 'tool': return 'bg-blue-100 border-blue-300';
      case 'process': return 'bg-green-100 border-green-300';
      case 'role': return 'bg-purple-100 border-purple-300';
      case 'data': return 'bg-yellow-100 border-yellow-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  // Get node icon based on category
  const getNodeIcon = (category: string) => {
    switch (category) {
      case 'tool': return '🔧';
      case 'process': return '⚙️';
      case 'role': return '👤';
      case 'data': return '📊';
      default: return '📦';
    }
  };

  // Get bottleneck severity badge
  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null;
    
    const colors = {
      high: 'bg-red-100 text-red-800 hover:bg-red-100',
      medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      low: 'bg-blue-100 text-blue-800 hover:bg-blue-100'
    };
    
    return (
      <Badge className={colors[severity as keyof typeof colors]}>
        {severity.toUpperCase()} BOTTLENECK
      </Badge>
    );
  };

  // Get complexity indicator
  const getComplexityIndicator = (value: number) => {
    return (
      <div className="flex space-x-0.5">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-sm ${
                i < value ? 'bg-red-500' : 'bg-gray-200'
              }`}
            />
          ))}
      </div>
    );
  };

  // Handle clicking a node
  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
  };

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 20, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 20, 60));
  };

  // Find all nodes connected to the selected node
  const getConnectedNodes = (nodeId: string) => {
    return connections
      .filter(conn => conn.source === nodeId || conn.target === nodeId)
      .map(conn => conn.source === nodeId ? conn.target : conn.source);
  };

  // Determine if a node should be highlighted based on selection
  const isHighlighted = (nodeId: string) => {
    if (!selectedNode) return false;
    if (selectedNode === nodeId) return true;
    return getConnectedNodes(selectedNode).includes(nodeId);
  };

  return (
    <Card className="border-gray-200 bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleZoomIn}
                  >
                    <PlusSquare className="h-4 w-4 text-gray-400" />
                    <span className="sr-only">Zoom in</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom in</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleZoomOut}
                  >
                    <MinusSquare className="h-4 w-4 text-gray-400" />
                    <span className="sr-only">Zoom out</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom out</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    <Info className="h-4 w-4 text-gray-400" />
                    <span className="sr-only">Source information</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click for source information</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
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

        <div className="flex mt-2 mb-4 items-center space-x-6">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-sm"></div>
            <span className="text-xs text-gray-600">Tool</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-sm"></div>
            <span className="text-xs text-gray-600">Process</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded-sm"></div>
            <span className="text-xs text-gray-600">Role</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded-sm"></div>
            <span className="text-xs text-gray-600">Data</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded-sm"></div>
            <span className="text-xs text-gray-600">Bottleneck</span>
          </div>
        </div>

        {/* System visualization area */}
        <div 
          className="relative border border-gray-200 rounded-md bg-gray-50 overflow-hidden"
          style={{ 
            height: '400px',
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'center',
            transition: 'transform 0.3s ease'
          }}
        >
          {/* Render connections first (below nodes) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map((conn, idx) => {
              const source = nodes.find(n => n.id === conn.source);
              const target = nodes.find(n => n.id === conn.target);
              
              if (!source || !target) return null;
              
              // Simplified positioning - in a real implementation, 
              // you would use proper layout algorithms
              const sourceX = 100 + (nodes.indexOf(source) % 4) * 150;
              const sourceY = 80 + Math.floor(nodes.indexOf(source) / 4) * 120;
              const targetX = 100 + (nodes.indexOf(target) % 4) * 150;
              const targetY = 80 + Math.floor(nodes.indexOf(target) / 4) * 120;
              
              const isHighlightedConnection = 
                selectedNode && 
                (selectedNode === conn.source || selectedNode === conn.target);
              
              return (
                <line 
                  key={`conn-${idx}`}
                  x1={sourceX} 
                  y1={sourceY}
                  x2={targetX}
                  y2={targetY}
                  stroke={conn.bottleneck ? '#ef4444' : '#94a3b8'}
                  strokeWidth={conn.bottleneck ? 3 : 2}
                  strokeDasharray={conn.bottleneck ? '5,5' : undefined}
                  strokeOpacity={
                    isHighlightedConnection || !selectedNode ? 1 : 0.3
                  }
                />
              );
            })}
          </svg>
          
          {/* Render nodes */}
          <div className="relative w-full h-full">
            {nodes.map((node, idx) => {
              // Simplified positioning - in a real implementation, 
              // you would use proper layout algorithms
              const left = 100 + (idx % 4) * 150;
              const top = 80 + Math.floor(idx / 4) * 120;
              
              const nodeHighlighted = isHighlighted(node.id) || !selectedNode;
              
              return (
                <div
                  key={node.id}
                  className={`absolute cursor-pointer transition-all duration-300 ${
                    getNodeColor(node.category, node.bottleneck)
                  } ${
                    selectedNode === node.id ? 'ring-2 ring-blue-500' : ''
                  } ${
                    nodeHighlighted ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
                  } border rounded-md p-2 shadow-sm`}
                  style={{
                    left: `${left}px`,
                    top: `${top}px`,
                    width: '120px',
                    height: '80px',
                    zIndex: selectedNode === node.id ? 10 : 1,
                  }}
                  onClick={() => handleNodeClick(node.id)}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center mb-1">
                      <span className="mr-1">{getNodeIcon(node.category)}</span>
                      <span className="text-xs font-medium truncate">
                        {node.name}
                      </span>
                    </div>
                    
                    {node.bottleneck && (
                      <div className="flex items-center mb-1">
                        <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                        <span className="text-xs text-red-600">Bottleneck</span>
                      </div>
                    )}
                    
                    <div className="mt-auto">
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 mr-1">Complexity:</span>
                        <div className="flex-grow">
                          {getComplexityIndicator(node.complexity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected node details */}
        {selectedNode && (
          <div className="mt-4 p-4 border border-blue-200 rounded-md bg-blue-50">
            {(() => {
              const node = nodes.find(n => n.id === selectedNode);
              if (!node) return null;
              
              return (
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium flex items-center">
                        {getNodeIcon(node.category)} {node.name}
                      </h4>
                      <div className="text-xs text-gray-500">
                        {node.category.charAt(0).toUpperCase() + node.category.slice(1)}
                      </div>
                    </div>
                    
                    {node.bottleneck && getSeverityBadge(node.bottleneckSeverity)}
                  </div>
                  
                  {node.details?.description && (
                    <p className="text-sm text-gray-600 mb-3">
                      {node.details.description}
                    </p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="p-2 bg-white rounded-md">
                      <div className="text-gray-500 mb-1">Complexity Score</div>
                      <div className="font-medium">{node.complexity}/10</div>
                    </div>
                    
                    {node.userFriction !== undefined && (
                      <div className="p-2 bg-white rounded-md">
                        <div className="text-gray-500 mb-1">User Friction</div>
                        <div className="font-medium">{node.userFriction}/10</div>
                      </div>
                    )}
                    
                    {node.details?.workarounds !== undefined && (
                      <div className="p-2 bg-white rounded-md">
                        <div className="text-gray-500 mb-1">Workarounds</div>
                        <div className="font-medium">{node.details.workarounds}</div>
                      </div>
                    )}
                    
                    {node.details?.avgTimeImpact && (
                      <div className="p-2 bg-white rounded-md">
                        <div className="text-gray-500 mb-1">Time Impact</div>
                        <div className="font-medium">{node.details.avgTimeImpact}</div>
                      </div>
                    )}
                    
                    {node.details?.failureRate !== undefined && (
                      <div className="p-2 bg-white rounded-md">
                        <div className="text-gray-500 mb-1">Failure Rate</div>
                        <div className="font-medium">{node.details.failureRate}%</div>
                      </div>
                    )}
                  </div>
                  
                  {node.impactedProcesses && node.impactedProcesses.length > 0 && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-500 mb-1">Impacted Processes:</div>
                      <div className="flex flex-wrap gap-1">
                        {node.impactedProcesses.map((process, i) => (
                          <Badge key={i} variant="outline" className="bg-white">
                            {process}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <div className="text-sm text-gray-500 mb-1">Connected to:</div>
                    <div className="flex flex-wrap gap-1">
                      {getConnectedNodes(node.id).map(connId => {
                        const connNode = nodes.find(n => n.id === connId);
                        return connNode ? (
                          <Badge 
                            key={connId} 
                            variant="outline" 
                            className={`bg-white cursor-pointer ${
                              connNode.bottleneck ? 'border-red-300' : ''
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNodeClick(connId);
                            }}
                          >
                            {getNodeIcon(connNode.category)} {connNode.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {insight && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-600">{insight}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}