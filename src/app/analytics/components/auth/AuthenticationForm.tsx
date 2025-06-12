'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, AlertTriangle } from 'lucide-react';
import { authService } from '@/lib/analytics/services/authService';
import { AuthSession } from '@/lib/analytics/types/auth';

interface AuthenticationFormProps {
  onAuthSuccess: (session: AuthSession) => void;
}

/**
 * Authentication form component for the analytics dashboard
 * Replaces the hardcoded "uniat" password with a more robust auth system
 */
export default function AuthenticationForm({ onAuthSuccess }: AuthenticationFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');

    try {
      const result = await authService.authenticate({ username, password });
      
      if (result.success && result.session) {
        // Store the session
        authService.storeSession(result.session);
        // Notify parent component
        onAuthSuccess(result.session);
      } else {
        setAuthError(result.error || 'Authentication failed');
      }
    } catch (error) {
      setAuthError('An unexpected error occurred');
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Analytics Access</CardTitle>
          <CardDescription>
            Enter your credentials to access the analytics dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                required
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
                autoComplete="current-password"
              />
            </div>
            {authError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
            <div className="text-center text-sm text-gray-500 mt-4">
              <p>For testing, use one of these credentials:</p>
              <ul className="mt-1">
                <li>admin / admin123</li>
                <li>coordinator / coord123</li>
                <li>assessor / assess123</li>
                <li>any / uniat (legacy)</li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}