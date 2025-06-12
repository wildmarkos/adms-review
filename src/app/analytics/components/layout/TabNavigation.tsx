'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthRole, RolePermissions } from '@/lib/analytics/types/auth';
import { authService } from '@/lib/analytics/services/authService';

// Tab components
import ApplicationProcessTab from '../tabs/ApplicationProcessTab';
import TeamCollaborationTab from '../tabs/TeamCollaborationTab';
import SystemEfficiencyTab from '../tabs/SystemEfficiencyTab';
import ImprovementActionsTab from '../tabs/ImprovementActionsTab';

// Interface for tab configuration
interface TabConfig {
  id: string;
  label: string;
  description: string;
  permissionKey?: keyof RolePermissions;
  component: React.ReactNode;
  visible: boolean | ((role: AuthRole) => boolean);
  apiEndpoint: string;
}

interface TabNavigationProps {
  userRole: AuthRole;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

/**
 * Enhanced Tab navigation component for the analytics dashboard
 * Implements the four main tabs from the refactoring plan with role-based filtering:
 * 1. Application Process
 * 2. Team Collaboration
 * 3. System Efficiency
 * 4. Improvement Actions
 */
export default function TabNavigation({
  userRole,
  activeTab = 'application',
  onTabChange
}: TabNavigationProps) {
  // Use internal state if no external control is provided
  const [internalActiveTab, setInternalActiveTab] = useState(activeTab);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string>>({});
  const [tabData, setTabData] = useState<Record<string, any>>({});
  
  // Get user permissions
  const permissions = authService.getCurrentPermissions();
  
  // Ensure internal state stays in sync with prop
  useEffect(() => {
    setInternalActiveTab(activeTab);
  }, [activeTab]);
  
  // Determine which state to use (controlled vs uncontrolled)
  const currentTab = activeTab || internalActiveTab;

  // Define tabs with role-based visibility
  const tabs: TabConfig[] = [
    {
      id: 'application',
      label: 'Application Process',
      description: 'Metrics and insights about the application workflow process',
      permissionKey: 'canViewAssessorMetrics',
      component: <ApplicationProcessTab data={tabData.application} isLoading={loading.application} error={error.application} role={userRole} />,
      visible: true, // Visible to all roles
      apiEndpoint: '/api/analytics/process'
    },
    {
      id: 'collaboration',
      label: 'Team Collaboration',
      description: 'Metrics and insights about team communication and handoffs',
      permissionKey: 'canViewCoordinatorMetrics',
      component: <TeamCollaborationTab data={tabData.collaboration} isLoading={loading.collaboration} error={error.collaboration} role={userRole} />,
      visible: (role) => role === 'admin' || role === 'coordinator', // Only admins and coordinators
      apiEndpoint: '/api/analytics/team'
    },
    {
      id: 'efficiency',
      label: 'System Efficiency',
      description: 'Metrics and insights about system tools and processes',
      permissionKey: 'canViewAssessorMetrics',
      component: <SystemEfficiencyTab data={tabData.efficiency} isLoading={loading.efficiency} error={error.efficiency} role={userRole} />,
      visible: true, // Visible to all roles
      apiEndpoint: '/api/analytics/summary'
    },
    {
      id: 'actions',
      label: 'Improvement Actions',
      description: 'Prioritized recommendations and action plans',
      permissionKey: 'canAccessRecommendations',
      component: <ImprovementActionsTab data={tabData.actions} isLoading={loading.actions} error={error.actions} role={userRole} />,
      visible: (role) => authService.hasPermission('canAccessRecommendations'), // Based on specific permission
      apiEndpoint: '/api/analytics/recommendations'
    }
  ];

  // Filter tabs based on role visibility and permissions
  const visibleTabs = tabs.filter(tab => {
    const isVisible = typeof tab.visible === 'function' ? tab.visible(userRole) : tab.visible;
    const hasPermission = tab.permissionKey ? permissions?.[tab.permissionKey] === true : true;
    return isVisible && hasPermission;
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    // Update internal state
    setInternalActiveTab(value);
    
    // Call parent handler if provided
    if (onTabChange) {
      onTabChange(value);
    }
    
    // Load data for this tab if not already loaded
    loadTabData(value);
  };
  
  // Load data for a specific tab
  const loadTabData = async (tabId: string) => {
    // Skip if data is already loaded or loading
    if (tabData[tabId] || loading[tabId]) return;
    
    // Find tab config
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;
    
    // Set loading state
    setLoading(prev => ({ ...prev, [tabId]: true }));
    setError(prev => ({ ...prev, [tabId]: '' }));
    
    try {
      // Fetch data from API endpoint
      const response = await fetch(`${tab.apiEndpoint}?role=${userRole}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Store data
      setTabData(prev => ({ ...prev, [tabId]: data }));
    } catch (err) {
      console.error(`Error loading data for tab ${tabId}:`, err);
      setError(prev => ({ 
        ...prev, 
        [tabId]: err instanceof Error ? err.message : 'Failed to load data' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [tabId]: false }));
    }
  };
  
  // Load data for the active tab on initial render
  useEffect(() => {
    if (currentTab) {
      loadTabData(currentTab);
    }
  }, [currentTab]);
  
  // Helper function to render tab content
  const renderTabContent = (tab: TabConfig) => {
    if (loading[tab.id]) {
      return (
        <div className="flex flex-col items-center justify-center p-12">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading {tab.label} data...</p>
        </div>
      );
    }
    
    if (error[tab.id]) {
      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error[tab.id]}
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={() => loadTabData(tab.id)}>
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      );
    }
    
    if (!tabData[tab.id] && !loading[tab.id]) {
      return (
        <Card className="my-4">
          <CardHeader>
            <CardTitle>{tab.label}</CardTitle>
            <CardDescription>{tab.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => loadTabData(tab.id)}>
              Load Data
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    return tab.component;
  };

  // Display a message if no tabs are available for this role
  if (visibleTabs.length === 0) {
    return (
      <Alert className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Access</AlertTitle>
        <AlertDescription>
          You don't have access to any analytics dashboards. Please contact your administrator.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="analytics-dashboard">
      <div className="role-indicator mb-4">
        <Alert variant="default" className="bg-blue-50 border-blue-200">
          <CheckCircle2 className="h-4 w-4 text-blue-500" />
          <AlertTitle className="text-blue-700">
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
          </AlertTitle>
          <AlertDescription className="text-blue-600">
            Viewing analytics data tailored for your role
          </AlertDescription>
        </Alert>
      </div>
      
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
          {visibleTabs.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              {tab.label}
              {loading[tab.id] && <Loader2 className="ml-2 h-3 w-3 animate-spin" />}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {tabs.map(tab => (
          <TabsContent key={`content-${tab.id}`} value={tab.id} className="mt-6">
            {/* Only render visible tabs */}
            {(typeof tab.visible === 'function' ? tab.visible(userRole) : tab.visible) && 
              (tab.permissionKey ? permissions?.[tab.permissionKey] === true : true) && 
              renderTabContent(tab)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}