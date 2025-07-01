import { useState, useEffect } from 'react';
import { useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { createClient } from '@deepgram/sdk';

// const TranscriptionWindow = () => {
//   const [transcripts, setTranscripts] = useState([]);
//   const tracks = useTracks([{ source: Track.Source.Microphone }]);

//   useEffect(() => {
//     const deepgram = createClient("0bfe4d4fcbc27973f713b2d784c333da51b450b1");

//     tracks.forEach((trackRef) => {
//       const track = trackRef.publication.track;
//       if (track?.kind === Track.Kind.Audio) {
//         const mediaStream = new MediaStream();
//         mediaStream.addTrack(track.mediaStreamTrack);

//         const connection = deepgram.listen.live({
//           model: 'nova-2',
//           punctuate: true,
//           smart_format: true,
//           interim_results: true,
//         });

//         connection.on('transcript', (data) => {
//           const transcript = data.channel.alternatives[0].transcript;
//           if (transcript) {
//             setTranscripts((prev) => [...prev.slice(-10), transcript]);
//           }
//         });

//         connection.on('error', (err) => console.error(err));
//         connection.on('warning', (warn) => console.warn(warn));

//         const audioContext = new AudioContext();
//         const mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);
//         const processor = audioContext.createScriptProcessor(4096, 1, 1);

//         mediaStreamSource.connect(processor);
//         processor.connect(audioContext.destination);

//         processor.onaudioprocess = (event) => {
//           const audioData = event.inputBuffer.getChannelData(0);
//           const int16Array = new Int16Array(audioData.length);
//           for (let i = 0; i < audioData.length; i++) {
//             int16Array[i] = Math.min(1, audioData[i]) * 0x7FFF;
//           }
//           connection.send(int16Array);
//         };

//         return () => {
//           connection.finish();
//           audioContext.close();
//           processor.disconnect();
//         };
//       }
//     });
//   }, [tracks]);

//   console.log("transcripts -> ", transcripts)

//   return (
//     <div className="transcription-window" style={{
//       maxHeight: '200px',
//       overflowY: 'auto',
//       padding: '1rem',
//       backgroundColor: '#1a1a1a',
//       color: 'white',
//       borderRadius: '8px'
//     }}>
//       {transcripts.map((text, index) => (
//         <p key={index} style={{ margin: '0.25rem 0' }}>{text}</p>
//       ))}
//     </div>
//   );
// };


const TranscriptionWindow = () => {
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const tracks = useTracks([{ source: Track.Source.Microphone }]);

  useEffect(() => {
    const deepgram = createClient("0bfe4d4fcbc27973f713b2d784c333da51b450b1");

    const cleanupFns: (() => void)[] = [];

    tracks.forEach((trackRef) => {
      const track = trackRef.publication.track;
      if (track?.kind === Track.Kind.Audio) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(track.mediaStreamTrack);

        const connection = deepgram.listen.live({
          model: 'nova-2',
          punctuate: true,
          smart_format: true,
          interim_results: true,
        });

        connection.on('transcript', (data) => {
          const transcript = data.channel.alternatives[0].transcript;
          if (transcript?.trim()) {
            setTranscripts(prev => [...prev, transcript]);
          }
        });

        const audioContext = new AudioContext();
        const mediaStreamSource = audioContext.createMediaStreamSource(mediaStream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        mediaStreamSource.connect(processor);
        processor.connect(audioContext.destination);

        processor.onaudioprocess = (event) => {
          const audioData = event.inputBuffer.getChannelData(0);
          const int16Array = new Int16Array(audioData.length);
          for (let i = 0; i < audioData.length; i++) {
            int16Array[i] = Math.min(1, audioData[i]) * 0x7FFF;
          }
          connection.send(int16Array.buffer);
        };

        cleanupFns.push(() => {
          connection.finish();
          audioContext.close();
          processor.disconnect();
        });
      }
    });

    return () => cleanupFns.forEach(fn => fn());
  }, [tracks]);

  console.log("transcripts -> ", transcripts)

  return (
    <div className="transcription-container">
      <div className="transcription-content">
        {transcripts.map((text, index) => (
          <div key={index} className="transcript-bubble">
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranscriptionWindow;