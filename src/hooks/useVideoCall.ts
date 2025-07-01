
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

type Peer = {
  userId: string;
  stream: MediaStream;
  connection: RTCPeerConnection;
};

interface VideoCallOptions {
  callId: string;
  onError?: (error: Error) => void;
}

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
];

export const useVideoCall = ({ callId, onError }: VideoCallOptions) => {
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<Peer[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDetails, setCallDetails] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const screenShareStream = useRef<MediaStream | null>(null);
  const originalStream = useRef<MediaStream | null>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const channelRef = useRef<any>(null);

  const initializeCall = useCallback(async () => {
    if (!user?.id || !callId) return;

    try {
      setIsConnecting(true);

      const { data, error } = await supabase.functions.invoke('call-signaling', {
        body: { action: 'join', callId }
      });

      if (error) throw new Error(error.message);
      
      const { data: callData, error: callError } = await supabase
        .from('calls')
        .select('*')
        .eq('id', callId)
        .single();

      if (callError) throw new Error('Failed to fetch call details');
      setCallDetails(callData);

      loadParticipants();

      await initializeMedia();

      const channel = supabase.channel(`call:${callId}`);
      
      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          handlePresenceSync(state);
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }) => {
          handleUserJoined(newPresences[0]?.userId);
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          handleUserLeft(leftPresences[0]?.userId);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ userId: user.id, online: true });
            channelRef.current = channel;
            setIsConnected(true);
            setIsConnecting(false);
          }
        });

      supabase
        .channel(`rtc_signals:${callId}:${user.id}`)
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'rtc_signals',
            filter: `to_user_id=eq.${user.id}` 
          }, 
          (payload) => {
            handleIncomingSignal(payload.new);
          }
        )
        .subscribe();

    } catch (err) {
      console.error('Error initializing call:', err);
      setIsConnecting(false);
      if (onError) onError(err);
      toast({
        title: 'Connection Error',
        description: `Could not join the call: ${err.message}`,
        variant: 'destructive'
      });
    }
  }, [callId, user?.id, onError]);

  const loadParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('call_participants')
        .select(`
          id,
          role,
          joined_at,
          left_at,
          profiles:user_id(id, first_name, last_name, avatar_url)
        `)
        .eq('call_id', callId);

      if (error) throw error;
      setParticipants(data || []);
    } catch (err) {
      console.error('Error loading participants:', err);
    }
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      setLocalStream(stream);
      originalStream.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      return stream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      toast({
        title: 'Camera/Microphone Error',
        description: 'Could not access your camera or microphone. Please check permissions.',
        variant: 'destructive'
      });
      throw err;
    }
  };

  const handlePresenceSync = (state: any) => {
    const userIds = Object.values(state).flat().map((p: any) => p.userId);
    userIds.forEach(userId => {
      if (userId !== user?.id && !peerConnections.current.has(userId)) {
        createPeerConnection(userId, true);
      }
    });
  };

  const handleUserJoined = async (userId: string) => {
    if (userId !== user?.id && !peerConnections.current.has(userId)) {
      await createPeerConnection(userId, true);
      loadParticipants();
    }
  };

  const handleUserLeft = (userId: string) => {
    if (peerConnections.current.has(userId)) {
      peerConnections.current.get(userId)?.close();
      peerConnections.current.delete(userId);
      
      setPeers(prev => prev.filter(peer => peer.userId !== userId));
      loadParticipants();
    }
  };

  const createPeerConnection = async (userId: string, isInitiator: boolean) => {
    try {
      const peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });
      peerConnections.current.set(userId, peerConnection);
      
      if (localStream) {
        localStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, localStream);
        });
      }
      
      peerConnection.onicecandidate = ({ candidate }) => {
        if (candidate) {
          sendSignal(userId, { type: 'ice-candidate', candidate });
        }
      };
      
      peerConnection.ontrack = (event) => {
        const remoteStream = event.streams[0];
        
        setPeers(prev => {
          const existingPeer = prev.find(p => p.userId === userId);
          if (existingPeer) {
            return prev;
          }
          return [...prev, { userId, stream: remoteStream, connection: peerConnection }];
        });
      };
      
      peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === 'failed') {
          peerConnection.restartIce();
        }
      };
      
      if (isInitiator) {
        const offer = await peerConnection.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true
        });
        await peerConnection.setLocalDescription(offer);
        sendSignal(userId, { type: 'offer', sdp: offer.sdp });
      }
      
      return peerConnection;
    } catch (err) {
      console.error('Error creating peer connection:', err);
      if (onError) onError(err);
      return null;
    }
  };

  const handleIncomingSignal = async (payload: any) => {
    try {
      const { from_user_id: fromUserId, signal } = payload;
      const parsedSignal = typeof signal === 'string' ? JSON.parse(signal) : signal;
      
      let peerConnection = peerConnections.current.get(fromUserId);
      
      if (!peerConnection) {
        peerConnection = await createPeerConnection(fromUserId, false);
        if (!peerConnection) return;
      }
      
      switch (parsedSignal.type) {
        case 'offer':
          await peerConnection.setRemoteDescription(new RTCSessionDescription({ 
            type: 'offer', 
            sdp: parsedSignal.sdp 
          }));
          
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          
          sendSignal(fromUserId, { type: 'answer', sdp: answer.sdp });
          break;
          
        case 'answer':
          await peerConnection.setRemoteDescription(new RTCSessionDescription({ 
            type: 'answer', 
            sdp: parsedSignal.sdp 
          }));
          break;
          
        case 'ice-candidate':
          if (parsedSignal.candidate) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(parsedSignal.candidate));
          }
          break;
      }
    } catch (err) {
      console.error('Error handling incoming signal:', err);
      if (onError) onError(err);
    }
  };

  const sendSignal = async (targetUserId: string, signal: any) => {
    try {
      await supabase.functions.invoke('call-signaling', {
        body: { 
          action: 'signal', 
          callId, 
          targetUserId, 
          signal: JSON.stringify(signal)
        }
      });
    } catch (err) {
      console.error('Error sending signal:', err);
      if (onError) onError(err);
    }
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        if (screenShareStream.current) {
          screenShareStream.current.getTracks().forEach(track => track.stop());
        }
        
        if (originalStream.current) {
          peerConnections.current.forEach((pc) => {
            const senders = pc.getSenders();
            const videoSender = senders.find(sender => 
              sender.track?.kind === 'video'
            );
            
            if (videoSender && originalStream.current) {
              const videoTrack = originalStream.current.getVideoTracks()[0];
              if (videoTrack) {
                videoSender.replaceTrack(videoTrack);
              }
            }
          });
          
          setLocalStream(originalStream.current);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = originalStream.current;
          }
        }
        
        setIsScreenSharing(false);
      } else {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        
        screenShareStream.current = stream;
        
        peerConnections.current.forEach((pc) => {
          const senders = pc.getSenders();
          const videoSender = senders.find(sender => 
            sender.track?.kind === 'video'
          );
          
          if (videoSender) {
            videoSender.replaceTrack(stream.getVideoTracks()[0]);
          }
        });
        
        const newStream = new MediaStream();
        
        newStream.addTrack(stream.getVideoTracks()[0]);
        
        if (originalStream.current) {
          const audioTrack = originalStream.current.getAudioTracks()[0];
          if (audioTrack) {
            newStream.addTrack(audioTrack);
          }
        }
        
        setLocalStream(newStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = newStream;
        }
        
        const videoTrack = stream.getVideoTracks()[0];
        videoTrack.onended = () => {
          toggleScreenShare();
        };
        
        setIsScreenSharing(true);
      }
    } catch (err) {
      console.error('Error toggling screen share:', err);
      toast({
        title: 'Screen Sharing Error',
        description: 'Could not share your screen. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const leaveCall = async () => {
    try {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      if (screenShareStream.current) {
        screenShareStream.current.getTracks().forEach(track => track.stop());
      }
      
      peerConnections.current.forEach(pc => pc.close());
      peerConnections.current.clear();
      
      if (channelRef.current) {
        await channelRef.current.untrack();
        await channelRef.current.unsubscribe();
      }
      
      await supabase.functions.invoke('call-signaling', {
        body: { action: 'leave', callId }
      });
      
      setIsConnected(false);
      setPeers([]);
      setLocalStream(null);
    } catch (err) {
      console.error('Error leaving call:', err);
      if (onError) onError(err);
    }
  };

  useEffect(() => {
    if (user?.id && callId) {
      initializeCall();
    }
    
    return () => {
      leaveCall();
    };
  }, [callId, user?.id]);
  
  return {
    isConnecting,
    isConnected,
    localStream,
    localVideoRef,
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
  };
};
