
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VideoCallErrorProps {
  error: string;
  onRetry?: () => void;
  onCancel?: () => void;
}

const VideoCallError = ({ error, onRetry, onCancel }: VideoCallErrorProps) => {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error connecting to call</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <div className="flex gap-2 justify-end">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          
          {onRetry && (
            <Button onClick={onRetry}>
              Retry Connection
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCallError;
