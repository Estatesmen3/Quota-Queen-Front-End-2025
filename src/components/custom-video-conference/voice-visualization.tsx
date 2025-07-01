import React, { useEffect, useState } from 'react';
import { useTracks, useLocalParticipant } from '@livekit/components-react';
import { Track } from 'livekit-client';

export const VoiceVisualization = () => {
  const [heights, setHeights] = useState<number[]>(Array(12).fill(20));
  
  // Get all microphone tracks from AI participants
  const aiAudioTracks = useTracks([Track.Source.Microphone])
    .filter((tr) => 
      tr.participant.metadata && 
      JSON.parse(tr.participant.metadata).isAI
    );

  useEffect(() => {
    const mst = aiAudioTracks[0]?.publication.track?.mediaStreamTrack;
    if (!mst) return;

    const audioContext = new AudioContext();
    const analyzer = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(new MediaStream([mst]));

    source.connect(analyzer);
    analyzer.fftSize = 256;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const update = () => {
      analyzer.getByteFrequencyData(dataArray);
      const newHeights = Array.from(dataArray)
        .filter((_, i) => i % 20 === 0)
        .map((v) => Math.max(20, (v / 255) * 100));
      setHeights(newHeights);
      requestAnimationFrame(update);
    };

    update();
    return () => {
      source.disconnect();
      audioContext.close();
    };
  }, [aiAudioTracks]);

  return (
    <div className="voice-bars">
      {heights.map((height, i) => (
        <div 
          key={i}
          className="bar"
          style={{ 
            height: `${height}px`,
            background: `hsl(${(i * 30) % 360}, 100%, 50%)`
          }}
        />
      ))}
      <style jsx>{`
        .voice-bars {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 4px;
          padding: 1rem;
        }
        .bar {
          width: 4px;
          transition: height 0.2s ease;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};
