// src/components/VideoConference.tsx

import * as React from 'react';
import { isWeb, WidgetState } from '@livekit/components-core';
import {
  LiveKitRoom,
  useCreateLayoutContext,
  useTracks,
  useRoomContext,
  usePinnedTracks,
  LayoutContextProvider,
  RoomAudioRenderer,
  useParticipants,
  GridLayout,
  ParticipantTile,
  ControlBar,
  Chat,
  ConnectionStateToast,
  ParticipantAudioTile,
} from '@livekit/components-react';
import { RoomEvent, Track } from 'livekit-client';
import { VoiceVisualization } from './voice-visualization';

export interface VideoConferenceProps
  extends React.HTMLAttributes<HTMLDivElement> {
  SettingsComponent?: React.ComponentType;
  chatMessageFormatter?: any;
  chatMessageEncoder?: any;
  chatMessageDecoder?: any;
}

export function VideoConference({
  SettingsComponent,
  chatMessageFormatter,
  chatMessageEncoder,
  chatMessageDecoder,
  ...props
}: VideoConferenceProps) {
  const layoutContext = useCreateLayoutContext();
  const room = useRoomContext();
  const [widgetState, setWidgetState] = React.useState<WidgetState>({
    showChat: false,
    unreadMessages: 0,
    showSettings: false,
  });
  const [aiSpeaking, setAiSpeaking] = React.useState(false);

  // Watch Active Speaker changes to detect AI
  React.useEffect(() => {
    const onSpeakers = (speakers: any[]) => {
      setAiSpeaking(
        speakers.some((p) =>
          p.identity.toLowerCase().includes('ai')
        )
      );
    };
    room.on(RoomEvent.ActiveSpeakersChanged, onSpeakers);
    return () => {
      room.off(RoomEvent.ActiveSpeakersChanged, onSpeakers);
    };
  }, [room]);

  // Grab only camera + screen‑share; layout updates on speaker changes
  const tracks = useTracks(
    [
      { source: Track.Source.Camera,        withPlaceholder: true  },
      { source: Track.Source.ScreenShare,   withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false }
  );

  // Split AI vs. user
  const userTracks = tracks.filter(
    (t) => !t.participant.identity.toLowerCase().includes('ai')
  );
  const aiTracks = tracks.filter((t) =>
    t.participant.identity.toLowerCase().includes('ai')
  );

  const onWidgetChange = (w: WidgetState) => setWidgetState(w);
  const participants = useParticipants();

  return (
    <div className="lk-video-conference" {...props}>
      {isWeb() && (
        <LayoutContextProvider
          value={layoutContext}
          onWidgetChange={onWidgetChange}
        >
          <div className="split-layout">
            {/* ─── LEFT: User camera feeds ─── */}
            <div className="pane user-pane">
              <GridLayout tracks={userTracks}>
                <ParticipantTile />
              </GridLayout>
            </div>

            {/* ─── RIGHT: AI pane ─── */}
            <div className={`pane ai-pane ${aiSpeaking ? 'speaking' : ''}`}>
              {aiTracks.length > 0 ? (
                <GridLayout tracks={aiTracks}>
                  <ParticipantTile />
                </GridLayout>
              ) : (
                <VoiceVisualization />
              )}
            </div>
          </div>

          <ControlBar
            controls={{
              chat: true,
              settings: !!SettingsComponent,
            }}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />

          <Chat
            style={{
              display: widgetState.showChat ? 'grid' : 'none',
            }}
            messageFormatter={chatMessageFormatter}
            messageEncoder={chatMessageEncoder}
            messageDecoder={chatMessageDecoder}
          />

          {SettingsComponent && widgetState.showSettings && (
            <div className="settings-modal">
              <SettingsComponent />
            </div>
          )}
        </LayoutContextProvider>
      )}

      {/* ← This must stay here so LiveKit mixes & plays *all* audio tracks */}
      <RoomAudioRenderer />

      {/* Mount ParticipantAudioTile for each participant to actually play their audio */}
      {participants.map((participant) => (
        <ParticipantAudioTile
          key={`audio-${participant.sid}`}
          participant={participant}
          style={{ display: 'none' }} // hide visually but keep audio playing
        />
      ))}

      <ConnectionStateToast />

      <style jsx>{`
        .lk-video-conference {
          position: relative;
          height: 100vh;
          width: 100vw;
          background: #0a0a0a;
          overflow: hidden;
        }
        .split-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          height: 100%;
        }
        .pane {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          background: #181818;
        }
        .user-pane {
          /* your user videos fill their column */
        }
        .ai-pane {
          display: flex;
          justify-content: center;
          align-items: center;
          transition: box-shadow 0.2s ease-in-out;
        }
        .ai-pane.speaking {
          box-shadow: 0 0 24px 4px rgba(0, 255, 136, 0.7);
          border: 2px solid #00ff88;
        }
        /* Hide LiveKit’s placeholder avatar */
        :global(.lk-participant-placeholder),
        :global(.lk-participant-placeholder svg) {
          display: none !important;
        }
        .settings-modal {
          position: absolute;
          top: 0;
          right: 0;
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
