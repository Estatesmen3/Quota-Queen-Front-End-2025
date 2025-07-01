import * as React from 'react';
import {
  useTracks,
  usePinnedTracks,
  LayoutContextProvider,
  useCreateLayoutContext,
  ParticipantTile,
  RoomAudioRenderer,
  ConnectionStateToast,
  CarouselLayout,
  GridLayout,
  FocusLayout,
  FocusLayoutContainer,
  ControlBar,
} from '@livekit/components-react';

import { Track, RoomEvent } from 'livekit-client';
import { isEqualTrackRef, isTrackReference, isWeb, log } from '@livekit/components-core';
import type {
  MessageDecoder,
  MessageEncoder,
  TrackReferenceOrPlaceholder,
  WidgetState,
} from '@livekit/components-core';

import { Chat } from './Chat';
import { useWarnAboutMissingStyles } from './hooks/useWarnAboutMissingStyles';

export interface VideoConferenceProps extends React.HTMLAttributes<HTMLDivElement> {
  chatMessageFormatter?: (msg: any) => React.ReactNode;
  chatMessageEncoder?: MessageEncoder;
  chatMessageDecoder?: MessageDecoder;
  SettingsComponent?: React.ComponentType;
}

export function VideoConference({
  chatMessageFormatter,
  chatMessageDecoder,
  chatMessageEncoder,
  SettingsComponent,
  ...props
}: VideoConferenceProps) {
  const [widgetState, setWidgetState] = React.useState<WidgetState>({
    showChat: false,
    unreadMessages: 0,
    showSettings: false,
  });

  const layoutContext = useCreateLayoutContext();
  const lastAutoFocusedScreenShareTrack = React.useRef<TrackReferenceOrPlaceholder | null>(null);

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false },
  );

  const screenShareTracks = tracks
    .filter(isTrackReference)
    .filter((track) => track.publication.source === Track.Source.ScreenShare);

  const focusTrack = usePinnedTracks(layoutContext)?.[0];
  const carouselTracks = tracks.filter((track) => !isEqualTrackRef(track, focusTrack));

  const widgetUpdate = (state: WidgetState) => {
    log.debug('updating widget state', state);
    setWidgetState(state);
  };

  React.useEffect(() => {
    if (
      screenShareTracks.some((track) => track.publication.isSubscribed) &&
      lastAutoFocusedScreenShareTrack.current === null
    ) {
      layoutContext.pin.dispatch?.({ msg: 'set_pin', trackReference: screenShareTracks[0] });
      lastAutoFocusedScreenShareTrack.current = screenShareTracks[0];
    } else if (
      lastAutoFocusedScreenShareTrack.current &&
      !screenShareTracks.some(
        (track) =>
          track.publication.trackSid ===
          lastAutoFocusedScreenShareTrack.current?.publication?.trackSid,
      )
    ) {
      layoutContext.pin.dispatch?.({ msg: 'clear_pin' });
      lastAutoFocusedScreenShareTrack.current = null;
    }

    if (focusTrack && !isTrackReference(focusTrack)) {
      const updatedFocusTrack = tracks.find(
        (tr) =>
          tr.participant.identity === focusTrack.participant.identity &&
          tr.source === focusTrack.source,
      );
      if (updatedFocusTrack !== focusTrack && isTrackReference(updatedFocusTrack)) {
        layoutContext.pin.dispatch?.({ msg: 'set_pin', trackReference: updatedFocusTrack });
      }
    }
  }, [
    screenShareTracks
      .map((ref) => `${ref.publication.trackSid}_${ref.publication.isSubscribed}`)
      .join(),
    focusTrack?.publication?.trackSid,
    tracks,
  ]);

  useWarnAboutMissingStyles();

  return (
    <div className="lk-video-conference" {...props}>
      {isWeb() && (
        <LayoutContextProvider value={layoutContext} onWidgetChange={widgetUpdate}>
          <div className="lk-video-conference-inner">
            {!focusTrack ? (
              <div className="lk-grid-layout-wrapper">
                <GridLayout tracks={tracks}>
                  <ParticipantTile />
                </GridLayout>
              </div>
            ) : (
              <div className="lk-focus-layout-wrapper">
                <FocusLayoutContainer>
                  <CarouselLayout tracks={carouselTracks}>
                    <ParticipantTile />
                  </CarouselLayout>
                  {focusTrack && <FocusLayout trackRef={focusTrack} />}
                </FocusLayoutContainer>
              </div>
            )}
            <ControlBar controls={{ chat: true, settings: !!SettingsComponent }} />
          </div>

          <Chat
            style={{ display: widgetState.showChat ? 'grid' : 'none' }}
            messageFormatter={chatMessageFormatter}
            messageEncoder={chatMessageEncoder}
            messageDecoder={chatMessageDecoder}
          />

          {SettingsComponent && widgetState.showSettings && (
            <div className="lk-settings-menu-modal">
              <SettingsComponent />
            </div>
          )}
        </LayoutContextProvider>
      )}
      <RoomAudioRenderer />
      <ConnectionStateToast />
    </div>
  );
}
