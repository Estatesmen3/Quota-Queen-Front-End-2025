
import React from 'react';
import { Loader2, Upload, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadButtonProps {
  isUploading: boolean;
  isProcessing: boolean;
  isPreparingStorage?: boolean;
  disabled: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({ 
  isUploading, 
  isProcessing, 
  isPreparingStorage,
  disabled 
}) => {
  return (
    <Button
      type="submit"
      className="w-full bg-gradient-to-r from-dopamine-cyan to-blue-500 hover:from-dopamine-cyan/90 hover:to-blue-500/90 text-white"
      disabled={disabled || isUploading || isProcessing || isPreparingStorage}
    >
      {isPreparingStorage ? (
        <>
          <Database className="mr-2 h-4 w-4 animate-pulse" />
          Preparing Storage...
        </>
      ) : isUploading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Uploading...
        </>
      ) : isProcessing ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        <>
          <Upload className="mr-2 h-4 w-4" />
          Upload Video
        </>
      )}
    </Button>
  );
};

export default UploadButton;
