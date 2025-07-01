
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, AlertCircle, Lightbulb, FileText, FileSearch, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ResumeScoreCardProps {
  studentId: string;
}

const ResumeScoreCard: React.FC<ResumeScoreCardProps> = ({ studentId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [resumeScores, setResumeScores] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResumeScores = async () => {
      if (!studentId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch the most recent resume version
        const { data: resumeVersion, error: resumeError } = await supabase
          .from('resume_versions' as any)
          .select('*')
          .eq('user_id', studentId)
          .eq('is_current', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (resumeError && resumeError.code !== 'PGRST116') {
          throw resumeError;
        }
        
        if (!resumeVersion) {
          setResumeScores(null);
          setIsLoading(false);
          return;
        }
        
        // Fetch the scores for this resume
        const { data: scores, error: scoresError } = await supabase
          .from('resume_scores' as any)
          .select('*')
          .eq('resume_id', (resumeVersion as any).id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
          
        if (scoresError && scoresError.code !== 'PGRST116') {
          throw scoresError;
        }
        
        setResumeScores(scores);
      } catch (err: any) {
        console.error('Error fetching resume scores:', err);
        setError(err.message || 'Failed to load resume scores');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResumeScores();
  }, [studentId]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-primary/80" />
            Resume Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-primary/80" />
            Resume Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <h3 className="font-medium text-lg mb-1">Error</h3>
          <p className="text-muted-foreground text-sm mb-4">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!resumeScores) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-primary/80" />
            Resume Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/40 mb-3" />
          <h3 className="font-medium text-lg mb-1">No Resume Data</h3>
          <p className="text-muted-foreground text-sm">
            This candidate doesn't have any analyzed resume yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <FileSearch className="h-5 w-5 text-primary/80" />
          Resume Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Overall</span>
              <span className="text-sm font-bold">
                {Math.round((resumeScores.ats_score + resumeScores.clarity_score + resumeScores.skills_match_score) / 3)}%
              </span>
            </div>
            <Progress 
              value={Math.round((resumeScores.ats_score + resumeScores.clarity_score + resumeScores.skills_match_score) / 3)} 
              className="h-2"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs">ATS Score</span>
                <span className="text-xs font-medium">{resumeScores.ats_score}%</span>
              </div>
              <Progress 
                value={resumeScores.ats_score} 
                className="h-1.5" 
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs">Clarity</span>
                <span className="text-xs font-medium">{resumeScores.clarity_score}%</span>
              </div>
              <Progress 
                value={resumeScores.clarity_score} 
                className="h-1.5" 
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs">Skills Match</span>
                <span className="text-xs font-medium">{resumeScores.skills_match_score}%</span>
              </div>
              <Progress 
                value={resumeScores.skills_match_score} 
                className="h-1.5" 
              />
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="strengths">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="strengths">Strengths</TabsTrigger>
            <TabsTrigger value="weaknesses">Weaknesses</TabsTrigger>
            <TabsTrigger value="tips">Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="strengths" className="space-y-2">
            {resumeScores.feedback_text?.strengths?.map((strength: string, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span className="text-xs">{strength}</span>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="weaknesses" className="space-y-2">
            {resumeScores.feedback_text?.weaknesses?.map((weakness: string, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-xs">{weakness}</span>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="tips" className="space-y-2">
            {resumeScores.feedback_text?.improvement_tips?.map((tip: string, i: number) => (
              <div key={i} className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <span className="text-xs">{tip}</span>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ResumeScoreCard;
