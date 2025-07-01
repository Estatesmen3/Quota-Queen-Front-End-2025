// // src/global.d.ts

// interface SpeechRecognition extends EventTarget {
//   start(): void;
//   stop(): void;
//   abort(): void;
//   lang: string;
//   continuous: boolean;
//   interimResults: boolean;
//   onresult: ((event: SpeechRecognitionEvent) => void) | null;
//   onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
//   onaudiostart: ((event: Event) => void) | null;
//   onaudioend: ((event: Event) => void) | null;
//   onend: ((event: Event) => void) | null;
//   onnomatch: ((event: SpeechRecognitionEvent) => void) | null;
//   onstart: ((event: Event) => void) | null;
// }

// interface SpeechRecognitionEvent extends Event {
//   results: SpeechRecognitionResultList;
// }

// interface SpeechRecognitionResultList {
//   length: number;
//   item(index: number): SpeechRecognitionResult;
//   [index: number]: SpeechRecognitionResult;
// }

// interface SpeechRecognitionResult {
//   isFinal: boolean;
//   length: number;
//   item(index: number): SpeechRecognitionAlternative;
//   [index: number]: SpeechRecognitionAlternative;
// }

// interface SpeechRecognitionAlternative {
//   transcript: string;
//   confidence: number;
// }

// interface Window {
//   SpeechRecognition: {
//     new (): SpeechRecognition;
//   };
//   webkitSpeechRecognition: {
//     new (): SpeechRecognition;
//   };
// }
