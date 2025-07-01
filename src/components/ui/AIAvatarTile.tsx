// In your AIAvatarTile.tsx
import React from 'react';
import { useIsSpeaking } from '@livekit/components-react';

const AIAvatarTile = ({ participant }) => {
  const isSpeaking = useIsSpeaking(participant);

  return (
    <div className="ai-avatar-tile">
      <model-viewer
        src="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
        alt="AI Avatar"
        auto-rotate
        autoplay
        camera-controls
        style={{
          width: "200px",
          height: "200px",
          filter: isSpeaking ? "drop-shadow(0 0 20px #00ffcc)" : "none",
          transition: "filter 0.3s ease-in-out",
        }}
      ></model-viewer>
      <div className="ai-status">{isSpeaking ? "🗣️ AI is speaking..." : "🤖 AI is listening..."}</div>
    </div>
  );
};

export default AIAvatarTile;
