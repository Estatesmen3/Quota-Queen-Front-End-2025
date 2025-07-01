
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { RoleplaySession, RoleplayScenario, Message } from '@/types/roleplay';

const WaitingRoom = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [session, setSession] = useState<RoleplaySession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSessionReady, setIsSessionReady] = useState(false);
  const [scenario, setScenario] = useState<RoleplayScenario | null>(null);
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  useEffect(() => {
    if (!id) {
      setError('Session ID is missing.');
      setIsLoading(false);
      return;
    }
    
    const fetchSession = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('roleplay_sessions')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (!data) {
          throw new Error('Session not found.');
        }
        
        // Safely convert to RoleplaySession type with all required fields
        const sessionData: RoleplaySession = {
          id: data.id,
          student_id: data.student_id,
          recruiter_id: data.recruiter_id,
          scenario_title: data.scenario_title || "Untitled Scenario",
          scenario_data: data.scenario_data as RoleplayScenario | undefined,
          industry: data.industry || "General",
          difficulty: data.difficulty || "intermediate",
          status: (data.status as "pending" | "in_progress" | "ready" | "completed") || "in_progress",
          duration: data.duration || 10,
          transcript: data.transcript ? (data.transcript as Message[]) : [],
          created_at: data.created_at,
          updated_at: data.updated_at,
          segment: data.segment
        };
        
        setSession(sessionData);
        
        // Check if scenario_data exists and is not null
        if (sessionData.scenario_data) {
          setScenario(sessionData.scenario_data);
        }
        
        // Determine user roles based on session data
        if (user && sessionData.recruiter_id === user.id) {
          setIsRecruiter(true);
          setIsStudent(false);
        } else if (user && sessionData.student_id === user.id) {
          setIsStudent(true);
          setIsRecruiter(false);
        }
        
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch session.');
        setIsLoading(false);
      }
    };
    
    fetchSession();
    
    // Subscribe to session updates
    const sessionSubscription = supabase
      .channel('roleplay_sessions')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'roleplay_sessions', 
        filter: `id=eq.${id}` 
      },
      (payload) => {
        if (payload.new) {
          const newData = payload.new as any;
          // Convert to RoleplaySession type
          const sessionData: RoleplaySession = {
            id: newData.id,
            student_id: newData.student_id,
            recruiter_id: newData.recruiter_id,
            scenario_title: newData.scenario_title || "Untitled Scenario",
            scenario_data: newData.scenario_data as RoleplayScenario | undefined,
            industry: newData.industry || "General",
            difficulty: newData.difficulty || "intermediate",
            status: (newData.status as "pending" | "in_progress" | "ready" | "completed") || "in_progress",
            duration: newData.duration || 10,
            transcript: newData.transcript ? (newData.transcript as Message[]) : [],
            created_at: newData.created_at,
            updated_at: newData.updated_at,
            segment: newData.segment
          };
          
          setSession(sessionData);
          
          if (sessionData.scenario_data) {
            setScenario(sessionData.scenario_data);
          }
          
          setIsSessionReady(sessionData.status === 'ready');
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(sessionSubscription);
    };
  }, [id, user?.id]);
  
  useEffect(() => {
    if (session && session.status === 'ready') {
      setIsSessionReady(true);
      
      // Automatically navigate to the call page after a delay
      const navigationTimeout = setTimeout(() => {
        navigate(`/call/${id}`);
      }, 2000); // Adjust delay as needed
      
      return () => clearTimeout(navigationTimeout);
    } else {
      setIsSessionReady(false);
    }
  }, [session, navigate, id]);
  
  const handleStartSession = async () => {
    if (!session || !id) return;
    
    try {
      // Update session status to "ready"
      const { error } = await supabase
        .from('roleplay_sessions')
        .update({ status: 'ready' })
        .eq('id', id);
        
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Session Ready",
        description: "The session is now ready to begin",
      });
      
      // Navigate to the call page immediately
      navigate(`/call/${id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to start session.');
    }
  };

  // Update session status to "in_progress"
  const updateSessionStatus = async () => {
    if (session && id) {
      try {
        const { error } = await supabase
          .from('roleplay_sessions')
          .update({ status: 'in_progress' })
          .eq('id', id);
          
        if (error) {
          console.error("Error updating session status:", error);
        } else {
          console.log("Session status updated to in_progress");
        }
      } catch (error) {
        console.error("Exception updating session status:", error);
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading session...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }
  
  if (!session || !scenario) {
    return (
      <div className="flex h-screen items-center justify-center">
        Session not found.
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Roleplay Session</h1>
      
      <Card className="mb-4">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-2">{scenario.title}</h2>
          <p className="text-muted-foreground">
            {isStudent && <span>Waiting for the recruiter to start the session...</span>}
            {isRecruiter && <span>You can start the session when you're ready.</span>}
          </p>
        </CardContent>
      </Card>
      
      {isRecruiter && (
        <Button 
          onClick={handleStartSession} 
          disabled={isSessionReady}
        >
          {isSessionReady ? 'Session Ready - Navigating...' : 'Start Session'}
        </Button>
      )}
      
      {isStudent && isSessionReady && (
        <div className="text-center mt-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary inline-block mr-2" />
          <p>Session is ready! Redirecting to call...</p>
        </div>
      )}
    </div>
  );
};

export default WaitingRoom;
