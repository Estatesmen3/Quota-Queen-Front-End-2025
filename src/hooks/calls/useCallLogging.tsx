
import { supabase } from "@/lib/supabase";

export const useCallLogging = () => {
  // Log call events to the database directly with better error handling
  const logCallEvent = async (callId: string, logType: string, message: string) => {
    try {
      // Use rpc to avoid RLS issues
      const { error } = await supabase.rpc('log_call_event', {
        p_call_id: callId,
        p_log_type: logType,
        p_message: message
      });
      
      if (error) throw error;
      console.log(`Call log recorded: [${logType}] ${message}`);
    } catch (error) {
      console.error('Failed to log call event:', error);
    }
  };

  // Debug function to print all calls and participants (useful for debugging)
  const logCallsAndParticipants = async () => {
    try {
      console.log("All calls after operation:");
      const { data: allCalls, error: callsError } = await supabase
        .from("calls")
        .select("*");
      
      if (callsError) {
        console.error("Error fetching calls:", callsError);
        return;
      }
      
      console.log(allCalls);
      
      console.log("All participants after operation:");
      const { data: allParticipants, error: participantsError } = await supabase
        .from("call_participants")
        .select("*");
      
      if (participantsError) {
        console.error("Error fetching participants:", participantsError);
        return;
      }
      
      console.log(allParticipants);
    } catch (error) {
      console.error("Error fetching calls and participants for logging:", error);
    }
  };

  return {
    logCallEvent,
    logCallsAndParticipants
  };
};
