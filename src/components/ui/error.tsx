import { AlertCircle, XCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
  className?: string;
}

export function ErrorMessage({ 
  title = "Something went wrong",
  message,
  onRetry,
  fullScreen = false,
  className 
}: ErrorMessageProps) {
  const content = (
    <div className={cn("flex flex-col items-center justify-center space-y-4 p-6", className)}>
      <div className="rounded-full bg-red-100 p-3">
        <XCircle className="h-8 w-8 text-red-600" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 max-w-md">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="max-w-md w-full mx-4">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <div className="w-full p-8 bg-red-50 rounded-lg border border-red-200">
      <div className="flex flex-col items-center justify-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-600" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-red-900">Error</h3>
          <p className="text-sm text-red-700">{message}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="destructive" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
}

export function EmptyState({ title, message, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      {icon ? (
        <div className="mb-4">{icon}</div>
      ) : (
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          <AlertCircle className="h-12 w-12 text-gray-400" />
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
