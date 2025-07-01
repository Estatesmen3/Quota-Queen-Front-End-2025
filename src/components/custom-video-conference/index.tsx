// import {
//   useCreateLayoutContext,
//   LayoutContextProvider,
//   ParticipantTile,
//   useTracks,
//   usePinnedTracks,
//   TrackReferenceOrPlaceholder,
//   VideoConferenceProps,
//   WidgetState,
//   ControlBar,
// } from '@livekit/components-react';
// import { Room, RoomEvent, Track } from 'livekit-client';
// import React, { useEffect } from 'react';
// import { VoiceVisualization } from './voice-visualization';

// export function CustomVideoConference(props: VideoConferenceProps) {
//   const layoutContext = useCreateLayoutContext();
//   const [widgetState, setWidgetState] = React.useState<WidgetState>({
//     showChat: false,
//     unreadMessages: 0,
//     showSettings: false,
//   });

//   // Get all camera and screen share tracks
//   const tracks = useTracks(
//     [
//       { source: Track.Source.Camera, withPlaceholder: true },
//       { source: Track.Source.ScreenShare, withPlaceholder: false },
//     ],
//     { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged] },
//   );

//   // Split tracks into user and AI
//   const userTracks = tracks.filter(t => !t.participant.identity.includes('AI'));
//   const aiTracks = tracks.filter(t => t.participant.identity.includes('AI'));


// // useEffect(() => {
// //   const newRoom = new Room({
// //     adaptiveStream: true,
// //     dynacast: true,
// //     audioCaptureDefaults: {
// //       autoGainControl: true,
// //       echoCancellation: true,
// //       noiseSuppression: true,
// //     },
// //   });
  
// //   newRoom.connect("wss://test-spacedome-445k8x1f.livekit.cloud", props?.token, {
// //     autoSubscribe: true, // Ensure this is true
// //     audioTrackSelector: { source: Track.Source.Microphone }
// //   });

// //   // Add audio playback element
// //   const audioElement = document.createElement('audio');
// //   document.body.appendChild(audioElement);

// //   newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
// //     if (track.kind === Track.Kind.Audio && participant.isAI) {
// //       track.attach(audioElement);
// //     }
// //   });

// //   return () => {
// //     document.body.removeChild(audioElement);
// //   };
// // }, []);

//   return (
//     <div className="lk-video-conference" {...props}>
//       <LayoutContextProvider value={layoutContext}>
//         <div className="custom-split-layout">
//           {/* User Video Section (Left Side) */}
//           <div className="user-section">
//             {userTracks.map((track) => (
//               <ParticipantTile
//                 key={track.participant.identity}
//                 trackRef={track}
//                 className="user-video"
//               />
//             ))}
//           </div>

//           {/* AI Assistant Section (Right Side) */}
//           <div className="ai-section">
//             {aiTracks.length > 0 ? (
//               aiTracks.map((track) => (
//                 <ParticipantTile
//                   key={track.participant.identity}
//                   trackRef={track}
//                   className="ai-video"
//                 />
//               ))
//             ) : (
//               <VoiceVisualization />
//             )}
//           </div>
//         </div>

//         <ControlBar 
//           controls={{ chat: true, settings: !!props.SettingsComponent }}
//           style={{ position: 'absolute', bottom: '1rem' }}
//         />
//       </LayoutContextProvider>

//       <style jsx>{`
//         .lk-video-conference {
//           height: 100vh;
//           width: 100vw;
//           background: #0a0a0a;
//         }

//         .custom-split-layout {
//           display: grid;
//           grid-template-columns: 1fr 400px;
//           height: 100%;
//           gap: 1rem;
//           padding: 1rem;
//         }

//         .user-section {
//           flex: 1;
//           border-radius: 16px;
//           overflow: hidden;
//           background: #181818;
//           position: relative;
//         }

//         .ai-section {
//           width: 100%;
//           border-radius: 16px;
//           border: 2px solid #00ff88;
//           background: #181818;
//           box-shadow: 0 0 16px rgba(0,255,136,0.3);
//           display: flex;
//           flex-direction: column;
//         }

