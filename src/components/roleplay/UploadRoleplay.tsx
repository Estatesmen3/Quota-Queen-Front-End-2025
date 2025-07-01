
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileVideo } from "lucide-react";
import { useVideoUpload } from './hooks/useVideoUpload';
import VideoFileDisplay from './VideoFileDisplay';
import VideoDropzone from './VideoDropzone';
import UploadProgress from './UploadProgress';
import UploadButton from './UploadButton';

interface UploadRoleplayProps {
  scenarioTitle?: string;
  scenarioId?: string;
  segment?: string;
}

const UploadRoleplay: React.FC<UploadRoleplayProps> = ({ 
  scenarioTitle = "Sales Pitch", 
  scenarioId,
  segment
}) => {
  const {
    title,
    setTitle,
    videoFile,
    isUploading,
    uploadProgress,
    isProcessing,
    isPreparingStorage,
    fileInputRef,
    handleFileChange,
    removeVideo,
    handleSubmit
  } = useVideoUpload({ scenarioTitle, scenarioId, segment });

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-dopamine-cyan/10 to-blue-500/5 border-b">
        <CardTitle className="flex items-center gap-2">
          <FileVideo className="h-5 w-5 text-dopamine-cyan" />
          Upload Your Roleplay
        </CardTitle>
        <CardDescription>
          Share your video for AI analysis and feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" value={scenarioId || ''} />
          <input type="hidden" value={segment || ''} />
          
          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              placeholder="Enter a title for your video"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="video-upload">Video</Label>
            {videoFile ? (
              <VideoFileDisplay 
                videoFile={videoFile} 
                removeVideo={removeVideo} 
              />
            ) : (
              <VideoDropzone 
                fileInputRef={fileInputRef} 
                handleClick={() => fileInputRef.current?.click()} 
              />
            )}
            <input
              type="file"
              accept="video/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
          
          <UploadProgress 
            isUploading={isUploading} 
            isProcessing={isProcessing} 
            uploadProgress={uploadProgress} 
          />
          
          <UploadButton 
            isUploading={isUploading} 
            isProcessing={isProcessing}
            isPreparingStorage={isPreparingStorage}
            disabled={!videoFile} 
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default UploadRoleplay;
