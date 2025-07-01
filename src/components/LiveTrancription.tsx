// import React, { useEffect, useState, useRef } from "react";
// import { LiveKitRoom } from "@livekit/components-react";
// import { useTracks, ParticipantTile, TrackReferenceOrPlaceholder } from "@livekit/components-react";
// import { Participant, Track } from "livekit-client";

// ///////////////////////
// // LIVE TRANSCRIPTION //
// ///////////////////////

// function LiveTranscription() {
//   const [transcript, setTranscript] = useState("");
//   const recognitionRef = useRef<SpeechRecognition | null>(null);

//   useEffect(() => {
//     if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
//       setTranscript("Speech Recognition API not supported in this browser.");
//       return;
//     }

//     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = "en-US";

//     recognition.onresult = (event: SpeechRecognitionEvent) => {
//       let interimTranscript = "";
//       let finalTranscript = "";

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const result = event.results[i];
//         if (result.isFinal) {
//           finalTranscript += result[0].transcript + " ";
//         } else {
//           interimTranscript += result[0].transcript;
//         }
//       }
//       setTranscript(finalTranscript + interimTranscript);
//     };

//     recognition.onerror = (event) => {
//       console.error("Speech recognition error", event.error);
//     };

//     recognition.onend = () => {
//       // Restart recognition automatically to keep it live
//       recognition.start();
//     };

//     recognition.start();
//     recognitionRef.current = recognition;

//     return () => {
//       recognition.stop();
//       recognitionRef.current = null;
//     };
//   }, []);

//   return (
//     <div style={{
//       padding: "1rem",
//       backgroundColor: "#222",
//       color: "#0f0",
//       fontFamily: "monospace",
//       borderRadius: "8px",
//       maxHeight: "150px",
//       overflowY: "auto",
//       userSelect: "text"
//     }}>
//       <h4>Live Transcript</h4>
//       <p>{transcript || "Listening..."}</p>
//     </div>
//   );
// }

// export default LiveTranscription