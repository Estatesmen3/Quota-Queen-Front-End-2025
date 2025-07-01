
import { createContext, useContext, useState, ReactNode } from "react";
import { Conversation, VideoCallState } from "@/types/messages";
import { useToast } from "@/hooks/use-toast";

interface VideoCallContextType {
  callState: VideoCallState;
  initiateCall: (conversation: Conversation) => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
}

const initialCallState: VideoCallState = {
  isInCall: false,
  callId: null,
  callPartner: null,
  initiatingCall: false,
  isAudioMuted: false,
  isVideoOff: false
};

const VideoCallContext = createContext<VideoCallContextType | undefined>(undefined);

export const VideoCallProvider = ({ children }: { children: ReactNode }) => {
  const [callState, setCallState] = useState<VideoCallState>(initialCallState);
  const { toast } = useToast();

  const initiateCall = async (conversation: Conversation) => {
    if (!conversation || !conversation.with_user_id) {
      toast({
        title: "Cannot start call",
        description: "Missing conversation information",
        variant: "destructive"
      });
      return;
    }

    setCallState(prev => ({ ...prev, initiatingCall: true }));
    
    try {
      // In a real app, we would make an API call to create a call
      const mockCallId = `call-${Date.now()}`;
      
      setCallState({
        isInCall: true,
        callId: mockCallId,
        callPartner: conversation,
        initiatingCall: false,
        isAudioMuted: false,
        isVideoOff: false
      });
      
      toast({
        title: "Video call initiated",
        description: `Starting call with ${conversation.with_user_name}`
      });
    } catch (error) {
      console.error("Error starting call:", error);
      toast({
        title: "Failed to start video call",
        description: "Please try again",
        variant: "destructive"
      });
      setCallState(prev => ({ ...prev, initiatingCall: false }));
    }
  };

  const endCall = () => {
    setCallState(initialCallState);
  };

  const toggleMute = () => {
    setCallState(prev => ({
      ...prev,
      isAudioMuted: !prev.isAudioMuted
    }));
  };

  const toggleCamera = () => {
    setCallState(prev => ({
      ...prev,
      isVideoOff: !prev.isVideoOff
    }));
  };

  return (
    <VideoCallContext.Provider value={{ callState, initiateCall, endCall, toggleMute, toggleCamera }}>
      {children}
    </VideoCallContext.Provider>
  );
};

export const useVideoCall = () => {
  const context = useContext(VideoCallContext);
  if (context === undefined) {
    throw new Error("useVideoCall must be used within a VideoCallProvider");
  }
  return context;
};
