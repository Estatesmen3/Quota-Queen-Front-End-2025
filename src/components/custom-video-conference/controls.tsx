// controls.tsx
import { 
  TrackToggle,
  ControlBarProps,
  useLocalParticipant 
} from '@livekit/components-react';
import { Track } from 'livekit-client';

export const CustomControlBar = ({ 
  isMicMuted,
  isCameraOff,
  onDisconnect
}: {
  isMicMuted: boolean;
  isCameraOff: boolean;
  onDisconnect: () => void;
}) => {
  const { localParticipant } = useLocalParticipant();

  return (
    <div className="controls">
      <TrackToggle
        source={Track.Source.Microphone}
        initialState={!isMicMuted}
        onChange={(enabled) => {
          localParticipant?.setMicrophoneEnabled(enabled);
        }}
      />
      <TrackToggle
        source={Track.Source.Camera}
        initialState={!isCameraOff}
        onChange={(enabled) => {
          localParticipant?.setCameraEnabled(enabled);
        }}
      />
      <button onClick={onDisconnect} className="disconnect-btn">
        Leave
      </button>
    </div>
  );
};