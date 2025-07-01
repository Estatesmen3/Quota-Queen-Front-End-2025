
import React from 'react';
import { FileVideo, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoFileDisplayProps {
  videoFile: File;
  removeVideo: () => void;
}

const VideoFileDisplay: React.FC<VideoFileDisplayProps> = ({ 
  videoFile, 
  removeVideo 
}) => {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
      <div className="flex items-center space-x-2">
        <FileVideo className="h-5 w-5 text-dopamine-cyan" />
        <div>
          <p className="text-sm font-medium">{videoFile.name}</p>
          <p className="text-xs text-muted-foreground">
            {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={removeVideo} 
        className="h-8 w-8 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default VideoFileDisplay;
