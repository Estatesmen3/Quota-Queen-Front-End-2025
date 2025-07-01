
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, Check, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { uploadDocument, FeatureSource } from "@/services/ragService";

interface DocumentUploaderProps {
  featureSource: FeatureSource;
  onUploadComplete?: (documentId: string) => void;
}

export function DocumentUploader({ featureSource, onUploadComplete }: DocumentUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
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
      if (fileType !== 'pdf' && fileType !== 'doc' && fileType !== 'docx' && fileType !== 'txt') {
        toast({
          title: "Invalid file type",
          description: "Only PDF, DOC, DOCX, and TXT files are supported",
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title || !user || !profile) {
      toast({
        title: "Missing information",
        description: "Please provide a file and title",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const result = await uploadDocument(
        file,
        user.id,
        profile.user_type || 'student',
        title,
        featureSource
      );
      
      if (!result.success || !result.documentId) {
        throw new Error(result.error || "Upload failed");
      }
      
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded and processed successfully",
      });
      
      // Call the completion callback with the document ID
      if (onUploadComplete) {
        onUploadComplete(result.documentId);
      }
      
      // Reset form
      setFile(null);
      setTitle("");
      
    } catch (error: any) {
      console.error("Document upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload document",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
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
      if (fileType !== 'pdf' && fileType !== 'doc' && fileType !== 'docx' && fileType !== 'txt') {
        toast({
          title: "Invalid file type",
          description: "Only PDF, DOC, DOCX, and TXT files are supported",
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
    document.getElementById('document-upload')?.click();
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Document</CardTitle>
        <CardDescription>
          Upload a document (PDF, DOCX, DOC, TXT) for AI-powered analysis and Q&A
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sales Strategy Document"
              required
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
                <h3 className="font-medium mb-2">Drag & drop your document here</h3>
                <p className="text-sm text-muted-foreground mb-4">Supports PDF, DOCX, DOC, TXT (Max 5MB)</p>
                <Input 
                  type="file" 
                  className="hidden" 
                  id="document-upload"
                  accept=".pdf,.docx,.doc,.txt"
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
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading & Processing...
              </>
            ) : (
              "Upload & Process Document"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
