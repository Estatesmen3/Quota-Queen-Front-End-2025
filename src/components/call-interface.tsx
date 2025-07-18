// // Updated frontend component for call interface
// // components/call-interface.tsx
// import { useState, useEffect } from 'react';
// import { useToast } from '@/hooks/use-toast';
// import {
//   LiveKitRoom,
//   VideoConference,
//   useToken,
//   useTracks,
// } from '@livekit/components-react';
// import { Track } from 'livekit-client';

// interface CallInterfaceProps {
//   roomName: string;
//   token: string;
//   onDisconnect: () => void;
// }

// export const CallInterface = ({ roomName, token, onDisconnect }: CallInterfaceProps) => {
//   const { toast } = useToast();
//   const [isConnecting, setIsConnecting] = useState(true);
//   const [aiParticipant, setAiParticipant] = useState<any>(null);

//   useTracks([Track.Source.Camera, Track.Source.Microphone])
//     .filter((track) => track.participant.identity === 'ai-agent')
//     .forEach((track) => {
//       if (!aiParticipant) {
//         setAiParticipant(track.participant);
//       }
//     });

//   useEffect(() => {
//     return () => {
//       onDisconnect();
//     };
//   }, [onDisconnect]);

//   return (
//     <div className="fixed inset-0 bg-black/90 z-50">
//       <LiveKitRoom
//         token={token}
//         serverUrl={process.env.LIVEKIT_URL}
//         connect={true}
//         video={false}
//         audio={false}
//         onConnected={() => setIsConnecting(false)}
//         onDisconnected={onDisconnect}
//       >
//         {isConnecting ? (
//           <div className="text-white">Connecting to AI agent...</div>
//         ) : (
//           <div className="relative h-screen w-full">
//             <VideoConference />
//             {aiParticipant && (
//               <div className="absolute bottom-8 left-8 bg-white p-4 rounded-lg">
//                 <p className="text-sm">Talking to: {aiParticipant.name}</p>
//                 <p className="text-xs text-gray-500">
//                   {aiParticipant.metadata?.isAI ? 'AI Assistant' : 'Human'}
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </LiveKitRoom>
//     </div>
//   );
// };



// components/call-interface.tsx
// import { useState, useEffect } from 'react';
// import { useToast } from '@/hooks/use-toast';
// import {
//   LiveKitRoom,
//   VideoConference,
//   useLiveKitRoom,
//   useTracks,
// } from '@livekit/components-react';
// import { Track, Room } from 'livekit-client';

// interface CallInterfaceProps {
//   roomName: string;
//   token: string;
//   onDisconnect: () => void;
// }

// const CallContent = () => {
//   const [aiParticipant, setAiParticipant] = useState<any>(null);

//   const { room, htmlProps } = useLiveKitRoom({
//     serverUrl: "wss://test-spacedome-445k8x1f.livekit.cloud", //process.env.LIVEKIT_URL,
//     token: "eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiVXNlci05NDkzOWE0Ni1jNzE3LTQyZDMtYTFhYS0yZjA0NzY2OWYxYjgiLCJ2aWRlbyI6eyJyb29tSm9pbiI6dHJ1ZSwicm9vbSI6InJvb21fNDM5OWFjMGQtZjhmYi00OGZkLWEwNjMtYjgwMjg0Yjc4ODg5IiwiY2FuUHVibGlzaCI6dHJ1ZSwiY2FuU3Vic2NyaWJlIjp0cnVlLCJjYW5QdWJsaXNoRGF0YSI6dHJ1ZSwicm9vbUFkbWluIjpmYWxzZX0sImlzcyI6IkFQSXJKZ0cycWRqOURVZSIsImV4cCI6MTc0NzcxNzk3NiwibmJmIjowLCJzdWIiOiI5NDkzOWE0Ni1jNzE3LTQyZDMtYTFhYS0yZjA0NzY2OWYxYjgifQ.RgtIQ-JkSLKTJFGL5QQqP7Xvbzf4XAVEe8MCc9gcJcY",
//     connect: true,
//   });

//   const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);

//   useEffect(() => {
//     const aiTrack = tracks.find(
//       (t) => t.participant.identity === 'ai-agent'
//     );
//     if (aiTrack && !aiParticipant) {
//       setAiParticipant(aiTrack.participant);
//     }
//   }, [tracks, aiParticipant]);

