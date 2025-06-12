import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ErrorStateProps {
  message: string;
}

/**
 * Component to display an error state with a descriptive message
 */
export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="w-full max-w-md">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
          <p className="text-gray-600 text-sm mt-4 text-center">
            Try refreshing the page or contact support if the problem persists.
          </p>
        </div>
      </div>
    </div>
  );
}