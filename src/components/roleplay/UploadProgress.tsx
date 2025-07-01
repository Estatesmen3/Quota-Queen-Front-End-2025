
import React from 'react';
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  isUploading: boolean;
  isProcessing: boolean;
  uploadProgress: number;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ 
  isUploading, 
  isProcessing, 
  uploadProgress 
}) => {
  if (!isUploading && !isProcessing) return null;
  
  return (
    <div className="space-y-2">
      {isUploading && (
        <>
          <p className="text-sm font-medium">Uploading: {uploadProgress}%</p>
          <Progress value={uploadProgress} className="w-full h-2" />
        </>
      )}
      
      {isProcessing && (
        <>
          <p className="text-sm font-medium flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing video...
          </p>
          <Progress value={100} className="w-full h-2 animate-pulse" />
        </>
      )}
    </div>
  );
};

export default UploadProgress;
