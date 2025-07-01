// src/components/VideoConference/VideoConference.tsx
import React from "react";
import {
  GridLayout,
  ParticipantTile,
  useTracks,
  ControlBar,
  RoomAudioRenderer,
  ConnectionStateToast,
} from "@livekit/components-react";
import { Track } from "livekit-client";

export const VideoConference: React.FC = () => {
  // Get all camera and screen share tracks
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  return (
    <div className="lk-video-conference" style={{ height: "100%", width: "100%" }}>
      <RoomAudioRenderer />
      <ConnectionStateToast />
      <GridLayout tracks={tracks} style={{ flex: 1 }}>
        {tracks.map((trackRef) => (
          <ParticipantTile key={trackRef.participant.identity + trackRef.source} trackRef={trackRef} />
        ))}
      </GridLayout>
      <ControlBar />
    </div>
  );
};
