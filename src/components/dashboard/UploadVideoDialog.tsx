
import React, { useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Upload, Video, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo"
];

const videoSchema = z.object({
  title: z.string().min(2, {
    message: "Video title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  video: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "File size must be less than 100MB")
    .refine(
      (file) => ACCEPTED_VIDEO_TYPES.includes(file.type),
      "Only MP4, WebM, MOV, and AVI video formats are supported"
    ),
});

type VideoFormValues = z.infer<typeof videoSchema>;

interface UploadVideoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVideoUploaded: () => void;
}

export function UploadVideoDialog({ open, onOpenChange, onVideoUploaded }: UploadVideoDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<VideoFormValues>({
    resolver: zodResolver(videoSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // Basic validation
      if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Only MP4, WebM, MOV, and AVI video formats are supported",
          variant: "destructive",
        });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: "File size must be less than 100MB",
          variant: "destructive",
        });
        return;
      }

      // Set the file in the form
      form.setValue("video", file);
      setSelectedVideo(file);

      // Create a preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } catch (error) {
      console.error("Error handling video change:", error);
      toast({
        title: "Error selecting video",
        description: "There was an error processing your video file.",
        variant: "destructive",
      });
    }
  };

  const resetVideoSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedVideo(null);
    setPreviewUrl(null);
    form.setValue("video", undefined as any);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: VideoFormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be signed in to upload videos.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedVideo) {
      toast({
        title: "No Video Selected",
        description: "Please select a video file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      // 1. Upload the video file to storage
      const fileExt = selectedVideo.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      
      // Track upload progress manually
      const uploadWithProgress = async () => {
        // Create an upload instance
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('performance_videos')
          .upload(filePath, selectedVideo, {
            cacheControl: '3600',
            upsert: false
          });
        
        // Set 100% when complete
        setUploadProgress(100);
        
        return { uploadData, uploadError };
      };
      
      // Execute the upload and track progress
      const { uploadData, uploadError } = await uploadWithProgress();
      
      if (uploadError) throw uploadError;
      
      // 2. Get the public URL for the uploaded video
      const { data: urlData } = supabase.storage
        .from('performance_videos')
        .getPublicUrl(uploadData.path);

      if (!urlData.publicUrl) throw new Error("Failed to get public URL");
      
      // 3. Create the performance library entry
      const { error: insertError } = await supabase
        .from('performance_library')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description || null,
          video_url: urlData.publicUrl,
          source: 'upload'
        });
      
      if (insertError) throw insertError;
      
      toast({
        title: "Video Uploaded",
        description: "Your video has been uploaded successfully!",
      });
      
      // Clean up
      resetVideoSelection();
      form.reset();
      onVideoUploaded();
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading video:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isSubmitting) {
        onOpenChange(newOpen);
        if (!newOpen) {
          resetVideoSelection();
          form.reset();
        }
      }
    }}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Upload Performance Video</DialogTitle>
          <DialogDescription>
            Upload a video of your sales roleplay or mock interview to build your performance library.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Cold Call Practice - Tech Industry" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the scenario, what you were practicing..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="video"
              render={() => (
                <FormItem>
                  <FormLabel>Video File</FormLabel>
                  {!selectedVideo ? (
                    <FormControl>
                      <div 
                        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">
                          MP4, WebM, MOV or AVI (max. 100MB)
                        </p>
                        <Input 
                          ref={fileInputRef}
                          type="file" 
                          accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                          onChange={handleVideoChange} 
                          className="hidden" 
                        />
                      </div>
                    </FormControl>
                  ) : (
                    <div className="rounded-lg border overflow-hidden">
                      <div className="flex items-center justify-between p-3 bg-muted">
                        <div className="flex items-center">
                          <Video className="h-5 w-5 mr-2" />
                          <span className="text-sm font-medium truncate max-w-[300px]">
                            {selectedVideo.name}
                          </span>
                        </div>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={resetVideoSelection}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {previewUrl && (
                        <div className="relative pt-[56.25%] bg-black">
                          <video 
                            src={previewUrl} 
                            controls 
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {uploadProgress > 0 && isSubmitting && (
              <div className="space-y-2">
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Uploading: {uploadProgress}%
                </p>
              </div>
            )}

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !selectedVideo}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Uploading...
                  </>
                ) : (
                  "Upload Video"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UploadVideoDialog;
