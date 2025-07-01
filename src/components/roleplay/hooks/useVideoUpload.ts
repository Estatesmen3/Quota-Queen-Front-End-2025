
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { 
  validateVideoFile, 
  uploadVideoToStorage, 
  createRoleplaySession, 
  addToPerformanceLibrary, 
  triggerVideoAnalysis,
  simulateProgress,
  ensureVideosBucketExists
} from '../utils/videoUtils';

interface UseVideoUploadProps {
  scenarioTitle?: string;
  scenarioId?: string;
  segment?: string;
}

export const useVideoUpload = ({ 
  scenarioTitle = "Sales Pitch", 
  scenarioId, 
  segment 
}: UseVideoUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPreparingStorage, setIsPreparingStorage] = useState(false);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!validateVideoFile(file, toast)) return;
      
      setVideoFile(file);
      
      if (!title) {
        setTitle(`${scenarioTitle || 'Sales Pitch'} - ${new Date().toLocaleDateString()}`);
      }
    }
  };
  
  const removeVideo = () => {
    setVideoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload your roleplay video",
        variant: "destructive"
      });
      return;
    }
    
    if (!videoFile) {
      toast({
        title: "Video required",
        description: "Please select a video to upload",
        variant: "destructive"
      });
      return;
    }
    
    const finalTitle = title || `${scenarioTitle || 'Sales Pitch'} - ${new Date().toLocaleDateString()}`;
    
    setIsPreparingStorage(true);
    
    try {
      // First make sure the storage bucket exists
      const bucketExists = await ensureVideosBucketExists();
      
      if (!bucketExists) {
        toast({
          title: "Storage error",
          description: "Could not access the video storage. Please try again later.",
          variant: "destructive"
        });
        setIsPreparingStorage(false);
        return;
      }
      
      setIsPreparingStorage(false);
      setIsUploading(true);
      const stopProgress = simulateProgress(setUploadProgress);
      
      // Upload video to storage
      const publicUrl = await uploadVideoToStorage(user.id, videoFile);
      if (!publicUrl) {
        stopProgress();
        throw new Error("Failed to upload video");
      }
      
      setUploadProgress(95);
      
      // Create roleplay session
      const sessionData = await createRoleplaySession(
        user.id, 
        finalTitle, 
        publicUrl, 
        segment, 
        scenarioId, 
        scenarioTitle
      );
      if (!sessionData) throw new Error("Failed to create roleplay session");
      
      // Add to performance library
      await addToPerformanceLibrary(user.id, finalTitle, publicUrl, sessionData.id);
      
      setUploadProgress(100);
      
      toast({
        title: "Upload successful",
        description: "Your video has been uploaded and is being analyzed."
      });
      
      // Trigger video analysis
      if (sessionData && sessionData.id) {
        setIsProcessing(true);
        const analysisResult = await triggerVideoAnalysis(sessionData.id, publicUrl, toast);
        
        if (analysisResult && analysisResult.success) {
          // Redirect to the feedback page
          navigate(`/roleplay/${sessionData.id}/feedback`);
          return;
        }
      }
      
      // If analysis failed or no sessionId, fall back to performance library
      navigate('/performance-library');
      
    } catch (error: any) {
      console.error("Error uploading video:", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was a problem uploading your video",
        variant: "destructive"
      });
    } finally {
      setIsPreparingStorage(false);
      setIsUploading(false);
      setIsProcessing(false);
    }
  };
  
  return {
    title,
    setTitle,
    videoFile,
    setVideoFile,
    isUploading,
    uploadProgress,
    isProcessing,
    isPreparingStorage,
    fileInputRef,
    handleFileChange,
    removeVideo,
    handleSubmit
  };
};
