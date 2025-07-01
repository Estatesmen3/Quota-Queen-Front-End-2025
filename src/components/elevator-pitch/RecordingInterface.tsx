import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Mic, FileVideo, Video, Camera, CameraOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase, ensureBucketExists } from '@/lib/supabase';

interface RecordingInterfaceProps {
  onUploadSuccess?: (sessionId: string) => void;
}

const RecordingInterface: React.FC<RecordingInterfaceProps> = ({ onUploadSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<BlobPart[]>([]);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPreviewMode && previewUrl) {
        videoRef.current.srcObject = null;
        videoRef.current.src = previewUrl;
        videoRef.current.controls = true;
        videoRef.current.muted = false;
        
        videoRef.current.play().catch(err => {
          console.error("Error playing preview video:", err);
        });
      } else if (videoStream) {
        videoRef.current.srcObject = videoStream;
        videoRef.current.controls = false;
        videoRef.current.muted = true;
        videoRef.current.play().catch(err => {
          console.error("Error playing video:", err);
        });
      }
    }
  }, [videoStream, previewUrl, isPreviewMode]);

  const startCamera = async () => {
    try {
      const constraints = {
        audio: true,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setVideoStream(stream);
      setIsPreviewMode(false);
      setPreviewUrl(null);
      
      toast({
        title: "Camera started",
        description: "Your camera is now active. Click 'Start Recording' when you're ready.",
      });
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast({
        title: "Camera error",
        description: "Could not access your camera or microphone. Please check your permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => {
        track.stop();
      });
      
      setVideoStream(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const startRecording = () => {
    if (!videoStream) return;
    
    setRecordedChunks([]);
    setRecordedBlob(null);
    setPreviewUrl(null);
    setRecordingTime(0);
    setIsPreviewMode(false);
    
    try {
      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      const mediaRecorder = new MediaRecorder(videoStream, options);
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setRecordedChunks(prev => [...prev, e.data]);
        }
      };
      
      mediaRecorder.onstop = () => {
        const chunks = recordedChunks.slice();
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedBlob(blob);
        
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setIsPreviewMode(true);
        
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        toast({
          title: "Recording complete",
          description: `Your ${recordingTime}s pitch has been recorded. You can now upload it or re-record.`,
        });
      };
      
      mediaRecorder.start(1000);
      setIsRecording(true);
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= 90) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
      
      toast({
        title: "Recording started",
        description: "You're now recording your elevator pitch. Aim for 30-60 seconds.",
      });
    } catch (err) {
      console.error("Error starting recording:", err);
      toast({
        title: "Recording error",
        description: "Could not start recording. Please try again.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRecording(false);
  };

  const ensureVideosBucketExists = async () => {
    try {
      setIsChecking(true);
      
      const bucketExists = await ensureBucketExists('videos');
      
      if (!bucketExists) {
        throw new Error("Unable to create storage for videos. Please contact support.");
      }
      
      return true;
    } catch (error) {
      console.error("Error ensuring videos bucket exists:", error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const uploadRecording = async () => {
    if (!recordedBlob || !user) return;
    
    try {
      setIsUploading(true);
      
      toast({
        title: "Preparing upload",
        description: "Getting ready to upload your elevator pitch...",
      });
      
      const bucketExists = await ensureVideosBucketExists();
      
      if (!bucketExists) {
        throw new Error("Could not access or create the videos storage bucket. Please try again later.");
      }
      
      toast({
        title: "Uploading",
        description: "Your elevator pitch is being uploaded...",
      });
      
      const timestamp = new Date().getTime();
      const filePath = `${user.id}/${timestamp}-elevator-pitch.webm`;
      
      console.log("Attempting to upload to Supabase Storage bucket 'videos' at path:", filePath);
      
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(filePath, recordedBlob, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error("Supabase storage upload error:", error);
        throw error;
      }
      
      console.log("Upload successful:", data);
      
      const { data: urlData } = await supabase.storage
        .from('videos')
        .getPublicUrl(filePath);
      
      const videoUrl = urlData.publicUrl;
      console.log("Video URL:", videoUrl);
      
      const { data: sessionData, error: sessionError } = await supabase
        .from('roleplay_sessions')
        .insert({
          student_id: user.id,
          scenario_title: "Elevator Pitch",
          upload_url: videoUrl,
          segment: "elevator_pitch",
          status: "in_progress",
          feedback_status: "pending"
        })
        .select()
        .single();
      
      if (sessionError) {
        console.error("Supabase session creation error:", sessionError);
        throw sessionError;
      }
      
      console.log("Session created:", sessionData);
      
      const { error: analysisError } = await supabase.functions.invoke("analyze-speech", {
        body: {
          sessionId: sessionData.id,
          sessionType: 'roleplay',
          recording_url: videoUrl
        }
      });
      
      if (analysisError) {
        console.error("Supabase function invocation error:", analysisError);
        throw analysisError;
      }
      
      toast({
        title: "Upload successful",
        description: "Your elevator pitch has been uploaded and is being analyzed.",
      });
      
      setRecordedBlob(null);
      setRecordedChunks([]);
      setPreviewUrl(null);
      setRecordingTime(0);
      stopCamera();
      
      if (onUploadSuccess && sessionData?.id) {
        onUploadSuccess(sessionData.id);
      } else if (sessionData?.id) {
        window.location.href = `/roleplay/${sessionData.id}/feedback`;
      }
    } catch (error: any) {
      console.error("Error uploading video:", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was a problem uploading your video",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  React.useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-full aspect-video bg-muted/50 rounded-lg flex items-center justify-center border overflow-hidden relative">
        {videoStream || (isPreviewMode && previewUrl) ? (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted={!isPreviewMode}
            controls={isPreviewMode}
            className="w-full h-full object-cover"
          />
        ) : (
          <Video className="h-12 w-12 text-muted-foreground/50" />
        )}
        
        {isRecording && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded-md flex items-center gap-1">
            <span className="animate-pulse h-2 w-2 bg-white rounded-full"></span>
            <span className="text-sm font-medium">{recordingTime}s</span>
          </div>
        )}
      </div>
      
      <p className="text-center text-muted-foreground max-w-md">
        {!videoStream && !isPreviewMode 
          ? "Use your device's camera to record yourself delivering a 30-60 second elevator pitch."
          : isPreviewMode 
            ? "Review your recording or upload it to get AI feedback."
            : "You're ready to record your elevator pitch. Aim for 30-60 seconds."}
      </p>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {!videoStream && !isPreviewMode ? (
          <Button 
            onClick={startCamera}
            className="bg-gradient-to-r from-dopamine-purple to-dopamine-pink hover:from-dopamine-purple/90 hover:to-dopamine-pink/90 text-white"
          >
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        ) : videoStream && !isRecording && !isPreviewMode ? (
          <>
            <Button
              onClick={startRecording}
              className="bg-gradient-to-r from-dopamine-purple to-dopamine-pink hover:from-dopamine-purple/90 hover:to-dopamine-pink/90 text-white"
            >
              <Mic className="mr-2 h-4 w-4" />
              Start Recording
            </Button>
            <Button
              onClick={stopCamera}
              variant="outline"
            >
              <CameraOff className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </>
        ) : isRecording ? (
          <Button
            onClick={stopRecording}
            variant="destructive"
          >
            Stop Recording
          </Button>
        ) : isPreviewMode ? (
          <>
            <Button
              onClick={uploadRecording}
              disabled={isUploading || isChecking}
              className="bg-gradient-to-r from-dopamine-purple to-dopamine-pink hover:from-dopamine-purple/90 hover:to-dopamine-pink/90 text-white"
            >
              {isUploading || isChecking ? (
                <>
                  <span className="animate-pulse h-2 w-2 bg-white rounded-full mr-2"></span>
                  {isChecking ? "Checking storage..." : "Uploading..."}
                </>
              ) : (
                <>
                  <FileVideo className="mr-2 h-4 w-4" />
                  Upload Recording
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                if (previewUrl) {
                  URL.revokeObjectURL(previewUrl);
                }
                setRecordedBlob(null);
                setRecordedChunks([]);
                setPreviewUrl(null);
                setIsPreviewMode(false);
                startCamera();
              }}
              variant="outline"
            >
              Re-record
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default RecordingInterface;
