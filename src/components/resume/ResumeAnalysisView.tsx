
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Loader2, Check, AlertCircle, Lightbulb, Download, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { analyzeResume, downloadResume, saveResumeScores } from "@/services/aiService";
import { useAuth } from "@/context/AuthContext";

interface ResumeAnalysisViewProps {
  resumeId: string;
  onBack: () => void;
}

export function ResumeAnalysisView({ resumeId, onBack }: ResumeAnalysisViewProps) {
  const [resumeData, setResumeData] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchResumeData = async () => {
      if (!resumeId) return;
      
      setIsLoading(true);
      
      try {
        // Fetch resume version data
        const { data: resumeVersion, error: resumeError } = await supabase
          .from('resume_versions' as any)
          .select('*')
          .eq('id', resumeId)
          .single();
          
        if (resumeError) throw resumeError;
        
        setResumeData(resumeVersion);
        
        // Fetch analysis data
        const { data: analysisScores, error: analysisError } = await supabase
          .from('resume_scores' as any)
          .select('*')
          .eq('resume_id', resumeId)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (analysisError && analysisError.code !== 'PGRST116') {
          throw analysisError;
        }
        
        if (analysisScores && analysisScores.length > 0) {
          setAnalysisData(analysisScores[0]);
        }
      } catch (error) {
        console.error("Fetch resume data error:", error);
        toast({
          title: "Error",
          description: "Failed to load resume data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResumeData();
  }, [resumeId, toast]);
  
  const handleAnalyzeResume = async () => {
    if (!resumeData || !user) return;
    
    setIsAnalyzing(true);
    
    try {
      // Download the resume file
      const result = await downloadResume(resumeData.file_path);
      
      if (!result.success || !result.url) {
        throw new Error(result.error || "Failed to download resume");
      }
      
      // Get the file content
      const response = await fetch(result.url);
      const blob = await response.blob();
      const text = await blob.text();
      
      // Clean up the object URL
      URL.revokeObjectURL(result.url);
      
      // Analyze the resume
      const analysisResult = await analyzeResume(text);
      
      if (!analysisResult.success || !analysisResult.data) {
        throw new Error(analysisResult.error || "Analysis failed");
      }
      
      // Save the analysis
      const saveResult = await saveResumeScores(
        user.id,
        resumeId,
        analysisResult.data
      );
      
      if (!saveResult.success) {
        throw new Error(saveResult.error || "Failed to save analysis");
      }
      
      // Fetch the saved analysis
      const { data, error } = await supabase
        .from('resume_scores' as any)
        .select('*')
        .eq('id', saveResult.id)
        .single();
        
      if (error) throw error;
      
      setAnalysisData(data);
      
      toast({
        title: "Analysis complete",
        description: "Your resume has been analyzed successfully",
      });
    } catch (error) {
      console.error("Resume analysis error:", error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze resume",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleDownloadResume = async () => {
    if (!resumeData) return;
    
    try {
      const result = await downloadResume(resumeData.file_path);
      
      if (result.success && result.url) {
        const link = document.createElement('a');
        link.href = result.url;
        link.download = `${resumeData.title}.${resumeData.file_path.split('.').pop()}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
        <CardContent className="py-10 flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-center text-muted-foreground">Loading resume data...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!resumeData) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <h3 className="font-bold mb-2">Resume not found</h3>
          <p className="text-muted-foreground mb-4">The requested resume could not be found</p>
          <Button onClick={onBack}>Go Back</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold">{resumeData.title}</h2>
      </div>
      
      {!analysisData ? (
        <Card>
          <CardContent className="py-10 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">No Analysis Yet</h3>
            <p className="text-muted-foreground mb-6">
              This resume hasn't been analyzed yet. Run an analysis to get feedback and optimization suggestions.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" onClick={handleDownloadResume}>
                <Download className="h-4 w-4 mr-2" />
                Download Resume
              </Button>
              <Button onClick={handleAnalyzeResume} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Resume"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Resume Analysis Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Overall</span>
                    <span className="text-sm font-bold">
                      {Math.round((analysisData.ats_score + analysisData.clarity_score + analysisData.skills_match_score) / 3)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.round((analysisData.ats_score + analysisData.clarity_score + analysisData.skills_match_score) / 3)} 
                    className="h-2"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">ATS Score</span>
                      <span className="text-sm font-medium">{analysisData.ats_score}%</span>
                    </div>
                    <Progress 
                      value={analysisData.ats_score} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Clarity</span>
                      <span className="text-sm font-medium">{analysisData.clarity_score}%</span>
                    </div>
                    <Progress 
                      value={analysisData.clarity_score} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Skills Match</span>
                      <span className="text-sm font-medium">{analysisData.skills_match_score}%</span>
                    </div>
                    <Progress 
                      value={analysisData.skills_match_score} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="strengths">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="strengths">Strengths</TabsTrigger>
              <TabsTrigger value="weaknesses">Improvements</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="strengths" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {analysisData.feedback_text?.strengths?.map((strength, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="weaknesses">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {analysisData.feedback_text?.weaknesses?.map((weakness, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tips">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {analysisData.feedback_text?.improvement_tips?.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={handleDownloadResume}>
              <Download className="h-4 w-4 mr-2" />
              Download Resume
            </Button>
            
            <Button onClick={handleAnalyzeResume} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Reanalyzing...
                </>
              ) : (
                "Reanalyze"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
