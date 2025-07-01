
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { scoreRoleplay, RoleplayScoring } from "@/services/aiService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  Lightbulb, 
  Loader2, 
  BarChart, 
  Activity,
  RefreshCw,
  FileText
} from "lucide-react";
import { RAGContainer } from "../rag/RAGContainer";
import { uploadDocument } from "@/services/ragService";
import { useAuth } from "@/context/AuthContext";

interface AIAnalysisProps {
  callData?: any;
}

const AIAnalysis = ({ callData }: AIAnalysisProps) => {
  const { id: callId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<RoleplayScoring | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [analysisSource, setAnalysisSource] = useState<string>('api');
  const [isProcessingForRAG, setIsProcessingForRAG] = useState(false);
  const [hasProcessedForRAG, setHasProcessedForRAG] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!callId) return;
      
      try {
        // Fetch existing analysis/feedback if available
        const { data: performanceData, error: performanceError } = await supabase
          .from("performance_library")
          .select("feedback, transcript")
          .eq("id", callId)
          .single();
          
        if (performanceError && performanceError.code !== 'PGRST116') {
          throw performanceError;
        }
        
        if (performanceData?.feedback) {
          // Convert the feedback JSON to RoleplayScoring type
          const feedbackData = performanceData.feedback as Record<string, any>;
          
          if (feedbackData.score !== undefined) {
            const roleplayScoring: RoleplayScoring = {
              score: feedbackData.score,
              persuasion_score: feedbackData.persuasion_score || 0,
              tone_score: feedbackData.tone_score || 0,
              objection_handling: feedbackData.objection_handling || 0,
              strengths: feedbackData.strengths || [],
              weaknesses: feedbackData.weaknesses || [],
              improvement_tips: feedbackData.improvement_tips || []
            };
            
            setAnalysisData(roleplayScoring);
          }
        }
        
        if (performanceData?.transcript) {
          setTranscript(performanceData.transcript);
        } else if (callData?.transcript_url) {
          // If transcript available, fetch it
          const { data: transcriptText } = await supabase.storage
            .from('call-transcripts')
            .download(callData.transcript_url);
            
          if (transcriptText) {
            const text = await transcriptText.text();
            setTranscript(text);
          }
        }
      } catch (error) {
        console.error("Error fetching analysis data:", error);
        toast({
          title: "Error",
          description: "Failed to load existing analysis data",
          variant: "destructive"
        });
      }
    };
    
    fetchData();
  }, [callId, callData, toast]);
  
  const analyzeCall = async () => {
    if (!transcript || isAnalyzing) return;
    
    setIsAnalyzing(true);
    
    try {
      toast({
        title: "Analyzing Call",
        description: "AI is evaluating your sales performance...",
      });
      
      // Call the AI service to analyze the roleplay
      const aiResponse = await scoreRoleplay(transcript);
      
      if (aiResponse.success && aiResponse.data) {
        setAnalysisData(aiResponse.data);
        setAnalysisSource(aiResponse.source || 'api');
        
        // Save the analysis back to the database for future use
        await supabase
          .from('performance_library')
          .update({ 
            feedback: {
              score: aiResponse.data.score,
              persuasion_score: aiResponse.data.persuasion_score,
              tone_score: aiResponse.data.tone_score,
              objection_handling: aiResponse.data.objection_handling,
              strengths: aiResponse.data.strengths,
              weaknesses: aiResponse.data.weaknesses,
              improvement_tips: aiResponse.data.improvement_tips
            }
          })
          .eq('id', callId);
          
        toast({
          title: "Analysis Complete",
          description: aiResponse.source === 'cache' 
            ? "Analysis retrieved from cache" 
            : "Your sales call has been analyzed successfully"
        });
      } else {
        throw new Error(aiResponse.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Error analyzing call:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not generate AI feedback. Please try again.",
        variant: "destructive"
      });
      
      // For demo/fallback purposes
      setAnalysisData({
        score: 78,
        persuasion_score: 75,
        tone_score: 85,
        objection_handling: 70,
        strengths: [
          "Good rapport building at the beginning of the call",
          "Clear explanation of product features",
          "Confident tone throughout the conversation"
        ],
        weaknesses: [
          "Missed opportunity to ask deeper discovery questions",
          "Could improve handling of pricing objections",
          "Closed too early without addressing all concerns"
        ],
        improvement_tips: [
          "Use the SPIN questioning technique for better discovery",
          "Practice the feel-felt-found method for objection handling",
          "Wait for clear buying signals before moving to close"
        ]
      });
      setAnalysisSource('fallback');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const saveToRoleplayFeedback = async () => {
    if (!analysisData || !callId) return;
    
    try {
      // Get related session ID if available
      const { data: callRecord } = await supabase
        .from("calls")
        .select("related_session_id")
        .eq("id", callId)
        .single();
        
      if (callRecord?.related_session_id) {
        // Check if feedback already exists
        const { data: existingFeedback } = await supabase
          .from("ai_feedback")
          .select("id")
          .eq("roleplay_session_id", callRecord.related_session_id)
          .single();
          
        if (existingFeedback) {
          // Update existing feedback
          await supabase
            .from("ai_feedback")
            .update({
              score: analysisData.score,
              strengths: analysisData.strengths,
              weaknesses: analysisData.weaknesses,
              improvement_tips: analysisData.improvement_tips
            })
            .eq("id", existingFeedback.id);
        } else {
          // Create new feedback entry
          const aiResponse = analysisData;
          setAnalysisSource(analysisSource || 'api');
          
          // Save the analysis back to the database as a plain object
          await supabase
            .from('ai_feedback')
            .insert({
              roleplay_session_id: callRecord.related_session_id,
              score: aiResponse.score,
              strengths: aiResponse.strengths,
              weaknesses: aiResponse.weaknesses,
              improvement_tips: aiResponse.improvement_tips
            });
        }
        
        toast({
          title: "Feedback Saved",
          description: "Analysis saved to roleplay session",
        });
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast({
        title: "Save Failed",
        description: "Could not save analysis to roleplay session",
        variant: "destructive"
      });
    }
  };
  
  const processTranscriptForRAG = async () => {
    if (!transcript || !user || !profile || isProcessingForRAG) return;
    
    setIsProcessingForRAG(true);
    
    try {
      // Create a text file from the transcript
      const blob = new Blob([transcript], { type: 'text/plain' });
      const file = new File([blob], `Transcript_${callId}.txt`, { type: 'text/plain' });
      
      // Upload to RAG system
      const result = await uploadDocument(
        file,
        user.id,
        profile.user_type || 'student',
        `Call Transcript ${new Date().toLocaleDateString()}`,
        'roleplay_feedback'
      );
      
      if (!result.success) {
        throw new Error(result.error || "Processing failed");
      }
      
      setHasProcessedForRAG(true);
      
      toast({
        title: "Transcript Processed",
        description: "Your transcript is now available for AI Q&A",
      });
      
    } catch (error) {
      console.error("RAG processing error:", error);
      toast({
        title: "Processing Failed",
        description: error.message || "Failed to process transcript for Q&A",
        variant: "destructive"
      });
    } finally {
      setIsProcessingForRAG(false);
    }
  };
  
  if (!transcript) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            No transcript available for this call. AI analysis requires a transcript.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 75) return "text-yellow-500";
    return "text-orange-500";
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="analysis">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="askAI">Ask AI</TabsTrigger>
        </TabsList>
        
        <TabsContent value="analysis" className="mt-4 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium">AI Performance Analysis</h3>
              <p className="text-muted-foreground text-sm">
                {analysisSource === 'cache' ? 'Retrieved from cache' : 
                 analysisSource === 'fallback' ? 'Using fallback analysis' : 
                 'AI-powered insights on your sales call'}
              </p>
            </div>
            
            {!isAnalyzing && (
              <Button 
                variant={analysisData ? "outline" : "default"} 
                size="sm"
                onClick={analyzeCall}
                disabled={isAnalyzing}
              >
                {analysisData ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reanalyze
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2" />
                    Analyze Call
                  </>
                )}
              </Button>
            )}
          </div>
          
          {isAnalyzing ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="font-medium">Analyzing your sales call</p>
                <p className="text-sm text-muted-foreground">
                  Our AI is reviewing the transcript to provide personalized feedback
                </p>
              </CardContent>
            </Card>
          ) : analysisData ? (
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Performance Score</CardTitle>
                    {analysisSource !== 'api' && (
                      <Badge variant="outline">
                        {analysisSource === 'cache' ? 'Cached' : 'Fallback'}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-6 justify-between">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl font-bold mb-1">
                        <span className={getScoreColor(analysisData.score)}>
                          {analysisData.score}
                        </span>
                        <span className="text-lg text-muted-foreground">/100</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Overall Score</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Persuasion</span>
                          <span className="font-medium">{analysisData.persuasion_score}%</span>
                        </div>
                        <Progress value={analysisData.persuasion_score} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Tone</span>
                          <span className="font-medium">{analysisData.tone_score}%</span>
                        </div>
                        <Progress value={analysisData.tone_score} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Objection Handling</span>
                          <span className="font-medium">{analysisData.objection_handling}%</span>
                        </div>
                        <Progress value={analysisData.objection_handling} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  {callData?.related_session_id && (
                    <div className="mt-4 pt-4 border-t flex justify-end">
                      <Button size="sm" variant="outline" onClick={saveToRoleplayFeedback}>
                        Save to Roleplay Feedback
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Tabs defaultValue="strengths">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="strengths">Strengths</TabsTrigger>
                  <TabsTrigger value="weaknesses">Areas to Improve</TabsTrigger>
                  <TabsTrigger value="tips">Coaching Tips</TabsTrigger>
                </TabsList>
                
                <TabsContent value="strengths" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-3">
                        {analysisData.strengths.map((strength, index) => (
                          <li key={index} className="flex gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="weaknesses" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-3">
                        {analysisData.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex gap-2">
                            <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="tips" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-3">
                        {analysisData.improvement_tips.map((tip, index) => (
                          <li key={index} className="flex gap-2">
                            <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="text-sm font-medium mb-2">Next Steps</h4>
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4 text-primary" />
                  <p className="text-sm">
                    Focus on improving your <span className="font-medium">objection handling</span> score by practicing the recommended techniques.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Get AI-powered insights on your sales call performance.
                </p>
                <Button onClick={analyzeCall} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Call"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="askAI" className="mt-4 space-y-6">
          {!hasProcessedForRAG ? (
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Process Transcript for Q&A</h3>
                <p className="text-muted-foreground mb-6">
                  To ask AI questions about this transcript, we need to process it first.
                </p>
                <Button 
                  onClick={processTranscriptForRAG}
                  disabled={isProcessingForRAG}
                >
                  {isProcessingForRAG ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Process Transcript"
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <RAGContainer 
              featureSource="roleplay_feedback"
              title="Transcript Q&A"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAnalysis;
