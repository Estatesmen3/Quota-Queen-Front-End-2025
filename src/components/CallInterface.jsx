import { useState, useEffect } from 'react';
// import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { VideoConference } from '../components/VideoConference/VideoConference';

export const CallInterface = ({ roomName, token, onDisconnect }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [aiParticipant, setAiParticipant] = useState(null);

  return (
    <div className="call-container">
      <LiveKitRoom
        serverUrl={import.meta.env.VITE_LIVEKIT_URL}
        token={token}
        connect={true}
        audio={false}
        video={false}
        onConnected={() => setIsConnected(true)}
        onDisconnected={onDisconnect}
      >
        {!isConnected ? (
          <div className="connecting">Connecting to AI agent...</div>
        ) : (
          <div className="video-conference">
            {/* <VideoConference /> */}
            <VideoConference />
            <div className="ai-overlay">
              <div className="ai-indicator">
                <span className="ai-label">AI Assistant</span>
                <div className="pulse-animation" />
              </div>
            </div>
          </div>
        )}
      </LiveKitRoom>
    </div>
  );
};