//   return (
//     <div className="relative h-screen w-full">
//       <VideoConference />
//       {aiParticipant && (
//         <div className="absolute bottom-8 left-8 bg-white p-4 rounded-lg">
//           <p className="text-sm">Talking to: {aiParticipant.name}</p>
//           <p className="text-xs text-gray-500">
//             {aiParticipant.metadata?.isAI ? 'AI Assistant' : 'Human'}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export const CallInterface = ({ roomName, token, onDisconnect }: CallInterfaceProps) => {
//   const { toast } = useToast();
//   const [isConnecting, setIsConnecting] = useState(true);
//   const [room, setRoom] = useState<Room | null>(null);


//   return (
//     <div className="fixed inset-0 bg-black/90 z-50">
//       <LiveKitRoom
//         token={String(token)}
//         serverUrl={'wss://test-spacedome-445k8x1f.livekit.cloud'}
//         roomName={roomName}
//         connect={true}
//         video={false}
//         audio={false}
//         onConnected={(room) => {
//           setIsConnecting(false);
//           setRoom(room);
//         }}
//         onDisconnected={() => {
//           onDisconnect();
//           setRoom(null);
//         }}
//       >
//         {isConnecting ? (
//           <div className="text-white">Connecting to AI agent...</div>
//         ) : (
//           <CallContent />
//         )}
//       </LiveKitRoom>
//     </div>
//   );
// };

// CallInterface.tsx


// import React from "react";
// import { AudioConference, LiveKitRoom, useRoomContext } from "@livekit/components-react";
// import { useToast } from "@/hooks/use-toast";
// import { Room, Track } from "livekit-client";
// import { Button } from "@/components/ui/button";
// import {
//   Mic,
//   MicOff,
//   Video,
//   VideoOff,
//   ScreenShare,
//   PhoneOff
// } from "lucide-react";
// import { useLocalParticipant, VideoConference } from "@livekit/components-react";
// import { CustomVideoConference } from "./custom-video-conference";
// import TranscriptionWindow from "./Transcription";
// import LiveTranscription from "./LiveTrancription";
// import TranscriptionDisplay from "./TranscriptionDisplay";
// import CustomAudioConference from "./ui/CustomAudioConference";
// //import { VideoConference } from "./prefabs/VideoConference";

// export interface CallInterfaceProps {
//   roomName: string;
//   token: string;
//   onDisconnect: () => void;
//   onRoomConnected?: (room: Room) => void;
// }


// const CustomControls = () => {
//   const { localParticipant } = useLocalParticipant();
//   const room = useRoomContext();
//   const { toast } = useToast();
//   const [isMicMuted, setIsMicMuted] = React.useState(false);
//   const [isCameraOff, setIsCameraOff] = React.useState(false);
//   const [isScreenSharing, setIsScreenSharing] = React.useState(false);

//   const handleDisconnect = () => {
//     room.disconnect();
//     window.location.reload(); // Force cleanup
//   };

//   const toggleAudio = async () => {
//     try {
//       if (isMicMuted) {
//         await localParticipant.setMicrophoneEnabled(true);
//         setIsMicMuted(false);
//       } else {
//         await localParticipant.setMicrophoneEnabled(false);
//         setIsMicMuted(true);
//       }
//     } catch (error) {
//       toast({
//         title: "Microphone error",
//         description: (error as Error).message,
//         variant: "destructive"
//       });
//     }
//   };

//   const toggleVideo = async () => {
//     try {
//       if (isCameraOff) {
//         await localParticipant.setCameraEnabled(true);
//         setIsCameraOff(false);
//       } else {
//         await localParticipant.setCameraEnabled(false);
//         setIsCameraOff(true);
//       }
//     } catch (error) {
//       toast({
//         title: "Camera error",
//         description: (error as Error).message,
//         variant: "destructive"
//       });
//     }
//   };

//   const toggleScreenShare = async () => {
//     try {
//       if (isScreenSharing) {
//         await localParticipant.stopScreenSharing();
//         setIsScreenSharing(false);
//       } else {
//         const screenTrack = await Track.createLocalScreenShareTrack();
//         await localParticipant.publishTrack(screenTrack);
//         setIsScreenSharing(true);
//       }
//     } catch (error) {
//       toast({
//         title: "Screen share error",
//         description: (error as Error).message,
//         variant: "destructive"
//       });
//     }
//   };

//   return (
//     <div className="controls-container">
//       <Button
//         variant={isMicMuted ? "destructive" : "secondary"}
//         size="icon"
//         onClick={toggleAudio}
//         className="control-button"
//       >
//         {isMicMuted ? <MicOff size={20} /> : <Mic size={20} />}
//       </Button>

