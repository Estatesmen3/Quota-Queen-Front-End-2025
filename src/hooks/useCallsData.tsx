
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCallsLoadData } from "./calls/useCallsLoadData";
import { useCallsCreate } from "./calls/useCallsCreate";
import { useCallsJoin } from "./calls/useCallsJoin";
import { Call } from "@/types/calls";

export const useCallsData = () => {
  const [upcomingCalls, setUpcomingCalls] = useState<Call[]>([]);
  const [pastCalls, setPastCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load calls using the extracted hook
  const { loadCalls } = useCallsLoadData({
    user,
    setIsLoading,
    setError,
    setUpcomingCalls,
    setPastCalls
  });

  // // Create call using the extracted hook
  // const { createCall } = useCallsCreate({
  //   user,
  //   setIsCreating,
  //   setError,
  //   loadCalls,
  //   toast
  // });

  const { 
    createCall, 
    callConfig, 
    showCallInterface,
    endCall 
  } = useCallsCreate({
    user,
    setIsCreating,
    setError,
    loadCalls,
    toast
  });

  // Join call using the extracted hook
  const { joinCall, isJoining } = useCallsJoin({ user, toast });

  // Load calls on component mount or when user changes
  useEffect(() => {
    loadCalls();
  }, [loadCalls]);

  return {
    upcomingCalls: upcomingCalls || [],
    pastCalls: pastCalls || [],
    isLoading,
    error,
    loadCalls,
    createCall,
    joinCall,
    isCreating,
    isJoining,
    callConfig,
    showCallInterface, /* from useCallsCreate */
    endCall, /* from useCallsCreate */
  };
};

export default useCallsData;
