import { supabase, ensureBucketExists } from "@/lib/supabase";
import { toast as Toast } from "@/hooks/use-toast";

export const validateVideoFile = (file: File, toast: typeof Toast): boolean => {
  // Check file type
  const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  if (!validTypes.includes(file.type)) {
    toast({
      title: "Invalid file type",
      description: "Please upload an MP4, WebM, or MOV video file",
      variant: "destructive"
    });
    return false;
  }
  
  // Check file size (100MB max)
  const maxSize = 100 * 1024 * 1024; // 100MB in bytes
  if (file.size > maxSize) {
    toast({
      title: "File too large",
      description: "Please upload a video smaller than 100MB",
      variant: "destructive"
    });
    return false;
  }
  
  return true;
};

export const simulateProgress = (setProgress: React.Dispatch<React.SetStateAction<number>>): () => void => {
  // Simulate upload progress for better UX
  const interval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 90) return prev;
      return prev + Math.random() * 5;
    });
  }, 500);
  
  return () => clearInterval(interval);
};

export const ensureVideosBucketExists = async (): Promise<boolean> => {
  try {
    return await ensureBucketExists('videos');
  } catch (error) {
    console.error("Error ensuring videos bucket exists:", error);
    return false;
  }
};

export const uploadVideoToStorage = async (userId: string, file: File): Promise<string | null> => {
  try {
    // Make sure the videos bucket exists before uploading
    const bucketExists = await ensureVideosBucketExists();
    
    if (!bucketExists) {
      console.error("Failed to ensure videos bucket exists");
      throw new Error("Storage is not properly configured. Please try again later.");
    }
    
    // Create a unique file path with timestamp
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const filePath = `${userId}/${timestamp}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(filePath, file);
    
    if (error) throw error;
    
    // Get public URL
    const { data: urlData } = await supabase.storage
      .from('videos')
      .getPublicUrl(filePath);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading to storage:", error);
    return null;
  }
};

export const createRoleplaySession = async (
  userId: string,
  title: string,
  videoUrl: string,
  segment?: string,
  scenarioId?: string,
  scenarioTitle?: string
) => {
  try {
    // Generate a sample scenario if none provided
    const defaultScenario = {
      title: scenarioTitle || title,
      company_description: "A software company providing CRM solutions.",
      buyer_profile: "IT Director looking to improve sales team efficiency.",
      scenario_background: "Initial discovery call to understand needs and pain points.",
      key_objectives: ["Identify pain points", "Establish rapport", "Schedule follow-up"],
      common_objections: ["Price concerns", "Implementation timeline", "Training requirements"],
      talking_points: ["ROI benefits", "Implementation process", "Customer success stories"],
      evaluation_criteria: ["Clear value proposition", "Active listening", "Objection handling"],
      difficulty: "intermediate"
    };
    
    // Insert into roleplay_sessions table
    const { data, error } = await supabase
      .from('roleplay_sessions')
      .insert({
        student_id: userId,
        scenario_title: title,
        scenario_data: defaultScenario,
        industry: "technology",
        difficulty: "intermediate",
        status: "in_progress",
        segment: segment || "full_roleplay",
        upload_url: videoUrl,
        feedback_status: "pending"
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error creating roleplay session:", error);
    return null;
  }
};

export const addToPerformanceLibrary = async (
  userId: string,
  title: string,
  videoUrl: string,
  relatedSessionId?: string
) => {
  try {
    const { data, error } = await supabase
      .from('performance_library')
      .insert({
        user_id: userId,
        title,
        video_url: videoUrl,
        source: 'upload',
        related_session_id: relatedSessionId
      });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error adding to performance library:", error);
    return null;
  }
};

export const triggerVideoAnalysis = async (
  sessionId: string,
  videoUrl: string,
  toast: typeof Toast
) => {
  try {
    // Call the analyze-speech edge function
    const { data, error } = await supabase.functions.invoke("analyze-speech", {
      body: {
        sessionId,
        sessionType: 'roleplay',
        recording_url: videoUrl
      }
    });
    
    if (error) {
      console.error("Error analyzing speech:", error);
      toast({
        title: "Analysis failed",
        description: "Could not analyze your roleplay session. Please try again later.",
        variant: "destructive"
      });
      return null;
    }
    
    // Update the roleplay session status
    await supabase
      .from('roleplay_sessions')
      .update({
        status: 'completed',
        feedback_status: 'completed'
      })
      .eq('id', sessionId);
    
    return data;
  } catch (error) {
    console.error("Error triggering analysis:", error);
    toast({
      title: "Analysis error",
      description: "There was a problem analyzing your video. Please try again later.",
      variant: "destructive"
    });
    return null;
  }
};
