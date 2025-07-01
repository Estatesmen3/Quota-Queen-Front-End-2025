// types/livekit.ts
export interface CallConfig {
  roomName: string;
  token: string;
  aiIdentity: string;
  userIdentity: string;
}

// types/calls.ts
export interface CreateCallData {
  title: string;
  description?: string;
  scheduled_at?: string;
  call_type: string;
  participants?: string[];
}