//         .user-video {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .ai-video {
//           width: 100%;
//           height: 100%;
//           object-fit: contain;
//         }

//         /* Hide default LiveKit elements */
//         :global(.lk-grid-layout-wrapper),
//         :global(.lk-focus-layout-wrapper) {
//           display: none !important;
//         }
//       `}</style>
//     </div>
//   );
// }


// src/components/CustomVideoConference.tsx
import React, { useEffect } from 'react';
import {
  useCreateLayoutContext,
  LayoutContextProvider,
  useTracks,
  ControlBar,
  ParticipantTile,
  VideoConferenceProps,
  WidgetState,
  RoomAudioRenderer,
  TrackReferenceOrPlaceholder,
} from '@livekit/components-react';
import { Room, RoomEvent, Track } from 'livekit-client';
import { VoiceVisualization } from './voice-visualization';

export function CustomVideoConference(props: VideoConferenceProps) {
  const layoutContext = useCreateLayoutContext();
  const [widgetState, setWidgetState] = React.useState<WidgetState>({
    showChat: false,
    unreadMessages: 0,
    showSettings: false,
  });

  // subscribe only to camera + screen‑share, update on active speaker change
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged] },
  );

  // split AI vs user
  const userTracks = tracks.filter(t => !t.participant.identity.includes('AI'));
  const aiTracks   = tracks.filter(t =>  t.participant.identity.includes('AI'));

  // connect only once
  useEffect(() => {
    const room = new Room({
      adaptiveStream: true,
      dynacast: true,
      audioCaptureDefaults: {
        autoGainControl: true,
        echoCancellation: true,
        noiseSuppression: true,
      },
    });

    room.connect(
      "wss://test-spacedome-445k8x1f.livekit.cloud",
      props.token!,
      { autoSubscribe: true }
    );

    // nothing else here—no manual attach!
    return () => { room.disconnect(); };
  }, ["wss://test-spacedome-445k8x1f.livekit.cloud", props.token]);

  return (
    <div className="lk-video-conference" {...props}>
      <LayoutContextProvider value={layoutContext}>
        <div className="custom-split-layout">
          {/* Left: all user cameras */}
          <div className="user-section">
            {userTracks.map((track) => (
              <ParticipantTile
                key={track.participant.identity + track.source}
                trackRef={track as TrackReferenceOrPlaceholder}
                className="user-video"
              />
            ))}
          </div>

          {/* Right: AI or visualization */}
          <div className="ai-section">
            {aiTracks.length > 0
              ? aiTracks.map((track) => (
                  <ParticipantTile
                    key={track.participant.identity + track.source}
                    trackRef={track as TrackReferenceOrPlaceholder}
                    className="ai-video"
                  />
                ))
              : <VoiceVisualization />
            }
          </div>
        </div>

        <ControlBar
          controls={{ chat: true, settings: !!props.SettingsComponent }}
          style={{ position: 'absolute', bottom: '1rem', width: '100%' }}
        />
      </LayoutContextProvider>

      {/* Let LiveKit render all audio exactly once */}
      <RoomAudioRenderer />

      <style jsx>{`
        .lk-video-conference {
          height: 100vh;
          width: 100vw;
          background: #0a0a0a;
        }
        .custom-split-layout {
          display: grid;
          grid-template-columns: 1fr 400px;
          height: 100%;
          gap: 1rem;
          padding: 1rem;
        }
        .user-section, .ai-section {
          border-radius: 16px;
          overflow: hidden;
          background: #181818;
          position: relative;
        }
        .ai-section {
          border: 2px solid #00ff88;
          box-shadow: 0 0 16px rgba(0,255,136,0.3);
          display: flex;
          flex-direction: column;
        }
        .user-video, .ai-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        /* hide LiveKit’s built‑in placeholders */
        :global(.lk-participant-placeholder),
        :global(.lk-participant-placeholder svg) {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
