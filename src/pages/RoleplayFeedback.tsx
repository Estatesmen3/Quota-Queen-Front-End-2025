import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, Star, BarChart, Download, Share, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from 'framer-motion';
import { AIFeedback, RoleplaySession, Message } from '@/types/roleplay';

interface FeedbackPageState {
  isLoading: boolean;
  sessionData: RoleplaySession | null;
  feedback: AIFeedback | null;
  transcript: Message[];
  error: string | null;
}

const RoleplayFeedback = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [state, setState] = useState<FeedbackPageState>({
    isLoading: true,
    sessionData: null,
    feedback: null,
    transcript: [],
    error: null
  });
  
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  useEffect(() => {
    if (!id || !user) return;
    
    const loadFeedback = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        // Fetch the roleplay session
        const { data: sessionData, error: sessionError } = await supabase
          .from('roleplay_sessions')
          .select('*')
          .eq('id', id)
          .eq('student_id', user.id)
          .single();
        
        if (sessionError) throw new Error(sessionError.message);
        if (!sessionData) throw new Error('Session not found');
        
        const typedSessionData = sessionData as unknown as RoleplaySession;
        
        // Process transcript data if available
        let transcriptData: Message[] = [];
        if (typedSessionData.transcript && Array.isArray(typedSessionData.transcript)) {
          transcriptData = typedSessionData.transcript.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
        }
        
        // Fetch the AI feedback
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('ai_feedback')
          .select('*')
          .eq('roleplay_session_id', id)
          .single();
        
        if (feedbackError && feedbackError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw new Error(feedbackError.message);
        }
        
        setState({
          isLoading: false,
          sessionData: typedSessionData,
          feedback: feedbackData as unknown as AIFeedback || null,
          transcript: transcriptData,
          error: null
        });
      } catch (err: any) {
        console.error('Error loading feedback:', err);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err.message || 'Failed to fetch feedback data'
        }));
        
        toast({
          title: 'Error loading feedback',
          description: 'Could not load the roleplay feedback',
          variant: 'destructive'
        });
      }
    };
    
    loadFeedback();
  }, [id, user, toast]);
  
  const handleTryAgain = () => {
    if (!state.sessionData) return;
    
    // Navigate to a new roleplay with the same segment
    navigate(`/student/roleplay/context-setup/${state.sessionData.segment || ''}`);
  };
  
  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };
  
  if (state.isLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
            <p>Loading feedback...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!state.feedback) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-6 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Feedback Not Available</CardTitle>
              <CardDescription>
                We couldn't find feedback for this roleplay session.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>This might be because the analysis is still in progress or there was an error during analysis.</p>
              <Button onClick={() => navigate('/student/roleplay/new')} className="w-full">
                Return to Practice
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="flex-1 p-6 md:p-8 bg-gradient-to-br from-background to-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button 
              variant="outline" 
              className="mb-2 group transition-all duration-300 hover:bg-dopamine-purple/10"
              onClick={() => navigate('/student/roleplay/new')}
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:text-dopamine-purple transition-colors" />
              <span className="group-hover:text-dopamine-purple transition-colors">Back to Practice Options</span>
            </Button>
          </div>
          
          <motion.div 
            className="mb-8 p-6 rounded-xl bg-gradient-to-r from-dopamine-purple/20 to-dopamine-pink/10 shadow-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold tracking-tight highlight-gradient">
              Roleplay Feedback
            </h1>
            <p className="text-muted-foreground mt-2">
              AI-powered analysis and personalized feedback for your sales practice
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            <motion.div 
              className="md:col-span-5 lg:col-span-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="overflow-hidden border-t-4 border-dopamine-purple shadow-md">
                <CardHeader className="bg-gradient-to-r from-dopamine-purple/10 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-dopamine-purple" />
                    Performance Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-36 h-36 flex items-center justify-center mb-4">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#f0f0f0"
                          strokeWidth="10"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="url(#scoreGradient)"
                          strokeWidth="10"
                          strokeDasharray={`${state.feedback.score * 2.83} ${283 - state.feedback.score * 2.83}`}
                          strokeDashoffset="70"
                          transform="rotate(-90 50 50)"
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
                        {state.feedback.score}
                      </div>
                    </div>
                    
                    <div className="text-muted-foreground text-sm text-center max-w-xs mx-auto">
                      {state.feedback.score >= 90 ? (
                        "Outstanding performance! You've mastered this sales technique."
                      ) : state.feedback.score >= 75 ? (
                        "Great work! You show strong sales skills with some room for improvement."
                      ) : state.feedback.score >= 60 ? (
                        "Good effort! With some refinement, you'll see significant improvement."
                      ) : (
                        "This is a challenging area. Focus on the improvement tips to build your skills."
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Button 
                    className="w-full dopamine-gradient-1 glow-on-hover h-12"
                    onClick={handleTryAgain}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Practice Again
                  </Button>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <Button
                    variant="outline"
                    className="w-full h-12"
                    onClick={handleGoToDashboard}
                  >
                    View Dashboard
                  </Button>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:col-span-7 lg:col-span-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="overflow-hidden shadow-md border-t-4 border-emerald-500">
                <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {state.feedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden shadow-md border-t-4 border-rose-500 mt-6">
                <CardHeader className="bg-gradient-to-r from-rose-500/10 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-rose-500" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {state.feedback.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 text-rose-500 mt-0.5 flex-shrink-0" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden shadow-md border-t-4 border-amber-500 mt-6">
                <CardHeader className="bg-gradient-to-r from-amber-500/10 to-transparent">
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    Improvement Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-2">
                    {state.feedback.improvement_tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {state.transcript.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Card className="overflow-hidden shadow-md">
                <CardHeader>
                  <CardTitle>Conversation Transcript</CardTitle>
                  <CardDescription>
                    Review your roleplay conversation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {state.transcript.map((message, index) => (
                      <div key={index} className="pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <strong className={message.role === 'buyer' ? 'text-blue-500' : 'text-purple-500'}>
                            {message.role === 'buyer' ? 'Buyer' : 'You (Seller)'}:
                          </strong>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp instanceof Date 
                              ? message.timestamp.toLocaleTimeString() 
                              : new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="pl-5">{message.content}</p>
                        {index < state.transcript.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RoleplayFeedback;

