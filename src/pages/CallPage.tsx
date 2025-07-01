
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import VideoCall from "@/components/VideoCall";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  AudioConference,
  LiveKitRoom,
  useRoomContext,
  useParticipantTracks,
  useRemoteParticipants,
  ParticipantAudioTile,
  useLocalParticipant,
  VideoConference
} from "@livekit/components-react";
import { Room, Track } from "livekit-client";
import apiClient from '../../apiClient';
import useCallsData from "@/hooks/useCallsData";
import { CallInterface } from "@/components/call-interface";
import AiAgentUI from "@/components/calls/AiAgentUI";

const CallPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [callDetails, setCallDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [showCallEnded, setShowCallEnded] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [callType, setCallType] = useState<string>("regular");
  const [isAnalysisProcessing, setIsAnalysisProcessing] = useState(false);
  const [livekitRoom, setLivekitRoom] = useState<Room | null>(null);

  const {
    upcomingCalls,
    isCreating,
    createCall,
    callConfig,
    showCallInterface,
    endCall,
  } = useCallsData();

  const handleCreateCall = async (callData: any) => {
    await createCall({
      ...callData,
      scheduled_at: callData.scheduled_at || null,
    });
  };

  useEffect(() => {
    console.log("innnnnnnnn calllll apgeeeee")
    // if (!id || !user) return;
    callCreate();
    // loadCallDetails();
  }, []);

  // const loadCallDetails = async () => {
  //   setIsLoading(true);
  //   try {
  //     // Check if user is a participant or host
  //     const { data: callData, error: callError } = await supabase
  //       .from("calls")
  //       .select(`
  //         *,
  //         host:host_id(id, first_name, last_name)
  //       `)
  //       .eq("id", id)
  //       .single();

  //     if (callError) throw callError;

  //     // Store the session ID if this is a roleplay call
  //     if (callData.related_session_id) {
  //       setSessionId(callData.related_session_id);
  //     }

  //     // Set call type
  //     setCallType(callData.call_type || "regular");

  //     // Check if user is host or participant
  //     const { data: participantData, error: participantError } = await supabase
  //       .from("call_participants")
  //       .select("*")
  //       .eq("call_id", id)
  //       .eq("user_id", user?.id)
  //       .maybeSingle();

  //     if (participantError) throw participantError;

  //     // If user is neither host nor participant, add them as participant
  //     if (callData.host_id !== user?.id && !participantData) {
  //       const { error: insertError } = await supabase
  //         .from("call_participants")
  //         .insert({
  //           call_id: id,
  //           user_id: user?.id,
  //           role: "participant",
  //           joined_at: new Date().toISOString()
  //         });

  //       if (insertError) throw insertError;
  //     }

  //     setCallDetails(callData);
  //   } catch (error) {
  //     console.error("Error loading call details:", error);
  //     toast({
  //       title: "Error loading call",
  //       description: "This call may not exist or you don't have permission to join it.",
  //       variant: "destructive"
  //     });
  //     navigate("/dashboard");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const inviteUser = async () => {
  //   if (!userEmail.trim() || !id) return;

  //   setIsInviting(true);
  //   try {
  //     // First, check if the user exists
  //     const { data: userData, error: userError } = await supabase
  //       .from("profiles")
  //       .select("id")
  //       .eq("email", userEmail)
  //       .maybeSingle();

  //     if (userError) throw userError;

  //     if (!userData) {
  //       toast({
  //         title: "User not found",
  //         description: "No user found with that email address.",
  //         variant: "destructive"
  //       });
  //       return;
  //     }

  //     // Check if user is already a participant
  //     const { data: existingParticipant, error: checkError } = await supabase
  //       .from("call_participants")
  //       .select("*")
  //       .eq("call_id", id)
  //       .eq("user_id", userData.id)
  //       .maybeSingle();

  //     if (checkError) throw checkError;

  //     if (existingParticipant) {
  //       toast({
  //         title: "Already invited",
  //         description: "This user is already a participant in this call.",
  //         variant: "default"
  //       });
  //       return;
  //     }

  //     // Add user as participant
  //     const { error: insertError } = await supabase
  //       .from("call_participants")
  //       .insert({
  //         call_id: id,
  //         user_id: userData.id,
  //         role: "participant"
  //       });

  //     if (insertError) throw insertError;

  //     toast({
  //       title: "Invitation sent",
  //       description: `Successfully invited ${userEmail} to the call.`
  //     });

  //     setUserEmail("");
  //   } catch (error) {
  //     console.error("Error inviting user:", error);
  //     toast({
  //       title: "Invitation failed",
  //       description: "Failed to invite the user. Please try again.",
  //       variant: "destructive"
  //     });
  //   } finally {
  //     setIsInviting(false);
  //   }
  // };

  // const handleCallEnded = async () => {
  //   try {
  //     setIsAnalysisProcessing(true);

  //     // Log call ended event
  //     try {
  //       await supabase.from('call_logs').insert({
  //         call_id: id,
  //         log_type: 'call_ended',
  //         message: 'Call ended and feedback process started'
  //       });
  //     } catch (logError) {
  //       console.error('Error logging call end:', logError);
  //     }

  //     // Update call status to completed
  //     await supabase
  //       .from("calls")
  //       .update({ status: "completed", ended_at: new Date().toISOString() })
  //       .eq("id", id);

  //     // If this is a roleplay call, update the session status
  //     if (sessionId) {
  //       await supabase
  //         .from("roleplay_sessions")
  //         .update({ status: "completed" })
  //         .eq("id", sessionId);
  //     }

  //     // Check if recording exists
  //     const { data: callData } = await supabase
  //       .from("calls")
  //       .select("recording_url, is_ai_feedback_processed")
  //       .eq("id", id)
  //       .single();

  //     // If recording exists and AI feedback not processed yet, wait for it
  //     if (callData?.recording_url && !callData?.is_ai_feedback_processed) {
  //       // Poll for AI feedback completion (retry 5 times with 3 second intervals)
  //       let attempts = 0;
  //       const checkInterval = setInterval(async () => {
  //         attempts++;

  //         const { data: updatedCall } = await supabase
  //           .from("calls")
  //           .select("is_ai_feedback_processed")
  //           .eq("id", id)
  //           .single();

  //         if (updatedCall?.is_ai_feedback_processed) {
  //           clearInterval(checkInterval);
  //           setIsAnalysisProcessing(false);
  //           setShowCallEnded(true);
  //         } else if (attempts >= 5) {
  //           // After 5 attempts (15 seconds), just continue anyway
  //           clearInterval(checkInterval);
  //           setIsAnalysisProcessing(false);
  //           setShowCallEnded(true);
  //         }
  //       }, 3000);
  //     } else {
  //       // No recording or already processed, just show call ended
  //       setIsAnalysisProcessing(false);
  //       setShowCallEnded(true);
  //     }
  //   } catch (error) {
  //     console.error("Error ending call:", error);
  //     setIsAnalysisProcessing(false);
  //     setShowCallEnded(true);
  //   }
  // };

  // const goToFeedback = () => {
  //   // If this was a roleplay session, go to roleplay feedback
  //   if (sessionId && callType === "roleplay") {
  //     navigate(`/roleplay/${sessionId}/feedback`);
  //   } else {
  //     // Otherwise go to regular call feedback
  //     navigate(`/call/${id}/feedback`);
  //   }
  // };

  const location = useLocation();


  const state = location.state || JSON.parse(localStorage.getItem("challengeData") || "{}");

  const goToDashboard = () => {
    console.log("goToDashboard")
    navigate("/dashboard");
  };


  const callCreate = async () => {

    try {
      const tokenString = localStorage.getItem("sb-pesnfpdwcojfomspprmf-auth-token");
      const tokenObject = tokenString ? JSON.parse(tokenString) : null;
      const accessToken = tokenObject?.access_token;
      const userId = tokenObject?.user?.id;
      const user = tokenObject?.user;

      console.log("user ID LS ", userId)

      const res = await apiClient.post(
        'api/calls',
        {
          userId: userId,
          userMetadata: user,
          title: state.company_name,
          description: state. company_description,
          scheduledAt: state.start_date || null,
          callType: state.difficulty,
          LIVEKIT_URL: state.livekit_url,
          LIVEKIT_API_KEY: state.livekit_api_key,
          LIVEKIT_API_SECRET: state.livekit_api_secret
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = res.data;
      await handleCreateCall(data);

      toast({
        title: "Call created",
        description: "Opening call interface…",
      });
    } catch (e: any) {
      toast({
        title: "Failed to create call",
        description: e.response?.data?.error || e.message || "Something went wrong",
        variant: "destructive",
      });
    }

  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading video call...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // if (isAnalysisProcessing) {
    return (
      <DashboardLayout>
        {/* <div className="flex-1 p-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Processing call recording...</p>
            <p className="text-muted-foreground mt-2">
              Our AI is analyzing your call. This may take a moment.
            </p>
          </div>
        </div> */}

        {showCallInterface && callConfig && (
          <div className="fixed inset-0 z-50 bg-black/80 flex">
            <CallInterface
              roomName={callConfig.roomName}
              token={callConfig.token}
              onDisconnect={() => {
                endCall();
                setLivekitRoom(null);
              }}
              onRoomConnected={setLivekitRoom}
            />
            {livekitRoom && <AiAgentUI room={livekitRoom} />}
          </div>
        )}
      </DashboardLayout>
    );
  // }

  // if (showCallEnded) {
  //   return (
  //     <DashboardLayout>
  //       <div className="flex-1 p-4 flex items-center justify-center">
  //         <div className="text-center max-w-md mx-auto">
  //           <div className="bg-green-100 text-green-800 p-2 rounded-full inline-flex items-center justify-center mb-4">
  //             <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  //             </svg>
  //           </div>
  //           <h2 className="text-2xl font-bold mb-2">Call Completed</h2>
  //           <p className="text-muted-foreground mb-6">
  //             Your video call has ended. The AI is now analyzing the call to provide feedback.
  //           </p>
  //           <div className="space-y-2">
  //             <Button className="w-full" onClick={goToFeedback}>
  //               View AI Feedback
  //             </Button>
  //             <Button variant="outline" className="w-full" onClick={goToDashboard}>
  //               Return to Dashboard
  //             </Button>
  //           </div>
  //         </div>
  //       </div>
  //     </DashboardLayout>
  //   );
  // }

  // return (
  //   <DashboardLayout>
  //     <div className="flex-1 p-4 flex flex-col h-full max-h-screen">
  //       <div className="flex items-center justify-between mb-4">
  //         <div className="flex items-center">
  //           <Button
  //             variant="ghost"
  //             onClick={() => navigate(callType === "roleplay" ? "/roleplays" : "/roleplays")}
  //             className="mr-2"
  //           >
  //             <ArrowLeft className="h-4 w-4 mr-2" />
  //             Back
  //           </Button>
  //           <h1 className="text-xl font-semibold">
  //             {callType === "roleplay" ? "Roleplay: " : ""}{callDetails?.title || "Call"}
  //           </h1>
  //         </div>

  //         {callDetails?.host_id === user?.id && (
  //           <Dialog>
  //             <DialogTrigger asChild>
  //               <Button variant="outline" size="sm">
  //                 <UserPlus className="h-4 w-4 mr-2" />
  //                 Invite
  //               </Button>
  //             </DialogTrigger>
  //             <DialogContent>
  //               <DialogHeader>
  //                 <DialogTitle>Invite a User</DialogTitle>
  //               </DialogHeader>
  //               <div className="py-4">
  //                 <Label htmlFor="email">Email Address</Label>
  //                 <Input
  //                   id="email"
  //                   type="email"
  //                   placeholder="user@example.com"
  //                   value={userEmail}
  //                   onChange={(e) => setUserEmail(e.target.value)}
  //                   className="mt-1"
  //                 />
  //               </div>
  //               <DialogFooter>
  //                 <Button onClick={inviteUser} disabled={isInviting}>
  //                   {isInviting ? "Inviting..." : "Send Invitation"}
  //                 </Button>
  //               </DialogFooter>
  //             </DialogContent>
  //           </Dialog>
  //         )}
  //       </div>

  //       <div className="flex-1 overflow-hidden">
  //         <VideoCall callId={id!} onCallEnded={handleCallEnded} />
  //       </div>
  //     </div>
  //   </DashboardLayout>
  // );
};

export default CallPage;
