
import React, { memo, useState, useEffect } from "react";
import { PhoneCall, X, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoCall from "@/components/VideoCall";
import { useVideoCall } from "@/context/VideoCallContext";
import { useToast } from "@/hooks/use-toast";

// Use React.memo to prevent unnecessary re-renders
const ActiveVideoCall = memo(() => {
  const { callState, endCall, toggleMute, toggleCamera } = useVideoCall();
  const { toast } = useToast();
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "connecting" | "reconnecting" | "failed">("connecting");
  
  if (!callState.isInCall || !callState.callId || !callState.callPartner) {
    return null;
  }

  const handleEndCall = () => {
    if (endCall) {
      endCall();
    }
  };

  const handleConnectionStatus = (status: "connected" | "connecting" | "reconnecting" | "failed") => {
    setConnectionStatus(status);
    
    if (status === "reconnecting" && !isReconnecting) {
      setIsReconnecting(true);
      setReconnectAttempts(prev => prev + 1);
      
      toast({
        title: "Connection issues",
        description: "Attempting to reconnect your call...",
        variant: "default"
      });
      
      // If we've tried reconnecting too many times, show a more prominent message
      if (reconnectAttempts >= 2) {
        toast({
          title: "Connection problems",
          description: "We're having trouble maintaining a stable connection. Try ending the call and starting again.",
          variant: "destructive",
          duration: 6000
        });
      }
    } else if (status === "connected" && isReconnecting) {
      setIsReconnecting(false);
      
      toast({
        title: "Reconnected",
        description: "Your call has been restored",
        variant: "default"
      });
    } else if (status === "failed") {
      toast({
        title: "Call Failed",
        description: "Could not establish a connection. Please try again later.",
        variant: "destructive",
        duration: 5000
      });
      
      // Auto end call on complete failure
      if (endCall) {
        setTimeout(() => {
          endCall();
        }, 2000);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-3 bg-muted border-b flex items-center justify-between">
        <div className="flex items-center">
          <PhoneCall className={`h-4 w-4 mr-2 ${connectionStatus === "connected" ? "text-green-500" : connectionStatus === "reconnecting" ? "text-yellow-500" : connectionStatus === "failed" ? "text-red-500" : "text-blue-500"}`} />
          <span>
            {connectionStatus === "connected" && `In call with ${callState.callPartner.with_user_name}`}
            {connectionStatus === "connecting" && "Connecting call..."}
            {connectionStatus === "reconnecting" && "Reconnecting..."}
            {connectionStatus === "failed" && "Call failed"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={toggleMute}
            title={callState.isAudioMuted ? "Unmute" : "Mute"}
          >
            {callState.isAudioMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={toggleCamera}
            title={callState.isVideoOff ? "Turn camera on" : "Turn camera off"}
          >
            {callState.isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
          </Button>
          <Button variant="destructive" size="sm" onClick={handleEndCall}>
            <X className="h-4 w-4 mr-1" />
            End Call
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <VideoCall 
          callId={callState.callId} 
          onCallEnded={handleEndCall}
          onConnectionStatusChange={handleConnectionStatus}
        />
      </div>
    </div>
  );
});

// Display name for debugging
ActiveVideoCall.displayName = 'ActiveVideoCall';

export default ActiveVideoCall;
