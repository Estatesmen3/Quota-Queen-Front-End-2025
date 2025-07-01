
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle2, XCircle, Award, LineChart, MessageSquare, Download } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

const CallFeedback = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [callDetails, setCallDetails] = useState<any>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [participants, setParticipants] = useState<any[]>([]);
  const [transcript, setTranscript] = useState<any[]>([]);
  const [callLogs, setCallLogs] = useState<any[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    loadCallData();
  }, [id, user]);

  const loadCallData = async () => {
    setIsLoading(true);
    try {
      // First check if the user has permission to view this call
      const { data: callData, error: callError } = await supabase
        .from("calls")
        .select(`
          *,
          host:host_id(id, first_name, last_name, avatar_url)
        `)
        .eq("id", id)
        .single();
      
      if (callError) throw callError;
      setCallDetails(callData);
      
      // Load participants
      const { data: participantsData, error: participantsError } = await supabase
        .from("call_participants")
        .select(`
          id,
          role,
          joined_at,
          left_at,
          profiles:user_id(id, first_name, last_name, avatar_url)
        `)
        .eq("call_id", id);
      
      if (participantsError) throw participantsError;
      setParticipants(participantsData || []);
      
      // Load call logs
      const { data: logsData, error: logsError } = await supabase
        .from("call_logs")
        .select("*")
        .eq("call_id", id)
        .order("created_at", { ascending: false });
      
      if (logsError) throw logsError;
      setCallLogs(logsData || []);
      
      // Check for existing AI analysis
      const { data: analysisData, error: analysisError } = await supabase
        .from("ai_feedback")
        .select("*")
        .eq("roleplay_session_id", id)
        .maybeSingle();
      
      if (analysisError) throw analysisError;
      
      // If no analysis exists yet but we have a recording, trigger analysis
      if (!analysisData && callData.recording_url && !callData.is_ai_feedback_processed) {
        toast({
          title: "Processing Recording",
          description: "AI is analyzing the call recording. This may take a moment."
        });
        
        // Trigger the analysis edge function
        try {
          const { data: analysisResult, error: analyzeError } = await supabase.functions.invoke("analyze-speech", {
            body: {
              sessionType: "call",
              call_id: id,
              recording_url: callData.recording_url
            }
          });
          
          if (analyzeError) throw analyzeError;
          
          // Refetch the analysis data after processing
          const { data: updatedAnalysis } = await supabase
            .from("ai_feedback")
            .select("*")
            .eq("roleplay_session_id", id)
            .single();
            
          setAiAnalysis(updatedAnalysis);
        } catch (analyzeError) {
          console.error("Error analyzing call:", analyzeError);
          toast({
            title: "Analysis Failed",
            description: "Could not analyze the call recording. Using mock data instead.",
            variant: "destructive"
          });
          
          // Use mock data as fallback
          const mockAnalysis = generateMockAiAnalysis();
          setAiAnalysis(mockAnalysis);
        }
      } else {
        setAiAnalysis(analysisData);
      }
      
      // Generate transcript from recording or use placeholder
      if (callData.transcript_url) {
        // Use actual transcript if available
        generateTranscriptFromText(callData.transcript_url);
      } else {
        // Use mock transcript for demo
        const mockTranscript = generateMockTranscript();
        setTranscript(mockTranscript);
      }
      
    } catch (error) {
      console.error("Error loading call feedback:", error);
      toast({
        title: "Error loading feedback",
        description: "Could not load the call feedback. You may not have permission to view it.",
        variant: "destructive"
      });
      navigate("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const generateTranscriptFromText = (transcriptText: string) => {
    // Simple transcript parser
    try {
      // Split by clear speaker changes
      const lines = transcriptText.split(/\n|\. /);
      const processedTranscript = [];
      
      let currentTime = 15; // Start at 15 seconds
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Try to determine speaker (very simple heuristic)
        let speaker = i % 2 === 0 ? "You" : "Customer";
        
        // Add time
        currentTime += Math.floor(Math.random() * 30) + 10;
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        const timeString = `00:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        processedTranscript.push({
          speaker: speaker,
          text: line,
          time: timeString
        });
      }
      
      setTranscript(processedTranscript);
    } catch (error) {
      console.error("Error parsing transcript:", error);
      const mockTranscript = generateMockTranscript();
      setTranscript(mockTranscript);
    }
  };

  const generateMockAiAnalysis = () => {
    // Generate realistic mock AI analysis for demo
    return {
      score: Math.floor(Math.random() * 30) + 65, // 65-95 range
      strengths: [
        "Effective discovery questions to understand customer needs",
        "Clear product value proposition aligned with customer pain points",
        "Strong handling of initial objections",
        "Good rapport building at the beginning of the call"
      ],
      weaknesses: [
        "Too much technical jargon when explaining product features",
        "Missed opportunity to ask about budget constraints",
        "Could improve active listening - interrupted customer twice",
        "Need more concise answers to customer questions"
      ],
      improvement_tips: [
        "Practice summarizing key benefits in 30 seconds or less",
        "Prepare 3-5 open-ended discovery questions for each sales call",
        "Work on objection handling framework: acknowledge, validate, explore, respond",
        "Record practice sessions to identify filler words and eliminate them"
      ],
      metrics: {
        talk_ratio: Math.floor(Math.random() * 30) + 50, // 50-80% range
        questions_asked: Math.floor(Math.random() * 6) + 5, // 5-10 range
        objection_handling: Math.floor(Math.random() * 20) + 70, // 70-90% range
        solution_relevance: Math.floor(Math.random() * 15) + 75, // 75-90% range
        closing_effectiveness: Math.floor(Math.random() * 25) + 65 // 65-90% range
      }
    };
  };

  const generateMockTranscript = () => {
    // Generate mock transcript for demo
    return [
      { speaker: "You", text: "Hi there, thanks for taking the time to chat today. I'm excited to learn more about your needs and share how our solution might help.", time: "00:00:15" },
      { speaker: "Customer", text: "Thanks for setting this up. We've been looking at a few options in this space, so I'm curious to hear what you offer.", time: "00:00:30" },
      { speaker: "You", text: "Great! Before I dive in, could you tell me a bit about your current challenges with sales training?", time: "00:00:42" },
      { speaker: "Customer", text: "Our biggest challenge is consistency in our sales approach. Different reps use different methods, and we don't have a good way to standardize and improve.", time: "00:01:05" },
      { speaker: "You", text: "That's a common challenge. How is this inconsistency affecting your business outcomes?", time: "00:01:20" },
      { speaker: "Customer", text: "Our conversion rates vary widely between reps, and onboarding new people takes too long. Plus, we don't have good visibility into what's working and what's not.", time: "00:01:45" },
      { speaker: "You", text: "I see. Quota Queen could help address those challenges through our AI-powered roleplay platform. Basically, we provide a space where your reps can practice consistent sales approaches and get immediate feedback.", time: "00:02:10" },
      { speaker: "Customer", text: "That sounds interesting, but we've tried other training platforms before with mixed results. How is yours different?", time: "00:02:35" },
      { speaker: "You", text: "Great question. Unlike traditional platforms, we use advanced AI to analyze every aspect of the conversation - from tone and pacing to objection handling and closing techniques. Plus, our system adapts to each rep's strengths and weaknesses.", time: "00:03:00" },
      { speaker: "Customer", text: "What about implementation? We don't have a lot of bandwidth for complex new systems.", time: "00:03:25" },
      { speaker: "You", text: "Absolutely understand. We've designed our platform for minimal setup. Most companies are up and running within a day, and we provide templates based on your industry so you don't start from scratch.", time: "00:03:50" },
      { speaker: "Customer", text: "And pricing? This is always the tricky part.", time: "00:04:10" },
      { speaker: "You", text: "Our pricing is subscription-based starting at $49 per user per month, with volume discounts for teams over 10 people. We also offer a 14-day free trial so you can see the results before committing.", time: "00:04:30" },
      { speaker: "Customer", text: "That seems reasonable. What would be the next steps if we wanted to try it out?", time: "00:04:55" },
      { speaker: "You", text: "I'd be happy to set up that free trial for you. We could also do a brief onboarding session with your team to make sure everyone gets the most out of the platform from day one. Would that work for you?", time: "00:05:15" },
      { speaker: "Customer", text: "Yes, let's do that. I'd like to get a few of our top performers and newer reps to try it and give feedback.", time: "00:05:35" },
      { speaker: "You", text: "Perfect! I'll send over the trial setup information today. Do you have any other questions I can answer right now?", time: "00:05:50" },
      { speaker: "Customer", text: "Not at the moment. I'm looking forward to trying it out.", time: "00:06:05" },
      { speaker: "You", text: "Great! I'll follow up with an email shortly. Thanks for your time today, and I'm excited to help your team improve their sales consistency.", time: "00:06:20" }
    ];
  };

  const downloadRecording = () => {
    if (callDetails?.recording_url) {
      window.open(callDetails.recording_url, '_blank');
    } else {
      toast({
        title: "No Recording Available",
        description: "There is no recording available for this call.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Analyzing call data...</p>
            <p className="text-muted-foreground">Our AI is processing your conversation</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mr-3">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{callDetails?.title || "Call Feedback"}</h1>
            <p className="text-muted-foreground">
              AI-powered analysis and feedback from your call
            </p>
          </div>
          {callDetails?.recording_url && (
            <Button variant="outline" onClick={downloadRecording}>
              <Download className="h-4 w-4 mr-2" />
              Download Recording
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-6">
          {/* Sidebar with call details */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Call Information</CardTitle>
                <CardDescription>Details about this call session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Date & Time</h3>
                  <p className="text-sm">
                    {new Date(callDetails?.started_at || "").toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Duration</h3>
                  <p className="text-sm">
                    {callDetails?.started_at && callDetails?.ended_at
                      ? `${Math.round((new Date(callDetails.ended_at).getTime() - new Date(callDetails.started_at).getTime()) / 60000)} minutes`
                      : "Not available"}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Host</h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={callDetails?.host?.avatar_url} />
                      <AvatarFallback>
                        {callDetails?.host?.first_name?.[0]}{callDetails?.host?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      {callDetails?.host?.first_name} {callDetails?.host?.last_name}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Participants</h3>
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={participant.profiles?.avatar_url} />
                          <AvatarFallback>
                            {participant.profiles?.first_name?.[0]}{participant.profiles?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {participant.profiles?.first_name} {participant.profiles?.last_name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Overall Score</h3>
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary font-medium rounded-full px-2 py-1 text-sm">
                      {aiAnalysis?.score || 0}/100
                    </div>
                    {aiAnalysis?.score >= 80 ? (
                      <span className="text-green-600 text-sm">Excellent</span>
                    ) : aiAnalysis?.score >= 70 ? (
                      <span className="text-amber-600 text-sm">Good</span>
                    ) : (
                      <span className="text-red-600 text-sm">Needs Improvement</span>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowLogs(!showLogs)}
                >
                  {showLogs ? "Hide Call Logs" : "Show Call Logs (Dev)"}
                </Button>
                
                {showLogs && callLogs.length > 0 && (
                  <div className="border rounded-md p-2 mt-2 max-h-48 overflow-y-auto">
                    <h4 className="text-xs font-medium mb-1">Call Logs (Developer View)</h4>
                    <div className="space-y-1">
                      {callLogs.map((log, index) => (
                        <div key={index} className="text-xs border-b pb-1 last:border-0">
                          <span className="font-medium">{log.log_type}:</span> {log.message}
                          <div className="text-muted-foreground text-[10px]">
                            {new Date(log.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Main content with tabs */}
          <div className="md:col-span-4">
            <Tabs defaultValue="analysis">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
              </TabsList>
              
              <TabsContent value="analysis" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {aiAnalysis?.strengths?.map((strength: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-600" />
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {aiAnalysis?.weaknesses?.map((weakness: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-600" />
                      Suggested Improvements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {aiAnalysis?.improvement_tips?.map((tip: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <Award className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="metrics" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-blue-600" />
                      Performance Metrics
                    </CardTitle>
                    <CardDescription>
                      Key indicators from your call performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Talk Ratio (You vs. Customer)</span>
                        <span className="text-sm">{aiAnalysis?.metrics?.talk_ratio || 65}%</span>
                      </div>
                      <Progress value={aiAnalysis?.metrics?.talk_ratio || 65} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {aiAnalysis?.metrics?.talk_ratio > 70 
                          ? "Consider asking more questions and listening more" 
                          : aiAnalysis?.metrics?.talk_ratio < 40
                          ? "Try to guide the conversation more actively" 
                          : "Good balance between speaking and listening"}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Questions Asked</span>
                        <span className="text-sm">{aiAnalysis?.metrics?.questions_asked || 7}</span>
                      </div>
                      <Progress value={(aiAnalysis?.metrics?.questions_asked || 7) * 10} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {aiAnalysis?.metrics?.questions_asked >= 8 
                          ? "Excellent discovery through questions" 
                          : aiAnalysis?.metrics?.questions_asked <= 4
                          ? "Try to ask more discovery questions" 
                          : "Good questioning technique"}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Objection Handling</span>
                        <span className="text-sm">{aiAnalysis?.metrics?.objection_handling || 75}%</span>
                      </div>
                      <Progress value={aiAnalysis?.metrics?.objection_handling || 75} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {aiAnalysis?.metrics?.objection_handling >= 85 
                          ? "Strong objection handling skills" 
                          : aiAnalysis?.metrics?.objection_handling <= 60
                          ? "Focus on improving objection handling techniques" 
                          : "Good handling of objections with room for improvement"}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Solution Relevance</span>
                        <span className="text-sm">{aiAnalysis?.metrics?.solution_relevance || 82}%</span>
                      </div>
                      <Progress value={aiAnalysis?.metrics?.solution_relevance || 82} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {aiAnalysis?.metrics?.solution_relevance >= 85 
                          ? "Excellent alignment of solution to customer needs" 
                          : aiAnalysis?.metrics?.solution_relevance <= 65
                          ? "Work on better tailoring your solution to specific needs" 
                          : "Good solution alignment with room for improvement"}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Closing Effectiveness</span>
                        <span className="text-sm">{aiAnalysis?.metrics?.closing_effectiveness || 68}%</span>
                      </div>
                      <Progress value={aiAnalysis?.metrics?.closing_effectiveness || 68} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {aiAnalysis?.metrics?.closing_effectiveness >= 85 
                          ? "Strong closing techniques" 
                          : aiAnalysis?.metrics?.closing_effectiveness <= 60
                          ? "Focus on improving closing techniques" 
                          : "Decent closing with room for improvement"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="transcript" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      Call Transcript
                    </CardTitle>
                    <CardDescription>
                      Conversation transcript from your call
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {transcript.map((entry, index) => (
                        <div key={index} className="pb-4 border-b last:border-0">
                          <div className="flex justify-between items-center mb-1">
                            <div className="font-medium">
                              {entry.speaker === "You" 
                                ? <span className="text-blue-600">{entry.speaker}</span> 
                                : <span className="text-purple-600">{entry.speaker}</span>}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {entry.time}
                            </div>
                          </div>
                          <p className="text-sm">{entry.text}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CallFeedback;