//       <Button
//         variant={isCameraOff ? "destructive" : "secondary"}
//         size="icon"
//         onClick={toggleVideo}
//         className="control-button"
//       >
//         {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
//       </Button>

//       <Button
//         variant={isScreenSharing ? "default" : "secondary"}
//         size="icon"
//         onClick={toggleScreenShare}
//         className="control-button"
//       >
//         <ScreenShare size={20} />
//       </Button>

//       <Button
//         variant="destructive"
//         size="icon"
//         onClick={handleDisconnect}
//         className="control-button"
//       >
//         <PhoneOff size={20} />
//       </Button>

//       <style jsx>{`
//         .controls-container {
//           position: fixed;
//           bottom: 2rem;
//           left: 50%;
//           transform: translateX(-50%);
//           display: flex;
//           gap: 0.75rem;
//           padding: 0.75rem;
//           background: rgba(24, 24, 24, 0.8);
//           backdrop-filter: blur(8px);
//           border-radius: 2rem;
//           box-shadow: 0 8px 32px rgba(0,0,0,0.2);
//           border: 1px solid rgba(255,255,255,0.1);
//           z-index: 1000;
//         }

//         .control-button {
//           transition: all 0.2s ease;
//         }

//         .control-button:hover {
//           transform: scale(1.1);
//         }
//       `}</style>
//     </div>
//   );
// };

// export const CallInterface: React.FC<CallInterfaceProps> = ({
//   roomName,
//   token,
//   onDisconnect,
//   onRoomConnected,
// }) => {
//   const { toast } = useToast();

//   return (
//     <div data-lk-theme="default" style={{ height: '100vh', width: '100vw', margin: '0 auto' }}>
//       <LiveKitRoom
//         roomName={roomName}
//         token={token}
//         serverUrl={"wss://test-spacedome-445k8x1f.livekit.cloud"}
//         connect
//         video
//         audio
//         onConnected={(room) => {
//           toast({ title: "Connected to meeting" });
//           onRoomConnected?.(room);
//         }}
//         onDisconnected={() => {
//           toast({ title: "Disconnected from meeting", variant: "destructive" });
//           onDisconnect();
//         }}
//         onError={(error) => {
//           toast({
//             title: "Connection error",
//             description: error.message,
//             variant: "destructive",
//           });
//         }}
//       >
//         <div className="call-container">
//           {/* <VideoConference /> */}
//           {/* <CustomAudioConference />
//                     <CustomControls /> */}
//           <AudioConference />
//           <TranscriptionDisplay />
//           {/* <LiveTranscription /> */}
//           {/* <TranscriptionWindow /> */}
//           {/* <AudioConference /> */}
//           {/* <CustomVideoConference
//           roomName={roomName}
//           token={token}
//           serverUrl="wss://test-spacedome-445k8x1f.livekit.cloud"
//           onDisconnected={() => console.log('Disconnected.....')}
//         />  */}
//           {/* <VideoConference /> */}

//           {/* <CustomControls /> */}
//         </div>

//         {/* <style jsx global>{`
//         body {
//           margin: 0;
//           overflow: hidden;
//           background: #0a0a0a;
//         }
        
//         .lk-video-conference {
//           // display: grid;
//           // grid-template-columns: 1fr 400px;
//           // gap: 1rem;
//           // padding: 1rem;
//           // height: 100vh;
//         }
        
//         .lk-participant-tile {
//           border-radius: 16px;
//           overflow: hidden;
//           background: #181818;
//         }
        
//         .lk-focus-layout {
//           grid-column: 1 / 2;
//         }
        
//         .ai-container {
//           grid-column: 2 / 3;
//           background: #181818;
//           border-radius: 16px;
//           border: 2px solid #00ff88;
//           box-shadow: 0 0 16px rgba(0,255,136,0.3);
//           padding: 1rem;
//           display: flex;
//           flex-direction: column;
//         }
//       `}</style> */}
//       </LiveKitRoom>

//     </div>
//   );
// };





import React, { useEffect, useRef, useState } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Room, Track } from "livekit-client";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff } from "lucide-react";
import { TalkingHead } from "@met4citizen/talkinghead";
import TranscriptionDisplay from "./TranscriptionDisplay";
import AIAvatarTile from "./ui/AIAvatarTile";
import CustomVideoConference from "./VideoConference/CustomParticipantTile"

