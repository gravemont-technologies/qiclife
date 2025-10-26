import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export const ErrorState = ({ 
  title = "Something went wrong",
  message,
  onRetry,
  fullScreen = false
}: ErrorStateProps) => {
  const content = (
    <Alert variant="destructive" className="max-w-2xl mx-auto">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        {message}
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-4"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        {content}
      </div>
    );
  }

  return (
    <div className="py-8">
      {content}
    </div>
  );
};
