// // src/components/SpeechToText.tsx
// import React, { useEffect, useState } from 'react';

// const SpeechToText: React.FC = () => {
//   const [transcript, setTranscript] = useState('');
//   const [isListening, setIsListening] = useState(false);
//   const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

//   useEffect(() => {
//     const SpeechRecognitionClass =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognitionClass) {
//       alert('Speech Recognition not supported in this browser.');
//       return;
//     }

//     const recog = new SpeechRecognitionClass();
//     recog.continuous = false;
//     recog.interimResults = false;
//     recog.lang = 'en-US';

//     recog.onresult = (event) => {
//       const transcriptText = event.results[0][0].transcript;
//       setTranscript(prev => prev + ' ' + transcriptText);
//       setIsListening(false);
//     };

//     recog.onerror = (event) => {
//       console.error('Speech recognition error', event);
//       setIsListening(false);
//     };

//     recog.onend = () => {
//       setIsListening(false);
//     };

//     setRecognition(recog);
//   }, []);

//   const handleStart = () => {
//     if (recognition && !isListening) {
//       setTranscript('');
//       recognition.start();
//       setIsListening(true);
//     }
//   };

//   const handleStop = () => {
//     if (recognition && isListening) {
//       recognition.stop();
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleStart} disabled={isListening}>
//         Start Listening
//       </button>
//       <button onClick={handleStop} disabled={!isListening}>
//         Stop Listening
//       </button>
//       <p><strong>Transcript:</strong> {transcript}</p>
//     </div>
//   );
// };

// export default SpeechToText;
