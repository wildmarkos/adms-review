'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Lock } from 'lucide-react';
import { AuthSession, AuthRole } from '@/lib/analytics/types/auth';
import { authService } from '@/lib/analytics/services/authService';
import {
  TabNavigation,
  AuthenticationForm,
  LoadingState,
  ErrorState
} from '../index';

interface DashboardContainerProps {
  children: React.ReactNode;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  userRole?: AuthRole; // Added userRole prop
}

export default function DashboardContainer({
  children,
  activeTab = 'application',
  onTabChange,
  userRole // Use userRole prop if provided
}: DashboardContainerProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authSession, setAuthSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check authentication status on load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const session = authService.retrieveSession();
      setIsAuthenticated(!!session);
      setAuthSession(session);
      setLoading(false);
    } catch (err) {
      setError('Failed to check authentication status');
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.clearSession();
    setIsAuthenticated(false);
    setAuthSession(null);
  };

  const handleAuthSuccess = (session: AuthSession) => {
    setIsAuthenticated(true);
    setAuthSession(session);
    setError(null);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // This would trigger a data refresh in a real implementation
    // For Phase 1, we'll just simulate a refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleExportData = () => {
    // This would export dashboard data in a real implementation
    // For Phase 1, we'll just create a simple JSON export
    const dummyData = {
      exportedAt: new Date().toISOString(),
      user: authSession?.username,
      role: authSession?.role,
      metrics: {
        timeAllocation: {
          adminTime: 45,
          salesTime: 35,
          otherTime: 20
        }
      }
    };

    const dataStr = JSON.stringify(dummyData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Show authentication form if not authenticated
  if (!isAuthenticated) {
    return <AuthenticationForm onAuthSuccess={handleAuthSuccess} />;
  }

  // Show loading state
  if (loading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  // Show error state
  if (error) {
    return <ErrorState message={error} />;
  }

  // Determine the role to use (either from prop or from session)
  const effectiveRole: AuthRole = userRole || authSession?.role || 'assessor';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <Card className="bg-white p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                <p className="text-gray-600 mb-4">
                  Admissions process monitoring system
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="font-medium">Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Role: {effectiveRole}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Last refresh: {new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button size="sm" onClick={handleExportData} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </Card>

          {/* TAB NAVIGATION */}
          <TabNavigation
            userRole={effectiveRole}
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
          
          {/* MAIN CONTENT */}
          <div className="mt-6">
            {children}
          </div>
          
          {/* FOOTER */}
          <Card className="mt-8 bg-white p-6">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">
                Analytics Dashboard • Admissions Monitoring System
              </p>
              <p className="text-gray-500 text-xs">
                Last updated: {new Date().toLocaleString()} •
                User: {authSession?.username} •
                Role: {effectiveRole}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}