export interface CallInterfaceProps {
  roomName: string;
  token: string;
  livekit_url?: string;
  onDisconnect: () => void;
  onRoomConnected?: (room: Room) => void;
}

// 🧠 Avatar Tile for AI
// function AIAvatarTile({ participant }) {
//   const canvasRef = useRef(null);
//   const [talkingHead, setTalkingHead] = useState(null);

//   const [audioTrackRef] = useParticipantTracks({
//     participantIdentity: participant.identity,
//     sources: [Track.Source.Audio]
//   });

//   useEffect(() => {
//     if (!canvasRef.current) return;
//     const head = new TalkingHead(canvasRef.current, {
//       avatarUrl: 'https://models.readyplayer.me/64f8d88b9deff8000736e654.glb',
//       lipsync: true,
//     });
//     head.setStreaming(true);
//     setTalkingHead(head);
//     return () => {
//       head.stop();
//       head.dispose();
//     };
//   }, []);

//   useEffect(() => {
//     if (!audioTrackRef || !talkingHead) return;
//     const track = audioTrackRef.track;
//     const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//     const src = audioCtx.createMediaStreamSource(new MediaStream([track.mediaStreamTrack]));
//     const processor = audioCtx.createScriptProcessor(2048, 1, 1);
//     src.connect(processor);
//     processor.connect(audioCtx.destination);

//     processor.onaudioprocess = (e) => {
//       const pcmData = e.inputBuffer.getChannelData(0);
//       talkingHead.streamAudio(pcmData);
//     };

//     return () => {
//       processor.disconnect();
//       src.disconnect();
//       audioCtx.close();
//     };
//   }, [audioTrackRef, talkingHead]);

//   return (
//     <div style={{ width: 250, height: 250, backgroundColor: "#eee", borderRadius: "8px" }}>
//       <canvas ref={canvasRef} width={250} height={250} />
//     </div>
//   );
// }

// 🎛️ Controls
const CustomControls = () => {
  const { localParticipant } = useLocalParticipant();
  const room = useRoomContext();
  const { toast } = useToast();
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const handleDisconnect = () => {
    room.disconnect();
    window.location.reload();
  };

  const toggleAudio = async () => {
    try {
      await localParticipant.setMicrophoneEnabled(isMicMuted);
      setIsMicMuted(!isMicMuted);
    } catch (error) {
      toast({
        title: "Microphone error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const toggleVideo = async () => {
    try {
      await localParticipant.setCameraEnabled(isCameraOff);
      setIsCameraOff(!isCameraOff);
    } catch (error) {
      toast({
        title: "Camera error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await localParticipant.stopScreenSharing();
      } else {
        const screenTrack = await Track.createLocalScreenShareTrack();
        await localParticipant.publishTrack(screenTrack);
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      toast({
        title: "Screen share error",
        description: (error as Error).message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="controls-container">
      <Button onClick={toggleAudio} variant={isMicMuted ? "destructive" : "secondary"} size="icon">
        {isMicMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </Button>
      <Button onClick={toggleVideo} variant={isCameraOff ? "destructive" : "secondary"} size="icon">
        {isCameraOff ? <VideoOff size={20} /> : <Video size={20} />}
      </Button>
      <Button onClick={toggleScreenShare} variant={isScreenSharing ? "default" : "secondary"} size="icon">
        <ScreenShare size={20} />
      </Button>
      <Button onClick={handleDisconnect} variant="destructive" size="icon">
        <PhoneOff size={20} />
      </Button>
    </div>
  );
};

export const CallInterface: React.FC<CallInterfaceProps> = ({
  roomName,
  token,
  livekit_url,
  onDisconnect,
  onRoomConnected
}) => {
  const { toast } = useToast();

  return (
    <div data-lk-theme="default" style={{ height: "100vh", width: "100vw", margin: "0 auto" }}>
      <LiveKitRoom
        roomName={roomName}
        token={token}
        serverUrl={livekit_url}
        connect
        video
        audio
        onConnected={(room) => {
          toast({ title: "Connected to meeting" });
          onRoomConnected?.(room);
        }}
        onDisconnected={() => {
          toast({ title: "Disconnected from meeting", variant: "destructive" });
          onDisconnect();
        }}
        onError={(error) => {
          toast({
            title: "Connection error",
            description: error.message,
            variant: "destructive"
          });
        }}
      >
        <div className="call-container">
          <VideoConference />
          {/* <CustomVideoConference /> */}
          <TranscriptionDisplay />
        </div>
      </LiveKitRoom>
    </div>
  );
};
