'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { AuthRole } from '@/lib/analytics/types/auth';

export interface TeamCollaborationTabProps {
  data?: any;
  isLoading?: boolean;
  error?: string;
  role: AuthRole;
}

/**
 * Team Collaboration Tab
 * Displays metrics and insights about team communication and handoffs
 */
export default function TeamCollaborationTab({
  data,
  isLoading = false,
  error,
  role
}: TeamCollaborationTabProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading team collaboration data...</p>
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
          <CardTitle>Team Collaboration</CardTitle>
          <CardDescription>No data available yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Placeholder implementation - will be enhanced in future phases
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team Collaboration Metrics</CardTitle>
          <CardDescription>Key metrics for team collaboration</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Team collaboration metrics dashboard content will appear here.</p>
          <p>Role: {role}</p>
          {/* Actual implementation will display real metrics from data */}
        </CardContent>
      </Card>
    </div>
  );
}