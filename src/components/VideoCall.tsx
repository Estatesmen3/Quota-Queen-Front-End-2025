
import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, MicOff, Video, VideoOff, PhoneOff, ScreenShare, Users } from "lucide-react";
import { useVideoCall } from "@/hooks/useVideoCall";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

interface VideoCallProps {
  callId: string;
  onCallEnded?: () => void;
  onConnectionStatusChange?: (status: "connected" | "connecting" | "reconnecting" | "failed") => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ callId, onCallEnded, onConnectionStatusChange }) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const videoGrid = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const combinedStream = useRef<MediaStream | null>(null);
  
  const {
    isConnecting,
    isConnected,
    localVideoRef,
    localStream,
    peers,
    isMuted,
    isVideoOff,
    isScreenSharing,
    callDetails,
    participants,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    leaveCall
  } = useVideoCall({
    callId,
    onError: (error) => {
      toast({
        title: "Call Error",
        description: error.message,
        variant: "destructive"
      });
      
      // Log error to call_logs table
      logCallEvent('error', error.message);
    }
  });

  // Function to log call events to the call_logs table
  const logCallEvent = async (logType: string, message: string) => {
    try {
      await supabase
        .from('call_logs')
        .insert({
          call_id: callId,
          log_type: logType,
          message: message
        });
    } catch (error) {
      console.error('Failed to log call event:', error);
    }
  };

  // Set up combined stream for recording
  useEffect(() => {
    if (isConnected && localStream) {
      try {
        // Create a new canvas for compositing video
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext('2d');
        
        // Set up the stream from the canvas
        const canvasStream = canvas.captureStream(30); // 30 FPS
        
        // Add audio tracks from local stream
        const audioTracks = localStream.getAudioTracks();
        audioTracks.forEach(track => {
          canvasStream.addTrack(track);
        });
        
        // Add remote audio tracks from peer connections
        peers.forEach(peer => {
          const remoteTracks = peer.stream.getAudioTracks();
          remoteTracks.forEach(track => {
            canvasStream.addTrack(track);
          });
        });
        
        // Store the combined stream for recording
        combinedStream.current = canvasStream;
        
        // Draw video feeds on canvas
        const drawVideoFeeds = () => {
          if (!ctx) return;
          
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          const videos: HTMLVideoElement[] = [];
          
          // Add local video
          if (localVideoRef.current) {
            videos.push(localVideoRef.current);
          }
          
          // Add remote videos
          peers.forEach(peer => {
            const remoteVideo = document.getElementById(`remote-video-${peer.userId}`) as HTMLVideoElement;
            if (remoteVideo) {
              videos.push(remoteVideo);
            }
          });
          
          // Calculate layout based on number of videos
          if (videos.length === 1) {
            // Single video - full canvas
            const video = videos[0];
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          } else if (videos.length === 2) {
            // Two videos - side by side
            const video1 = videos[0];
            const video2 = videos[1];
            ctx.drawImage(video1, 0, 0, canvas.width / 2, canvas.height);
            ctx.drawImage(video2, canvas.width / 2, 0, canvas.width / 2, canvas.height);
          } else {
            // Grid layout for more videos
            const cols = Math.ceil(Math.sqrt(videos.length));
            const rows = Math.ceil(videos.length / cols);
            const cellWidth = canvas.width / cols;
            const cellHeight = canvas.height / rows;
            
            videos.forEach((video, index) => {
              const col = index % cols;
              const row = Math.floor(index / cols);
              ctx.drawImage(
                video,
                col * cellWidth,
                row * cellHeight,
                cellWidth,
                cellHeight
              );
            });
          }
          
          requestAnimationFrame(drawVideoFeeds);
        };
        
        drawVideoFeeds();
        
        // Start recording automatically when call is connected
        startRecording();
        
        return () => {
          if (combinedStream.current) {
            combinedStream.current.getTracks().forEach(track => track.stop());
          }
        };
      } catch (error) {
        console.error('Error setting up recording:', error);
        logCallEvent('recording_setup_error', error.message || 'Failed to set up recording');
      }
    }
  }, [isConnected, localStream, peers]);

  // Start recording function
  const startRecording = () => {
    try {
      if (!combinedStream.current) {
        console.error('No stream available for recording');
        return;
      }
      
      // Clear previous recording chunks
      recordedChunks.current = [];
      
      // Configure MediaRecorder with settings for optimal quality
      const options = {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: 3000000 // 3 Mbps
      };
      
      // Create MediaRecorder
      mediaRecorder.current = new MediaRecorder(combinedStream.current, options);
      
      // Handle dataavailable event
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data);
        }
      };
      
      // Handle recording stopped
      mediaRecorder.current.onstop = async () => {
        setIsRecording(false);
        
        // Create a blob from the recorded chunks
        const recordedBlob = new Blob(recordedChunks.current, { type: 'video/webm' });
        
        try {
          // Upload to Supabase Storage
          await uploadRecording(recordedBlob);
        } catch (uploadError) {
          console.error('Error uploading recording:', uploadError);
          logCallEvent('recording_upload_error', uploadError.message || 'Failed to upload recording');
          
          toast({
            title: 'Recording Error',
            description: 'Failed to save call recording. Please try again.',
            variant: 'destructive'
          });
        }
      };
      
      // Start recording
      mediaRecorder.current.start(1000); // Collect data in 1-second chunks
      setIsRecording(true);
      
      // Log recording started
      logCallEvent('recording_started', 'Call recording started successfully');
    } catch (error) {
      console.error('Error starting recording:', error);
      logCallEvent('recording_start_error', error.message || 'Failed to start recording');
      
      toast({
        title: 'Recording Error',
        description: 'Could not start call recording',
        variant: 'destructive'
      });
    }
  };

  // Stop recording function
  const stopRecording = async () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      logCallEvent('recording_stopped', 'Call recording stopped');
    }
  };

  // Upload recording function
  const uploadRecording = async (recordingBlob: Blob) => {
    try {
      const fileName = `${callId}.webm`;
      const filePath = `${callId}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('call_recordings')
        .upload(filePath, recordingBlob, {
          contentType: 'video/webm',
          upsert: true
        });
      
      if (error) {
        throw error;
      }
      
      // Get public URL for the recording
      const { data: publicUrlData } = supabase.storage
        .from('call_recordings')
        .getPublicUrl(filePath);
      
      const recordingUrl = publicUrlData.publicUrl;
      
      // Update call record with recording URL
      const { error: updateError } = await supabase
        .from('calls')
        .update({ recording_url: recordingUrl })
        .eq('id', callId);
      
      if (updateError) {
        throw updateError;
      }
      
      // Log successful upload
      logCallEvent('recording_uploaded', `Recording uploaded successfully: ${recordingUrl}`);
      
      // Trigger AI analysis of the recording
      await triggerAnalysis(recordingUrl);
      
      toast({
        title: 'Recording Saved',
        description: 'Call recording has been saved and is being analyzed',
      });
    } catch (error) {
      console.error('Error uploading recording:', error);
      throw error;
    }
  };

  // Trigger AI analysis function
  const triggerAnalysis = async (recordingUrl: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-speech', {
        body: {
          sessionType: 'call',
          call_id: callId,
          recording_url: recordingUrl
        }
      });
      
      if (error) {
        throw error;
      }
      
      logCallEvent('analysis_completed', 'AI analysis completed successfully');
      
      return data;
    } catch (error) {
      console.error('Error triggering analysis:', error);
      logCallEvent('analysis_error', error.message || 'Failed to analyze recording');
      throw error;
    }
  };

  useEffect(() => {
    if (onConnectionStatusChange) {
      if (isConnecting) {
        onConnectionStatusChange("connecting");
      } else if (isConnected) {
        onConnectionStatusChange("connected");
      }
    }
  }, [isConnecting, isConnected, onConnectionStatusChange]);

  useEffect(() => {
    peers.forEach(peer => {
      const existingVideo = document.getElementById(`remote-video-${peer.userId}`) as HTMLVideoElement;
      
      if (!existingVideo) {
        const videoElement = document.createElement("video");
        videoElement.id = `remote-video-${peer.userId}`;
        videoElement.autoplay = true;
        videoElement.playsInline = true;
        videoElement.className = "w-full h-full object-cover rounded-lg";
        videoElement.srcObject = peer.stream;
        
        const videoContainer = document.createElement("div");
        videoContainer.id = `video-container-${peer.userId}`;
        videoContainer.className = "relative w-full h-full";
        videoContainer.appendChild(videoElement);
        
        const nameTag = document.createElement("div");
        nameTag.className = "absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-sm rounded";
        
        const participant = participants.find(p => p.profiles?.id === peer.userId);
        const name = participant ? 
          `${participant.profiles?.first_name || ""} ${participant.profiles?.last_name || ""}` : 
          "Participant";
        
        nameTag.textContent = name;
        videoContainer.appendChild(nameTag);
        
        if (videoGrid.current) {
          videoGrid.current.appendChild(videoContainer);
        }
      }
    });
    
    if (videoGrid.current) {
      Array.from(videoGrid.current.children).forEach(child => {
        const id = child.id.replace("video-container-", "");
        if (id !== "local-video-container" && !peers.some(peer => peer.userId === id)) {
          child.remove();
        }
      });
    }
  }, [peers, participants]);

  // Enhanced call leave handler
  const handleEndCall = async () => {
    try {
      // Stop recording first
      await stopRecording();
      
      // Wait a bit for recording to process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Then leave the call
      await leaveCall();
      logCallEvent('call_ended', 'Call ended by user');
      
      if (onCallEnded) {
        onCallEnded();
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Error ending call:', error);
      logCallEvent('call_end_error', error.message || 'Error ending call');
      
      // Still leave call even if recording failed
      await leaveCall();
      
      if (onCallEnded) {
        onCallEnded();
      } else {
        navigate("/dashboard");
      }
    }
  };

  if (isConnecting) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Connecting to call...</p>
          <p className="text-muted-foreground">Preparing your video and audio...</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="flex-1 flex flex-col overflow-hidden">
      <CardContent className="flex-1 p-0 flex flex-col">
        <div className="bg-muted p-3 border-b flex items-center justify-between">
          <div>
            <h3 className="font-medium">{callDetails?.title || "Video Call"}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(callDetails?.started_at || Date.now()).toLocaleTimeString()} • 
              {participants.length} {participants.length === 1 ? "participant" : "participants"}
              {isRecording && <span className="ml-2 text-red-500 animate-pulse"> • Recording</span>}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              toast({
                title: "Participants",
                description: (
                  <div className="mt-2 space-y-2">
                    {participants.map(p => (
                      <div key={p.id} className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={p.profiles?.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {p.profiles?.first_name?.[0]}{p.profiles?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {p.profiles?.first_name} {p.profiles?.last_name}
                        </span>
                      </div>
                    ))}
                  </div>
                )
              });
            }}
          >
            <Users className="h-4 w-4 mr-1" />
            <span className="sr-md:not-sr-only">Participants</span>
          </Button>
        </div>
        
        <div 
          className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-background/80"
          ref={videoGrid}
        >
          <div id="local-video-container" className="relative w-full h-64 md:h-auto">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-lg bg-muted"
            />
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-sm rounded">
              {profile?.first_name} {profile?.last_name} (You)
            </div>
            {isMuted && (
              <div className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                <MicOff className="h-4 w-4" />
              </div>
            )}
            {isVideoOff && (
              <div className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full">
                <VideoOff className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t bg-muted flex items-center justify-center gap-2">
          <Button
            variant={isMuted ? "destructive" : "secondary"}
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={toggleMute}
          >
            {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={isVideoOff ? "destructive" : "secondary"}
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={toggleVideo}
          >
            {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
          </Button>
          
          <Button
            variant={isScreenSharing ? "default" : "secondary"}
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={toggleScreenShare}
          >
            <ScreenShare className="h-5 w-5" />
          </Button>
          
          <Button
            variant="destructive"
            size="icon"
            className="rounded-full h-12 w-12"
            onClick={handleEndCall}
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCall;
