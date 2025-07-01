
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCallLogging } from "./useCallLogging";
import { Call } from "@/types/calls";

interface UseCallsJoinProps {
  user: any;
  toast: any;
}

export const useCallsJoin = ({ user, toast }: UseCallsJoinProps) => {
  const [isJoining, setIsJoining] = useState(false);
  const { logCallEvent, logCallsAndParticipants } = useCallLogging();

  const joinCall = async (callId: string): Promise<Call | null> => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to join calls",
        variant: "destructive"
      });
      return null;
    }

    setIsJoining(true);

    try {
      console.log("Joining call with ID:", callId);
      
      // Use a stored procedure to handle joining logic server-side
      // This avoids multiple roundtrips and prevents RLS issues
      const { data, error } = await supabase.rpc('join_call', {
        p_call_id: callId,
        p_user_id: user.id
      });
      
      if (error) {
        console.error("Error joining call:", error);
        throw error;
      }
      
      if (!data || !data.call) {
        throw new Error("Failed to join call: No data returned");
      }
      
      console.log("Join call successful:", data.call);
      
      if (data.action === 'joined') {
        await logCallEvent(callId, "join", `User ${user.id} joined the call`);
      } else if (data.action === 'rejoined') {
        await logCallEvent(callId, "rejoin", `User ${user.id} rejoined the call`);
      }
      
      // For debugging only
      if (process.env.NODE_ENV === 'development') {
        await logCallsAndParticipants();
      }

      return data.call;
    } catch (err: any) {
      console.error("Exception joining call:", err);
      toast({
        title: "Error joining call",
        description: err.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsJoining(false);
    }
  };

  return { 
    joinCall,
    isJoining 
  };
};
