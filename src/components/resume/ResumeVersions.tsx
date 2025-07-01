
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, ArrowRight, Check, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { getResumeVersions, downloadResume } from "@/services/aiService";
import { formatDistanceToNow } from "date-fns";

interface ResumeVersionsProps {
  onSelectVersion: (resumeId: string) => void;
}

export function ResumeVersions({ onSelectVersion }: ResumeVersionsProps) {
  const [versions, setVersions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchResumeVersions = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        const result = await getResumeVersions(user.id);
        
        if (result.success && result.versions) {
          setVersions(result.versions);
        } else {
          throw new Error(result.error || "Failed to fetch resume versions");
        }
      } catch (error) {
        console.error("Fetch resume versions error:", error);
        toast({
          title: "Error",
          description: "Failed to load your resume versions",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResumeVersions();
  }, [user, toast]);
  
  const handleDownload = async (path: string, title: string) => {
    try {
      const result = await downloadResume(path);
      
      if (result.success && result.url) {
        // Create an anchor element and trigger download
        const link = document.createElement('a');
        link.href = result.url;
        link.download = `${title}.${path.split('.').pop()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the object URL
        URL.revokeObjectURL(result.url);
      } else {
        throw new Error(result.error || "Download failed");
      }
    } catch (error) {
      console.error("Resume download error:", error);
      toast({
        title: "Download failed",
        description: error.message || "Failed to download resume",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex justify-center">
            <FileText className="h-10 w-10 text-muted-foreground animate-pulse" />
          </div>
          <p className="text-center mt-4 text-muted-foreground">Loading your resume versions...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (versions.length === 0) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex justify-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
          </div>
          <p className="text-center mt-4 text-muted-foreground">You haven't uploaded any resumes yet</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your Resume Versions</h2>
      
      {versions.map((version) => {
        const hasScores = version.resume_scores && version.resume_scores.length > 0;
        const latestScore = hasScores ? version.resume_scores[0] : null;
        
        return (
          <Card key={version.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="flex items-center">
                    {version.title}
                    {version.is_current && (
                      <Badge className="ml-2 bg-green-500" variant="secondary">
                        <Check className="h-3 w-3 mr-1" />
                        Current
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Uploaded {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                    </span>
                  </CardDescription>
                </div>
                
                {hasScores && (
                  <Badge 
                    className={
                      latestScore.ats_score >= 80 ? "bg-green-500" :
                      latestScore.ats_score >= 60 ? "bg-yellow-500" :
                      "bg-red-500"
                    }
                  >
                    ATS Score: {latestScore.ats_score}%
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              {version.description && (
                <p className="text-sm text-muted-foreground mb-3">{version.description}</p>
              )}
              
              {hasScores && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="text-lg font-bold">{latestScore.ats_score}%</div>
                    <div className="text-xs">ATS Score</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="text-lg font-bold">{latestScore.clarity_score}%</div>
                    <div className="text-xs">Clarity</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="text-lg font-bold">{latestScore.skills_match_score}%</div>
                    <div className="text-xs">Skills</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>Last updated {formatDistanceToNow(new Date(version.updated_at), { addSuffix: true })}</span>
                <span className="mx-2">•</span>
                <span className="capitalize">{version.file_type}</span>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(version.file_path, version.title)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              
              <Button
                size="sm"
                onClick={() => onSelectVersion(version.id)}
              >
                {hasScores ? "View Analysis" : "Analyze"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
