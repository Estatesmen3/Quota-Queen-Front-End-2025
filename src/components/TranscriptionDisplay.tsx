// import { useEffect, useRef } from 'react';
// import { useTranscriptions } from '@livekit/components-react';

// const TranscriptionDisplay = () => {
//   const transcriptions = useTranscriptions();
//   const endRef = useRef<HTMLDivElement | null>(null);

//   const getSpeakerName = (identity: string | undefined) => {
//     if (!identity) return 'Speaker';
//     if (identity.startsWith('Blake')) return 'Austin';
//     return 'You';
//   };

//   useEffect(() => {
//     if (endRef.current) {
//       endRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [transcriptions]);

//   return (
//     <div
//       style={{
//         position: 'fixed',
//         bottom: '0',
//         left: '0',
//         right: '0',
//         maxHeight: '35vh',
//         background: '#FFFFFF33',
//         padding: '1rem 2rem',
//         overflowY: 'auto',
//         // borderTop: '2px solid #444',
//         fontFamily: 'Segoe UI, Roboto, sans-serif',
//         zIndex: 1000,
//       }}
//     >
//       <h2 style={{ color: '#f5f5f5', marginBottom: '1rem' }}>Live Conversation</h2>
//       <div
//         style={{
//           display: 'flex',
//           flexDirection: 'column',
//           gap: '1rem',
//         }}
//       >
//         {transcriptions.length > 0 ? (
//           transcriptions.map((t, index) => {
//             const identity = t.participantInfo?.identity;
//             const speaker = getSpeakerName(identity);
//             const isUser = speaker === 'You';

//             return (
//               <div
//                 key={index}
//                 style={{
//                   alignSelf: isUser ? 'flex-end' : 'flex-start',
//                   backgroundColor: isUser ? '#8B5CF6' : '#EC4899',
//                   color: '#fff',
//                   padding: '0.75rem 1rem',
//                   borderRadius: '10px',
//                   maxWidth: '70%',
//                   wordWrap: 'break-word',
//                   lineHeight: 1.4,
//                 }}
//               >
//                 <strong style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>
//                   {speaker}
//                 </strong>
//                 {t.text}
//               </div>
//             );
//           })
//         ) : (
//           <p style={{ color: '#aaa' }}>Transcription not active.</p>
//         )}
//         <div ref={endRef} />
//       </div>
//     </div>
//   );
// };

// export default TranscriptionDisplay;


import { useEffect, useRef } from 'react';
import { useTranscriptions, useLocalParticipant } from '@livekit/components-react';

const TranscriptionDisplay = () => {
  const transcriptions = useTranscriptions();
  const { localParticipant } = useLocalParticipant();
  const endRef = useRef<HTMLDivElement | null>(null);

  const getSpeakerInfo = (identity: string | undefined) => {
    if (!identity) return { name: 'Speaker', isUser: false };
    
    // Check if it's the local participant (the current user)
    const isUser = identity === localParticipant?.identity;
    
    // Return appropriate labels
    return isUser
      ? { name: 'You', isUser: true }
      : { name: 'Agent', isUser: false }; 
  };

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcriptions]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        maxHeight: '35vh',
        background: '#FFFFFF33',
        padding: '1rem 2rem',
        overflowY: 'auto',
        fontFamily: 'Segoe UI, Roboto, sans-serif',
        zIndex: 1000,
      }}
    >
      <h2 style={{ color: '#f5f5f5', marginBottom: '1rem' }}>Live Conversation</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {transcriptions.length > 0 ? (
          transcriptions.map((t, index) => {
            const identity = t.participantInfo?.identity;
            const speakerInfo = getSpeakerInfo(identity);
            
            return (
              <div
                key={index}
                style={{
                  alignSelf: speakerInfo.isUser ? 'flex-end' : 'flex-start',
                  backgroundColor: speakerInfo.isUser ? '#8B5CF6' : '#EC4899',
                  color: '#fff',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  maxWidth: '70%',
                  wordWrap: 'break-word',
                  lineHeight: 1.4,
                }}
              >
                <strong style={{ display: 'block', fontSize: '0.9rem', opacity: 0.8, marginBottom: '0.25rem' }}>
                  {speakerInfo.name}
                </strong>
                {t.text}
              </div>
            );
          })
        ) : (
          <p style={{ color: '#aaa' }}>Transcription not active.</p>
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default TranscriptionDisplay;