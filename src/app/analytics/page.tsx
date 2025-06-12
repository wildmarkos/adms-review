'use client';

import { useState, useEffect } from 'react';
import { AuthSession, AuthRole } from '@/lib/analytics/types/auth';
import { authService } from '@/lib/analytics/services/authService';
import {
  DashboardContainer,
  LoadingState,
  ErrorState,
  AuthenticationForm
} from './components';
import DashboardIntegration from './components/integration/DashboardIntegration';

/**
 * Main Analytics Dashboard Page
 * Entry point for the analytics dashboard
 */
export default function AnalyticsPage() {
  const [authSession, setAuthSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On component mount, check authentication and load data
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const session = authService.retrieveSession();
      setAuthSession(session);
      
      if (session) {
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
      setError('Failed to load authentication status');
      setIsLoading(false);
    }
  };

  // We no longer need to load initial data here as each component handles its own data

  // Handle successful authentication
  const handleAuthSuccess = (session: AuthSession) => {
    setAuthSession(session);
    authService.storeSession(session);
    setIsLoading(false);
  };

  // Show loading state while initializing
  if (isLoading) {
    return <LoadingState message="Initializing dashboard..." />;
  }

  // Show error state if there was an error
  if (error) {
    return <ErrorState message={error} />;
  }

  // Show authentication form if not authenticated
  if (!authSession) {
    return <AuthenticationForm onAuthSuccess={handleAuthSuccess} />;
  }

  // Get the user's role from the session if available
  const userRole: AuthRole = authSession?.role || 'assessor';

  // Render the dashboard container with the integration component
  return (
    <DashboardContainer userRole={userRole}>
      <DashboardIntegration />
    </DashboardContainer>
  );
}