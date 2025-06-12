import { RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

/**
 * Component to display a loading state with an animated spinner
 */
export default function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </div>
  );
}