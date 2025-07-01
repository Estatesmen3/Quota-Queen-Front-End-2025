
import { useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Call } from "@/types/calls";

interface UseCallsLoadDataProps {
  user: any;
  setIsLoading: (loading: boolean) => void;
  setError: (error: any) => void;
  setUpcomingCalls: (calls: Call[]) => void;
  setPastCalls: (calls: Call[]) => void;
}

export const useCallsLoadData = ({
  user,
  setIsLoading,
  setError,
  setUpcomingCalls,
  setPastCalls
}: UseCallsLoadDataProps) => {
  
  const loadCalls = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Loading calls for user ID:", user.id);
      
      // Use a more efficient approach with a single query and server-side joins
      const { data: userCalls, error: callsError } = await supabase.rpc(
        'get_user_calls',
        { user_id: user.id }
      );
      
      if (callsError) {
        console.error("Error fetching calls:", callsError);
        throw callsError;
      }
      
      console.log("Total calls loaded:", userCalls?.length || 0);
      
      if (!userCalls || userCalls.length === 0) {
        setUpcomingCalls([]);
        setPastCalls([]);
        setIsLoading(false);
        return;
      }
      
      // Split into upcoming and past calls
      const upcoming = userCalls
        .filter((call: Call) => 
          call.status === 'scheduled' || call.status === 'in_progress'
        )
        .sort((a: Call, b: Call) => {
          const dateA = a.scheduled_at ? new Date(a.scheduled_at) : new Date(a.created_at);
          const dateB = b.scheduled_at ? new Date(b.scheduled_at) : new Date(b.created_at);
          return dateA.getTime() - dateB.getTime();
        });
      
      const past = userCalls
        .filter((call: Call) => 
          call.status === 'completed' || call.status === 'cancelled'
        )
        .sort((a: Call, b: Call) => {
          const dateA = a.scheduled_at ? new Date(a.scheduled_at) : new Date(a.created_at);
          const dateB = b.scheduled_at ? new Date(b.scheduled_at) : new Date(b.created_at);
          return dateB.getTime() - dateA.getTime(); // Reverse sort for past calls
        });
      
      console.log("Upcoming calls:", upcoming.length);
      console.log("Past calls:", past.length);
      
      setUpcomingCalls(upcoming);
      setPastCalls(past);
    } catch (err) {
      console.error("Exception fetching calls:", err);
      setError(err);
      setUpcomingCalls([]);
      setPastCalls([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, setIsLoading, setError, setUpcomingCalls, setPastCalls]);

  return { loadCalls };
};
