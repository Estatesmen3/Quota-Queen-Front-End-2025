
// import { supabase } from "@/lib/supabase";
// import { CreateCallData } from "@/types/calls";
// import { useCallLogging } from "./useCallLogging";

// interface UseCallsCreateProps {
//   user: any;
//   setIsCreating: (creating: boolean) => void;
//   setError: (error: any) => void;
//   loadCalls: () => Promise<void>;
//   toast: any;
// }

// export const useCallsCreate = ({
//   user,
//   setIsCreating,
//   setError,
//   loadCalls,
//   toast
// }: UseCallsCreateProps) => {
//   const { logCallsAndParticipants } = useCallLogging();

//   const createCall = async (callData: CreateCallData) => {
//     if (!user) {
//       toast({
//         title: "Authentication error",
//         description: "You must be logged in to create calls",
//         variant: "destructive"
//       });
//       return null;
//     }

//     setIsCreating(true);
//     setError(null);

//     try {
//       console.log("Creating call for user ID:", user.id);

//       // Use a stored procedure to handle call creation server-side
//       // This reduces client-side logic and improves security
//       const { data, error } = await supabase.rpc('create_call', {
//         p_title: callData.title,
//         p_description: callData.description || null,
//         p_scheduled_at: callData.scheduled_at || null,
//         p_call_type: callData.call_type,
//         p_user_id: user.id,
//         p_participants: callData.participants || []
//       });

//       if (error) {
//         console.error("Error creating call:", error);
//         throw error;
//       }

//       if (!data || !data.call) {
//         throw new Error("Failed to create call: No data returned");
//       }

//       console.log("Call created successfully:", data.call);

//       // For debugging only
//       if (process.env.NODE_ENV === 'development') {
//         await logCallsAndParticipants();
//       }

//       // Refresh the call list after creating a new call
//       await loadCalls();

//       toast({
//         title: "Call created",
//         description: "Your call has been created successfully."
//       });

//       return data.call;
//     } catch (err: any) {
//       console.error("Exception creating call:", err);
//       setError(err);
//       toast({
//         title: "Error creating call",
//         description: err.message || "An unexpected error occurred",
//         variant: "destructive"
//       });
//       return null;
//     } finally {
//       setIsCreating(false);
//     }
//   };

//   return { createCall };
// };


// hooks/useCallsCreate.ts
import { useState } from 'react';
import { CreateCallData } from '@/types/calls';
import { useCallLogging } from './useCallLogging';
import { supabase } from '@/lib/supabase';
import { CallConfig } from '@/types/livekit';
import { useToast } from "@/hooks/use-toast";
import apiClient from '../../../apiClient';


interface UseCallsCreateProps {
  user: any;
  setIsCreating: (creating: boolean) => void;
  setError: (error: any) => void;
  loadCalls: () => Promise<void>;
  toast: any;
}

interface UseCallsCreateReturn {
  createCall: (callData: CreateCallData) => Promise<void>;
  callConfig: CallConfig | null;
  showCallInterface: boolean;
  endCall: () => void;
}

export const useCallsCreate = ({
  user,
  setIsCreating,
  setError,
  loadCalls,
  toast
}: UseCallsCreateProps): UseCallsCreateReturn => {
  const { logCallsAndParticipants } = useCallLogging();
  const [callConfig, setCallConfig] = useState<CallConfig | null>(null);
  const [showCallInterface, setShowCallInterface] = useState(false);

  const createCall = async (callData: CreateCallData) => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to create calls",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const tokenString = localStorage.getItem("sb-pesnfpdwcojfomspprmf-auth-token");
      const tokenObject = tokenString ? JSON.parse(tokenString) : null;
      const accessToken = tokenObject?.access_token;
  
      console.log(`Bearer ${accessToken}`);

      console.log(`Bearer user ${user}`);

      console.log(`Bearer user  callData ${JSON.stringify(callData)}`);

  
      const response = await apiClient.post('api/calls', {
        userId: user.id,
        userMetadata: user.user_metadata,
        title: callData.title,
        description: callData.description,
        scheduledAt: callData.scheduled_at,
        callType: callData.call_type,
        participants: callData.participants,
        LIVEKIT_URL: callData.LIVEKIT_URL,
        LIVEKIT_API_KEY: callData.LIVEKIT_API_KEY,
        LIVEKIT_API_SECRET: callData.LIVEKIT_API_SECRET,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
  
      const { call, livekit } = response.data;
  
      // For debugging only
      if (process.env.NODE_ENV === 'development') {
        await logCallsAndParticipants();
      }

      const response2 = await apiClient.post(`api/scorecard/create/${user.id}/${livekit.roomName}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if(response2.data){
        console.log("response2 data ", response2.data)
      }

  
      // Start the AI call interface
      setCallConfig({
        roomName: livekit.roomName,
        token: livekit.token,
        aiIdentity: 'ai-agent',
        userIdentity: user.id
      });
      setShowCallInterface(true);
  
      // Update local state
      await loadCalls();
  
      toast({
        title: "Call created",
        description: "Connecting to AI agent..."
      });
  
    } catch (err: any) {
      console.error("Call creation error:", err);
      setError(err);
      toast({
        title: "Error creating call",
        description: err.response?.data?.error || err.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }

  //   try {
  //     const tokenString = localStorage.getItem("sb-pesnfpdwcojfomspprmf-auth-token");
  //     const tokenObject = tokenString ? JSON.parse(tokenString) : null;
  //     const accessToken = tokenObject?.access_token;
  //     console.log(`Bearer ${accessToken}`)
  //     const response = await fetch('http://localhost:3003/api/calls', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${accessToken}`,
  //       },
  //       body: JSON.stringify({
  //         userId: user.id,
  //         title: callData.title,
  //         description: callData.description,
  //         scheduledAt: callData.scheduled_at,
  //         callType: callData.call_type,
  //         participants: callData.participants
  //       })
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || 'Failed to create call');
  //     }

  //     const { call, livekit } = await response.json();

  //     // For debugging only
  //     if (process.env.NODE_ENV === 'development') {
  //       await logCallsAndParticipants();
  //     }

  //     // Start the AI call interface
  //     setCallConfig({
  //       roomName: livekit.roomName,
  //       token: livekit.token,
  //       aiIdentity: 'ai-agent',
  //       userIdentity: user.id
  //     });
  //     setShowCallInterface(true);

  //     // Update local state
  //     await loadCalls();

  //     toast({
  //       title: "Call created",
  //       description: "Connecting to AI agent..."
  //     });

  //   } catch (err: any) {
  //     console.error("Call creation error:", err);
  //     setError(err);
  //     toast({
  //       title: "Error creating call",
  //       description: err.message || "An unexpected error occurred",
  //       variant: "destructive"
  //     });
  //   } finally {
  //     setIsCreating(false);
  //   }
  // };
  }

  const endCall = () => {
    setShowCallInterface(false);
    setCallConfig(null);
    toast({
      title: "Call ended",
      description: "Your conversation has been saved"
    });
  };

  return {
    createCall,
    callConfig,
    showCallInterface,
    endCall
  };
};