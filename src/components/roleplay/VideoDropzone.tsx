
import React from 'react';
import { FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VideoDropzoneProps {
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleClick: () => void;
}

const VideoDropzone: React.FC<VideoDropzoneProps> = ({ 
  fileInputRef, 
  handleClick 
}) => {
  return (
    <div className="border-2 border-dashed rounded-md p-8 text-center border-muted-foreground/20">
      <Input
        id="video-upload"
        type="file"
        accept="video/*"
        className="hidden"
        ref={fileInputRef}
      />
      <FileVideo className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
      <p className="text-sm font-medium mb-1">Drag and drop a video file or click to browse</p>
      <p className="text-xs text-muted-foreground mb-4">MP4, WebM, or MOV up to 100MB</p>
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        className="mx-auto"
      >
        Select Video
      </Button>
    </div>
  );
};

export default VideoDropzone;
