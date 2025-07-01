
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, Check, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { 
  uploadResume, 
  saveResumeVersion, 
  analyzeResume, 
  saveResumeScores 
} from "@/services/aiService";
import { uploadDocument } from "@/services/ragService";

export function ResumeUploader({ onUploadComplete }: { onUploadComplete?: (resumeId: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive"
        });
        return;
      }
      
      const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
      if (fileType !== 'pdf' && fileType !== 'doc' && fileType !== 'docx') {
        toast({
          title: "Invalid file type",
          description: "Only PDF, DOC, and DOCX files are supported",
          variant: "destructive"
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Set a default title based on file name
      if (!title) {
        const fileName = selectedFile.name.split('.')[0];
        setTitle(fileName.charAt(0).toUpperCase() + fileName.slice(1));
      }
    }
  };
  
  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Use the same validation as handleFileChange
      if (droppedFile.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive"
        });
        return;
      }
      
      const fileType = droppedFile.name.split('.').pop()?.toLowerCase();
      if (fileType !== 'pdf' && fileType !== 'doc' && fileType !== 'docx') {
        toast({
          title: "Invalid file type",
          description: "Only PDF, DOC, and DOCX files are supported",
          variant: "destructive"
        });
        return;
      }
      
      setFile(droppedFile);
      
      // Set a default title based on file name
      if (!title) {
        const fileName = droppedFile.name.split('.')[0];
        setTitle(fileName.charAt(0).toUpperCase() + fileName.slice(1));
      }
    }
  };
  
  // Function to trigger hidden file input click
  const triggerFileInput = () => {
    document.getElementById('resume-upload')?.click();
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title || !user) {
      toast({
        title: "Missing information",
        description: "Please provide a file and title",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Upload file to Supabase Storage
      const uploadResult = await uploadResume(file, user.id);
      
      if (!uploadResult.success || !uploadResult.filePath) {
        throw new Error(uploadResult.error || "Upload failed");
      }
      
      // Save resume version to database
      const fileType = file.name.split('.').pop() || '';
      const saveResult = await saveResumeVersion(
        user.id, 
        title, 
        description, 
        uploadResult.filePath, 
        fileType,
        true // Set as current version
      );
      
      if (!saveResult.success || !saveResult.id) {
        throw new Error(saveResult.error || "Failed to save resume version");
      }
      
      toast({
        title: "Resume uploaded",
        description: "Your resume has been uploaded successfully",
      });
      
      // Also upload to the RAG system if user profile is available
      if (profile) {
        try {
          await uploadDocument(
            file,
            user.id,
            profile.user_type || 'student',
            title,
            'resume_analyzer'
          );
        } catch (ragError) {
          console.error("RAG upload error:", ragError);
          // Don't fail the entire process if RAG upload fails
        }
      }
      
      // Start AI analysis if file is PDF
      if (fileType === 'pdf') {
        setIsAnalyzing(true);
        
        // Get text content from the file
        const fileReader = new FileReader();
        fileReader.onload = async (event) => {
          const fileText = event.target?.result as string;
          
          // Call AI to analyze resume
          const analysisResult = await analyzeResume(fileText);
          
          if (analysisResult.success && analysisResult.data) {
            // Save analysis results
            await saveResumeScores(user.id, saveResult.id, analysisResult.data);
            
            toast({
              title: "Analysis complete",
              description: "Your resume has been analyzed successfully",
            });
          } else {
            toast({
              title: "Analysis warning",
              description: "Resume uploaded but analysis could not be completed. You can retry analysis later.",
              variant: "default"
            });
          }
          
          setIsAnalyzing(false);
          
          // Call the completion callback with the resume ID
          if (onUploadComplete) {
            onUploadComplete(saveResult.id);
          }
        };
        
        fileReader.readAsText(file);
      } else {
        setIsUploading(false);
        
        if (onUploadComplete) {
          onUploadComplete(saveResult.id);
        }
      }
    } catch (error: any) {
      console.error("Resume upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload resume",
        variant: "destructive"
      });
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Your Resume</CardTitle>
        <CardDescription>
          Upload your resume for AI analysis and job matching
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Resume Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sales Representative Resume"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this resume version"
              rows={3}
            />
          </div>
          
          <div 
            className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            {file ? (
              <div className="flex items-center justify-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-medium">{file.name}</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <FileUp className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">Drag & drop your resume here</h3>
                <p className="text-sm text-muted-foreground mb-4">Supports PDF, DOCX (Max 5MB)</p>
                <Input 
                  type="file" 
                  className="hidden" 
                  id="resume-upload"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mx-auto"
                >
                  Select File
                </Button>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!file || isUploading || isAnalyzing}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Upload & Analyze"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
