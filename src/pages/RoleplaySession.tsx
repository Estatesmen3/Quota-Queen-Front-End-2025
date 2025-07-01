
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/DashboardLayout";
import { Send, ArrowLeft, Loader2, RotateCw, User, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RoleplaySession as RoleplaySessionType, RoleplayScenario, Message } from "@/types/roleplay";

const RoleplaySession = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [sessionData, setSessionData] = useState<RoleplaySessionType | null>(null);
  const [scenario, setScenario] = useState<RoleplayScenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [buyerMode, setBuyerMode] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!id || !user) return;

    const fetchRoleplaySession = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("roleplay_sessions")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        
        // Function to validate scenario data
        const isValidScenario = (obj: any): obj is RoleplayScenario => {
          return (
            obj &&
            typeof obj === 'object' &&
            typeof obj.title === 'string' &&
            typeof obj.company_description === 'string' &&
            typeof obj.buyer_profile === 'string' &&
            typeof obj.scenario_background === 'string' &&
            Array.isArray(obj.key_objectives) &&
            Array.isArray(obj.common_objections) &&
            Array.isArray(obj.talking_points) &&
            Array.isArray(obj.evaluation_criteria) &&
            typeof obj.difficulty === 'string'
          );
        };
        
        // Function to validate if an object is a valid Message
        const isValidMessage = (obj: any): obj is Message => {
          return (
            obj &&
            typeof obj === 'object' &&
            (obj.role === 'user' || obj.role === 'buyer') &&
            typeof obj.content === 'string' &&
            (obj.timestamp instanceof Date || typeof obj.timestamp === 'string')
          );
        };
        
        // Function to validate if an array is a valid Message array
        const isValidMessageArray = (arr: any[]): arr is Message[] => {
          return Array.isArray(arr) && arr.every(item => isValidMessage(item));
        };
        
        // Safe type casting with validation
        const typedData: RoleplaySessionType = {
          ...data,
          id: data.id,
          student_id: data.student_id,
          recruiter_id: data.recruiter_id,
          scenario_title: data.scenario_title,
          industry: data.industry,
          difficulty: data.difficulty,
          status: data.status as "pending" | "in_progress" | "ready" | "completed",
          duration: data.duration,
          created_at: data.created_at,
          updated_at: data.updated_at,
          segment: data.segment,
          // Properly validate scenario_data
          scenario_data: data.scenario_data && isValidScenario(data.scenario_data) 
            ? data.scenario_data as RoleplayScenario 
            : undefined,
          // Properly validate transcript
          transcript: Array.isArray(data.transcript) && data.transcript.length > 0
            ? (isValidMessageArray(data.transcript) 
                ? data.transcript 
                : data.transcript.map((msg: any) => ({
                    role: msg.role === 'buyer' ? 'buyer' : 'user',
                    content: typeof msg.content === 'string' ? msg.content : '',
                    timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
                  })))
            : []
        };
        
        setSessionData(typedData);
        
        // Extract and validate the scenario data
        if (typedData.scenario_data && isValidScenario(typedData.scenario_data)) {
          setScenario(typedData.scenario_data);
        }
        
        // Parse and validate the transcript
        if (typedData.transcript && typedData.transcript.length > 0) {
          // Ensure each message has the proper shape and types
          const parsedMessages: Message[] = typedData.transcript.map((msg: any) => ({
            role: msg.role === 'buyer' ? 'buyer' : 'user',
            content: typeof msg.content === 'string' ? msg.content : '',
            timestamp: msg.timestamp instanceof Date ? msg.timestamp : new Date(msg.timestamp)
          }));
          
          setMessages(parsedMessages);
        }
        
        setSessionComplete(typedData.status === "completed");
        
        // Set up timer if the session is in progress and has a duration
        if (typedData.status === "in_progress" && typedData.duration) {
          const createdAt = new Date(typedData.created_at);
          const durationMs = typedData.duration * 60 * 1000; // Convert minutes to ms
          const endTime = new Date(createdAt.getTime() + durationMs);
          const now = new Date();
          
          if (now < endTime) {
            const remainingMs = endTime.getTime() - now.getTime();
            setTimeRemaining(Math.floor(remainingMs / 1000));
            setTimerActive(true);
          } else {
            setTimeRemaining(0);
          }
        }
      } catch (error) {
        console.error("Error fetching roleplay session:", error);
        toast({
          title: "Error loading roleplay",
          description: "Could not load the roleplay session",
          variant: "destructive"
        });
        navigate("/student/roleplay/new");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoleplaySession();
  }, [id, user, navigate, toast]);

  // Timer effect
  useEffect(() => {
    if (timerActive && timeRemaining !== null && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => prev !== null ? prev - 1 : null);
      }, 1000);
      
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else if (timeRemaining === 0 && !sessionComplete) {
      // Auto-complete the session when timer reaches zero
      handleCompleteSession();
    }
  }, [timerActive, timeRemaining, sessionComplete]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isSending || !id) return;
    
    const newMessage: Message = {
      role: buyerMode ? "buyer" : "user",
      content: input.trim(),
      timestamp: new Date()
    };
    
    setIsSending(true);
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    
    try {
      const updatedMessages = [...messages, newMessage];
      
      // Convert Date objects to ISO strings for JSON storage
      const jsonReadyMessages = updatedMessages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp
      }));
      
      await supabase
        .from("roleplay_sessions")
        .update({ transcript: jsonReadyMessages })
        .eq("id", id);
      
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        description: "Failed to send your message",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleCompleteSession = async () => {
    if (!id || !user) return;
    
    try {
      await supabase
        .from("roleplay_sessions")
        .update({ status: "completed" })
        .eq("id", id);
      
      setSessionComplete(true);
      
      toast({
        title: "Roleplay completed",
        description: "Your session is now being analyzed for feedback",
        variant: "default"
      });
      
      // Call the analyze-speech edge function to get AI feedback
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke("analyze-speech", {
        body: {
          transcript: messages.map(m => `${m.role === 'user' ? 'Salesperson' : 'Buyer'}: ${m.content}`).join('\n\n'),
          sessionId: id,
          sessionType: 'roleplay'
        }
      });
      
      if (analysisError) {
        console.error("Error analyzing speech:", analysisError);
        toast({
          title: "Analysis failed",
          description: "Could not analyze your roleplay session. Default feedback generated.",
          variant: "destructive"
        });
        
        // Generate fallback feedback if analysis fails
        const strengths = [
          "Good communication skills",
          "Asked relevant questions",
          "Maintained professional tone"
        ];
        
        const weaknesses = [
          "Could improve product knowledge",
          "Needs more objection handling practice", 
          "Consider better closing techniques"
        ];
        
        const improvements = [
          "Practice more scenario-based roleplays",
          "Research industry pain points",
          "Focus on value proposition delivery"
        ];
        
        const score = Math.floor(Math.random() * 20) + 70;
        
        await supabase
          .from("ai_feedback")
          .insert({
            roleplay_session_id: id,
            score,
            strengths,
            weaknesses,
            improvement_tips: improvements
          });
        
        if (user?.id) {
          await updateLeaderboard(user.id, score);
        }
      } else {
        console.log("Analysis successful:", analysisData);
        if (user?.id) {
          await updateLeaderboard(user.id, analysisData.analysis?.score || 75);
        }
      }
      
      navigate(`/roleplay/${id}/feedback`);
    } catch (error) {
      console.error("Error completing session:", error);
      toast({
        title: "Error completing session",
        description: "Failed to complete the roleplay session",
        variant: "destructive"
      });
    }
  };
  
  const updateLeaderboard = async (userId: string, score: number) => {
    try {
      const { data: existingEntry } = await supabase
        .from("leaderboard_entries")
        .select("*")
        .eq("user_id", userId)
        .eq("category", "global")
        .maybeSingle();
      
      if (existingEntry) {
        if (score > existingEntry.score) {
          await supabase
            .from("leaderboard_entries")
            .update({ score, updated_at: new Date().toISOString() })
            .eq("id", existingEntry.id);
        }
      } else {
        await supabase
          .from("leaderboard_entries")
          .insert({
            user_id: userId,
            score,
            category: "global",
            rank: 99
          });
      }
    } catch (error) {
      console.error("Error updating leaderboard:", error);
    }
  };

  const toggleBuyerMode = () => {
    setBuyerMode(!buyerMode);
    toast({
      title: buyerMode ? "Switched to Seller Mode" : "Switched to Buyer Mode",
      description: buyerMode ? "You are now the seller" : "You are now the buyer",
    });
  };

  const handleRestart = async () => {
    if (!id) return;
    
    try {
      await supabase
        .from("roleplay_sessions")
        .update({ transcript: [], status: "in_progress" })
        .eq("id", id);
      
      setMessages([]);
      setSessionComplete(false);
      
      // Reset timer if there's a duration
      if (sessionData?.duration) {
        setTimeRemaining(sessionData.duration * 60);
        setTimerActive(true);
      }
      
      toast({
        title: "Roleplay restarted",
        description: "Your session has been reset",
      });
    } catch (error) {
      console.error("Error restarting session:", error);
      toast({
        title: "Error restarting session",
        description: "Failed to restart the roleplay session",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin mb-2 text-primary" />
            <p>Loading roleplay session...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!scenario) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-6 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                Error Loading Scenario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>The roleplay scenario could not be loaded. This might be due to an error in scenario generation.</p>
              <Button 
                onClick={() => navigate("/student/roleplay/new")}
                className="w-full"
              >
                Return to Practice Options
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 md:p-8 flex flex-col h-screen max-h-screen">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/student/roleplay/new")}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">{scenario?.title}</h1>
          </div>
          
          <div className="flex gap-2 items-center">
            {timeRemaining !== null && (
              <div className={`text-lg font-mono ${timeRemaining < 60 ? 'text-red-500' : 'text-primary'}`}>
                {formatTime(timeRemaining)}
              </div>
            )}
            
            <Button 
              variant="outline" 
              onClick={toggleBuyerMode}
              className={buyerMode ? "bg-blue-100/10 text-blue-500 border-blue-200" : ""}
            >
              {buyerMode ? "Switch to Seller" : "Switch to Buyer"}
            </Button>
            
            {messages.length > 0 && !sessionComplete && (
              <Button onClick={handleCompleteSession} variant="default">
                Complete & Analyze
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="chat" className="w-full flex-1 flex flex-col" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="chat">Roleplay Chat</TabsTrigger>
            <TabsTrigger value="scenario">Scenario Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="flex-1 flex flex-col">
            <Card className="flex-1 flex flex-col overflow-hidden">
              <CardHeader className="py-3 px-4 border-b">
                <CardTitle className="text-sm font-medium flex justify-between items-center">
                  <span>
                    {sessionData?.industry.charAt(0).toUpperCase() + sessionData?.industry.slice(1)} • 
                    {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
                  </span>
                  <Badge variant={buyerMode ? "secondary" : "default"} className="ml-2">
                    {buyerMode ? "Acting as Buyer" : "Acting as Seller"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-auto p-4">
                <div className="space-y-4 pb-4">
                  {messages.length === 0 && (
                    <div className="p-6 text-center text-muted-foreground">
                      <p className="mb-4">This is a human-to-human roleplay session.</p>
                      <p>Use the "Switch to Buyer" button to toggle between roles during practice.</p>
                      <p className="mt-4">When finished, click "Complete & Analyze" for expert analysis and feedback.</p>
                    </div>
                  )}
                  
                  {messages.map((message, i) => (
                    <div 
                      key={i} 
                      className={`flex ${message.role === "buyer" ? "justify-start" : "justify-end"}`}
                    >
                      <div className={`flex items-start max-w-[80%] ${message.role === "buyer" ? "flex-row" : "flex-row-reverse"}`}>
                        <div className="mt-0.5 mx-2">
                          <Avatar className={message.role === "buyer" ? "bg-primary/10" : "bg-secondary"}>
                            <AvatarFallback>
                              {message.role === "buyer" ? "B" : "S"}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className={`px-4 py-2 rounded-lg ${
                          message.role === "buyer" 
                            ? "bg-muted" 
                            : "bg-primary text-primary-foreground"
                        }`}>
                          <p>{message.content}</p>
                          <span className="text-xs opacity-50 mt-1 block">
                            {message.timestamp instanceof Date 
                              ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder={sessionComplete ? "This roleplay session has ended" : `Type your message as ${buyerMode ? "buyer" : "seller"}...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={sessionComplete || isSending}
                    className="flex-1"
                  />
                  <Button 
                    type="submit" 
                    disabled={!input.trim() || sessionComplete || isSending}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="scenario" className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Company & Product</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{scenario.company_description}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Buyer Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{scenario.buyer_profile}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Scenario Background</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line">{scenario.scenario_background}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Key Objectives</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-1">
                    {scenario.key_objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Common Objections</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-1">
                    {scenario.common_objections.map((objection, index) => (
                      <li key={index}>{objection}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Suggested Talking Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-1">
                    {scenario.talking_points.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Criteria</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-6 space-y-1">
                    {scenario.evaluation_criteria.map((criteria, index) => (
                      <li key={index}>{criteria}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("chat")}
                className="mr-2"
              >
                Return to Chat
              </Button>
              
              {messages.length > 0 ? (
                <Button onClick={handleRestart} variant="destructive">
                  <RotateCw className="h-4 w-4 mr-2" />
                  Restart Roleplay
                </Button>
              ) : null}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default RoleplaySession;
